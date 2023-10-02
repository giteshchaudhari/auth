import { execute } from '../database/database'

export async function logoutUserFromApplication (req): Promise<any> {
  const sessionId = req.session?.sessionId
  const sql = 'DELETE from sessions where sessionid=$1'
  await execute(sql, [sessionId])
  req.session.destroy()
}
