var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  let is_logged_in
  if (req.cookies['logged_in_user']) {
    req.flash('login_msg', 'You are logged in')
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
