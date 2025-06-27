import fs from 'fs';
import { CONFIG_DIR } from './consts';
import path from 'path';

export const CONFIG_FILE_PATH = path.join(CONFIG_DIR, 'config.json');

export function getConfig<T = unknown>(key?: string): T {
  if (!fs.existsSync(CONFIG_FILE_PATH))
    throw new Error('Config file not found');
  const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
  const config: Record<string, unknown> = JSON.parse(data);
  if (key) {
    if (!(key in config)) throw new Error(`Config key '${key}' not found`);
    return config[key] as T;
  }
  return config as T;
}

export function setConfig(key: string, value: unknown): void {
  let config: Record<string, unknown> = {};
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')) as Record<
      string,
      unknown
    >;
  } else if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  config[key] = value;
  fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
}
