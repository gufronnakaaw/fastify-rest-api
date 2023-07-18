import { CreateSellerDTO, LoginSellerDTO } from './seller.dto';
import {
  CreateSellerValidation,
  LoginSellerValidation,
} from './seller.validation';
import { SellerEntity } from './seller.entity';
import { hashpassword, checkpassword } from '../../utils/hashandcheck';
import prisma from '../../utils/database';
import generate from '../../utils/generate';
import validate from '../../utils/validate';
import ResponseError from '../../errors/ResponseError';

async function create(body: any) {
  const result: CreateSellerDTO = validate(CreateSellerValidation, body);

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

  const feedback = {
    id: idSeller,
    ...except,
  };

  return feedback;
}

async function login(body: any) {
  const result: LoginSellerDTO = validate(LoginSellerValidation, body);

  const { email, password } = result;

  const seller = await prisma.seller.findFirst({
    where: {
      email,
    },
    select: {
      id_seller: true,
      password: true,
    },
  });

  if (!seller) {
    throw new ResponseError(404, 'seller not found');
  }

  const checkPassword = await checkpassword(password, seller.password);

  if (!checkPassword) {
    throw new ResponseError(400, 'wrong password');
  }

  const feedback = {
    id: seller.id_seller,
  };

  return feedback;
}

export { create, login };
