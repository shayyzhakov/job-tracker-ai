import winston from 'winston';
import path from 'path';
import { CONFIG_DIR } from './consts';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: path.join(CONFIG_DIR, 'mcp-tool.log'),
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${
              info.username ? `[${info.username}]` : '[anonymous]'
            } ${info.level}: ${info.message}`,
        ),
      ),
    }),
  ],
});

export function initializeLogger(username: string) {
  try {
    logger.defaultMeta = { ...logger.defaultMeta, username };
  } catch (error) {
    // error cant be logged as logger is not initialized
  }
}

export default logger;
