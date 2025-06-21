import logger from './utils/logger';

export function validateArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    logger.error('Please provide supabase URL as a command-line argument');
    process.exit(1);
  } else if (args.length === 1) {
    logger.error('Please provide supabase anon key as a command-line argument');
    process.exit(1);
  }

  return {
    supabaseUrl: args[0],
    supabaseAnonKey: args[1],
  };
}
