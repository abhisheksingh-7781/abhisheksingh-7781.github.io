import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { connectDatabase, disconnectDatabase } from './services/database.js';
import { verifyMailer } from './services/mailer.js';

/**
 * Server bootstrap: connect the optional services, start listening, and shut
 * down cleanly when the platform sends a termination signal.
 */
async function start() {
  await connectDatabase();
  await verifyMailer();

  if (!env.canAcceptMessages) {
    logger.warn(
      'Neither SMTP nor MongoDB is configured. POST /api/contact will return 503 until one of them is.',
    );
  }

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT}`, {
      environment: env.NODE_ENV,
      corsOrigins: env.CORS_ORIGINS,
    });
  });

  /**
   * A failed bind (port taken, no permission) arrives as an 'error' event, not
   * a rejection. Without this it would crash as an unhandled event with a bare
   * stack trace instead of a message explaining what went wrong.
   */
  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${env.PORT} is already in use. Set PORT to a free port.`);
    } else {
      logger.error('HTTP server error.', { code: error.code, error: error.message });
    }
    process.exit(1);
  });

  /**
   * Stop taking new connections, let in-flight requests finish, then close the
   * database. The timer is a backstop for a connection that never drains.
   */
  const shutdown = (signal: string) => {
    logger.info(`Received ${signal}, shutting down.`);

    const forceExit = setTimeout(() => {
      logger.error('Shutdown timed out after 10s, exiting immediately.');
      process.exit(1);
    }, 10_000);
    forceExit.unref();

    server.close(async (error) => {
      if (error) {
        logger.error('Error while closing HTTP server.', { error: error.message });
      }
      await disconnectDatabase().catch(() => undefined);
      process.exit(error ? 1 : 0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((error: unknown) => {
  logger.error('Failed to start the API.', {
    error: error instanceof Error ? (error.stack ?? error.message) : String(error),
  });
  process.exit(1);
});
