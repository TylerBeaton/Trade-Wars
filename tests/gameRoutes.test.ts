import { expect } from 'chai';
import request from 'supertest';
import { app, sequelize } from '../app';

describe('Game Routes', () => {
    // First test: get all games (GET)
    it("should return a list of all games", async () => {
        const response = await request(app)
            .get('/api/games')
            .expect(200);
        console.log("Reponse:", response.body);
        expect(response.body).to.be.an('array');
    });

    // Second test: create a new game (POST)
    it("should create a new game", async () => {
        const newGame = {
            name: 'Test Game',
            description: 'A game created during testing',
            maxPlayers: 4,
            ownerId: 1,
            isActive: true
        };
        const response = await request(app)
            .post('/api/games')
            .send(newGame)
            .expect(201);
        console.log("Created game:", response.body);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', 'Test Game');
        expect(response.body).to.have.property('description', 'A game created during testing');
        expect(response.body).to.have.property('maxPlayers', 4);
        expect(response.body).to.have.property('ownerId', 1);
        expect(response.body).to.have.property('isActive', true);
    });
    // Third test: get a game by ID (GET)
    it("should return a game by ID", async () => {
        const newGame = {
            name: 'Test Game',
            description: 'A game created during testing',
            maxPlayers: 4,
            ownerId: 1,
            isActive: true
        };
        const createReponse = await request(app)
            .post('/api/games')
            .send(newGame)
            .expect(201);
    })
})