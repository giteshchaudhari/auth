import { execute } from '../database/database'

export async function updateSession (req): Promise<void> {
  const sessionId = req.session.sessionId
  const sql = 'UPDATE sessions SET updated_at=now() where sessionid=$1'
  await execute(sql, [sessionId])
}
