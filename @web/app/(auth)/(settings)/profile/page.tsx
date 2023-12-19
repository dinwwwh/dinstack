import type { Metadata } from 'next'
import { OauthConnections } from '../../../../services/auth/oauth-connections'
import { PersonalInfosForm } from '../../../../services/auth/personal-infos-form'

export const metadata: Metadata = {
  title: 'Profile',
}

export default function ProfilePage() {
  return (
    <main className="p-4">
      <div className="mx-auto max-w-7xl divide-y">
        <PersonalInfosForm />

        <OauthConnections />
      </div>
    </main>
  )
}
