import { GoogleLogoIcon } from '../icons/google-logo'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { MutationStatusIcon } from '@web/components/mutation-status-icon'
import type { ApiOutputs } from '@web/lib/api'
import { api } from '@web/lib/api'
import { useAuthStore } from '@web/stores/auth'
import { ArrowLeft, ArrowRight, GithubIcon } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import OTPInput from 'react-otp-input'
import { match } from 'ts-pattern'

export function LoginForm() {
  const authStore = useAuthStore()
  const [step, setStep] = useState<'send-otp' | 'validate-otp'>('send-otp')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (
      !authStore.emailAuthorization ||
      authStore.emailAuthorization.at < new Date(Date.now() - 60 * 1000 * 5)
    ) {
      return
    }

    setEmail(authStore.emailAuthorization.email)
    setStep('validate-otp')
  }, [authStore])

  return (
    <div>
      {match(step)
        .with('send-otp', () => (
          <SendOtpForm
            onSuccess={(data) => {
              setEmail(data.email)
              useAuthStore.setState({
                emailAuthorization: {
                  email: data.email,
                  at: new Date(),
                },
              })
              setStep('validate-otp')
            }}
          />
        ))
        .with('validate-otp', () => (
          <ValidateOtpForm
            email={email}
            onSuccess={(data) => {
              useAuthStore.setState({ session: data.session, emailAuthorization: null })
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
            <span className="bg-background px-6 text-muted-foreground text-sm">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <LoginWithGoogleButton />
          <LoginWithGithubButton />
        </div>
      </div>
    </div>
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
        <Button className="w-full gap-2" disabled={mutation.isLoading}>
          Continue
          <MutationStatusIcon status={mutation.status}>
            <ArrowRight className="w-4 h-4" />
          </MutationStatusIcon>
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
        mutation.mutate({ code: otp, email: props.email })
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
        <Button
          variant="secondary"
          type="button"
          onClick={() => props.onBack?.()}
          className="w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button className="w-full gap-2" disabled={mutation.isLoading}>
          Continue
          <MutationStatusIcon status={mutation.status}>
            <ArrowRight className="w-4 h-4" />
          </MutationStatusIcon>
        </Button>
      </div>

      <div className="mt-3">
        <Button
          disabled={sendOtpMutation.isLoading}
          variant="ghost"
          className="w-full text-muted-foreground gap-2"
          type="button"
          onClick={() => {
            sendOtpMutation.mutate({ email: props.email })
          }}
        >
          Resend OTP
          <MutationStatusIcon status={sendOtpMutation.status} />
        </Button>
      </div>
    </form>
  )
}

function LoginWithGoogleButton() {
  const authGoogle = api.auth.oauth.authorizationUrl.useMutation({
    onSuccess: (data) => {
      useAuthStore.setState({
        oauthAuthorization: {
          codeVerifier: data.codeVerifier,
          state: data.state,
          redirectUrl: new URL(window.location.href),
        },
      })

      window.location.href = data.url.toString()
    },
  })

  return (
    <Button
      variant={'secondary'}
      type="button"
      className="w-full gap-2"
      disabled={authGoogle.isLoading}
      onClick={() =>
        authGoogle.mutate({
          provider: 'google',
        })
      }
    >
      <MutationStatusIcon status={authGoogle.status}>
        <GoogleLogoIcon className="w-4 h-4" />
      </MutationStatusIcon>
      <span className="text-sm font-semibold leading-6">Google</span>
    </Button>
  )
}

function LoginWithGithubButton() {
  const authGithub = api.auth.oauth.authorizationUrl.useMutation({
    onSuccess: (data) => {
      useAuthStore.setState({
        oauthAuthorization: {
          codeVerifier: data.codeVerifier,
          state: data.state,
          redirectUrl: new URL(window.location.href),
        },
      })
      window.location.href = data.url.toString()
    },
  })

  return (
    <Button
      variant={'secondary'}
      type="button"
      className="w-full gap-2"
      disabled={authGithub.isLoading}
      onClick={() =>
        authGithub.mutate({
          provider: 'github',
        })
      }
    >
      <MutationStatusIcon status={authGithub.status}>
        <GithubIcon className="w-4 h-4" />
      </MutationStatusIcon>
      <span className="text-sm font-semibold leading-6">Github</span>
    </Button>
  )
}
