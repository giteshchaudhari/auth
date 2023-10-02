import { execute } from '../database/database'

export async function checkIfLoggedIn (req, res, next): Promise<any> {
  const sessionId = req.session?.sessionId
  const sql = 'select * from sessions where sessionid=$1'
  const data = await execute(sql, [sessionId])
  if (!!sessionId && sessionId === data.rows[0]?.sessionid) {
    await next()
  } else {
    res.status(401).send('you are not logged in')
  }
}
