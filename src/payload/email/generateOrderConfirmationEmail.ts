// src\payload\email\generateOrderConfirmationEmail.ts
import type { CollectionConfig } from 'payload/types'

const Orders: CollectionConfig = {
  slug: 'orders',
  hooks: {
    afterChange: [
      ({ doc, operation, req }) => {
        const { customerEmail, items, total } = doc
        if (operation === 'create') {
          req.payload.sendEmail({
            to: customerEmail,
            from: 'Acme <onboarding@resend.dev>',
            subject: 'Order Confirmation',
            plain: 'Thank you for your order!',
            html: `<h1>Thank you for your order!</h1>
              <p>Here is your order summary:</p>
              <ul>
                ${items.map(item => `<li>${item.name} - ${item.price}</li>`)}
              </ul>
              <p>Total: ${total}</p>
            `,
          })
        }
      },
    ],
  },
  fields: [],
}

export default Orders
