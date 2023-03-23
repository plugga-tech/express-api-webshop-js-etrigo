const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  const user = req.signedCookies['logged_in_user']
  let is_logged_in
  if (user) {
    req.flash('login_msg', `You are logged in ${user.name}`)
    is_logged_in = true
  } else {
    req.flash('login_msg', 'You need to login')
    is_logged_in = false
  }
  const login_msg = req.flash('login_msg')[0]
  res.render('index', {
    title: 'Webshop app',
    msg: login_msg,
    is_logged_in: is_logged_in
  })
})

module.exports = router
