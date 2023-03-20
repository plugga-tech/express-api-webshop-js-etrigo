const express = require('express')
const router = express.Router()

/* Get all users excluding password. */
router.get('/', (req, res) => {
  res.send('respond with a resource')
})

/* Get specific user object. */
router.post('/', (req, res) => {
  res.send('respond with a resource')
})

/* Create new user */
router.post('/add', (req, res) => {
  res.send('respond with a resource')
})

/* Login user */
router.post('/login', (req, res) => {
  res.send('respond with a resource')
})

module.exports = router
