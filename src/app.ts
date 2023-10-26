import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import session from 'express-session'
import cron from 'node-cron'
import { registerRoutes } from './routes/regesterAllRoutes'
import { deleteExpiredSessions } from './cronjob/deleteExpiredSessions'
import './database/database'
import './operations/getAllUsers'
import './operations/createUser'
import './operations/userLoginInApplication'
import './operations/resetPassword'
import './operations/logoutUserFromApplication'
import './operations/UserLoginWithOtp'
import './clients/twilio'
const app = express()
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

app.listen(process.env.PORT, () => {
  console.log('server is running on port 3000')
})
