import { CallbackHandler } from './_components/callback-handler'
import { oauthAccountProviders } from '@api/database/schema'
import { ReloadIcon } from '@radix-ui/react-icons'
import { uppercaseFirstLetter } from '@shared/utils/uppercase-first-letter'
import type { Metadata } from 'next'

type Props = {
  params: { provider: string }
}

export function generateStaticParams(): Props['params'][] {
  return oauthAccountProviders.enumValues.map((provider) => {
    return {
      provider,
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Handling ${uppercaseFirstLetter(params.provider)} callback`,
  }
}

export default function OauthCallbackPage() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-background">
      <CallbackHandler />
      <ReloadIcon className="h-9 w-9 animate-spin text-muted-foreground" />
    </div>
  )
}
