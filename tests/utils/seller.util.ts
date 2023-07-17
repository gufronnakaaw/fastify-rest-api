import prisma from '../../utils/database';
import { hashpassword } from '../../utils/hashandcheck';
import generate from '../../utils/generate';

export async function removeTestUser() {
  await prisma.seller.deleteMany({
    where: {
      domain: 'testing',
    },
  });
}

export async function createTestUser() {
  await prisma.seller.create({
    data: {
      id_seller: generate(),
      domain: 'testing',
      name: 'testing name',
      email: 'testing@mail.com',
      password: await hashpassword('testingpass'),
    },
  });
}
