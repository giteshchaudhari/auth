import { execute } from '../database/database'

export async function getAllUsers (): Promise<any> {
  const sql = 'SELECT * From PERSONS;'
  const results = await execute(sql)
  return results.rows
}
