const express = require('express')
const router = express.Router()

/* GET render for to register */
router.get('/', (req, res) => {
  req.signedCookies['logged_in_user']
    ? res.redirect('/')
    : res.render('register', { title: 'Become member' })
})

/* POST register new user. */
router.post('/', (req, res) => {
  fetch('http://localhost:3000/api/users/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
    .then(response => response.json())
    .then(data => {
      if (data.insertedId) {
        res.cookie(
          'logged_in_user',
          { id: data.insertedId, name: data.name },
          { signed: true }
        )
        req.flash(
          'login_msg',
          `Welcome as new member. You have been logged in ${data.name}`
        )
        res.redirect('/')
      } else {
        req.flash('login_msg', 'You have NOT been logged in')
        res.redirect('/')
      }
    })
    .catch(error => {
      req.flash('login_msg', 'Server error')
      res.redirect('/')
    })
})

module.exports = router
