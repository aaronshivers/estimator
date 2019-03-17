const express = require('express')
const router = express.Router()

// GET /
router.get('/', (req, res) => {

  try {

    // render home
    res.render('home')

  } catch (error) {

    // send error message
    res.render('error', { msg: error.message })
  }
})

module.exports = router
