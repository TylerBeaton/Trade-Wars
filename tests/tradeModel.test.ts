import 'dotenv/config';

import { expect } from 'chai';
import { Sequelize } from 'sequelize';
import TradeModel from '../models/tradeModel';

describe('Trade Model', () => {
    let sequelize: Sequelize;
    let Trade: any;

    beforeEach(async () => {
        // Create a completely separate connection for model tests
        sequelize = new Sequelize(
            process.env.TEST_DB_NAME ?? 'test_models', // Use TEST_DB_NAME instead
            process.env.DB_USER ?? 'user',
            process.env.DB_PASSWORD ?? 'password',
            {
                host: process.env.DB_HOST ?? 'localhost',
                dialect: 'postgres',
                logging: false,
            }
        );

        Trade = TradeModel(sequelize);
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Reset tables for each test
    });

    afterEach(async () => {
        if (sequelize) {
            await sequelize.close();
        }
    });

    it('should reject a trade without ownerId', async () => {
        try {
            await Trade.create({
                stock: 'GOOG',
                price: 42.00,
                quantity: 100,
                type: 'buy',
                description: "Test trade using mocha, supertest, and chai.",
                isActive: true
            });
            expect.fail('Should have thrown an error for missing ownerId');
        } catch (error: any) {
            expect(error.name).to.equal('SequelizeValidationError');
        }
    });

    it('should create a trade with valid data', async () => {
        const trade = await Trade.create({
            ownerId: 1,
            gameId: 1,
            stock: 'GOOG',
            price: 42.00,
            quantity: 100,
            type: 'buy',
            description: "Test trade using mocha, supertest, and chai.",
            isActive: true
        });

        expect(trade).to.have.property('id');
        expect(trade.ownerId).to.equal(1);
        expect(trade.gameId).to.equal(1);
        expect(trade.stock).to.equal('GOOG');
        expect(trade.price).to.equal('42.00');
        expect(trade.quantity).to.equal(100);
        expect(trade.type).to.equal('buy');
        expect(trade.description).to.equal("Test trade using mocha, supertest, and chai.");
        expect(trade.isActive).to.equal(true);

    });
});