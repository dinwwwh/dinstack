import { SignIn } from '@clerk/clerk-react'
import { Button } from '@web/components/ui/button'
import { env } from '@web/lib/env'
import { ChevronLeftIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export function Component() {
  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>

      <div className="relative h-full flex items-center justify-center container">
        <Button
          variant={'secondary'}
          className="absolute top-4 left-4 gap-1.5 rounded-full pl-2.5"
          asChild
        >
          <Link to={env.CONTENT_BASE_URL}>
            <ChevronLeftIcon className="size-4" />
            Home
          </Link>
        </Button>

        <SignIn />
      </div>
    </>
  )
}
