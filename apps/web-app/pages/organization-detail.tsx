import { OrganizationInfosForm } from '@auth-react/components/organization-infos-form'
import { OrganizationMembers } from '@auth-react/components/organization-members'
import { Card, CardContent, CardHeader, CardTitle } from '@ui/ui/card'
import { constructPublicResourceUrl } from '@web-app/lib/utils'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

export function Component() {
  const params = z
    .object({
      organizationId: z.string().uuid(),
    })
    .parse(useParams())

  return (
    <div className="">
      <div className="max-w-3xl p-4 mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationInfosForm
              organizationId={params.organizationId}
              constructPublicResourceUrl={constructPublicResourceUrl}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Members</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationMembers
              organizationId={params.organizationId}
              constructPublicResourceUrl={constructPublicResourceUrl}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
