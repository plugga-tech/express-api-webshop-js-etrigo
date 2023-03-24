const express = require('express')
const router = express.Router()

/* GET go back to home page. */
router.get('/', async (req, res) => res.redirect('/'))

/* POST add product to cart */
router.post('/', async (req, res) => {
  const user = req.signedCookies['logged_in_user']
  const storedCart = req.signedCookies['cart']
  let cart = {}
  if (user) {
    if (storedCart) {
      storedCart.products.push({
        quantity: parseInt(req.body.quantity),
        ...req.body
      })
      res.cookie('cart', storedCart, { signed: true })
    } else {
      cart.user = user.id
      cart.products = [{ quantity: parseInt(req.body.quantity), ...req.body }]
      res.cookie('cart', cart, { signed: true })
    }
  }
  res.redirect('/')
})

module.exports = router
