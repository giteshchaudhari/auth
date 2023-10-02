import { execute } from '../database/database'

export async function deleteExpiredSessions (): Promise<void> {
  const sql = 'DELETE FROM sessions where created_at< now()-\'60 min\'::interval;'
  await execute(sql)
}
