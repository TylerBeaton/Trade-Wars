import { expect } from 'chai';
import request from 'supertest';
import { app, sequelize } from '../app';

describe('Trade Routes', () => {

    // First test: get all trades (GET)
    it("should return a list of all trades", async () => {
        const response = await request(app)
            .get('/api/trades')
            .expect(200);
        console.log("Reponse:", response.body);
        expect(response.body).to.be.an('array');
    });

    // Second test: create a new trade (POST)
    it("should create a new trade", async () => {
        const newTrade = {
            ownerId: 1,
            stock: 'GOOG',
            price: 42,
            quantity: 100,
            type: 'buy',
            description: "Test trade using mocha, supertest, and chai.",
            isActive: true
        };

        const response = await request(app)
            .post('/api/trades')
            .send(newTrade)
            .expect(201);

        console.log("Created trade:", response.body);

        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('stock', 'GOOG');
        expect(response.body).to.have.property('price', 42);
        expect(response.body).to.have.property('quantity', 100);
        expect(response.body).to.have.property('type', 'buy');
        expect(response.body).to.have.property('description', 'Test trade using mocha, supertest, and chai.');
        expect(response.body).to.have.property('isActive', true);

    });

    // Third test: get a trade by ID (GET)
    it("should return a trade by ID", async () => {
        const newTrade = {
            ownerId: 1,
            stock: 'GOOG',
            price: 42,
            quantity: 100,
            type: 'buy',
            description: "Test trade using mocha, supertest, and chai.",
            isActive: true
        };

        const createReponse = await request(app)
            .post('/api/trades')
            .send(newTrade)
            .expect(201);

        const tradeId = createReponse.body.id;
        console.log("Created trade with ID:", tradeId);

        const response = await request(app)
            .get(`/api/trades/${tradeId}`)
            .expect(200);

        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('stock', 'GOOG');
        expect(response.body).to.have.property('price', 42);
        expect(response.body).to.have.property('quantity', 100);
        expect(response.body).to.have.property('type', 'buy');
        expect(response.body).to.have.property('description', 'Test trade using mocha, supertest, and chai.');
        // This is intentionally hidden for clarity in public API responses
        expect(response.body).to.not.have.property('isActive');
    });

    // Fourth test: update a trade (PUT)
    it("should update a trade", async () => {
        const newTrade = {
            ownerId: 1,
            stock: 'GOOG',
            price: 42,
            quantity: 100,
            type: 'buy',
            description: "Test trade using mocha, supertest, and chai.",
            isActive: true
        };

        const createResponse = await request(app)
            .post('/api/trades')
            .send(newTrade)
            .expect(201);

        const tradeId = createResponse.body.id;
        console.log('Created trade for update (PUT) with id: ', tradeId)

        const updateData = {
            ownerId: 1,
            stock: 'GOOG',
            price: 32, // Update the trade price
            quantity: 100,
            type: 'buy',
            description: "Test trade using mocha, supertest, and chai.",
            isActive: true
        };

        const updateResponse = await request(app)
            .put(`/api/trades/${tradeId}`)
            .send(updateData)
            .expect(200);

        console.log("Updated trade: ", updateResponse.body);
        expect(updateResponse.body).to.have.property('id');
        expect(updateResponse.body).to.have.property('stock', 'GOOG');
        expect(updateResponse.body).to.have.property('price', 32);
        expect(updateResponse.body).to.have.property('quantity', 100);
        expect(updateResponse.body).to.have.property('type', 'buy');
        expect(updateResponse.body).to.have.property('description', 'Test trade using mocha, supertest, and chai.');
        expect(updateResponse.body).to.have.property('isActive');
    });

    // Fifth test: delete a trade (DELETE)
    it("should delete a trade", async () => {
        const newTrade = {
            ownerId: 1,
            stock: 'GOOG',
            price: 42,
            quantity: 100,
            type: 'buy',
            description: "Test trade using mocha, supertest, and chai.",
            isActive: true
        };

        const createResponse = await request(app)
            .post('/api/trades')
            .send(newTrade)
            .expect(201)

        const tradeId = createResponse.body.id;
        console.log('Created trade for delete (DELETE) with id: ', tradeId)

        const deleteResponse = await request(app)
            .delete(`/api/trades/${tradeId}`)
            .expect(200);

        console.log("Deleted trade with ID:", tradeId);
        expect(deleteResponse.body).to.have.property('message', `Trade ${tradeId} deleted`);

        const getResponse = await request(app)
            .get(`/api/trades/${tradeId}`)
            .expect(200);

        console.log("Trade after deletion: ", getResponse.body);
        expect(getResponse.body).to.be.null;
    })
});