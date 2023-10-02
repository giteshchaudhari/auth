import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import './database/database'
import cron from 'node-cron'

import { getAllUsers } from './operations/getAllUsers'
import { createUser } from './operations/createUser'
import { userLoginInApplication } from './operations/userLoginInApplication'
import { resetPassword } from './operations/resetPassword'
import { logoutUserFromApplication } from './operations/logoutUserFromApplication'
import { checkIfLoggedIn } from './middleware/checkIfLoggedIn'
import { deleteExpiredSessions } from './cronjob/deleteExpiredSessions'

const app = express()
const port = 3000
app.use(cors())
app.use(bodyParser.json())
app.use(session({
  secret: 'something very large sentence',
  resave: true,
  saveUninitialized: true
}))

cron.schedule('*/15 * * * * *', async () => {
  await deleteExpiredSessions
}, {})

app.get('/getAllUsers', checkIfLoggedIn, async (req: any, res) => {
  const allUsers = await getAllUsers()
  return res.send(allUsers)
})

app.post('/signup', async (req, res) => {
  try {
    await createUser(req.body)
    return res.send('user created, now go to login')
  } catch (e) {
    res.status(400).send(e.detail)
  }
})

app.post('/login', async (req, res) => {
  try {
    const response: { allowed: boolean } = await userLoginInApplication(req)
    if (response.allowed) {
      res.send('login success')
    } else {
      res.status(401).send('Unauthorised')
    }
  } catch (e) {
    if (e.code === '23505') {
      res.status(409).send('user is already logged in')
    }
  }
})

app.post('/logout', checkIfLoggedIn, async (req, res) => {
  await logoutUserFromApplication(req)
  return res.send('logged out')
})

app.post('/resetPassword', checkIfLoggedIn, async (req, res) => {
  try {
    await resetPassword(req.body)
    res.send('password is updated')
  } catch (e) {
    res.status(401).send(e.message)
  }
})

app.listen(port, () => {
  console.log('server is running on port 3000')
})
