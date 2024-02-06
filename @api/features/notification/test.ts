import { authProcedure } from '@api/core/trpc'

export const notificationTestRoute = authProcedure.mutation(async ({ ctx }) => {
  await ctx.knock.workflows.trigger('test', {
    recipients: [ctx.auth.userId],
    data: {
      action_url: new URL('?hi=xin-chao#vietnam', ctx.env.WEB_BASE_URL),
      variableKey: 'Preview data value',
    },
  })
})
