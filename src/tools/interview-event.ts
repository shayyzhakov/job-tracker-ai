import { SupabaseClient } from '@supabase/supabase-js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import logger from '../utils/logger';
import {
  InterviewEventIdSchema,
  EventTypeSchema,
  EventDateSchema,
  MeetingTypeSchema,
  NotesSchema,
  OutcomeSchema,
} from '../schemas/interview-event.schema.js';
import { RoleIdSchema } from '../schemas/role.schema.js';
import { ContactIdSchema } from '../schemas/contact.schema.js';

export function registerInterviewEventTools(
  server: McpServer,
  supabase: SupabaseClient,
) {
  server.registerTool(
    'getInterviewEvents',
    {
      description: 'Fetch all interview events for a given role.',
      inputSchema: {
        role_id: RoleIdSchema.describe(
          'The ID of the role to fetch events for.',
        ),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:getInterviewEvents] tool called');
      const { role_id } = args;
      const { data, error } = await supabase
        .from('interview_events')
        .select('*')
        .eq('role_id', role_id);

      if (error) {
        logger.error(
          '[tool:getInterviewEvents] error fetching interview events',
          error,
        );
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      logger.info('[tool:getInterviewEvents] tool completed');
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );

  server.registerTool(
    'addInterviewEvent',
    {
      description:
        'Add a new interview event for a role. If the contact does not exist, create it first using the addContact tool. Try to fill as much info as possible.',
      inputSchema: {
        role_id: RoleIdSchema.describe(
          'The ID of the role to add an event for. In case there are multiple ones, must be stated explicitly.',
        ),
        event_type: EventTypeSchema,
        event_date: EventDateSchema.optional(),
        contact_id: ContactIdSchema.optional().describe(
          'The ID of the contact associated with this interview event. Ask the user about it if not stated explicitly, use updateInterviewEvent to add the contact info later on.',
        ),
        meeting_type: MeetingTypeSchema.optional(),
        notes: NotesSchema.optional(),
        outcome: OutcomeSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:addInterviewEvent] tool called');
      const {
        role_id,
        event_type,
        event_date,
        contact_id,
        meeting_type,
        notes,
        outcome,
      } = args;
      const { data, error } = await supabase
        .from('interview_events')
        .insert([
          {
            role_id,
            event_type,
            event_date,
            contact_id,
            meeting_type,
            notes,
            outcome,
          },
        ])
        .select()
        .single();

      if (error) {
        logger.error(
          '[tool:addInterviewEvent] error adding interview event',
          error,
        );
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      logger.info('[tool:addInterviewEvent] tool completed');
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );

  server.registerTool(
    'updateInterviewEvent',
    {
      description: 'Update an existing interview event.',
      inputSchema: {
        id: InterviewEventIdSchema,
        event_type: EventTypeSchema.optional(),
        event_date: EventDateSchema.optional(),
        contact_id: ContactIdSchema.optional(),
        meeting_type: MeetingTypeSchema.optional(),
        notes: NotesSchema.optional(),
        outcome: OutcomeSchema.optional(),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:updateInterviewEvent] tool called');
      const {
        id,
        event_type,
        event_date,
        contact_id,
        meeting_type,
        notes,
        outcome,
      } = args;
      const updateData: Record<string, unknown> = {};
      if (event_type !== undefined) updateData.event_type = event_type;
      if (event_date !== undefined) updateData.event_date = event_date;
      if (contact_id !== undefined) updateData.contact_id = contact_id;
      if (meeting_type !== undefined) updateData.meeting_type = meeting_type;
      if (notes !== undefined) updateData.notes = notes;
      if (outcome !== undefined) updateData.outcome = outcome;
      const { data, error } = await supabase
        .from('interview_events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      logger.info('[tool:updateInterviewEvent] tool completed');
      if (error) {
        logger.error(
          '[tool:updateInterviewEvent] error updating interview event',
          error,
        );
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      logger.info('[tool:updateInterviewEvent] tool completed');
      return {
        content: [{ type: 'text', text: JSON.stringify(data) }],
      };
    },
  );

  server.registerTool(
    'removeInterviewEvent',
    {
      description: 'Remove an interview event.',
      inputSchema: {
        id: InterviewEventIdSchema.describe(
          'The ID of the interview event to remove. Must be provided explicitly.',
        ),
      },
    },
    async (args: Record<string, unknown>) => {
      logger.info('[tool:removeInterviewEvent] tool called');
      const { id } = args;
      const { error } = await supabase
        .from('interview_events')
        .delete()
        .eq('id', id);

      if (error) {
        logger.error(
          '[tool:removeInterviewEvent] error removing interview event',
          error,
        );
        return {
          content: [
            { type: 'text', text: JSON.stringify({ error: error.message }) },
          ],
        };
      }

      logger.info('[tool:removeInterviewEvent] tool completed');
      return {
        content: [
          {
            type: 'text',
            text: `Interview event with id ${id} was removed successfully`,
          },
        ],
      };
    },
  );
}
