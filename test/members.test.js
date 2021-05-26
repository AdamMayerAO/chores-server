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

describe('Members test', () => {
    const existinghousehold = {
        householdName: 'test',
        email: 'test@gmail.com',
        password: 'test'
    };
    before(async () => {
        await db('household').delete();
        console.info('Deleting all records in household collection');
        await db('chores').delete();
        console.info('Deleting all records in chores collection');
        await db('members').delete();
        console.info('Deleting all records in members collection');
        await db('household').insert(existinghousehold);
        console.info('Inserting household record');
    });

    it('GET /members/:id', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const response = await request(app)
            .get(`/members/${id}`)
            .expect(200);
        const { body } = response;
        expect(body).to.have.property('members').to.be.an.instanceOf(Array);
        expect(body).to.have.property('message').to.equal('Members fetched successfully!');
    });

    it('GET fail /members/:id, household does not exist', async () => {
        const response = await request(app)
            .get(`/members/1`)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching details!');
    });


    it('POST fail /members/add-member, missing fields', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const member = {
            householdId: id,
            name: null,
            age: 1,
            points: 1
        };
        const response = await request(app)
            .post('/members/add-member')
            .send(member)
            .expect(400);
        const { body } = response;
        expect(body).to.have.property('error');
        expect(body.error).to.have.property('message');
    });


    it('POST fail /members/add-member, missing household', async () => {
        const member = {
            householdId: 1,
            name: 'test',
            age: 1,
            points: 1
        };
        const response = await request(app)
            .post('/members/add-member')
            .send(member)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching details!');
    });

    it('POST /members/add-member', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const member = {
            householdId: id,
            name: 'test',
            age: 1,
            points: 1
        };
        const response = await request(app)
            .post('/members/add-member')
            .send(member)
            .expect(201);
        const { body } = response;
        expect(body).to.have.property('member');
        expect(body.member).to.have.property('name').to.equal(member.name);
        expect(body).to.have.property('message').to.equal('member added successfully!');
    });

    it('DELETE fail /members/remove-member, household does not exist', async () => {
        const memberdata = await db('members').select();
        const memberid = memberdata[0].id;
        const member = {
            householdId: 1,
            id: memberid,
        };
        const response = await request(app)
            .delete('/members/remove-member')
            .send(member)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching  details!');
    });

    it('DELETE /members/remove-member', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const memberdata = await db('members').select();
        const memberid = memberdata[0].id;
        const member = {
            householdId: id,
            id: memberid,
        };
        await request(app)
            .delete('/members/remove-member')
            .send(member)
            .expect(204);
    });
});
