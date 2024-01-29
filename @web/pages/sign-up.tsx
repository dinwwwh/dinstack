import { SignUp } from '@clerk/clerk-react'
import { Button } from '@web/components/ui/button'
import { env } from '@web/lib/env'
import { ChevronLeftIcon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export function Component() {
  return (
    <>
      <Helmet>
        <title>Sign up</title>
      </Helmet>

      <div className="relative h-screen flex items-center justify-center container">
        <Button
          variant={'link'}
          className="absolute top-4 left-4 gap-1 text-muted-foreground"
          asChild
        >
          <Link to={env.CONTENT_BASE_URL}>
            <ChevronLeftIcon strokeWidth={1.5} className="size-4" />
            Home
          </Link>
        </Button>

        <SignUp />
      </div>
    </>
  )
}
