import logger from './utils/logger';

export function validateArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    logger.warn('No auth token provided, using anonymous mode');
  }

  return {
    authToken: args[0],
  };
}
