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


// router.patch('/users/:id', authenticateUser, (req, res) => {
//   const { token } = req.cookies
//   const { id } = req.params
//   const {
//     totalOperatingExpenses,
//     payrollTaxExpenses,
//     wagesAndSalaries,
//     totalCostOfGoodsSold,
//     employeeHourlyRate,
//     desiredPreTaxNetProfitMargin
//   } = req.body

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
//         const updatedUser = {
//           totalOperatingExpenses,
//           payrollTaxExpenses,
//           wagesAndSalaries,
//           totalCostOfGoodsSold,
//           employeeHourlyRate,
//           desiredPreTaxNetProfitMargin
//         }
//         const options = { runValidators: true }

//         User.findByIdAndUpdate(id, updatedUser, options).then((user) => {

//           if (user) return res.status(302).redirect('/calculator')

//           res.status(404).render('error', {
//             statusCode: '404',
//             errorMessage: `Sorry, that user Id 
//             was not found in our database.`
//           })
//         }).catch(err => res.status(400).render('error', {
//           statusCode: '400',
//           errorMessage: `Sorry, that email already exists in our database.`
//         }))
//       })
//     }
//   })
// })

module.exports = router
