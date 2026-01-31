import jwt from 'jsonwebtoken';
import { AuthPayload } from '../middleware/auth.js';

function getSecret(): string {
  return process.env.JWT_SECRET || 'dev-secret';
}

function getAccessExpiry(): string {
  return process.env.JWT_EXPIRES_IN || '15m';
}

function getRefreshExpiry(): string {
  return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
}

export function generateAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: getAccessExpiry() });
}

export function generateRefreshToken(payload: AuthPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: getRefreshExpiry() });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, getSecret()) as AuthPayload;
}
