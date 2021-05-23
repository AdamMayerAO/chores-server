
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

describe('POST /household', () =>{
  it("Successfully posting a new household returns 201 success",() =>{
   const knex = app.get('db')
   knex.table('household').truncate()
   const data = {
    "householdName": "Mayer",
    "email": "r.adammayer@gmail.com",
    "password": "8"
   };
  return supertest(app)
      .post('/household/signup')
      .send({ data })
      .expect(201)
  })
}) 
    //1. truncate database //2. post successfully
    //3. try to REPOST the same household
    //4. delete the new
 
  // test('Household-Router returns 405 if email already exists', () => {
  //   const data = {
  //     "householdName": "Mayer",
  //     "email": "r.adammayer@gmail.com",
  //     "password": "8"
  //   };

  //   return supertest(app)
  //   .post("household/signup")
  //   .set("Accept", "application/json")
  //   .send({ data })

  