const { ObjectId } = require('mongodb')

const User = require(`../models/user-model`)
const { createToken } = require('../middleware/handle-tokens')

const users = [{
  _id: new ObjectId(),
  email: `user0@example.com`,
  password: `0asdfASDF1234!@#`
}, {
  _id: new ObjectId(),
  email: `user1@example.com`,
  password: `1asdfASDF1234!@#`
}, {
  _id: new ObjectId(),
  email: `user2@example.com`,
  password: `2asdfASDF1234!@#`
}, {
  _id: new ObjectId(),
  email: `invalid.email@net`, // invalid email
  password: `3asdfASDF1234!@#`
}, {
  _id: new ObjectId(),
  email: `user4@example.com`,
  password: `4asdfASDF1234` // invalid password
}]

const populateUsers = (done) => {
  User.deleteMany().then(() => {
    const user0 = new User(users[0]).save()
    const user1 = new User(users[1]).save()

    return Promise.all([user0, user1])
  }).then(() => done())
}

const tokens = []
  
users.forEach((user) => {
  createToken(user).then((token) => {
    tokens.push(token)
  })
})

module.exports = {
  populateUsers,
  users,
  tokens
}
