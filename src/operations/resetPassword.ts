import { execute } from '../database/database'
import { getHashedPassword, userLogin } from './common'
import { registerPath } from '../routes/regesterAllRoutes'
import { checkIfLoggedIn } from '../middleware/checkIfLoggedIn'
import { updateSession } from '../middleware/updateSession'

export async function resetPassword (body: {
  username: string
  oldPassword: string
  newPassword: string
}): Promise<any> {
  const { username, oldPassword, newPassword } = body
  const { allowed } = await userLogin({ username, password: oldPassword })
  if (allowed === true) {
    const { salt, hashedPass } = getHashedPassword(newPassword)
    return await updatePassword({ salt, hashedPass, username })
  } else {
    throw Error('invalid credentials')
  }
}

async function updatePassword (body: { salt: string, hashedPass: string, username: string }): Promise<any> {
  const { salt, hashedPass, username } = body
  const sql = 'UPDATE Persons SET salt=$1 , passhash=$2 where username=$3'
  await execute(sql, [salt, hashedPass, username])
  return null
}

registerPath({
  path: '/resetPassword',
  middleware: [checkIfLoggedIn, updateSession],
  method: 'post',
  handler: async (req, res) => {
    try {
      await resetPassword(req.body)
      res.send('password is updated')
    } catch (e) {
      res.status(401).send(e.message)
    }
  }
})
