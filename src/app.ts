import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import cron from 'node-cron'
import './database/database'
import './operations/getAllUsers'
import './operations/createUser'
import './operations/userLoginInApplication'
import './operations/resetPassword'
import './operations/logoutUserFromApplication'

import { registerRoutes } from './routes/regesterAllRoutes'
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

registerRoutes(app)

app.listen(port, () => {
  console.log('server is running on port 3000')
})
