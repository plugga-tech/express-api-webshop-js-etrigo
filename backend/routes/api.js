const express = require('express')
const router = express.Router()

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
  req.app.locals.db
    .collection('users')
    .insertOne(req.body)
    .then(result => {
      console.log('New user added to collection', result)
      res.status(200).json(result)
    })
    .catch(error => {
      console.log('Could not add user to collection', error)
      res.status(500).json({ error: error.details[0].message })
    })
})

/* Login user */
router.post('/users/login', (req, res) => {
  res.send('respond with a resource')
})

module.exports = router
