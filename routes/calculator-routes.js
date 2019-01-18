const express = require('express')
const router = express.Router()

router.get('/calculator', (req, res) => {
  res.render('calculator')
})


module.exports = router
