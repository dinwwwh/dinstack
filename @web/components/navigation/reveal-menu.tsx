import { Logo } from '../logo'
import { ThemeToggle } from '../theme-toggle'
import { Button } from '../ui/button'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { env } from '@web/lib/env'
import { BellIcon, MessageCircleQuestionIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export function RevealMenu() {
  return (
    <div className="py-2 @container">
      <div className="flex items-center justify-between">
        <div>
          <Button variant={'link'} size={'sm'} className="h-6 px-1" asChild>
            <Link to={'/'}>
              <span className="sr-only">Homepage</span>
              <div className="hidden @md:block">
                <Logo size={16} />
              </div>
              <div className="block @md:hidden">
                <Logo variant="icon" size={16} />
              </div>
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            size={'sm'}
            className="size-6 p-0 text-muted-foreground"
            variant={'ghost'}
            asChild
          >
            <a href={`mailto:${env.SUPPORT_EMAIL}`}>
              <span className="sr-only">Help</span>
              <MessageCircleQuestionIcon className="size-4" />
            </a>
          </Button>
          <ThemeToggle variant="link" className="text-muted-foreground size-6 p-0" />
          <SignedIn>
            {/* TODO */}
            <Button
              type="button"
              size={'sm'}
              className="size-6 p-0 text-muted-foreground"
              variant={'ghost'}
            >
              <span className="sr-only">Notifications</span>
              <BellIcon className="size-4" />
            </Button>
            <UserButton
              appearance={{
                elements: {
                  rootBox: '[&.cl-userButton-root]:size-6 [&.cl-userButton-root]:pl-1',
                  userButtonTrigger: '[&_.cl-avatarBox]:size-6',
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Button variant={'link'} size={'sm'} className="text-muted-foreground h-6 px-1" asChild>
              <Link to={'/sign-up'}>Sign up</Link>
            </Button>

            <Button variant={'link'} size={'sm'} className="h-6 px-1" asChild>
              <Link to={'/sign-in'}>Sign in</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}