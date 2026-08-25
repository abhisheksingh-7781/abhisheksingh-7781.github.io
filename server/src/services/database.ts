import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

/**
 * MongoDB connection lifecycle. Storage is optional: with no MONGODB_URI the
 * API runs as a pure email relay and every function here becomes a no-op.
 */

let connected = false;

export function isDatabaseConnected() {
  return connected && mongoose.connection.readyState === 1;
}

export async function connectDatabase(): Promise<void> {
  if (!env.MONGODB_URI) {
    logger.warn('MONGODB_URI is not set — submissions will not be stored.');
    return;
  }

  mongoose.connection.on('disconnected', () => {
    connected = false;
    logger.warn('MongoDB disconnected.');
  });
  mongoose.connection.on('reconnected', () => {
    connected = true;
    logger.info('MongoDB reconnected.');
  });

  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10_000,
  });

  connected = true;
  logger.info('MongoDB connected.', { database: env.MONGODB_DB_NAME });
}

export async function disconnectDatabase(): Promise<void> {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
  logger.info('MongoDB connection closed.');
}
