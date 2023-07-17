import { describe, it, expect, afterAll } from '@jest/globals';
import build from '../utils/server';
import { removeTestUser } from './utils/seller.util';

describe('POST /sellers/register', () => {
  afterAll(async () => {
    await removeTestUser();
  });

  it('should can register', async () => {
    const server = build();

    const payload = {
      domain: 'testing',
      name: 'Testing Shop',
      email: 'testing@mail.com',
      phone: '081234345656',
      password: 'testingsecret',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/sellers/register',
      payload,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('data');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeTruthy();
    expect(response.json().data.id).toBeDefined();
    expect(response.json().data.domain).toBe(payload.domain);
    expect(response.json().data.name).toBe(payload.name);
    expect(response.json().data.email).toBe(payload.email);
    expect(response.json().errors).toBeNull();
  });

  it('should reject if domain already exists', async () => {
    const server = build();

    const payload = {
      domain: 'testing',
      name: 'Testing Shop',
      email: 'testing@mail.com',
      password: 'testingsecret',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/sellers/register',
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBe('domain already exists');
  });

  it('should reject if email already exists', async () => {
    const server = build();

    const payload = {
      domain: 'testingid',
      name: 'Testing Shopping',
      email: 'testing@mail.com',
      password: 'testingsecret',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/sellers/register',
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBe('email already exists');
  });

  it('should reject if name already exists', async () => {
    const server = build();

    const payload = {
      domain: 'testingid',
      name: 'Testing Shop',
      email: 'testingshop@mail.com',
      password: 'testingsecret',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/sellers/register',
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBe('name already exists');
  });

  it('should reject if phone already exists', async () => {
    const server = build();

    const payload = {
      domain: 'testingid',
      name: 'Testing Shopping',
      email: 'testingshop@mail.com',
      phone: '081234345656',
      password: 'testingsecret',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/sellers/register',
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(response.json().errors).toBe('phone already exists');
  });

  it('should reject if request is invalid', async () => {
    const server = build();

    const payload = {
      domain: '',
      name: '',
      email: '',
      password: '',
    };

    const response = await server.inject({
      method: 'POST',
      url: '/sellers/register',
      payload,
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toHaveProperty('success');
    expect(response.json()).toHaveProperty('errors');

    expect(response.json().success).toBeFalsy();
    expect(Array.isArray(response.json().errors)).toBe(true);
  });
});
