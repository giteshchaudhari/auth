import { execute } from './database/database'
import * as crypto from 'crypto'
import md5 from 'md5'

export interface User {
  username: string
  password: string
  email: string
  firstname: string
  lastname: string
}

export async function getAllUsers (): Promise<any> {
  const sql = 'SELECT * From PERSONS;'
  const results = await execute(sql)
  return results.rows
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

export async function userLogin (body: { username: string, password: string }): Promise<any> {
  const { username, password } = body
  const sql = 'SELECT salt, passhash from Persons where username=$1'
  const results = await execute(sql, [username])
  const salt = results.rows[0].salt
  const hassedPass = results.rows[0].passhash
  const allowed = hassedPass === md5(salt + password)
  return {
    allowed
  }
}

export async function resetPassword (body: { username: string, oldPassword: string, newPassword: string }): Promise<any> {
  const { username, oldPassword, newPassword } = body
  const { allowed } = await userLogin({ username, password: oldPassword })
  if (allowed === true) {
    const { salt, hashedPass } = getHashedPassword(newPassword)
    return await updatePassword({ salt, hashedPass, username })
  } else {
    throw Error('invalid credentials')
  }
}

function getHashedPassword (password: string): any {
  const salt = crypto.randomBytes(16).toString('base64')
  const saltAddedPassword = salt + password
  const hashedPass = md5(saltAddedPassword)
  return { salt, hashedPass }
}

async function updatePassword (body: { salt: string, hashedPass: string, username: string }): Promise<any> {
  const { salt, hashedPass, username } = body
  const sql = 'UPDATE Persons SET salt=$1 , passhash=$2 where username=$3'
  await execute(sql, [salt, hashedPass, username])
  return null
}
