const express = require('express')
const router = express.Router()

/* POST login user */
router.get('/', (req, res) => {
  res.clearCookie('logged_in_user')
  req.flash('login_msg', 'You have been logged out')
  res.redirect('/')
})

module.exports = router
