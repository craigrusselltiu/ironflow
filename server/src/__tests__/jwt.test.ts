import { describe, it, expect, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../utils/jwt.js';

// Set up test environment
beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '15m';
  process.env.JWT_REFRESH_EXPIRES_IN = '7d';
});

describe('JWT Utils', () => {
  const payload = { userId: 'user-123', email: 'test@example.com' };

  describe('generateAccessToken', () => {
    it('should generate a valid JWT', () => {
      const token = generateAccessToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include payload in token', () => {
      const token = generateAccessToken(payload);
      const decoded = jwt.decode(token) as { userId: string; email: string };
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid JWT', () => {
      const token = generateRefreshToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should include payload in token', () => {
      const token = generateRefreshToken(payload);
      const decoded = jwt.decode(token) as { userId: string; email: string };
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid access token', () => {
      const token = generateAccessToken(payload);
      const verified = verifyToken(token);
      expect(verified.userId).toBe(payload.userId);
      expect(verified.email).toBe(payload.email);
    });

    it('should verify valid refresh token', () => {
      const token = generateRefreshToken(payload);
      const verified = verifyToken(token);
      expect(verified.userId).toBe(payload.userId);
      expect(verified.email).toBe(payload.email);
    });

    it('should throw for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow();
    });

    it('should throw for expired token', () => {
      const expiredToken = jwt.sign(payload, 'test-secret', { expiresIn: '-1s' });
      expect(() => verifyToken(expiredToken)).toThrow();
    });
  });
});
