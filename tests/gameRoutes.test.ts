import { expect } from 'chai';
import request from 'supertest';
import { app, models, sequelize } from '../app';

describe('Game Routes', () => {

    const createTestUser = async () => models.User.create({
        firstName: "Mocha",
        lastName: "Latte"
    })

    const createTestGame = async (ownerId: number) => models.Game.create({
        name: "Test Game",
        description: "A game created during testing",
        maxPlayers: 4,
        ownerId: ownerId,
        startingBalance: 10000.00,
        isActive: true
    })

    const createTestPlayer = async (userId: number, gameId: number, balance: number) => models.Player.create({
        userId: userId,
        balance: balance,
        gameId: gameId,
    })


    beforeEach(async () => {
        await sequelize.sync({ force: true });
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
        expect(response.body).to.be.an('array');
    });

    // Second test: create a new game (POST)
    it("should create a new game", async () => {
        const testUser = await createTestUser();

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

        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', 'Test Game');
        expect(response.body).to.have.property('description', 'A game created during testing');
        expect(response.body).to.have.property('maxPlayers', 4);
        expect(response.body).to.have.property('ownerId', testUser.id);
        expect(response.body).to.have.property('isActive', true);
    });

    // Third test: get a game by ID (GET)
    it("should return a game by ID", async () => {
        const testUser = await createTestUser();

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

        const response = await request(app)
            .get(`/api/games/${gameId}`)
            .expect(200);

        expect(response.body).to.have.property('id', gameId);
        expect(response.body).to.have.property('ownerId', testUser.id);
        expect(response.body).to.have.property('name', newGame.name);
        expect(response.body).to.have.property('description', newGame.description);
        expect(response.body).to.have.property('maxPlayers', newGame.maxPlayers);
        expect(response.body).to.have.property('isActive', newGame.isActive);
    })
    // Fourth test: update a game (PUT)
    it("should update a game", async () => {

        const testUser = await createTestUser();

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

        expect(updateResponse.body).to.have.property('id');
        expect(updateResponse.body).to.have.property('name', updateData.name);
        expect(updateResponse.body).to.have.property('description', updateData.description);
        expect(updateResponse.body).to.have.property('maxPlayers', updateData.maxPlayers);
        expect(updateResponse.body).to.have.property('ownerId', testUser.id);
        expect(updateResponse.body).to.have.property('isActive', updateData.isActive);
    })

    // Fifth test: delete a game (DELETE)
    it("should delete a game", async () => {

        const testUser = await createTestUser();

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

        const deleteResponse = await request(app)
            .delete(`/api/games/${gameId}`)
            .expect(200);

        expect(deleteResponse.body).to.have.property('message', `Game ${gameId} deleted`);

        const getResponse = await request(app)
            .get(`/api/games/${gameId}`)
            .expect(200);

        expect(getResponse.body).to.be.null;
    })

    // Player Tests for /api/games

    // Add Player
    it("should add a player to a game", async () => {

        const testUser = await createTestUser();
        const testGame = await createTestGame(testUser.id);

        const response = await request(app)
            .post(`/api/games/${testGame.id}/players`)
            .send({ userId: testUser.id })
            .expect(201); 

        expect(response.body).to.have.property('message');
        expect(response.body).to.have.property('player');

        const playerResponse = await request(app)
            .get(`/api/games/${response.body.player.gameId}/players/${response.body.player.id}`)
            .expect(200);

        expect(playerResponse.body).to.have.property('id', response.body.player.id);
        expect(playerResponse.body).to.have.property('userId', response.body.player.userId);
        expect(playerResponse.body).to.have.property('gameId', response.body.player.gameId);
        expect(playerResponse.body).to.have.property('balance', response.body.player.balance);
        expect(playerResponse.body.balance).to.equal(testGame.startingBalance);
    })

    //it("should create a game, and add players", async () => {

    it("should create a game, add players and list players", async () => {

        const testUser = await createTestUser();

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

        const testGame = await createTestGame(testUser.id);

        await request(app)
            .post(`/api/games/${testGame.id}/players`)
            .send({ userId: user1.id })
            .expect(201);
        await request(app)
            .post(`/api/games/${testGame.id}/players`)
            .send({ userId: user2.id })
            .expect(201);
        await request(app)
            .post(`/api/games/${testGame.id}/players`)
            .send({ userId: user3.id })
            .expect(201);

        const playersResponse = await request(app)
            .get(`/api/games/${testGame.id}/players`)
            .expect(200);

        expect(playersResponse.body).to.be.an('array');
        expect(playersResponse.body).to.have.lengthOf(3);

    })

    //it("should create a game, add players and create trades", async () => {

    //    const testUser = await createTestUser();
    //    const testGame = await createTestGame(testUser.id);

    //    const user1 = await models.User.create({
    //        firstName: "Chai",
    //        lastName: "Tea",
    //    });
    //    const user2 = await models.User.create({
    //        firstName: "Mocha",
    //        lastName: "Coffee",
    //    });
    //    const user3 = await models.User.create({
    //        firstName: "Latte",
    //        lastName: "Milk",
    //    });

    //    await request(app)
    //        .post(`/api/games/${testGame.id}/players`)
    //        .send({ userId: user1.id })
    //        .expect(200);
    //    await request(app)
    //        .post(`/api/games/${testGame.id}/players`)
    //        .send({ userId: user2.id })
    //        .expect(200);
    //    await request(app)
    //        .post(`/api/games/${testGame.id}/players`)
    //        .send({ userId: user3.id })
    //        .expect(200);

    //    const trade1Data = {
    //        ownerId: user1.id,
    //        gameId: testGame.id,
    //        stock: 'AAPL',
    //        price: 150.00,
    //        quantity: 100,
    //        type: 'buy',
    //        description: "Chai's first trade for AAPL.",
    //        isActive: true
    //    }

    //    const trade2Data = {
    //        ownerId: user2.id,
    //        gameId: testGame.id,
    //        stock: 'GOGL',
    //        price: 321.00,
    //        quantity: 50,
    //        type: 'buy',
    //        description: "Mocha's first trade for AAPL.",
    //        isActive: true
    //    }

    //    const trade3Data = {
    //        ownerId: user3.id,
    //        gameId: testGame.id,
    //        stock: 'TSLA',
    //        price: 200.00,
    //        quantity: 65,
    //        type: 'buy',
    //        description: "Latte's first trade for AAPL.",
    //        isActive: true
    //    }

    //    const trade1Response = await request(app)
    //        .post(`/api/games/${testGame.id}/trades`)
    //        .send(trade1Data)
    //        .expect(201)

    //    const trade2Response = await request(app)
    //        .post(`/api/games/${testGame.id}/trades`)
    //        .send(trade2Data)
    //        .expect(201)

    //    const trade3Response = await request(app)
    //        .post(`/api/games/${testGame.id}/trades`)
    //        .send(trade3Data)
    //        .expect(201)

    //    const tradesResponse = await request(app)
    //        .get(`/api/games/${testGame.id}/trades`)
    //        .expect(200)

    //    expect(tradesResponse.body).to.be.an('array');
    //    expect(tradesResponse.body).to.have.lengthOf(3);

    //    // console.log("Trades in game:", tradesResponse.body);


    //})
})