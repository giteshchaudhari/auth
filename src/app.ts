import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import './database/database'
import { createUser, getAllUsers, userLogin } from './database/operations'

const app = express()
const port = 3000

app.use(cors())
app.use(bodyParser.json())

app.post('/', (req, res, next) => {
  return res.status(200).send('Hello world')
})

app.get('/getAllUsers', async (req, res) => {
  const allUsers = await getAllUsers()
  return res.send(allUsers)
})

app.post('/signup', async (req, res) => {
  await createUser(req.body)
  return res.send('user created')
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
