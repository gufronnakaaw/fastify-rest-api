import prisma from '../../utils/database';
import generate from '../../utils/generate';
import slug from '../../utils/slug';
import { getTestUser } from './seller.util';

export async function deleteTestProduct() {
  const seller = await getTestUser();

  await prisma.product.deleteMany({
    where: {
      seller_id: seller!.id,
    },
  });
}

export async function createTestProduct() {
  const seller = await getTestUser();

  const name = 'Create Product Test';
  await prisma.product.create({
    data: {
      id_product: generate(),
      name,
      description: 'Create Desc Test',
      slug: slug(name),
      price: 999,
      stock: 999,
      seller_id: seller!.id,
    },
  });
}
