import { execute } from '../database/database'
import { getHashedPassword } from './common'
import { registerPath } from '../routes/regesterAllRoutes'

export interface User {
  username: string
  password: string
  email: string
  firstname: string
  lastname: string
  mobile: string
}

export async function createUser (body: User): Promise<any> {
  const { username, password, email, lastname, firstname, mobile } = body
  const { salt, hashedPass } = getHashedPassword(password)
  const sql = `INSERT INTO Persons
     (username, salt, passhash , email, firstname, lastname, mobile)
     values ($1,$2, $3, $4, $5, $6, $7);`
  const results = await execute(sql, [username, salt, hashedPass, email, firstname, lastname, mobile])
  return results.rows
}

registerPath({
  path: '/signup',
  middleware: [],
  method: 'post',
  handler: async (req, res) => {
    try {
      await createUser(req.body)
      return res.send('user created, now go to login')
    } catch (e) {
      res.status(400).send(e.detail)
    }
  }
})
