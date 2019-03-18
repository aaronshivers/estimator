const expect = require('expect')
const request = require('supertest')

const app = require('../estimator')
const User = require('../models/users')

describe('/users', () => {

  const users = [{
    email: 'user0@example.com',
    password: 'asdfASDF1234!@#$'
  }, {
    email: 'user1@example.com',
    password: 'asdfASDF1234!@#$'
  }, {
    email: 'user2@example.com',
    password: 'invalidpass'
  }, {
    email: 'invalid.email!com',
    password: 'asdfASDF1234!@#$'
  }]

  let token

  beforeEach(async () => {
    await User.deleteMany()
    const user = await new User(users[0]).save()
    token = await user.createAuthToken()
  })

  describe('GET /users/signup', () => {

    it('should respond 200', async () => {
      
      await request(app)
        .get('/users/signup')
        .expect(200)
    })
  })

  describe('GET /users/login', () => {

    it('should respond 200', async () => {
      
      await request(app)
        .get('/users/login')
        .expect(200)
    })
  })

  describe('GET /users/me', () => {

    it('should respond 401 if user is NOT logged in', async () => {

      await request(app)
        .get('/users/me')
        .expect(401)
    })

    it('should respond with 400 if token is phony', async () => {
      const cookie = `token=${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}`
      
      await request(app)
        .get('/users/me')
        .set('Cookie', cookie)
        .expect(400)
    })

    it('should respond 200 if user is logged in', async () => {
      
      await request(app)
        .get('/users/me')
        .set('Cookie', `token=${ token }`)
        .expect(200)
    })
  })

  describe('POST /users', () => {

    it('should respond 400 if email is invalid', async () => {
      const { email, password } = users[3]

      await request(app)
        .post('/users')
        .send(`email=${ email }`)
        .send(`password=${ password }`)
        .expect(400)

      const foundUser = await User.findOne({ email })
      expect(foundUser).toBeFalsy()
    })

    it('should respond 400 if password is invalid', async () => {
      const { email, password } = users[2]

      await request(app)
        .post('/users')
        .send(`email=${ email }`)
        .send(`password=${ password }`)
        .expect(400)

      const foundUser = await User.findOne({ email })
      expect(foundUser).toBeFalsy()      
    })

    it('should respond 400 if email is already registered', async () => {
      const { email, password } = users[0]

      await request(app)
        .post('/users')
        .send(`email=${ email }`)
        .send(`password=${ password }`)
        .expect(400)

      const foundUser = await User.findOne({ email })
      expect(foundUser).toBeTruthy()      
    })

    it('should respond 201 and save the new user', async () => {
      const { email, password } = users[1]

      await request(app)
        .post('/users')
        .send(`email=${ email }`)
        .send(`password=${ password }`)
        .expect(201)

      const foundUser = await User.findOne({ email })
      expect(foundUser).toBeTruthy()
      expect(foundUser.email).toEqual(email)
      expect(foundUser.password).not.toEqual(password)
    })
  })

  describe('GET /users/logout', () => {

    it('should respond 200, delete auth token, and redirect to /', async () => {

      await request(app)
        .get('/users/logout')
        .set('Cookie', `token=${ token }`)
        .expect(302)
        .expect(res => {
          expect(res.header.location).toEqual('/')
          expect(res.header['set-cookie']).toEqual(["token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"])
        })
    })
  })
})
