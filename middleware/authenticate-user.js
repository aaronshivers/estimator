const jwt = require('jsonwebtoken')

const User = require(`../models/user-model`)

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).render('error', {
          statusCode: '401',
          errorMessage: err.message
        })
      } else {
        User.findById(decoded._id).then((user) => {
          if (user) {
            next()
          } else {
            res.status(401).render('error', {
              statusCode: '401',
              errorMessage: `Sorry, we couldn't find your account in our database.`
            })
          }
        })
      }    
    })
  } else {
    res.status(401).render('error', {
      statusCode: '401',
      errorMessage: 'You must login to view this page.'
    })
  }
}

module.exports = authenticateUser
