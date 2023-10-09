import crypto from 'crypto'
import { execute } from '../database/database'
import { userLogin } from './common'
import { registerPath } from '../routes/regesterAllRoutes'

export async function userLoginInApplication (req): Promise<any> {
  const requestBody = req.body
  const username = requestBody.username
  const password = requestBody.password
  const { allowed } = await userLogin({ username, password })
  if (allowed === true) {
    req.session.sessionId = await assignSessionId(username)
  }
  return {
    allowed
  }
}

async function assignSessionId (username: string): Promise<any> {
  const sessionId = crypto.randomBytes(64).toString('base64')
  const userId = (await getUserDetails(username))?.id
  const sql = 'INSERT INTO sessions (userid, sessionid) VALUES ($1, $2)'
  await execute(sql, [userId, sessionId])
  return sessionId
}
async function getUserDetails (username: string): Promise<any> {
  const sql = 'SELECT * FROM Persons WHERE username=$1'
  const data = await execute(sql, [username])
  return data.rows[0]
}

registerPath({
  path: '/login',
  middleware: [],
  method: 'post',
  handler: async (req, res) => {
    try {
      const response: { allowed: boolean } = await userLoginInApplication(req)
      if (response.allowed) {
        res.send('login success')
      } else {
        res.status(401).send('Unauthorised')
      }
    } catch (e) {
      if (e.code === '23505') {
        res.status(409).send('user is already logged in')
      }
    }
  }
})
