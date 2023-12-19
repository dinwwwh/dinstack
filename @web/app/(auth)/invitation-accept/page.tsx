import type { Metadata } from 'next'
import { InvitationCard } from '../../../services/organization/invitation-card'

export const metadata: Metadata = {
  title: 'Invitation Accept',
}

export default function InvitationAcceptPage() {
  return (
    <main className="z-10 fixed inset-0 bg-background flex items-center justify-center p-4">
      <InvitationCard />
    </main>
  )
}
