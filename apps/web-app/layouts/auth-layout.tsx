import { LoginForm } from '@auth-react/components/login-form'
import { useAuthStore } from '@auth-react/stores/auth'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  const authStore = useAuthStore()

  if (!authStore.session) {
    return (
      <section className="flex h-full">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              {/* TODO: LOGO */}
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-foreground">
                Sign in to your account 🚀
              </h2>
            </div>
            <div className="mt-10">
              <LoginForm />
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="/login-bg.avif"
            alt="Login background"
          />
        </div>
      </section>
    )
  }

  return <Outlet />
}
