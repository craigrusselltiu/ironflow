// Set up test environment before imports
process.env.JWT_SECRET = 'test-secret';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';
import { errorHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { generateAccessToken } from '../utils/jwt.js';

describe('Error Handler Middleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;
  const mockNext = vi.fn() as NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle AppError', () => {
    const error = new AppError(400, 'Bad request');
    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Bad request' });
  });

  it('should handle ZodError', () => {
    const schema = z.object({ email: z.string().email() });
    let zodError: ZodError | null = null;

    try {
      schema.parse({ email: 'invalid' });
    } catch (e) {
      zodError = e as ZodError;
    }

    errorHandler(zodError!, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array),
      })
    );
  });

  it('should handle unknown errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Unknown error');

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    consoleSpy.mockRestore();
  });
});

describe('Auth Middleware', () => {
  it('should call next with error if no auth header', () => {
    const mockReq = { headers: {} } as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Missing or invalid authorization header',
      })
    );
  });

  it('should call next with error if invalid auth format', () => {
    const mockReq = { headers: { authorization: 'Invalid format' } } as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Missing or invalid authorization header',
      })
    );
  });

  it('should call next with error for invalid token', () => {
    const mockReq = { headers: { authorization: 'Bearer invalid-token' } } as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Invalid or expired token',
      })
    );
  });

  it('should set user and call next for valid token', () => {
    const payload = { userId: 'user-123', email: 'test@example.com' };
    const token = generateAccessToken(payload);
    const mockReq = { headers: { authorization: `Bearer ${token}` } } as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn();

    authenticate(mockReq, mockRes, mockNext);

    expect(mockReq.user).toEqual(expect.objectContaining(payload));
    expect(mockNext).toHaveBeenCalledWith();
  });
});

describe('Validate Middleware', () => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  it('should call next for valid data', () => {
    const mockReq = {
      body: { email: 'test@example.com', password: 'password123' },
    } as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn();

    validate(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should call next with error for invalid data', () => {
    const mockReq = {
      body: { email: 'invalid', password: 'short' },
    } as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn();

    validate(schema)(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(ZodError));
  });
});
