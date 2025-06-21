import { z } from 'zod';
import { SupabaseClient } from '@supabase/supabase-js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import logger from '@/utils/logger';
import {
  CompanySizeSchema,
  CompanyIndustrySchema,
  CompanyNameSchema,
  CompanyLocationSchema,
  CompanyNotesSchema,
} from '../schemas/company.schema';
import {
  UserIdSchema,
  TitleSchema,
  LevelSchema,
  TechStackSchema,
  CompensationRequestedSchema,
  CompensationOfferedSchema,
  StatusSchema,
  SourceSchema,
  InitiatedBySchema,
  NotesSchema,
  RoleIdSchema,
} from '../schemas/role.schema';

export type AddRoleParams = {
  user_id?: string;
  // Company fields
  company_name: string;
  company_size?: z.infer<typeof CompanySizeSchema>;
  company_industry?: z.infer<typeof CompanyIndustrySchema>;
  company_location?: string;
  company_notes?: string;
  // Role fields
  title: string;
  level?: string;
  tech_stack?: string[];
  compensation_requested?: unknown;
  compensation_offered?: unknown;
  status?: string;
  source?: string;
  initiated_by?: z.infer<typeof InitiatedBySchema>;
  notes?: string;
};

export function registerRoleTools(server: McpServer, supabase: SupabaseClient) {
  server.registerTool(
    'getRoles',
    {
      description:
        'Fetch all interview roles. Optionally filter results by company name.',
      inputSchema: {
        company_name: CompanyNameSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:getRoles] tool called');
      const { company_name } = args;

      let query = supabase.from('companies').select('*, roles(*)');

      if (company_name) {
        query = query.eq('name', company_name);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[tool:getRoles] error fetching roles', error);
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      logger.info('[tool:getRoles] tool completed');
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );

  server.registerTool(
    'addRole',
    {
      description:
        'Add a new interview role and associate it to a company. If the system does not know the company, it will be created. Include all available details (especially company size, industry, and role level) to improve tracking and insights. If fields are missing, attempt to retrieve them from external or prior context. Fields such as company size, source, and initiated_by are particularly encouraged for completeness.',
      inputSchema: {
        user_id: UserIdSchema.optional(),
        company_name: CompanyNameSchema,
        company_size: CompanySizeSchema.optional(),
        company_industry: CompanyIndustrySchema.optional(),
        company_location: CompanyLocationSchema.optional(),
        company_notes: CompanyNotesSchema.optional(),
        title: TitleSchema,
        level: LevelSchema.optional(),
        tech_stack: TechStackSchema.optional(),
        compensation_requested: CompensationRequestedSchema.optional(),
        compensation_offered: CompensationOfferedSchema.optional(),
        status: StatusSchema.optional(),
        source: SourceSchema.optional(),
        initiated_by: InitiatedBySchema.optional(),
        notes: NotesSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:addRole] tool called');
      const {
        user_id,
        company_name,
        company_size,
        company_industry,
        company_location,
        company_notes,
        title,
        level,
        tech_stack,
        compensation_requested,
        compensation_offered,
        status,
        source,
        initiated_by,
        notes,
      } = args;
      // Find or create company
      let company_id: string | undefined;
      const { data: existingCompanies, error: findError } = await supabase
        .from('companies')
        .select('id')
        .eq('name', company_name);

      if (findError) {
        logger.error(
          '[tool:addRole] error finding company in addRole',
          findError,
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: findError.message }),
            },
          ],
        };
      }
      if (existingCompanies && existingCompanies.length > 0) {
        company_id = existingCompanies[0].id;
      } else {
        // Create new company
        const { data: newCompany, error: insertError } = await supabase
          .from('companies')
          .insert([
            {
              name: company_name,
              size: company_size,
              industry: company_industry,
              location: company_location,
              notes: company_notes,
            },
          ])
          .select('id')
          .single();

        if (insertError) {
          logger.error(
            '[tool:addRole] error inserting company in addRole',
            insertError,
          );
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ error: insertError.message }),
              },
            ],
          };
        }
        company_id = newCompany.id;
      }
      // Insert role
      const roleData: Record<string, unknown> = {
        company_id,
        title,
        level,
        tech_stack,
        compensation_requested,
        compensation_offered,
        status,
        source,
        initiated_by,
        notes,
      };

      // Only include user_id if it's provided
      if (user_id) {
        roleData.user_id = user_id;
      }

      const { data, error } = await supabase
        .from('roles')
        .insert([roleData])
        .select()
        .single();

      if (error) {
        logger.error('[tool:addRole] error inserting role in addRole', error);
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      logger.info('[tool:addRole] tool completed');
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );

  server.registerTool(
    'updateRole',
    {
      description:
        'Update an existing interview role with new or corrected information. Supports partial updates to any role field. Provide as much detail as possible (company size, industry, role level, compensation, etc.) to ensure better tracking and insights. If some optional fields are missing, consider asking follow-up questions to fill them in later using the updateRole tool.',
      inputSchema: {
        id: RoleIdSchema,
        title: TitleSchema.optional(),
        level: LevelSchema.optional(),
        tech_stack: TechStackSchema.optional(),
        compensation_requested: CompensationRequestedSchema.optional(),
        compensation_offered: CompensationOfferedSchema.optional(),
        status: StatusSchema.optional(),
        source: SourceSchema.optional(),
        initiated_by: InitiatedBySchema.optional(),
        notes: NotesSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:updateRole] tool called');
      const {
        id,
        title,
        level,
        tech_stack,
        compensation_requested,
        compensation_offered,
        status,
        source,
        initiated_by,
        notes,
      } = args;
      const updateData: Record<string, unknown> = {};
      if (title !== undefined) updateData.title = title;
      if (level !== undefined) updateData.level = level;
      if (tech_stack !== undefined) updateData.tech_stack = tech_stack;
      if (compensation_requested !== undefined)
        updateData.compensation_requested = compensation_requested;
      if (compensation_offered !== undefined)
        updateData.compensation_offered = compensation_offered;
      if (status !== undefined) updateData.status = status;
      if (source !== undefined) updateData.source = source;
      if (initiated_by !== undefined) updateData.initiated_by = initiated_by;
      if (notes !== undefined) updateData.notes = notes;
      const { data, error } = await supabase
        .from('roles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        logger.error('[tool:updateRole] error updating role', error);
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }
      logger.info('[tool:updateRole] tool completed');
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );
}
