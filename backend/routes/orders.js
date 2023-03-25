const express = require('express')
const { ObjectId } = require('mongodb')
const router = express.Router()

// GET get all orders - DONE
router.get('/all/:token', (req, res) => {
  if (req.params.token === process.env.API_KEY) {
    req.app.locals.db
      .collection('orders')
      .find()
      .toArray()
      .then(orders => {
        if (orders.length > 0) {
          res.status(200).json(orders)
        } else {
          res.status(400).json({ error: 'No orders found' })
        }
      })
  } else {
    res.status(401).json({ error: 'Wrong api key' })
  }
})

// POST add new order - DONE
router.post('/add', (req, res) => {
  // kontrollera att id föruser och produklt är korrect format
  let userId
  let productId

  try {
    userId = new ObjectId(req.body.user)
  } catch (error) {
    res.status(400).json({ error: 'Invalid user id format' })
  }

  req.body.products.forEach(productInOrder => {
    try {
      productId = new ObjectId(productInOrder.productId)
    } catch (error) {
      res.status(400).json({ error: 'Invalid product id format' })
    }
  })

  req.app.locals.db
    .collection('users')
    .findOne({ _id: userId })
    .then(user => {
      if (user) {
        const productIds = req.body.products.map(
          product => new ObjectId(product.productId)
        )
        const query = { _id: { $in: productIds } }
        req.app.locals.db
          .collection('products')
          .find(query)
          .toArray()
          .then(products => {
            if (products.length === req.body.products.length) {
              products.forEach(product => {
                const productData = req.body.products.find(
                  productData =>
                    productData.productId === product._id.toString()
                )
                if (product.lager >= productData.quantity) {
                  product.lager -= productData.quantity
                } else {
                  res.status(400).json({ error: 'Sorry not enough in stock' })
                }
              })
              const updated = products.map(product => ({
                updateOne: {
                  filter: { _id: product._id },
                  update: { $set: { lager: product.lager } }
                }
              }))
              req.app.locals.db
                .collection('products')
                .bulkWrite(updated)
                .then(() => {
                  req.app.locals.db
                    .collection('orders')
                    .insertOne(req.body)
                    .then(result => {
                      res.status(200).json(result)
                    })
                    .catch(error => {
                      res.status(500).json(error)
                    })
                })
                .catch(error => {
                  res.status(500).json(error)
                })
            } else {
              res.status(400).json({ error: 'cannot find all products' })
            }
          })
      } else {
        res.status(400).json({ error: 'User dont exist' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

// POST get order from specific user
router.post('/user', (req, res) => {
  if (process.env.API_KEY === req.body.token) {
    req.app.locals.db
      .collection('orders')
      .find({ user: req.body.user })
      .toArray()
      .then(user => {
        if (user) {
          res.status(200).json(user)
        } else {
          res.status(400).json({ error: 'No order for user found' })
        }
      })
      .catch(error => {
        res.status(500).json(error)
      })
  } else {
    res.status(401).json({ error: 'Wrong api key' })
  }
})

module.exports = router
