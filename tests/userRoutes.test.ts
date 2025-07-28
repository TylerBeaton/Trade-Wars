import { expect } from 'chai';
import request from 'supertest';
import { app } from '../app';

describe('User Routes', () => {
    // First test: get all users (GET)
    it("should return a list of all users", async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200);
        console.log("Reponse:", response.body);
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

        console.log("Created user:", response.body);

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
        console.log("Created user with ID:", userId);

        const getResponse = await request(app)
            .get(`/api/users/${userId}`)
            .expect(200);

        console.log("Found user:", getResponse.body);
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
        console.log('Created user for update (PUT) with id: ', userId)

        const updateData = {
            firstName: 'updated',
            lastName: 'user'
        }

        const updateResponse = await request(app)
            .put(`/api/users/${userId}`)
            .send(updateData)
            .expect(200);

        console.log("Updated user: ", updateResponse.body);
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
        console.log('Created user for delete (DELETE) with id: ', userId)

        const deleteResponse = await request(app)
            .delete(`/api/users/${userId}`)
            .expect(200);

        console.log("Deleted user with ID:", userId);
        expect(deleteResponse.body).to.have.property('message', `User ${userId} deleted`);

        const getResponse = await request(app)
            .get(`/api/users/${userId}`)
            .expect(200);

        console.log("User after deletion: ", getResponse.body);
        expect(getResponse.body).to.be.null;
    })
});







//import request from 'supertest';
//import app from '../src/app';
//import { expect } from 'chai';

//describe('user routes', () => {
//    describe('get /users', () => {
//        it('should return a list of users', async () => {
//            const res = await request(app).get('/users');
//            expect(res.statuscode).tobe(200);
//            expect(array.isarray(res.body)).tobe(true);
//        });
//    });

//    describe('post /users', () => {
//        it('should create a new user', async () => {
//            const newuser = { username: 'testuser', password: 'testpass' };
//            const res = await request(app).post('/users').send(newuser);
//            expect(res.statuscode).tobe(201);
//            expect(res.body).tohaveproperty('id');
//            expect(res.body.username).tobe(newuser.username);
//        });
//    });

//    describe('get /users/:id', () => {
//        it('should return a user by id', async () => {
//            const user = { username: 'findme', password: 'findpass' };
//            const createres = await request(app).post('/users').send(user);
//            const userid = createres.body.id;

//            const res = await request(app).get(`/users/${userid}`);
//            expect(res.statuscode).tobe(200);
//            expect(res.body).tohaveproperty('id', userid);
//            expect(res.body.username).tobe(user.username);
//        });
//    });

//    describe('put /users/:id', () => {
//        it('should update a user', async () => {
//            const user = { username: 'updateuser', password: 'updatepass' };
//            const createres = await request(app).post('/users').send(user);
//            const userid = createres.body.id;

//            const updateddata = { username: 'updateduser' };
//            const res = await request(app).put(`/users/${userid}`).send(updateddata);
//            expect(res.statuscode).tobe(200);
//            expect(res.body.username).tobe(updateddata.username);
//        });
//    });

//    describe('delete /users/:id', () => {
//        it('should delete a user', async () => {
//            const user = { username: 'deleteuser', password: 'deletepass' };
//            const createres = await request(app).post('/users').send(user);
//            const userid = createres.body.id;

//            const res = await request(app).delete(`/users/${userid}`);
//            expect(res.statuscode).tobe(204);

//            const getres = await request(app).get(`/users/${userid}`);
//            expect(getres.statuscode).tobe(404);
//        });
//    });
//});