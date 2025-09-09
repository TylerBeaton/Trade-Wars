import { expect } from 'chai';
import request from 'supertest';
import { app, sequelize } from '../app';

describe('User Routes', () => {

    // First test: get all users (GET)
    it("should return a list of all users", async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200);
        //console.log("Reponse:", response.body);
        expect(response.body).to.be.an('array');
    });

    // Second test: create a new user (POST)
    it("should create a new user", async () => {
        const newUser = {
            firstName: 'mochaTest',
            lastName: 'chaiTest',
        };

        const response = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);

        //console.log("Created user:", response.body);

        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('firstName', 'mochaTest');
        expect(response.body).to.have.property('lastName', 'chaiTest');
    });

    // Third test: get a user by ID (GET)
    it("should return a user by ID", async () => {
        const newUser = {
            firstName: 'expresso',
            lastName: 'pekoe'
        }

        const createReponse = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);

        const userId = createReponse.body.id;
        //console.log("Created user with ID:", userId);

        const getResponse = await request(app)
            .get(`/api/users/${userId}`)
            .expect(200);

        //console.log("Found user:", getResponse.body);
        expect(getResponse.body).to.have.property('id', userId);
        expect(getResponse.body).to.have.property('firstName', 'expresso');
        expect(getResponse.body).to.have.property('lastName', 'pekoe');
    });

    // Fourth test: update a user (PUT)
    it("should update a user", async () => {
        const newUser = {
            firstName: 'original',
            lastName: 'user'
        };

        const createResponse = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201);

        const userId = createResponse.body.id;
        //console.log('Created user for update (PUT) with id: ', userId)

        const updateData = {
            firstName: 'updated',
            lastName: 'user'
        }

        const updateResponse = await request(app)
            .put(`/api/users/${userId}`)
            .send(updateData)
            .expect(200);

        //console.log("Updated user: ", updateResponse.body);
        expect(updateResponse.body).to.have.property('id', userId);
        expect(updateResponse.body).to.have.property('firstName', 'updated');
        expect(updateResponse.body).to.have.property('lastName', 'user');
    });

    // Fifth test: delete a user (DELETE)
    it("should delete a user", async () => {
        const newUser = {
            firstName: 'delete',
            lastName: 'me'
        }

        const createResponse = await request(app)
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const userId = createResponse.body.id;
        //console.log('Created user for delete (DELETE) with id: ', userId)

        const deleteResponse = await request(app)
            .delete(`/api/users/${userId}`)
            .expect(200);

        //console.log("Deleted user with ID:", userId);
        expect(deleteResponse.body).to.have.property('message', `User ${userId} deleted`);

        const getResponse = await request(app)
            .get(`/api/users/${userId}`)
            .expect(200);

        //console.log("User after deletion: ", getResponse.body);
        expect(getResponse.body).to.be.null;
    })
});