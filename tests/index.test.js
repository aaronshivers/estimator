const expect = require('expect')
const request = require('supertest')

const app = require('../estimator')

describe('/', () => {

  it('should respond 200', async () => {
    await request(app)
      .get('/')
      .expect(200)
  })
})
