import validate from '../../utils/validate';
import prisma from '../../utils/database';
import generate from '../../utils/generate';
import ResponseError from '../../errors/ResponseError';
import slug from '../../utils/slug';
import { CreateProductValidation } from './product.validation';
import { CreateProductDTO } from './product.dto';
import { ProductEntity } from './product.entity';

async function create(sellerId: string, body: any) {
  const valid: CreateProductDTO = validate(CreateProductValidation, body);

  const seller = await prisma.seller.findFirst({
    where: {
      id_seller: sellerId,
    },
    select: {
      id: true,
    },
  });

  if (!seller) {
    throw new ResponseError(404, 'seller not found');
  }

  const data: ProductEntity = {
    id_product: generate(),
    ...valid,
    slug: slug(valid.name),
    seller_id: seller.id,
  };

  await prisma.product.create({
    data,
  });

  return {
    id: data.id_product,
    ...valid,
    slug: data.slug,
    seller_id: sellerId,
  };
}

export { create };
