const express = require('express')
const router = express.Router()
const CryptoJS = require('crypto-js')

/* Get all users excluding password. */
router.get('/users', (req, res) => {
  res.send('respond with a resource')
})

/* Get specific user object. */
router.post('/users', (req, res) => {
  res.send('respond with a resource')
})

/* Create new user */
router.post('/users/add', (req, res) => {
  if (req.headers.authorization === process.env.API_KEY) {
    const newUser = { ...req.body }
    const encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SALT
    ).toString()
    newUser.password = encryptedPassword

    req.app.locals.db
      .collection('users')
      .insertOne(newUser)
      .then(result => {
        console.log('New user added to collection', result)
        res.status(200).json(result)
      })
      .catch(error => {
        console.log('Could not add user to collection', error)
        res.status(500).json({ error: error.details[0].message })
      })
  } else {
    console.log('Not a autorizeds request, bad api key')
    res.status(401).json({ message: 'Not authorized, bad api key' })
  }
})

/* Login user */
router.post('/users/login', (req, res) => {
  // const password = CryptoJS.AES.decrypt(
  //   newUser,
  //   process.env.PASSWORD_SALT
  // ).toString(CryptoJS.enc.Utf8)
  // console.log(password)
  res.send('respond with a resource')
})

module.exports = router
