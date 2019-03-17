const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/user-model')
const validatePassword = require('../middleware/validate-password')
const authenticateUser = require('../middleware/authenticate-user')
const { createToken, verifyToken } = require('../middleware/handle-tokens')

const cookieExpiration = { expires: new Date(Date.now() + 86400000) }
const saltRounds = 10

// GET /
router.get('/', (req, res) => {
  const { token } = req.cookies
  if (token) {
    res.redirect('/calculator')
  } else {
    res.render('home')
  }
})

// GET /users/me
router.get('/users/me', authenticateUser, (req, res) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET
  const decoded = jwt.verify(token, secret)
  const { _id } = decoded

  User.findById(_id).then((user) => {
    if (user) {
      res.render('profile', { user })
    } else {
      res.status(401).render('error', {
        statusCode: '401',
        errorMessage: 'Sorry, you must be logged in to view this page.'
      })
    }
  })
})

// POST /users
router.post('/users', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  if (!password || !email) return res.status(400).render('error', {
    statusCode: '400',
    errorMessage: 'You must provide an email, and a password.'
  })

  validatePassword(password).then((password) => {
    const newUser = { email, password }
    const user = new User(newUser)

    user.save().then((user) => {
      createToken(user).then((token) => {
        res
          .cookie('token', token, cookieExpiration)
          .status(201)
          .redirect(`/calculator`)
      })
    }).catch(err => res.status(400).send(err.message))
  }).catch(err => res.status(400).render('error', {
    statusCode: '400',
    errorMessage: err.message
  }))
})

router.get('/users/:id/view', authenticateUser, (req, res) => {
  const { id } = req.params

  User.findById(id).then((user) => {
    res.render('view-user', { user })
  })
})

// GET /signup
router.get('/signup', (req, res) => res.render('signup'))

// GET /login
router.get('/login', (req, res) => res.render('login'))

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, hash) => {
        if (hash) {
          createToken(user).then((token) => {
            res
              .cookie('token', token, cookieExpiration)
              .status(200)
              .redirect(`/calculator`)
          })
        } else {
          res.status(401).render('error', {
            statusCode: '401',
            errorMessage: 'Please check your login credentials, and try again.'
          })
        }
      })
    } else {
      res.status(401).render('error', {
        statusCode: '401',
        errorMessage: 'Please check your login credentials, and try again.'
      })
    }
  }).catch(err => res.status(401)
    .send('Please check your login credentials, and try again.'))
})

// GET /logout
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect(`/`)
})

// GET /users/:id/edit
router.get('/users/edit', authenticateUser, (req, res) => {
  const { token } = req.cookies

  verifyToken(token).then((id) => {
    User.findById(id).then((user) => {
      if (!user) {
        res.status(404).render('error', {
          statusCode: '404',
          errorMessage: `Sorry, we can't find that user in our database.`
        })
      } else {
        res.render('edit-user', { user })
      }
    })
  })
})

// PATCH /users/:id
router.patch('/users/:id', authenticateUser, (req, res) => {
  const { token } = req.cookies
  const { id } = req.params
  const { email, password } = req.body

  User.findById(id).then((user) => {
    if (!user) {
      res.status(404).render('error', {
        statusCode: '404',
        errorMessage: 'Sorry, that user was not found in our database.'
      })
    } else {
      
      verifyToken(token).then((creator) => {

        if (creator !== id) {
          return res.status(401).render('error', {
            statusCode: '401',
            errorMessage: `Sorry, it appears that you 
            are not the owner of that account.`
          })
        }

        validatePassword(password).then((password) => {

          bcrypt.hash(password, saltRounds).then((hash) => {
            const updatedUser = {
              email,
              password: hash
            }
            const options = { runValidators: true }

            User.findByIdAndUpdate(id, updatedUser, options).then((user) => {

              if (user) return res.status(302).redirect('/profile')

              res.status(404).render('error', {
                statusCode: '404',
                errorMessage: `Sorry, that user Id 
                was not found in our database.`
              })
            }).catch(err => res.status(400).render('error', {
              statusCode: '400',
              errorMessage: `Sorry, that email already exists in our database.`
            }))
          }).catch(err => res.status(400).render('error', {
            statusCode: '400',
            errorMessage: err.message
          }))
        }).catch(err => res.status(400).render('error', {
          statusCode: '400',
          errorMessage: err.message
        }))
      })
    }
  })
})

// DELETE /users/:id
router.delete('/users/delete', authenticateUser, (req, res) => {
  const { token } = req.cookies

  verifyToken(token).then((id) => {
    User.findByIdAndDelete(id).then((user) => {

      if (user) {
        res.clearCookie('token').redirect('/')
      } else {
        res.status(404).render('error', {
          statusCode: '404',
          errorMessage: 'Sorry, we could not find that user in our database.'
        })
      }
    })
  })
})

module.exports = router
