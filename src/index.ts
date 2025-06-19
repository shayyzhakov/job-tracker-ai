import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { initializeSupabase } from './supabase.js';
import { registerCompanyTools } from './tools/company.js';
import { registerRoleTools } from './tools/role.js';
import { validateArgs } from './args.js';

const { supabaseUrl, supabaseAnonKey } = validateArgs();
const supabase = initializeSupabase(supabaseUrl, supabaseAnonKey);

const server = new McpServer({
  name: 'job-tracker-mcp',
  version: '0.1.0',
});

// Register all tools
registerCompanyTools(server, supabase);
registerRoleTools(server, supabase);

async function main() {
  try {
    const transport = new StdioServerTransport();
    transport.onerror = (error) => {
      console.error('Error:', error);
    };
    transport.onmessage = (message) => {
      console.log('Message:', message);
    };

    await server.connect(transport);

    // console.log('MCP server started');
  } catch (error) {
    // console.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

main();
