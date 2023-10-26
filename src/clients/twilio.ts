import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

export async function sendTwilloOtp (to: string): Promise<any> {
  return await client.verify.v2.services('VA98b6e8bf6d1e38296dbd75e38a935c01')
    .verifications
    .create({ to, channel: 'sms' })
}

export async function verifyTwilloOtp (to: string, code: string): Promise<any> {
  const resposne = await client.verify.v2.services('VA98b6e8bf6d1e38296dbd75e38a935c01')
    .verificationChecks
    .create({ to, code })
  console.log(resposne)
  return resposne.status
}
