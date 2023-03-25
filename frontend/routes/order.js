const express = require('express')
const router = express.Router()

/* GET redirect */
router.get('/', async (req, res) => res.redirect('/'))

/* POST place order */
router.post('/', async (req, res) => {
  const user = req.signedCookies['logged_in_user']
  const storedCart = req.signedCookies['cart']
  if (user && storedCart.user === req.body.user) {
    storedCart.products.forEach(product => {
      delete product.name
      product.quantity = parseInt(product.quantity)
    })
    fetch('http://localhost:3000/api/orders/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(storedCart)
    })
      .then(response => response.json())
      .then(data => {
        if (data.acknowledged) {
          res.clearCookie('cart')
          req.flash('order_msg', `Your order have been placed`)
          res.redirect('/orders')
        } else {
          req.flash('login_msg', `Sorry, your order could not be handled`)
          res.redirect('/')
        }
      })
      .catch(error => {
        req.flash('login_msg', 'Server error')
        res.redirect('/')
      })
  } else {
    res.redirect('/cart')
  }
})

module.exports = router
