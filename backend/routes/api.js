const express = require('express')
const router = express.Router()
const CryptoJS = require('crypto-js')
const { ObjectId } = require('mongodb')

/* Get all users excluding password. - DONE */
router.get('/users', (req, res) => {
  req.app.locals.db
    .collection('users')
    .find()
    .toArray()
    .then(users => {
      if (users) {
        const censoredUsers = users.map(user => {
          const { password, ...theRest } = user
          return theRest
        })
        res.status(200).json(censoredUsers)
      } else {
        res.status(400).json({ error: 'No users found' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

/* Get specific user object. - DONE */
router.post('/users', (req, res) => {
  try {
    const id = new ObjectId(req.body.id)
    req.app.locals.db
      .collection('users')
      .findOne({ _id: id })
      .then(result => {
        if (result) {
          res.status(200).json(result)
        } else {
          res.status(400).json({ error: 'No user found' })
        }
      })
      .catch(error => {
        res.status(500).json(error)
      })
  } catch (error) {
    res.status(400).json({ error: 'Invalid id format' })
  }
})

/* Create new user - DONE */
router.post('/users/add', (req, res) => {
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
      res.status(200).json(result)
    })
    .catch(error => {
      res.status(500).json({ error: error.details[0].message })
    })
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
