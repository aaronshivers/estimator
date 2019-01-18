const express = require('express')
const router = express.Router()

router.get('/calculator', (req, res) => {
  res.render('calculator')
})

router.get('/settings', (req, res) => {
  res.render('settings')
})

module.exports = router
