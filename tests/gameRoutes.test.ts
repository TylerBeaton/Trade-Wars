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
        // console.log("Reponse:", response.body);
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
        //console.log("Created game:", response.body);
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
        //console.log("Created game with ID:", gameId);

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
        //console.log('Created game for update (PUT) with id: ', gameId)

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

        //console.log("Updated game: ", updateResponse.body);
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
        //console.log('Created game for delete (DELETE) with id: ', gameId)

        const deleteResponse = await request(app)
            .delete(`/api/games/${gameId}`)
            .expect(200);

        //console.log("Deleted game with ID:", gameId);
        expect(deleteResponse.body).to.have.property('message', `Game ${gameId} deleted`);

        const getResponse = await request(app)
            .get(`/api/games/${gameId}`)
            .expect(200);

        //console.log("Game after deletion: ", getResponse.body);
        expect(getResponse.body).to.be.null;
    })

    // Player Tests for /api/games

    // Add Player
    it("should add a player to a game", async () => {
        const response = await request(app)
            .post(`/api/games/${testGame.id}/players`)
            .send({ userId: testUser.id })
            .expect(200);

        //console.log("Added player to game:", response.body);
        expect(response.body).to.have.property('message', `User ${testUser.id} added to game ${testGame.id}`);

        const playersResponse = await request(app)
            .get(`/api/games/${testGame.id}/players`)
            .expect(200);

        //console.log("Players in game:", playersResponse.body);
        expect(playersResponse.body).to.be.an('array');
        expect(playersResponse.body).to.have.lengthOf(1);
        expect(playersResponse.body[0]).to.have.property('id', testUser.id);
        expect(playersResponse.body[0]).to.have.property('firstName', testUser.firstName);
        expect(playersResponse.body[0]).to.have.property('lastName', testUser.lastName);
    })

    it("should create a game, and add players", async () => {

        const user1 = await models.User.create({
            firstName: "Chai",
            lastName: "Tea",
        });
        const user2 = await models.User.create({
            firstName: "Mocha",
            lastName: "Coffee",
        });
        const user3 = await models.User.create({
            firstName: "Latte",
            lastName: "Milk",
        });

        const game = await models.Game.create({
            name: "Trading Wars",
            description: "A test game of the ages.",
            maxPlayers: 4,
            ownerId: user1.id,
            isActive: true
        })

        await request(app)
            .post(`/api/games/${game.id}/players`)
            .send({ userId: user1.id })
            .expect(200);
        await request(app)
            .post(`/api/games/${game.id}/players`)
            .send({ userId: user2.id })
            .expect(200);
        await request(app)
            .post(`/api/games/${game.id}/players`)
            .send({ userId: user3.id })
            .expect(200);

        const playersResponse = await request(app)
            .get(`/api/games/${game.id}/players`)
            .expect(200);

        expect(playersResponse.body).to.be.an('array');
        expect(playersResponse.body).to.have.lengthOf(3);

    })

    it("should create a game, add players and create trades", async () => {

        const user1 = await models.User.create({
            firstName: "Chai",
            lastName: "Tea",
        });
        const user2 = await models.User.create({
            firstName: "Mocha",
            lastName: "Coffee",
        });
        const user3 = await models.User.create({
            firstName: "Latte",
            lastName: "Milk",
        });

        const game = await models.Game.create({
            name: "Trading Wars",
            description: "A test game of the ages.",
            maxPlayers: 4,
            ownerId: user1.id,
            isActive: true
        })

        await request(app)
            .post(`/api/games/${game.id}/players`)
            .send({ userId: user1.id })
            .expect(200);
        await request(app)
            .post(`/api/games/${game.id}/players`)
            .send({ userId: user2.id })
            .expect(200);
        await request(app)
            .post(`/api/games/${game.id}/players`)
            .send({ userId: user3.id })
            .expect(200);

        const trade1Data = {
            ownerId: user1.id,
            gameId: game.id,
            stock: 'AAPL',
            price: 150.00,
            quantity: 100,
            type: 'buy',
            description: "Chai's first trade for AAPL.",
            isActive: true
        }

        const trade2Data = {
            ownerId: user2.id,
            gameId: game.id,
            stock: 'GOGL',
            price: 321.00,
            quantity: 50,
            type: 'buy',
            description: "Mocha's first trade for AAPL.",
            isActive: true
        }

        const trade3Data = {
            ownerId: user3.id,
            gameId: game.id,
            stock: 'TSLA',
            price: 200.00,
            quantity: 65,
            type: 'buy',
            description: "Latte's first trade for AAPL.",
            isActive: true
        }

        const trade1Response = await request(app)
            .post(`/api/games/${game.id}/trades`)
            .send(trade1Data)
            .expect(201)

        const trade2Response = await request(app)
            .post(`/api/games/${game.id}/trades`)
            .send(trade2Data)
            .expect(201)

        const trade3Response = await request(app)
            .post(`/api/games/${game.id}/trades`)
            .send(trade3Data)
            .expect(201)

        const tradesResponse = await request(app)
            .get(`/api/games/${game.id}/trades`)
            .expect(200)

        expect(tradesResponse.body).to.be.an('array');
        expect(tradesResponse.body).to.have.lengthOf(3);

        // console.log("Trades in game:", tradesResponse.body);


    })
})