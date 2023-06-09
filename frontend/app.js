const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const flash = require('connect-flash')
require('dotenv').config()

const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')
const registerRouter = require('./routes/register')
const addToCartRouter = require('./routes/addToCart')
const cartRouter = require('./routes/cart')
const orderRouter = require('./routes/order')
const ordersRouter = require('./routes/orders')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: 'sessionsecret',
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    resave: false
  })
)
app.use(flash())

app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/logout', logoutRouter)
app.use('/register', registerRouter)
app.use('/addToCart', addToCartRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)
app.use('/orders', ordersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
