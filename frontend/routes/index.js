const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', async (req, res) => {
  const user = req.signedCookies['logged_in_user']
  const cart = req.signedCookies['cart'] ? req.signedCookies['cart'] : null
  let productsInCart = null
  if (cart) {
    productsInCart = cart.products.reduce(
      (prev, current) => prev + parseInt(current.quantity),
      0
    )
  }
  let is_logged_in
  if (user) {
    req.flash('login_msg', `You are logged in ${user.name}`)
    is_logged_in = true
  } else {
    req.flash('login_msg', 'You need to login')
    is_logged_in = false
  }

  const products = await fetch('http://localhost:3000/api/products').then(
    response => response.json()
  )
  let categories = await fetch('http://localhost:3000/api/categories').then(
    response => response.json()
  )

  if (!categories.error && !products.error) {
    categories.forEach(categoryData => {
      categoryData.products = []
      products.forEach(product => {
        if (product.category === categoryData._id) {
          const { category, ...rest } = product
          categoryData.products.push(rest)
        }
      })
    })
  } else {
    categories = false
  }

  const login_msg = req.flash('login_msg')[0]
  res.render('index', {
    title: 'Webshop app',
    msg: login_msg,
    is_logged_in: is_logged_in,
    categories: categories,
    cart: productsInCart
  })
})

module.exports = router
