import { User } from '../../models';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export async function seedUsers(numUsers: number) {
  for (let i = 0; i < numUsers; i++) {
    await User.create({
      id: uuidv4(),
      name: faker.person.firstName() + ' ' + faker.person.lastName(),
      username: `${faker.internet.username()}_${i}`,
      email: faker.internet.email(),
      emailVerified: faker.datatype.boolean(),
      image: faker.image.avatar(),
    });
  }
}
