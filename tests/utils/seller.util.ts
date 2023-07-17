import prisma from '../../utils/database';

export async function removeTestUser() {
  await prisma.seller.deleteMany({
    where: {
      domain: 'testing',
    },
  });
}
