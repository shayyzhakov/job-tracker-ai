import { z } from 'zod';

export const InterviewEventIdSchema = z.string().uuid();

export const EventTypeSchema = z
  .string()
  .min(1)
  .describe(
    'The type of interview event (e.g., "Phone Screen", "Technical Interview", "On-site"). If unclear, ask the user.',
  );

export const EventDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.')
  .describe(
    'The date of the interview event in YYYY-MM-DD format. If unknown, ask the user.',
  );

export const MeetingTypeSchema = z
  .string()
  .describe(
    'The type of meeting (e.g., "Zoom", "Phone Call", "Onsite Meeting", "Coffee Chat"). If unknown, leave empty.',
  );

export const NotesSchema = z
  .string()
  .describe('Freeform notes about the interview event.');

export const OutcomeSchema = z
  .string()
  .describe(
    'The outcome of the interview event (e.g., "Proceeding to next round", "Offer", "Rejected"). If unknown, leave empty.',
  );
