import { registerPath } from '../routes/regesterAllRoutes'
import { execute } from '../database/database'
import { sendTwilloOtp, verifyTwilloOtp } from '../clients/twilio'

export async function loginWithOtp (body: any): Promise<any> {
  const { username } = body
  const sql = 'SELECT * FROM Persons WHERE username=$1'
  const data = await execute(sql, [username])
  if (data.rows[0].mobile !== null) { await sendTwilloOtp(data.rows[0]?.mobile) } else throw new Error('User does not have a mobile number')
}

export async function VerifyOtp (body: any): Promise<any> {
  const { mobile, code } = body
  console.log('fvdcsxz')
  return await verifyTwilloOtp(mobile, code)
}

registerPath({
  path: '/loginWithOtp',
  middleware: [],
  method: 'post',
  handler: async (req, res) => {
    try {
      try { await loginWithOtp(req.body) } catch (e) {
        console.log(e)
      }

      return res.send('OTP sent to your mobile number')
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
})

registerPath({
  path: '/verifyOtp',
  middleware: [],
  method: 'post',
  handler: async (req, res) => {
    try {
      const response = await VerifyOtp(req.body)
      res.status(200).send(response)
    } catch (e) {
      res.status(400).send(e.message)
    }
  }
})
