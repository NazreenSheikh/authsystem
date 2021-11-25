require('dotenv').config()
const express = require('express')
// const User = require('./model/User')
const app = express()

app.use(express.json())

app.get('/', (req, res) => res.send('<h3> hello from auth system </h3>'))

app.post('/auth', async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  if (!email && !password && !firstName && !lastName) {
    res.status(400).send('all feilds are required')
  }
  const existingEmail = await User.findOne({ email: email })

  if (existingEmail) {
    res.status(401).send('email already exists')
  }
})

module.exports = app
