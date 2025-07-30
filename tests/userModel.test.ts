import 'dotenv/config';

import { expect } from 'chai';
import { Sequelize } from 'sequelize';
import UserModel from '../models/userModel';

describe('User Model', () => {
    let sequelize: Sequelize;
    let User: any;

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

        User = UserModel(sequelize);
        await sequelize.authenticate();
        await sequelize.sync({ force: true }); // Reset tables for each test
    });

    afterEach(async () => {
        if (sequelize) {
            await sequelize.close();
        }
    });

    it('should reject a user without firstName', async () => {
        try {
            await User.create({
                lastName: 'TestLastName'
            });
            expect.fail('Should have thrown an error for missing firstName');
        } catch (error: any) {
            expect(error.name).to.equal('SequelizeValidationError');
        }
    });

    it('should create a user with valid data', async () => {
        const user = await User.create({
            firstName: 'Test',
            lastName: 'User'
        });

        expect(user).to.have.property('id');
        expect(user.firstName).to.equal('Test');
        expect(user.lastName).to.equal('User');
    });
});