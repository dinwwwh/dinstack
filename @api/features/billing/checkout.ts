import { authProcedure } from '@api/core/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const billingCheckoutRoute = authProcedure
  .input(
    z.object({
      variantId: z.number(),
      darkMode: z.boolean(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.db.query.Users.findFirst({
      where(t, { eq }) {
        return eq(t.id, ctx.auth.userId)
      },
    })

    if (!user) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to find user',
      })
    }

    const checkout = await ctx.lemonSqueezy.createCheckout({
      storeId: ctx.env.LEMONSQUEEZY_STORE_ID,
      variantId: input.variantId,
      attributes: {
        checkout_options: {
          dark: input.darkMode,
          embed: true,
          media: false,
          desc: false,
          logo: false,
        },
        checkout_data: {
          email: user.email, // Displays in the checkout form
          custom: {
            user_id: user.id, // Sent in the background; visible in webhooks and API calls
          },
        },
        product_options: {
          enabled_variants: [input.variantId],
          redirect_url: new URL('profile/billing', ctx.env.WEB_BASE_URL),
          receipt_link_url: new URL('profile/billing', ctx.env.WEB_BASE_URL),
          receipt_button_text: 'Go to your account',
          receipt_thank_you_note: 'Your purchase means the world to us. Thank you for choosing us!',
        },
        test_mode: ctx.env.WORKER_ENV === 'development' ? true : undefined,
      },
    })

    const checkoutUrl = new URL(checkout.data.attributes.url)

    return {
      checkoutUrl,
    }
  })
