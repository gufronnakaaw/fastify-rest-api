import { describe, it, expect, afterEach, beforeEach } from '@jest/globals';
import build from '../utils/server';
import {
  createTestUser,
  getTestUser,
  removeTestUser,
} from './utils/seller.util';
import {
  createTestProduct,
  deleteTestProduct,
  getTestProduct,
} from './utils/product.util';
import slug from '../utils/slug';
import logger from '../utils/logger';

async function doLogin() {
  const server = build();

  const response = await server.inject({
    method: 'POST',
    path: '/sellers/login',
    payload: {
      email: 'testing@mail.com',
      password: 'testingpass',
    },
  });

  return {
    token: response.json().data.token,
  };
}

describe('POST /products', () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await deleteTestProduct();
    await removeTestUser();
  });

  it('should can create product', async () => {
    const server = build();
    const { token } = await doLogin();

    const payload = {
      name: 'Product Test',
      description: 'Desc Test',
      price: 15000,
      stock: 10,
    };

    const response = await server.inject({
      path: '/products',
      method: 'POST',
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    // logger.info(response.json());

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data.id).toBeDefined();
    expect(response.json().data.name).toBe(payload.name);
    expect(response.json().data.description).toBe(payload.description);
    expect(response.json().data.price).toBe(payload.price);
    expect(response.json().data.stock).toBe(payload.stock);
    expect(response.json().data.slug).toBe(slug(payload.name));
    expect(response.json().data.seller_id).toBeDefined();
    expect(response.json().errors).toBeNull();
  });

  it('should reject if token is invalid', async () => {
    const server = build();
    const { token } = await doLogin();

    const payload = {
      name: 'Product Test',
      description: 'Desc Test',
      price: 15000,
      stock: 10,
    };

    const response = await server.inject({
      path: '/products',
      method: 'POST',
      payload,
      headers: {
        authorization: `Bearer ${token}xx`,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });

  it('should reject if request is invalid', async () => {
    const server = build();
    const { token } = await doLogin();

    const payload = {
      name: '',
      description: '',
      price: '15000',
      stock: '10',
    };

    const response = await server.inject({
      path: '/products',
      method: 'POST',
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });

  it('should reject if product already exists', async () => {
    const server = build();
    const { token } = await doLogin();

    const payload = {
      name: 'Product Test',
      description: 'Desc Test',
      price: 15000,
      stock: 10,
    };

    await server.inject({
      path: '/products',
      method: 'POST',
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const duplicate = await server.inject({
      path: '/products',
      method: 'POST',
      payload,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    // logger.info(duplicate.json());

    expect(duplicate.statusCode).toBe(400);
    expect(duplicate.json()).toHaveProperty('success');
    expect(duplicate.json()).toHaveProperty('errors');

    expect(duplicate.json().success).toBeFalsy();
    expect(duplicate.json().errors).toBeDefined();
  });
});

describe('GET /products/:domain/:slug', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestProduct();
  });

  afterEach(async () => {
    await deleteTestProduct();
    await removeTestUser();
  });

  it('should can get one data', async () => {
    const server = build();
    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'GET',
      url: `/products/${seller?.domain}/${product?.slug}`,
    });

    // logger.info(response.json());

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().data.id).toBeDefined();
    expect(response.json().data.name).toBeDefined();
    expect(response.json().data.slug).toBeDefined();
    expect(response.json().data.description).toBeDefined();
    expect(response.json().data.stock).toBeDefined();
    expect(response.json().data.price).toBeDefined();
  });

  it('should reject if domain not found', async () => {
    const server = build();
    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'GET',
      url: `/products/${seller?.domain}wrong/${product?.slug}`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });

  it('should reject if slug not found', async () => {
    const server = build();
    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'GET',
      url: `/products/${seller?.domain}/${product?.slug}-wrong`,
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });
});

describe('DELETE /products/:domain/:slug', () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestProduct();
  });

  afterEach(async () => {
    await deleteTestProduct();
    await removeTestUser();
  });

  it('should can remove product', async () => {
    const server = build();
    const { token } = await doLogin();

    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'DELETE',
      url: `/products/${seller?.domain}/${product?.slug}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeTruthy();
    expect(response.json().errors).toBeNull();
  });

  it('should reject if wrong domain', async () => {
    const server = build();
    const { token } = await doLogin();

    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'DELETE',
      url: `/products/${seller?.domain}wrong/${product?.slug}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });

  it('should reject if product not found', async () => {
    const server = build();
    const { token } = await doLogin();

    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'DELETE',
      url: `/products/${seller?.domain}/${product?.slug}-wrong`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });

  it('should reject if not login', async () => {
    const server = build();

    const seller = await getTestUser();
    const product = await getTestProduct();

    const response = await server.inject({
      method: 'DELETE',
      url: `/products/${seller?.domain}/${product?.slug}`,
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBeDefined();
  });
});
