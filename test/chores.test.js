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

describe('Chores test', () => {
    const existinghousehold = {
        householdName: 'test',
        email: 'test@gmail.com',
        password: 'test'
    };
    before(async () => {
        await db('members').delete();
        console.info('Deleting all records in members collection');
        await db('household').delete();
        console.info('Deleting all records in household collection');
        await db('chores').delete();
        console.info('Deleting all records in chores collection');
        await db('household').insert(existinghousehold);
        console.info('Inserting household record')
        ;
    });

    it('GET /chores/id/:id', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const response = await request(app)
            .get(`/chores/id/${id}`)
            .expect(200);
        const { body } = response;
        expect(body).to.have.property('chores').to.be.an.instanceOf(Array);
        expect(body).to.have.property('message').to.equal('chores fetched successfully!');
    });

    it('GET fail /chores/id/:id, household does not exist', async () => {
        const response = await request(app)
            .get('/chores/id/11111')
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching details!');
    });

    it('POST /chores/id/:id', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const chores = {
            done: true,
            householdId: id
        };
        const response = await request(app)
            .post('/chores/id/1')
            .send(chores)
            .expect(201);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('chore added successfully!');
    });

    it('POST fail /chores/id/:id, household does not exist', async () => {
        const chores = {
            done: true,
            householdId: 1
        };
        const response = await request(app)
            .post(`/chores/id/${chores.householdId}`)
            .send(chores)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching details!');
    });

    it('DELETE /chores/id/:id', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const chores = {
            householdId: id
        };
        await request(app)
            .delete('/chores/id/1')
            .send(chores)
            .expect(204);
    });

    it('POST /chores/add-chore', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const chore = {
            householdId: id,
            points: 6,
            chore: 'test',
            done: true,
            member_name: 'test'
        };
        const response = await request(app)
            .post('/chores/add-chore')
            .send(chore)
            .expect(201);
            const { body } = response;
            expect(body).to.have.property('chore')
            expect(body).to.have.property('message').to.equal('chore added successfully!');
            expect(body.chore).to.have.property('chore').to.equal(chore.chore);
            expect(body.chore).to.have.property('member_name').to.equal(chore.member_name);
            expect(body.chore).to.have.property('done').to.equal(chore.done);
    });

    it('POST fail /chores/add-chore, missing params', async () => {
        const chore = {
            points: 6,
            chore: 'test',
            done: true,
            member_name: 'test'
        };
        const response = await request(app)
            .post('/chores/add-chore')
            .send(chore)
            .expect(400);
            const { body } = response;
            expect(body).to.have.property('error');
            expect(body.error).to.have.property('message').to.equal(`Missing 'householdId' in request body`);
    });

    it('POST fail /chores/add-chore, household does not exist', async () => {
        const chore = {
            householdId: 12345454,
            points: 6,
            chore: 'test',
            done: true,
            member_name: 'test'
        };
        const response = await request(app)
            .post('/chores/add-chore')
            .send(chore)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching details!');
    });

    it('DELETE fail /chore/remove-chore, household does not exist', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const choresdata = await db('chores').select();
        const choreid = choresdata[0].id;
        const chores = {
            householdId: 1,
            id: choreid,
        };
        const response = await request(app)
            .delete('/chores/remove-chore')
            .send(chores)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('An error occurred while fetching  details!');
    });

    it('DELETE /chore/remove-chore', async () => {
        const householddata = await db('household').select();
        const { id } = householddata[0];
        const choresdata = await db('chores').select();
        const choreid = choresdata[0].id;
        const chores = {
            householdId: id,
            id: choreid,
        };
        await request(app)
            .delete('/chores/remove-chore')
            .send(chores)
            .expect(204);
    });
});
