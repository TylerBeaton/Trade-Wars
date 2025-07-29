import 'dotenv/config';

import { expect } from 'chai';
import { Sequelize } from 'sequelize';
import UserModel from '../models/userModel';

describe('User Model', () => {
    let sequelize: Sequelize;
    let User: any;

    const PROJECT_ROOT = process.cwd();

    before(async () => {
        // Initialize Sequelize with PostgreSQL connection
        sequelize = new Sequelize(
            process.env.DB_NAME ?? 'database',
            process.env.DB_USER ?? 'user',
            process.env.DB_PASSWORD ?? 'password',
            {
                host: process.env.DB_HOST ?? 'localhost',
                dialect: 'postgres',
            }
        );

        User = UserModel(sequelize);
        await sequelize.authenticate();
        console.log('Model test database connected!');
    });

    after(async () => {
        await sequelize.close();
    });

    it('should reject a user without firstName', async () => {
        try {
            await User.create({
                lastName: 'TestLastName'
                // Missing firstName - should fail!
            });
            expect.fail('Should have thrown an error for missing firstName');
        } catch (error : any) {
            console.log('Caught expected error: ', error.message);
            console.log("Error name:", error.name);
            expect(error.name).to.equal('SequelizeValidationError');
        }
    });
});