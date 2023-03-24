const express = require('express')
const router = express.Router()

/* GET render cart */
router.get('/', async (req, res) => {
  const user = req.signedCookies['logged_in_user']
  const storedCart = req.signedCookies['cart']
  if (user && storedCart) {
    console.log(storedCart)
    res.render('cart', {
      title: 'Your shopping cart',
      cart: storedCart
    })
  } else {
    res.redirect('/')
  }
})

module.exports = router
