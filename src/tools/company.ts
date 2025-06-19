import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CompanyIdSchema,
  CompanyNameSchema,
  CompanySizeSchema,
  CompanyIndustrySchema,
  CompanyLocationSchema,
  CompanyNotesSchema,
} from '../schema/company';

export function registerCompanyTools(
  server: McpServer,
  supabase: SupabaseClient,
) {
  server.registerTool(
    'getCompanies',
    {
      description:
        'Fetches all companies where the user has active interview progress',
      inputSchema: {},
    },
    async () => {
      const { data, error } = await supabase.from('companies').select('*');
      if (error) {
        return {
          isError: true,
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
        structuredContent: { companies: data },
      };
    },
  );

  server.registerTool(
    'updateCompany',
    {
      description: "Update an existing company's information",
      inputSchema: {
        id: CompanyIdSchema.describe('The ID of the company to update'),
        name: CompanyNameSchema.optional(),
        size: CompanySizeSchema.optional(),
        industry: CompanyIndustrySchema.optional(),
        location: CompanyLocationSchema.optional(),
        notes: CompanyNotesSchema.optional(),
      },
    },
    async ({
      id,
      name,
      size,
      industry,
      location,
      notes,
    }: {
      id: string;
      name?: string;
      size?: z.infer<typeof CompanySizeSchema>;
      industry?: z.infer<typeof CompanyIndustrySchema>;
      location?: string;
      notes?: string;
    }) => {
      const updateData: {
        name?: string;
        size?: z.infer<typeof CompanySizeSchema>;
        industry?: z.infer<typeof CompanyIndustrySchema>;
        location?: string;
        notes?: string;
      } = {};
      if (name !== undefined) updateData.name = name;
      if (size !== undefined) updateData.size = size;
      if (industry !== undefined) updateData.industry = industry;
      if (location !== undefined) updateData.location = location;
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );
}
