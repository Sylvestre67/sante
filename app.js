const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const swaggerUi = require('swagger-ui-express')
const bullBoard = require('bull-board')
const cors = require('cors')
const mongoose = require('mongoose')
const swaggerJsdoc = require('swagger-jsdoc')
const config = require('config');

const { mongo } = config;
const { user, pwd } = mongo;

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// Configure Mongoose
mongoose.connect(`mongodb://${user}:${pwd}@localhost/sante?authSource=admin`, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('debug', true);

// Models
require('./models/User');

const options = {
  swaggerDefinition: {
    info: {
      title: 'sante',
      version: '0.0.1',
    },
  },
  apis: ['./src/routes*.js'],
}

const swaggerSpecification = swaggerJsdoc(options)

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors());
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Passport 
require('./auth/passport');

// Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpecification))

const bullRouter = bullBoard.router
app.use('/admin/queues', bullRouter)



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
