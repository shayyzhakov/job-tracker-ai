import logger from './utils/logger';

export function validateArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    logger.warn('No auth token provided, using anonymous mode');
  } else if (args.length === 1) {
    logger.warn('No refresh token provided');
  }

  return {
    authToken: args[0],
    refreshToken: args[1],
  };
}
