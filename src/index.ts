import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initializeSupabase } from './supabase.js';
import { registerCompanyTools } from './tools/company.js';
import { registerRoleTools } from './tools/role.js';
import { registerInterviewEventTools } from './tools/interview-event.js';
import { registerContactTools } from './tools/contact.js';
import { validateArgs } from './args.js';
import logger from './utils/logger.js';

const { supabaseUrl, supabaseAnonKey } = validateArgs();
const supabase = initializeSupabase(supabaseUrl, supabaseAnonKey);

const server = new McpServer({
  name: 'job-tracker-mcp',
  version: '0.1.0',
});

// Register all tools
registerCompanyTools(server, supabase);
registerRoleTools(server, supabase);
registerInterviewEventTools(server, supabase);
registerContactTools(server, supabase);

async function main() {
  try {
    const transport = new StdioServerTransport();

    await server.connect(transport);
    logger.info('MCP server started');
  } catch (error) {
    logger.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

main();
