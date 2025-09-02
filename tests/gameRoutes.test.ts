import { expect } from 'chai';
import request from 'supertest';
import { app, models, sequelize } from '../app';

describe('Game Routes', () => {

    let testUser: any;
    let testGame: any;

    beforeEach(async () => {
        await sequelize.sync({ force: true });

        testUser = await models.User.create({
            firstName: "Test",
            lastName: "User"
        });

        testGame = await models.Game.create({
            name: "Test Game",
            description: "A game created during testing",
            maxPlayers: 4,
            ownerId: testUser.id,
            isActive: true
        });
    });

    afterEach(async () => {
        await sequelize.sync({ force: true });
    });

    // CRUD Tests for /api/games

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
            ownerId: testUser.id,
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
        expect(response.body).to.have.property('ownerId', testUser.id);
        expect(response.body).to.have.property('isActive', true);
    });
    // Third test: get a game by ID (GET)
    it("should return a game by ID", async () => {
        const newGame = {
            name: 'Test Game',
            description: 'A game created during testing',
            maxPlayers: 4,
            ownerId: testUser.id,
            isActive: true
        };
        const createReponse = await request(app)
            .post('/api/games')
            .send(newGame)
            .expect(201);

        const gameId = createReponse.body.id;
        console.log("Created game with ID:", gameId);

        const response = await request(app)
            .get(`/api/games/${gameId}`)
            .expect(200);

        expect(response.body).to.have.property('id', gameId);
        expect(response.body).to.have.property('ownerId', testUser.id);
        expect(response.body).to.have.property('name', 'Test Game');
        expect(response.body).to.have.property('description', "A game created during testing");
        expect(response.body).to.have.property('maxPlayers', 4);
        expect(response.body).to.have.property('isActive');
    })
    // Fourth test: update a game (PUT)
    it("should update a game", async () => {
        const newGame = {
            name: 'Test Game',
            description: 'A game created during testing',
            maxPlayers: 4,
            ownerId: testUser.id,
            isActive: true
        };

        const createResponse = await request(app)
            .post('/api/games')
            .send(newGame)
            .expect(201);

        const gameId = createResponse.body.id;
        console.log('Created game for update (PUT) with id: ', gameId)

        const updateData = {
            name: 'Test Game Renamed',
            description: 'A game created during testing and updated',
            maxPlayers: 4,
            ownerId: testUser.id,
            isActive: true
        };

        const updateResponse = await request(app)
            .put(`/api/games/${gameId}`)
            .send(updateData)
            .expect(200);

        console.log("Updated game: ", updateResponse.body);
        expect(updateResponse.body).to.have.property('id');
        expect(updateResponse.body).to.have.property('name', 'Test Game Renamed');
        expect(updateResponse.body).to.have.property('description', 'A game created during testing and updated');
        expect(updateResponse.body).to.have.property('maxPlayers', 4);
        expect(updateResponse.body).to.have.property('ownerId', testUser.id);
        expect(updateResponse.body).to.have.property('isActive', true);
    })
    // Fifth test: delete a game (DELETE)
    it("should delete a game", async () => {
        const newGame = {
            name: 'Test Game',
            description: 'A game created during testing',
            maxPlayers: 4,
            ownerId: testUser.id,
            isActive: true
        };

        const createResponse = await request(app)
            .post('/api/games')
            .send(newGame)
            .expect(201)

        const gameId = createResponse.body.id;
        console.log('Created game for delete (DELETE) with id: ', gameId)

        const deleteResponse = await request(app)
            .delete(`/api/games/${gameId}`)
            .expect(200);

        console.log("Deleted game with ID:", gameId);
        expect(deleteResponse.body).to.have.property('message', `Game ${gameId} deleted`);

        const getResponse = await request(app)
            .get(`/api/games/${gameId}`)
            .expect(200);

        console.log("Game after deletion: ", getResponse.body);
        expect(getResponse.body).to.be.null;
    })

    // Player Tests for /api/games

    // Add Player
    it("should add a player to a game", async () => {
        const response = await request(app)
            .post(`/api/games/${testGame.id}/players`)
            .send({ userId: testUser.id })
            .expect(200);

        console.log("Added player to game:", response.body);
        expect(response.body).to.have.property('message', `User ${testUser.id} added to game ${testGame.id}`);

        const playersResponse = await request(app)
            .get(`/api/games/${testGame.id}/players`)
            .expect(200);

        console.log("Players in game:", playersResponse.body);
        expect(playersResponse.body).to.be.an('array');
        expect(playersResponse.body).to.have.lengthOf(1);
        expect(playersResponse.body[0]).to.have.property('id', testUser.id);
        expect(playersResponse.body[0]).to.have.property('firstName', testUser.firstName);
        expect(playersResponse.body[0]).to.have.property('lastName', testUser.lastName);
    })

})