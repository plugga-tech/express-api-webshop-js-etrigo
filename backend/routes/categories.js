const express = require('express')
const router = express.Router()

// get all categories - DONE
router.get('/', (req, res) => {
  req.app.locals.db
    .collection('categories')
    .find()
    .toArray()
    .then(categories => {
      if (categories.length > 0) {
        res.status(200).json(categories)
      } else {
        res.status(400).json({ error: 'No categories found' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

// add new category - DONE
router.post('/add', (req, res) => {
  if (req.body.token === process.env.API_KEY) {
    req.app.locals.db
      .collection('categories')
      .findOne({ name: req.body.name })
      .then(category => {
        if (category) {
          res.status(409).json({ error: 'Category already exists' })
        } else {
          req.app.locals.db
            .collection('categories')
            .insertOne({ name: req.body.name })
            .then(result => {
              res.status(200).json(result)
            })
            .catch(error => {
              res.status(500).json(error)
            })
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
