const mongoose = require('mongoose')
const validator = require('validator')

const hashPassword = require('../middleware/hash-password')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 8,
    maxlength: 100,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email address.`
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 100
  },
  signupDate: {
    type: Date,
    default: Date.now()
  },
  settings: {
    totalOperatingExpenses: { type: Number, default: 87084 },
    payrollTaxExpenses: { type: Number, default: 98335 },
    wagesAndSalaries: { type: Number, default: 16453 },
    totalCostOfGoodsSold: { type: Number, default: 66400 },
    employeeHourlyRate: { type: Number, default: 36 },
    desiredPreTaxNetProfitMargin: { type: Number, default: 0.2 }
  }
})

hashPassword(userSchema)

const User = mongoose.model('User', userSchema)

module.exports = User
