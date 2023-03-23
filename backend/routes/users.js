const express = require('express')
const router = express.Router()
const CryptoJS = require('crypto-js')
const { ObjectId } = require('mongodb')

/* Get all users excluding password. - DONE */
router.get('/', (req, res) => {
  req.app.locals.db
    .collection('users')
    .find()
    .project({ password: false })
    .toArray()
    .then(users => {
      if (users.length > 0) {
        res.status(200).json(users)
      } else {
        res.status(400).json({ error: 'No users found' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

/* Get specific user object. - DONE */
router.post('/', (req, res) => {
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
router.post('/add', (req, res) => {
  req.app.locals.db
    .collection('users')
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        res
          .status(409)
          .json({ error: 'User with that email already exists in database' })
      } else {
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
            res.status(500).json(error)
          })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

/* Login user - DONE */
router.post('/login', (req, res) => {
  req.app.locals.db
    .collection('users')
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        const decryptedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASSWORD_SALT
        ).toString(CryptoJS.enc.Utf8)
        if (req.body.password === decryptedPassword) {
          console.log(user._id)
          res.status(200).json({ id: user._id, name: user.name })
        } else {
          res.status(401).json({ error: 'password dont match' })
        }
      } else {
        res.status(401).json({ error: 'No user with that email found' })
      }
    })
    .catch(error => {
      res.status(500).json({ error: error.details[0].message })
    })
})

module.exports = router
