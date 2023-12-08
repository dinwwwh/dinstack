'use client'

import { Button } from '@dinstack/ui/button'
import { GoogleLogoIcon } from '@dinstack/ui/icons/google-logo'
import { Input } from '@dinstack/ui/input'
import { Label } from '@dinstack/ui/label'
import { ArrowLeftIcon, ArrowRightIcon, ReloadIcon, GitHubLogoIcon } from '@radix-ui/react-icons'
import { useAuthStore } from '@web/app/stores/auth'
import { useHistoryStore } from '@web/app/stores/history'
import type { ApiOutputs } from '@web/lib/api'
import { api } from '@web/lib/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useState } from 'react'
import OTPInput from 'react-otp-input'
import { match } from 'ts-pattern'

type Props = {
  isLoadingGoogle?: boolean
  isLoadingGithub?: boolean
}

export function LoginScreen(props: Props) {
  const auth = useAuthStore()
  const [step, setStep] = useState<'send-otp' | 'validate-otp'>('send-otp')
  const [email, setEmail] = useState('')
  const historyStore = useHistoryStore()
  const router = useRouter()

  const navigateToPreviousPage = useCallback(() => {
    if (historyStore.previousPathname && !historyStore.previousPathname.includes('/auth')) {
      router.push(`${historyStore.previousPathname}?${historyStore.previousSearchParams}`)
    } else {
      router.push('/dash')
    }
  }, [historyStore, router])

  useEffect(() => {
    if (
      !historyStore.previousLoginEmail ||
      !historyStore.previousLoginEmailAt ||
      historyStore.previousLoginEmailAt < Date.now() - 60 * 1000 * 5
    ) {
      return
    }

    setEmail(historyStore.previousLoginEmail)
    setStep('validate-otp')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="flex min-h-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/">
              <img className="h-10 w-auto" src="/logo.svg" alt="Your Company" />
            </Link>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm leading-6">
              {match(step)
                .with('send-otp', () => 'One Step Login')
                .with('validate-otp', () => 'We have sent you an OTP to your email address')
                .exhaustive()}
            </p>
          </div>

          <div className="mt-10">
            {match(step)
              .with('send-otp', () => (
                <SendOtpForm
                  onSuccess={(data) => {
                    setEmail(data.email)
                    historyStore.setPreviousLoginEmail(data.email)
                    historyStore.setPreviousLoginEmailAt(Date.now())
                    setStep('validate-otp')
                  }}
                />
              ))
              .with('validate-otp', () => (
                <ValidateOtpForm
                  email={email}
                  onSuccess={(data) => {
                    if (!auth.user) {
                      auth.setAuth(data.auth)
                    }

                    historyStore.setPreviousLoginEmail(null)
                    historyStore.setPreviousLoginEmailAt(null)
                    navigateToPreviousPage()
                  }}
                  onBack={() => {
                    setStep('send-otp')
                  }}
                />
              ))
              .exhaustive()}

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-background px-6 text-muted-foreground text-sm">Or continue with</span>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <LoginWithGoogleButton isLoading={props.isLoadingGoogle} />
                <LoginWithGithubButton isLoading={props.isLoadingGithub} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img className="absolute inset-0 h-full w-full object-cover" src="/login-bg.avif" alt="" />
      </div>
    </section>
  )
}

function SendOtpForm(props: { onSuccess?: ({ email }: { email: string }) => void }) {
  const emailId = useId()
  const [email, setEmail] = useState('')
  const mutation = api.auth.email.sendOtp.useMutation({
    onSuccess() {
      props.onSuccess?.({ email })
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()

        mutation.mutate({ email })
      }}
    >
      <div>
        <Label htmlFor={emailId}>Email address</Label>
        <div className="mt-2">
          <Input
            id={emailId}
            name="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button className="w-full" disabled={mutation.isLoading}>
          Continue
          {mutation.isLoading ? (
            <ReloadIcon className="w-4 h-4 animate-spin ml-2" />
          ) : (
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>
    </form>
  )
}

function ValidateOtpForm(props: {
  email: string
  onSuccess?: (data: ApiOutputs['auth']['email']['validateOtp']) => void
  onBack?: () => void
}) {
  const [otp, setOtp] = useState<string>('')
  const sendOtpMutation = api.auth.email.sendOtp.useMutation()
  const mutation = api.auth.email.validateOtp.useMutation({
    onSuccess(data) {
      props.onSuccess?.(data)
    },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate({ otp, email: props.email })
      }}
    >
      <div>
        <Label>OTP</Label>
        <div className="mt-2">
          <OTPInput
            containerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            value={otp.toUpperCase()}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <Input {...props} className="p-0 !w-12 h-16" required />}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" type="button" onClick={() => props.onBack?.()} className="w-full">
          <ArrowLeftIcon className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button className="w-full" disabled={mutation.isLoading}>
          Continue
          {mutation.isLoading ? (
            <ReloadIcon className="w-4 h-4 animate-spin ml-2" />
          ) : (
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          )}
        </Button>
      </div>

      <div className="mt-3">
        <Button
          disabled={sendOtpMutation.isLoading}
          variant="ghost"
          className="w-full text-muted-foreground"
          type="button"
          onClick={() => {
            sendOtpMutation.mutate({ email: props.email })
          }}
        >
          Resend OTP
          {sendOtpMutation.isLoading && <ReloadIcon className="w-4 h-4 animate-spin ml-2" />}
        </Button>
      </div>
    </form>
  )
}

function LoginWithGoogleButton(props: { isLoading?: boolean }) {
  const auth = useAuthStore()
  const authGoogle = api.auth.google.loginUrl.useMutation({
    onSuccess: (data) => {
      auth.setState(data.state)
      auth.setCodeVerifier(data.codeVerifier)
      window.location.href = data.url.toString()
    },
  })

  return (
    <Button
      variant={'secondary'}
      type="button"
      className="w-full"
      disabled={authGoogle.isLoading || props.isLoading}
      onClick={() => authGoogle.mutate()}
    >
      {authGoogle.isLoading || props.isLoading ? (
        <ReloadIcon className="w-4 h-4 animate-spin" />
      ) : (
        <GoogleLogoIcon className="w-[18px] h-[18px]" />
      )}
      <span className="ml-2 text-sm font-semibold leading-6">Google</span>
    </Button>
  )
}

function LoginWithGithubButton(props: { isLoading?: boolean }) {
  const auth = useAuthStore()
  const authGoogle = api.auth.github.loginUrl.useMutation({
    onSuccess: (data) => {
      auth.setState(data.state)
      window.location.href = data.url.toString()
    },
  })

  return (
    <Button
      variant={'secondary'}
      type="button"
      className="w-full"
      disabled={authGoogle.isLoading || props.isLoading}
      onClick={() => authGoogle.mutate()}
    >
      {authGoogle.isLoading || props.isLoading ? (
        <ReloadIcon className="w-4 h-4 animate-spin" />
      ) : (
        <GitHubLogoIcon className="w-4 h-4" />
      )}
      <span className="ml-2 text-sm font-semibold leading-6">Github</span>
    </Button>
  )
}
