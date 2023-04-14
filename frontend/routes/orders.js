const express = require('express')
const router = express.Router()

/* GET render orders */
router.get('/', async (req, res) => {
  const user = req.signedCookies['logged_in_user']
  if (user) {
    const orders = await fetch('http://localhost:3000/api/orders/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user: user.id, token: process.env.API_KEY })
    }).then(response => response.json())
    if (orders.length === 0) {
      req.flash('login_msg', 'You have no orders to show')
      res.redirect('/')
    } else {
      const productIds = []
      orders.map(order => {
        order.products.map(product => {
          if (!productIds.includes(product.productId)) {
            productIds.push(product.productId)
          }
        })
      })

      const productsFromDB = await Promise.all(
        productIds.map(async id => {
          const response = await fetch(
            `http://localhost:3000/api/products/${id}`
          )

          const product = await response.json()

          return product
        })
      )

      orders.map(order => {
        order.products.map(product => {
          const productData = productsFromDB.find(
            productFromDB => productFromDB._id === product.productId
          )
          product.name = productData.name
        })
      })

      res.render('orders', {
        title: 'My orders page',
        orders: orders
      })
    }
  } else {
    res.redirect('/')
  }
})

module.exports = router
