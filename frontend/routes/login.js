const express = require('express')
const router = express.Router()

/* POST login user */
router.post('/', (req, res) => {
  fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
    .then(response => response.json())
    .then(data => {
      if (data.id) {
        res.cookie(
          'logged_in_user',
          { id: data.id, name: data.name },
          { signed: true }
        )
        req.flash('login_msg', `You have been logged in ${data.name}`)
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
