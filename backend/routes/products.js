const express = require('express')
const router = express.Router()
const { ObjectId } = require('mongodb')

// GET all products
router.get('/', (req, res) => {
  req.app.locals.db
    .collection('products')
    .find()
    .toArray()
    .then(products => {
      if (products.length > 0) {
        res.status(200).json(products)
      } else {
        res.status(400).json({ error: 'No products found' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

// GET one specific product - DONE
router.get('/:id', (req, res) => {
  try {
    const id = new ObjectId(req.params.id)
    req.app.locals.db
      .collection('products')
      .findOne({ _id: id })
      .then(product => {
        if (product) {
          res.status(200).json(product)
        } else {
          res.status(400).json({ error: 'No product found' })
        }
      })
      .catch(error => {
        res.status(500).json(error)
      })
  } catch (error) {
    res.status(400).json({ error: 'Invalid id format' })
  }
})

// POST create new product - DONE
router.post('/add', (req, res) => {
  if (process.env.API_KEY === req.body.token) {
    const { token, ...product } = req.body
    req.app.locals.db
      .collection('products')
      .insertOne(product)
      .then(result => {
        res.status(200).json(result)
      })
      .catch(error => {
        res.status(500).json(error)
      })
  } else {
    res.status(401).json({ error: 'Wrong api key' })
  }
})

module.exports = router
