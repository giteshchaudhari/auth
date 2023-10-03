import { execute } from '../database/database'
import { checkIfLoggedIn } from '../middleware/checkIfLoggedIn'
import { updateSession } from '../middleware/updateSession'
import { registerPath } from '../routes/regesterAllRoutes'

export async function getAllUsers (): Promise<any> {
  const sql = 'SELECT * From PERSONS;'
  const results = await execute(sql)
  return results.rows
}
registerPath({
  path: '/getAllUsers',
  middleware: async (req, res, next) => {
    await checkIfLoggedIn(req, res, next)
    await updateSession(req, res, next)
  },
  method: 'get',
  handler: async (req: any, res) => {
    const allUsers = await getAllUsers()
    return res.send(allUsers)
  }
})
