import { env } from '../config/env.js';

/**
 * A dependency-free logger. In production it emits one JSON object per line,
 * which is what hosted log collectors expect; in development it prints a short
 * human-readable line instead.
 */

type Level = 'debug' | 'info' | 'warn' | 'error';
type Fields = Record<string, unknown>;

const RANK: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MINIMUM = env.isProduction ? RANK.info : RANK.debug;

function emit(level: Level, message: string, fields?: Fields) {
  if (RANK[level] < MINIMUM) return;

  const write = level === 'error' || level === 'warn' ? console.error : console.log;

  if (env.isProduction) {
    write(JSON.stringify({ level, message, time: new Date().toISOString(), ...fields }));
    return;
  }

  const suffix = fields && Object.keys(fields).length ? ` ${JSON.stringify(fields)}` : '';
  write(`${level.toUpperCase().padEnd(5)} ${message}${suffix}`);
}

export const logger = {
  debug: (message: string, fields?: Fields) => emit('debug', message, fields),
  info: (message: string, fields?: Fields) => emit('info', message, fields),
  warn: (message: string, fields?: Fields) => emit('warn', message, fields),
  error: (message: string, fields?: Fields) => emit('error', message, fields),
};
