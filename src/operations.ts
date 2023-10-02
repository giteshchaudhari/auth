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

async function getUserDetails (username: string): Promise<any> {
  const sql = 'SELECT * FROM Persons WHERE username=$1'
  const data = await execute(sql, [username])
  return data.rows[0]
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
  const salt = results.rows[0]?.salt
  const hassedPass = results.rows[0]?.passhash
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

export async function userLoginInApplication (req): Promise<any> {
  const requestBody = req.body
  const username = requestBody.username
  const password = requestBody.password
  const { allowed } = await userLogin({ username, password })
  if (allowed === true) {
    req.session.sessionId = await assignSessionId(username)
  }
  return {
    allowed
  }
}

async function assignSessionId (username: string): Promise<any> {
  const sessionId = crypto.randomBytes(64).toString('base64')
  const userId = (await getUserDetails(username))?.id
  const sql = 'INSERT INTO sessions (userid, sessionid) VALUES ($1, $2)'
  await execute(sql, [userId, sessionId])
  return sessionId
}

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

export async function logoutUserFromApplication (req): Promise<any> {
  const sessionId = req.session?.sessionId
  const sql = 'DELETE from sessions where sessionid=$1'
  await execute(sql, [sessionId])
}
