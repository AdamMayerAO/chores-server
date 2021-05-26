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

describe('Household test', () => {
    const existinghousehold = {
        householdName: 'test',
        email: 'test@gmail.com',
        password: 'test'
    };
    const newhouse = {
        householdName: 'demo',
        email: 'demo@gmail.com',
        password: 'demo'
    };
    const emptyhouse = {
        householdName: '',
        email: '',
        password: ''
    };
    before(async () => {
        await db('chores').delete();
        console.info('Deleting all records in chores collection');
        await db('members').delete();
        console.info('Deleting all records in members collection');
        await db('household').delete();
        console.info('Deleting all records in household collection');
        await db('household').insert(existinghousehold);
        console.info('Inserting household record');
    });

    let id;

    it('POST fail /household/signup, empty parameters', async () => {
        const response = await request(app)
            .post('/household/signup')
            .send(emptyhouse)
            .expect(405);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('One or more parameters are incorrect/empty!');
    });

    it('POST fail /household/signup, household already exists', async () => {
        const response = await request(app)
            .post('/household/signup')
            .send(existinghousehold)
            .expect(405);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('Household with this email already exists!');
    });

    it('POST /household/signup', async () => {
        const response = await request(app)
            .post('/household/signup')
            .send(newhouse)
            .expect(201);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('Household registered successfully!');
        expect(body).to.have.property('household');
        expect(body.household).to.have.property('householdName').to.equal(newhouse.householdName);
        expect(body.household).to.have.property('email').to.equal(newhouse.email);
        expect(body.household).to.have.property('password').to.equal(newhouse.password);
        expect(body.household).to.have.property('points').to.equal(null);
        expect(body.household).to.have.property('prize').to.equal(null);
        expect(body.household).to.have.property('goal').to.equal(null);
        id = body.household.id;
    });

    it('POST /household/login', async () => {
        const login = {
            email: newhouse.email,
            password: newhouse.password
        };
        const response = await request(app)
            .post('/household/login')
            .send(login)
            .expect(200);
        const { body } = response;
        expect(body).to.have.property('household');
        expect(body.household).to.have.property('householdName').to.equal(newhouse.householdName);
        expect(body.household).to.have.property('email').to.equal(newhouse.email);
        expect(body.household).to.have.property('password').to.equal(newhouse.password);
        expect(body.household).to.have.property('points').to.equal(null);
        expect(body.household).to.have.property('prize').to.equal(null);
        expect(body.household).to.have.property('goal').to.equal(null);
    });

    it('POST fail /household/login, household does not exist', async () => {
        const login = {
            email: 't@gmail.com',
            password: 't'
        };
        const response = await request(app)
            .post('/household/login')
            .send(login)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('Household does not exist with this email!');
    });

    it('POST fail /household/login, wrong password', async () => {
        const login = {
            email: newhouse.email,
            password: newhouse.email
        };
        const response = await request(app)
            .post('/household/login')
            .send(login)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('Email or password is incorrect!');
    });

    it('POST /household/prize', async () => {
        const prize = {
            prize: 'test',
            householdId: id,
            goal: 2
        };
        const response = await request(app)
            .post('/household/prize')
            .send(prize)
            .expect(201);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('prize added successfully!');
        expect(body).to.have.property('household');
        expect(body.household).to.have.property('householdName').to.equal(newhouse.householdName);
        expect(body.household).to.have.property('email').to.equal(newhouse.email);
        expect(body.household).to.have.property('password').to.equal(newhouse.password);
        expect(body.household).to.have.property('prize').to.equal(prize.prize);
        expect(body.household).to.have.property('goal').to.equal(prize.goal);
    });

    it('POST fail /household/prize, household does not exist', async () => {
        const prize = {
            prize: 'test',
            householdId: 1,
            goal: 2
        };
        const response = await request(app)
            .post('/household/prize')
            .send(prize)
            .expect(404);
        const { body } = response;
        expect(body).to.have.property('message').to.equal('Prize error!');
    });
});
