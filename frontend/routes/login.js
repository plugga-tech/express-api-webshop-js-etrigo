var express = require('express')
var router = express.Router()

/* GET home page. */
router.post('/', function (req, res, next) {
  // fetch user id from api based on email if password is correct
  fetch('http://localhost:3000/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.id) {
        res.cookie('logged_in_user', data.id)
        req.flash('login_msg', 'You have been logged in')
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
  // if response === 200 set user id in cookie and redirect to index route
  // else if reponse === 401 redirect with error message
  // else redirect with error message
})

module.exports = router
