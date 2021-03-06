require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const mongoose = require('./db/mongoose')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const app = express()
const { PORT, NODE_ENV } = process.env

const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')
const calculatorRoutes = require('./routes/calculator-routes')

app.set('view engine', 'ejs')

app.use(helmet())
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(indexRoutes)
app.use(userRoutes)
app.use(calculatorRoutes)

app.use((req, res, next) => {
  res.status(404).render('error', { msg: 'Page Not Found' })
})

app.use((error, req, res, next) => {
  res.status(500).render('error', { msg: 'Server Error' })
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${ PORT }.`)
  console.log(`Environment set to: ${ NODE_ENV }.`)
})

module.exports = app
