
const supertest = require('supertest')
const app = require('../src/app')
const knex = require('knex')
const {PORT, DATABASE_URL} = require('../src/config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL
})
app.set('db', db)

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello, world')
  })
})

