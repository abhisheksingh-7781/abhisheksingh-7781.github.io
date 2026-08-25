import mongoose from 'mongoose';

import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';

/**
 * MongoDB connection lifecycle. Storage is optional: with no MONGODB_URI the
 * API runs as a pure email relay and every function here becomes a no-op.
 *
 * Two hosting shapes are supported:
 *   - A long-running server (Render, Docker) connects once at boot.
 *   - Serverless (Vercel) has no boot, so ensureDatabase() connects lazily on
 *     the first request and every later invocation on that warm instance
 *     reuses the same connection.
 */

let connected = false;

/**
 * Memoised so concurrent requests on a cold instance share one connection
 * attempt instead of each opening their own — which is how serverless
 * functions exhaust a database's connection limit.
 */
let connecting: Promise<void> | null = null;

let listenersBound = false;

export function isDatabaseConnected() {
  return connected && mongoose.connection.readyState === 1;
}

function bindListeners() {
  if (listenersBound) return;
  listenersBound = true;

  mongoose.connection.on('disconnected', () => {
    connected = false;
    logger.warn('MongoDB disconnected.');
  });
  mongoose.connection.on('reconnected', () => {
    connected = true;
    logger.info('MongoDB reconnected.');
  });
}

/**
 * Connects if needed and resolves once the connection is usable. Safe to call
 * on every request. A failed attempt is not cached, so the next request retries
 * rather than the instance being permanently broken.
 */
export function ensureDatabase(): Promise<void> {
  if (!env.MONGODB_URI) return Promise.resolve();
  if (isDatabaseConnected()) return Promise.resolve();
  if (connecting) return connecting;

  bindListeners();

  connecting = mongoose
    .connect(env.MONGODB_URI, {
      dbName: env.MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 10_000,
    })
    .then(() => {
      connected = true;
      logger.info('MongoDB connected.', { database: env.MONGODB_DB_NAME });
    })
    .catch((error: unknown) => {
      connecting = null;
      throw error;
    });

  return connecting;
}

/** Boot-time connect for long-running hosts. Failure here is not fatal: the
 * API still serves, and the contact route falls back to email-only. */
export async function connectDatabase(): Promise<void> {
  if (!env.MONGODB_URI) {
    logger.warn('MONGODB_URI is not set — submissions will not be stored.');
    return;
  }

  await ensureDatabase();
}

export async function disconnectDatabase(): Promise<void> {
  if (!connected) return;
  await mongoose.disconnect();
  connected = false;
  connecting = null;
  logger.info('MongoDB connection closed.');
}
