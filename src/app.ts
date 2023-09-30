import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res, next) => {
  return res.status(200).send('Hello world')
})

app.listen(port, () => {
  console.log('server is running on port 3000')
})
