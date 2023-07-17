import { CreateSellerDTO } from './seller.dto';
import { CreateSellerSchema, CreateSellerSchemaType } from './seller.schema';
import { SellerEntity } from './seller.entity';
import { hashpassword } from '../../utils/hashandcheck';
import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import ResponseError from '../../errors/ResponseError';

async function create(body: any) {
  const result: CreateSellerSchemaType = validate(CreateSellerSchema, body);

  const checkDomain = await prisma.seller.count({
    where: {
      domain: result.domain,
    },
  });

  if (checkDomain > 0) {
    throw new ResponseError(400, 'domain already exists');
  }

  const checkEmail = await prisma.seller.count({
    where: {
      email: result.email,
    },
  });

  if (checkEmail > 0) {
    throw new ResponseError(400, 'email already exists');
  }

  const checkName = await prisma.seller.count({
    where: {
      name: result.name,
    },
  });

  if (checkName > 0) {
    throw new ResponseError(400, 'name already exists');
  }

  if (result.phone) {
    const checkPhone = await prisma.seller.count({
      where: {
        phone: result.phone,
      },
    });

    if (checkPhone > 0) {
      throw new ResponseError(400, 'phone already exists');
    }
  }

  const idSeller = generate();

  const data: SellerEntity = {
    id_seller: idSeller,
    domain: result.domain,
    name: result.name,
    email: result.email,
    phone: result.phone,
    description: result.description,
    password: await hashpassword(result.password),
  };

  await prisma.seller.create({
    data,
  });

  const { password, ...except } = result;

  const feedback: CreateSellerDTO = {
    id: idSeller,
    ...except,
  };

  return feedback;
}

async function login() {
  return false;
}

export { create, login };
