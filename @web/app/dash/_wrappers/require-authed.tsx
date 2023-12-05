'use client'

import { Button } from '@dinstack/ui/button'
import { Google } from '@dinstack/ui/icons/google'
import { Input } from '@dinstack/ui/input'
import { Label } from '@dinstack/ui/label'
import { useAuthStore } from '@web/app/stores/auth'
import { api } from '@web/lib/api'
import { Loader, Loader2 } from 'lucide-react'
import { useId } from 'react'

export function RequireAuthedWrapper({ children }: { children: React.ReactNode }) {
  const auth = useAuthStore()

  if (!auth.user) {
    return <LoginPage />
  }

  return <>{children}</>
}

function LoginPage() {
  const emailId = useId()

  const authGoogle = api.auth.google.loginUrl.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url.toString()
    },
  })

  return (
    <section className="fixed inset-0 z-50 flex min-h-full flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img className="h-10 w-auto" src="/logo.svg" alt="Your Company" />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm leading-6">One Step Login</p>
          </div>

          <div className="mt-10">
            <div>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <Label htmlFor={emailId}>Email address</Label>
                  <div className="mt-2">
                    <Input id={emailId} name="email" />
                  </div>
                </div>

                <div>
                  <Button className="w-full">Continue</Button>
                </div>
              </form>
            </div>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-background px-6 text-muted-foreground text-sm">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant={'secondary'}
                  type="button"
                  className="w-full"
                  disabled={authGoogle.isLoading}
                  onClick={() => authGoogle.mutate()}
                >
                  {authGoogle.isLoading ? <Loader2 size={20} className="animate-spin" /> : <Google size={20} />}
                  <span className="ml-2 text-sm font-semibold leading-6">Google</span>
                </Button>
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
