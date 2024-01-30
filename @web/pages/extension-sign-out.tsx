import { useAuth } from '@clerk/clerk-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@web/components/ui/alert-dialog'
import { Button } from '@web/components/ui/button'
import { env } from '@web/lib/env'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export function Component() {
  const { signOut } = useAuth()

  return (
    <>
      <Helmet>
        <title>Extension Sign Out</title>
      </Helmet>

      <div className="flex items-center justify-center h-screen">
        <AlertDialog defaultOpen>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of {env.APP_NAME} and its browser extension. You&apos;ll need
                to log in again to access the website or its browser extension.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => signOut({ redirectUrl: '/' })}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div>
          <p className="text-muted-foreground text-sm">
            Login sessions on {env.APP_NAME} and its browser extension are the same. Signing out on
            {env.APP_NAME} also signs out the browser extension.
          </p>
          <div className="flex justify-center">
            <Button variant={'link'} asChild>
              <Link to="/" className="text-muted-foreground text-sm text-center">
                Go to home page
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
