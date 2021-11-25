require('dotenv').config()
const express = require('express')
const User = require('./model/User')
const bcrypt = require('bcryptjs')
const app = express()

app.use(express.json())

app.get('/', (req, res) => res.send('<h3> hello from auth system </h3>'))

app.post('/auth', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    if (!email && !password && !firstName && !lastName) {
      res.status(400).send('all feilds are required')
    }
    const existingEmail = await User.findOne({ email: email })

    if (existingEmail) {
      res.status(401).send('email already exists')
    }
    const encryptPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptPassword,
    })

    //how to make Token . token consist of three parts 1)header 2)payload 3)signature
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: '2h',
      },
    )
    user.token = token

    // handle password situation now it will not send encrypted password to frontend;
    user.password = undefined

    // send token or send just success yes and redirect - choice
    res.status(201).json(user)
  } catch (error) {
    console.log(error)
  }
})

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!(email && password)) {
      res.status(400).send('Field is missing')
    }
    const user = await User.findOne({ email })
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: '2h',
        },
      )
      user.token = token
      user.password = undefined

      res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user,
      })
    }
    res.sendStatus(400).send('email or password is incorrect')
  } catch (error) {
    console.log(error)
  }
})

module.exports = app
