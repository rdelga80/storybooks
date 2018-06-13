const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

const app = express()

// load user model
require('./models/user')

// passports config
require('./config/passport')(passport)

// load routes
const index = require('./routes/index')
const auth = require('./routes/auth')

// load keys
const keys = require('./config/keys')

// // map global promises
mongoose.promise = global.Promise

// mongoose connect
mongoose.connect(keys.mongoURI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(cookieParser())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))

// passport middlewear
app.use(passport.initialize())
app.use(passport.session())

// set global vars
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

// use routes
app.use('/', index)
app.use('/auth', auth)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})