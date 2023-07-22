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

async function getOne(domain: string, slug: string) {
  const seller = await prisma.seller.findFirst({
    where: {
      domain,
    },
  });

  if (!seller) {
    throw new ResponseError(404, 'seller not found');
  }

  const product = await prisma.product.findFirst({
    where: {
      AND: [
        {
          slug,
        },
        {
          seller_id: seller.id,
        },
      ],
    },
    select: {
      id_product: true,
      name: true,
      slug: true,
      description: true,
      stock: true,
      price: true,
    },
  });

  if (!product) {
    throw new ResponseError(404, 'product not found');
  }

  const { id_product, ...except } = product;

  return {
    id: id_product,
    ...except,
  };
}

export { create, getOne };
