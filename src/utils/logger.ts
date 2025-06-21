import winston from 'winston';
import path from 'path';
import os from 'os';

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({
      filename: path.join(os.homedir(), 'mcp-tool.log'),
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.printf(
          (info) =>
            `${info.timestamp} ${
              info.email ? `[${info.email}]` : '[anonymous]'
            } ${info.level}: ${info.message}`,
        ),
      ),
    }),
  ],
});

export function initializeLogger(authToken?: string) {
  try {
    if (!authToken) return;

    const payload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString(),
    );
    const email = payload.email;
    if (email) {
      logger.defaultMeta = { ...logger.defaultMeta, email };
    }
  } catch (error) {
    // error cant be logged as logger is not initialized
  }
}

export default logger;
