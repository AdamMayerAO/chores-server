const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const knex = require('knex');
const { DATABASE_URL } = require('../src/config');

const db = knex({
    client: 'pg',
    connection: DATABASE_URL
});
app.set('db', db);

describe('App Test', async () => {
    const response = await request(app)
        .get('/')
        .expect(200);
    expect(response).to.have.property('text').to.equal('Hello, world');
});
