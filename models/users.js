const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
    payrollTaxExpenses: { type: Number, default: 9835 },
    wagesAndSalaries: { type: Number, default: 16453 },
    totalCostOfGoodsSold: { type: Number, default: 66400 },
    employeeHourlyRate: { type: Number, default: 36 },
    desiredPreTaxNetProfitMargin: { type: Number, default: 0.2 }
  }
})

// hash plain text passwords on user creation
userSchema.pre('save', async function(next) {
  const user = this
  const saltingRounds = 10

  if (user.isModified || user.isNew) {
    try {
      const hash = await bcrypt.hash(user.password, saltingRounds)
      user.password = hash
    } catch (error) {
      next(error)
    }
  }
  next()
})

// create auth tokens
userSchema.methods.createAuthToken = function () {
  const user = this
  const payload = { _id: user._id, isAdmin: user.isAdmin }
  const secret = process.env.JWT_SECRET
  const options = { expiresIn: '2d' }
  return jwt.sign(payload, secret, options)
}

const User = mongoose.model('User', userSchema)

module.exports = User
