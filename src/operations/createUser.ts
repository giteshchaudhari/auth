import { execute } from '../database/database'
import { getHashedPassword } from './common'

export interface User {
  username: string
  password: string
  email: string
  firstname: string
  lastname: string
}

export async function createUser (body: User): Promise<any> {
  const { username, password, email, lastname, firstname } = body
  const { salt, hashedPass } = getHashedPassword(password)
  const sql = `INSERT INTO Persons
     (username, salt, passhash , email, firstname, lastname)
     values ($1,$2, $3, $4, $5, $6);`
  const results = await execute(sql, [username, salt, hashedPass, email, firstname, lastname])
  return results.rows
}
