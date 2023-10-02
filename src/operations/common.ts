import { execute } from '../database/database'
import crypto from 'crypto'
import md5 from 'md5'

export async function userLogin (body: { username: string, password: string }): Promise<any> {
  const { username, password } = body
  const sql = 'SELECT salt, passhash from Persons where username=$1'
  const results = await execute(sql, [username])
  const salt = results.rows[0]?.salt
  const hassedPass = results.rows[0]?.passhash
  const allowed = hassedPass === md5(salt + password)
  return {
    allowed
  }
}

export function getHashedPassword (password: string): any {
  const salt = crypto.randomBytes(16).toString('base64')
  const saltAddedPassword = salt + password
  const hashedPass = md5(saltAddedPassword)
  return { salt, hashedPass }
}
