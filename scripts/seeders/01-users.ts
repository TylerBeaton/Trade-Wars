import { User } from '../../models';
import { faker } from '@faker-js/faker';

export async function seedUsers(numUsers: number) {
  for (let i = 0; i < numUsers; i++) {
    await User.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }
}
