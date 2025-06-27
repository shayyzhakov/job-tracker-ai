import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initializeSupabase } from './supabase.js';
import { registerCompanyTools } from './tools/company.js';
import { registerRoleTools } from './tools/role.js';
import { registerInterviewEventTools } from './tools/interview-event.js';
import { registerContactTools } from './tools/contact.js';
import { registerAuthTools } from './tools/auth.js';
import logger, { initializeLogger } from './utils/logger.js';
import { getConfig } from './utils/configStore.js';
import { getEmailFromToken } from './utils/tokenService.js';

async function main() {
  try {
    const accessToken = getConfig<string>('access_token');
    const refreshToken = getConfig<string>('refresh_token');

    const email = getEmailFromToken(accessToken);
    if (!email) {
      throw new Error('Invalid access token payload');
    }
    initializeLogger(email);

    const server = new McpServer({
      name: 'job-tracker-mcp',
      version: '0.1.0',
    });

    const supabase = initializeSupabase(accessToken, refreshToken);

    // Register all tools
    registerAuthTools(server);
    registerCompanyTools(server, supabase);
    registerRoleTools(server, supabase);
    registerInterviewEventTools(server, supabase);
    registerContactTools(server, supabase);

    const transport = new StdioServerTransport();

    await server.connect(transport);
    logger.info('MCP server started');
  } catch (error) {
    logger.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

main();
