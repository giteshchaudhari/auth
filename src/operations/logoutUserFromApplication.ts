import { execute } from '../database/database'
import { registerPath } from '../routes/regesterAllRoutes'
import { checkIfLoggedIn } from '../middleware/checkIfLoggedIn'

export async function logoutUserFromApplication (req): Promise<any> {
  const sessionId = req.session?.sessionId
  const sql = 'DELETE from sessions where sessionid=$1'
  await execute(sql, [sessionId])
  req.session.destroy()
}

registerPath({
  path: '/logout',
  method: 'post',
  middleware: [checkIfLoggedIn],
  handler: async (req, res) => {
    await logoutUserFromApplication(req)
    return res.send('logged out')
  }
})
