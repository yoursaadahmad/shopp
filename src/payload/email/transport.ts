// src/app/_api/email.js
export const email = {
  fromName: 'SHOPPIO',
  fromAddress: 'mosesnuggz@gmail.com',
  transportOptions: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  },
}

export default email
