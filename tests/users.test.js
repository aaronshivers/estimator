const expect = require('expect')
const request = require('supertest')

const app = require('../estimator')

describe('/users', () => {

  describe('GET /users', () => {

    it('should respond 401 if user is not logged in', async () => {

      await request(app)
        .get('/users/me')
        .expect(401)
    })
  })
})
