import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import logger from '../utils/logger';

export function registerAuthTools(server: McpServer) {
  server.registerTool(
    'login',
    {
      description: 'Get the URL to log in to the application.',
      inputSchema: {},
    },
    async () => {
      logger.info('[tool:login] tool called');
      const loginUrl = 'https://job-tracker-auth.vercel.app';
      logger.info('[tool:login] tool completed');
      return {
        content: [{ type: 'text', text: `Please login at ${loginUrl}` }],
      };
    },
  );
}
