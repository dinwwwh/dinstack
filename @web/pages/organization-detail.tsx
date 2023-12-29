import { OrganizationInfosForm } from '@web/components/organization/infos-form'
import { OrganizationMembers } from '@web/components/organization/members'
import { Card, CardContent, CardHeader, CardTitle } from '@web/components/ui/card'
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
            <OrganizationInfosForm organizationId={params.organizationId} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Members</CardTitle>
          </CardHeader>
          <CardContent>
            <OrganizationMembers organizationId={params.organizationId} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
