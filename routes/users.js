const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../models/users')
const validate = require('../middleware/validate')
const userValidator = require('../middleware/userValidator')
const auth = require('../middleware/auth')
// const { createToken, verifyToken } = require('../middleware/handle-tokens')

const cookieExpiration = { expires: new Date(Date.now() + 86400000) }
// const saltRounds = 10

// GET /signup
router.get('/users/signup', (req, res) => {

  try {

    // render signup page
    res.render('signup')

  } catch (error) {

    // send error message
    res.render('error', { msg: error.message })
  }
})

// GET /login
router.get('/users/login', (req, res) => {

  try {
    
    // render login page
    res.render('login')
    
  } catch (error) {

    // send error message
    res.render('error', { msg: error.message })
  }
})

// GET /users/me
router.get('/users/me', auth, async (req, res) => {

  try {

    // render profle with user info
    res.render('profile', { user: req.user })
    
  } catch (error) {

    // send error message
    res.render('error', { msg: error.message })
  }
})

// POST /users
router.post('/users', validate(userValidator), async (req, res) => {

  try {

    // get email and password from the body
    const { email, password } = req.body

    // check db for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).render('error', { msg: 'User already registered.' })

    // create user
    const user = await new User({ email, password })

    // save user
    await user.save()

    // get auth token
    const token = await user.createAuthToken()

    // set header and return user info
    res.cookie('token', token, cookieExpiration).status(201).render(`profile`, { user })

  } catch (error) {

    // send error message
    res.status(400).render('error', { msg: error.message })
  }
})

// GET /logout
router.get('/users/logout', (req, res) => {

  // remove auth token and redirect to /
  res.clearCookie('token').redirect(`/`)
})

// router.get('/users/:id/view', auth, (req, res) => {
//   const { id } = req.params

//   User.findById(id).then((user) => {
//     res.render('view-user', { user })
//   })
// })

// // POST /login
// router.post('/login', (req, res) => {
//   const { email, password } = req.body

//   User.findOne({ email }).then((user) => {
//     if (user) {
//       bcrypt.compare(password, user.password, (err, hash) => {
//         if (hash) {
//           createToken(user).then((token) => {
//             res
//               .cookie('token', token, cookieExpiration)
//               .status(200)
//               .redirect(`/calculator`)
//           })
//         } else {
//           res.status(401).render('error', {
//             statusCode: '401',
//             errorMessage: 'Please check your login credentials, and try again.'
//           })
//         }
//       })
//     } else {
//       res.status(401).render('error', {
//         statusCode: '401',
//         errorMessage: 'Please check your login credentials, and try again.'
//       })
//     }
//   }).catch(err => res.status(401)
//     .send('Please check your login credentials, and try again.'))
// })

// // GET /users/:id/edit
// router.get('/users/edit', auth, (req, res) => {
//   const { token } = req.cookies

//   verifyToken(token).then((id) => {
//     User.findById(id).then((user) => {
//       if (!user) {
//         res.status(404).render('error', {
//           statusCode: '404',
//           errorMessage: `Sorry, we can't find that user in our database.`
//         })
//       } else {
//         res.render('edit-user', { user })
//       }
//     })
//   })
// })

// // PATCH /users/:id
// router.patch('/users/:id', auth, (req, res) => {
//   const { token } = req.cookies
//   const { id } = req.params
//   const { email, password } = req.body

//   User.findById(id).then((user) => {
//     if (!user) {
//       res.status(404).render('error', {
//         statusCode: '404',
//         errorMessage: 'Sorry, that user was not found in our database.'
//       })
//     } else {
      
//       verifyToken(token).then((creator) => {

//         if (creator !== id) {
//           return res.status(401).render('error', {
//             statusCode: '401',
//             errorMessage: `Sorry, it appears that you 
//             are not the owner of that account.`
//           })
//         }

//         validatePassword(password).then((password) => {

//           bcrypt.hash(password, saltRounds).then((hash) => {
//             const updatedUser = {
//               email,
//               password: hash
//             }
//             const options = { runValidators: true }

//             User.findByIdAndUpdate(id, updatedUser, options).then((user) => {

//               if (user) return res.status(302).redirect('/profile')

//               res.status(404).render('error', {
//                 statusCode: '404',
//                 errorMessage: `Sorry, that user Id 
//                 was not found in our database.`
//               })
//             }).catch(err => res.status(400).render('error', {
//               statusCode: '400',
//               errorMessage: `Sorry, that email already exists in our database.`
//             }))
//           }).catch(err => res.status(400).render('error', {
//             statusCode: '400',
//             errorMessage: err.message
//           }))
//         }).catch(err => res.status(400).render('error', {
//           statusCode: '400',
//           errorMessage: err.message
//         }))
//       })
//     }
//   })
// })

// // DELETE /users/:id
// router.delete('/users/delete', auth, (req, res) => {
//   const { token } = req.cookies

//   verifyToken(token).then((id) => {
//     User.findByIdAndDelete(id).then((user) => {

//       if (user) {
//         res.clearCookie('token').redirect('/')
//       } else {
//         res.status(404).render('error', {
//           statusCode: '404',
//           errorMessage: 'Sorry, we could not find that user in our database.'
//         })
//       }
//     })
//   })
// })

module.exports = router
