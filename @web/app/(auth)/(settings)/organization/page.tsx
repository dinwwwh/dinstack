import type { Metadata } from 'next'
import { OrganizationInfosForm } from './_components/organization-infos-form'

export const metadata: Metadata = {
  title: 'Organization',
}

export default function OrganizationPage() {
  return (
    <main className="p-4">
      <div className="mx-auto max-w-7xl divide-y">
        <OrganizationInfosForm />
      </div>
    </main>
  )
}
