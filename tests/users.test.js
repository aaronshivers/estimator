const expect = require('expect')
const request = require('supertest')

const app = require('../estimator')
const User = require('../models/users')

describe('/users', () => {

  const userOne = {
    email: 'test@example.com',
    password: 'asdfASDF1234!@#$'
  }

  let token

  beforeEach(async () => {
    await User.deleteMany()
    const user = await new User(userOne).save()
    token = await user.createAuthToken()
  })

  describe('GET /users/me', () => {

    it('should respond 401 if user is NOT logged in', async () => {

      await request(app)
        .get('/users/me')
        .expect(401)
    })

    it('should respond 200 if user is logged in', async () => {
      
      await request(app)
        .get('/users/me')
        .set('Cookie', `token=${ token }`)
        .expect(200)
    })
  })
})
