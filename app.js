const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

const app = express()

// load user model
require('./models/user')
require('./models/story')

// passports config
require('./config/passport')(passport)

// load routes
const index = require('./routes/index')
const auth = require('./routes/auth')
const stories = require('./routes/stories')

// load keys
const keys = require('./config/keys')

// handlebars helper
const { truncate, stripTags, formatDate, select, editIcon } = require('./helpers/hbs')

// map global promises
mongoose.promise = global.Promise

// mongoose connect
mongoose.connect(keys.mongoURI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// method override
app.use(methodOverride('_method'))

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// handlebars middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
  },
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

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// use routes
app.use('/', index)
app.use('/auth', auth)
app.use('/stories', stories)

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})