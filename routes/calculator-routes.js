const express = require('express')
const router = express.Router()

const User = require('../models/user-model')
const authenticateUser = require('../middleware/authenticate-user')
const { verifyToken } = require('../middleware/handle-tokens')
const calculatePrice = require('../middleware/calculate-price')

// GET /calculator
router.get('/calculator', authenticateUser, (req, res) => {
  const { token } = req.cookies
  const parameters = {
    hoursWorkedOrEstimatedForJob,
    partsAndMaterials1,
    partsAndMaterials2,
    partsAndMaterials3
  } = req.query

  verifyToken(token).then((id) => {
    User.findById(id).then((user) => {
      calculatePrice(user, parameters).then((salePriceToCustomer) => {
        res.render('calculator', {
          salePriceToCustomer,
          parameters
        })
      })
    })
  })
})

// GET /settings
router.get('/settings', authenticateUser, (req, res) => {
  const { token } = req.cookies

  verifyToken(token).then((id) => {
    User.findById(id).then((user) => {
      res.render('settings', { user })
    })
  })
})

// PATCH /users/:id
router.patch('/settings', authenticateUser, (req, res) => {
  const { token } = req.cookies
  const {
    totalOperatingExpenses,
    payrollTaxExpenses,
    wagesAndSalaries,
    totalCostOfGoodsSold,
    employeeHourlyRate,
    desiredPreTaxNetProfitMargin
  } = req.body

  verifyToken(token).then((id) => {
    const update = {
      settings : {
        totalOperatingExpenses,
        payrollTaxExpenses,
        wagesAndSalaries,
        totalCostOfGoodsSold,
        employeeHourlyRate,
        desiredPreTaxNetProfitMargin
      }
    }
    const options = { runValidators: true }
    User.findByIdAndUpdate(id, update, options).then((user) => {
      res.status(302).redirect('/calculator')
    })
  })
})

module.exports = router
