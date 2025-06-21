import { SupabaseClient } from '@supabase/supabase-js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  ContactIdSchema,
  NameSchema,
  RoleSchema,
  EmailSchema,
  LinkedInURLSchema,
  PhoneNumberSchema,
  NotesSchema,
} from '../schemas/contact.schema.js';
import {
  CompanyIdSchema,
  CompanyNameSchema,
} from '../schemas/company.schema.js';

export function registerContactTools(
  server: McpServer,
  supabase: SupabaseClient,
) {
  server.registerTool(
    'getContacts',
    {
      description: 'Fetch all contacts for a given company.',
      inputSchema: {
        company_name: CompanyNameSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      const { company_name } = args;

      let query = supabase.from('companies').select('*, contacts(*)');

      if (company_name) {
        query = query.eq('name', company_name);
      }

      const { data, error } = await query;

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

  server.registerTool(
    'addContact',
    {
      description: 'Add a new contact for a company.',
      inputSchema: {
        company_id: CompanyIdSchema,
        name: NameSchema,
        role: RoleSchema,
        email: EmailSchema.optional(),
        linkedin_url: LinkedInURLSchema.optional(),
        phone_number: PhoneNumberSchema.optional(),
        notes: NotesSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      const {
        company_id,
        name,
        role,
        email,
        linkedin_url,
        phone_number,
        notes,
      } = args;

      const { data, error } = await supabase
        .from('contacts')
        .insert([
          {
            company_id,
            name,
            role,
            email,
            linkedin_url,
            phone_number,
            notes,
          },
        ])
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

  server.registerTool(
    'updateContact',
    {
      description: 'Update an existing contact.',
      inputSchema: {
        id: ContactIdSchema,
        name: NameSchema.optional(),
        role: RoleSchema.optional(),
        email: EmailSchema.optional(),
        linkedin_url: LinkedInURLSchema.optional(),
        phone_number: PhoneNumberSchema.optional(),
        notes: NotesSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      const { id, name, role, email, linkedin_url, phone_number, notes } = args;

      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role;
      if (email !== undefined) updateData.email = email;
      if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
      if (phone_number !== undefined) updateData.phone_number = phone_number;
      if (notes !== undefined) updateData.notes = notes;

      const { data, error } = await supabase
        .from('contacts')
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
