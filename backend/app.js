const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
require('dotenv').config()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

const MongoClient = require('mongodb').MongoClient

MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    console.log('App is connected to db')
    const db = client.db('bjorn_sjostedt')
    app.locals.db = db
  })
  .catch(error => {
    console.log('Could not connect to database', error)
    process.exit(1)
  })

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app
