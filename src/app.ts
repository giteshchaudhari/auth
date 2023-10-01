import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import './database/database'
import { createUser, getAllUsers, resetPassword, userLogin } from './operations'

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

app.post('/', (req, res) => {
  return res.status(200).send('Hello world')
})

app.get('/getAllUsers', async (req, res) => {
  const allUsers = await getAllUsers()
  return res.send(allUsers)
})

app.post('/signup', async (req, res) => {
  try {
    await createUser(req.body)
    return res.send('user created')
  } catch (e) {
    res.status(400).send(e.detail)
  }
})

app.post('/resetPassword', async (req, res) => {
  try {
    await resetPassword(req.body)
    res.send('password is updated')
  } catch (e) {
    res.status(401).send(e.message)
  }
})

app.post('/login', async (req, res) => {
  const response: { allowed: boolean } = await userLogin(req.body)
  if (response.allowed) {
    res.send('login success')
  } else {
    res.status(401).send('Unauthorised')
  }
})

app.listen(port, () => {
  console.log('server is running on port 3000')
})
