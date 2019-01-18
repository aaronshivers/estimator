require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const mongoose = require('./db/mongoose')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')

const app = express()
const { PORT } = process.env

const userRoutes = require('./routes/user-routes')
const calculatorRoutes = require('./routes/calculator-routes')

app.set('view engine', 'ejs')

app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(userRoutes)
app.use(calculatorRoutes)

app.get('/', (req, res) => res.render('home'))

app.use((req, res, next) => {
  res.status(404).render('error', {
    statusCode: '404',
    errorMessage: 'Sorry, we cannot find that!'
  })
})

app.use((err, req, res, next) => {
  res.status(500).render('error', {
    statusCode: '500',
    errorMessage: err.message
  })
})

app.listen(PORT)

module.exports = app
