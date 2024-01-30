import { Button } from '@web/components/ui/button'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useRouteError } from 'react-router-dom'

export function ErrorPage() {
  const error = useRouteError()
  const ph = usePostHog()

  useEffect(() => {
    console.error(error)
  }, [error])

  useEffect(() => {
    ph.startSessionRecording()
  }, [ph])

  const status =
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
      ? error.status
      : 500

  const message =
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.length < 100
      ? error.message
      : 'Please try again later.'

  return (
    <>
      <Helmet>
        <title>Error!</title>
      </Helmet>

      <div className="container px-4 mx-auto pt-16 md:mt-20 lg:mt-28 xl:mt-36">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-16 md:mb-0">
            <img className="mx-auto rounded" src="/dog-error.png" alt="dog error" />
          </div>
          <div className="w-full md:w-1/2 px-4">
            <div className="md:max-w-xl text-center md:text-left">
              <span className="inline-block py-px px-3 mb-4 text-xs leading-5 text-destructive-foreground bg-destructive font-medium rounded-full shadow-sm">
                Error {status}
              </span>
              <h2 className="mb-4 text-4xl md:text-5xl leading-tight font-bold tracking-tighter">
                Oh no! {status === 404 ? 'Page not found' : 'Something went wrong'}
              </h2>
              <p className="mb-10 text-lg md:text-xl text-muted-foreground">{message}</p>
              <div className="w-full lg:w-auto py-1 lg:py-0 lg:mr-6">
                <Button size={'lg'} asChild>
                  <Link to="/">Go back to Homepage</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
