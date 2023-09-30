import { execute } from './database'

export async function getAllUsers (): Promise<any> {
  const sql = 'SELECT * From PERSONS;'
  const results = await execute(sql)
  return results.rows
}
export interface User {
  username: string
  password: string
  email: string
  firstname: string
  lastname: string
}
export async function createUser (body: User): Promise<any> {
  const { username, password, email, lastname, firstname } = body
  const sql = `INSERT INTO Persons
     (username, password, email, firstname, lastname)
     values ($1,$2, $3, $4, $5);`
  const results = await execute(sql, [username, password, email, firstname, lastname])
  return results.rows
}

export async function userLogin (body): Promise<any> {
  const { username, password } = body
  const sql = 'SELECT password from Persons where username=$1'
  const results = await execute(sql, [username])
  const allowed = password === results.rows[0]?.password
  return {
    allowed
  }
}
