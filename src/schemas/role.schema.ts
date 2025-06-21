import { z } from 'zod';

export const InitiatedBy = z.enum(['user', 'company']);

export const UserIdSchema = z
  .string()
  .uuid()
  .describe(
    'The ID of the user creating the role (typically provided by the session or token context).',
  );

export const TitleSchema = z
  .string()
  .min(1)
  .describe(
    'The job title being tracked (e.g., "Senior Backend Engineer"). If the title is unclear or not provided, do not make one up; instead, ask the user for clarification.',
  );
export const LevelSchema = z
  .string()
  .describe(
    'Seniority level of the role, e.g., "Mid", "Senior", "Staff". If the level is unclear, ask the user.',
  );
export const TechStackSchema = z
  .array(z.string())
  .describe(
    'List of technologies relevant to the role (e.g., ["TypeScript", "PostgreSQL"]). If not provided or unclear, leave as an empty list and ask the user for details later.',
  );
export const CompensationRequestedSchema = z
  .unknown()
  .describe(
    'The compensation you requested, structured as JSON with fields like base, bonus, equity. If unknown, leave it empty. Do not invent a compensation structure.',
  );
export const CompensationOfferedSchema = z
  .unknown()
  .describe(
    'The compensation the company offered you, structured similarly to compensation_requested. If unknown, leave it empty. Do not invent a compensation structure.',
  );
export const StatusSchema = z
  .string()
  .describe(
    'The current status of this application or role (e.g., "open", "offer", "rejected"). If unclear, ask the user.',
  );
export const SourceSchema = z
  .string()
  .describe(
    'How the role opportunity originated: e.g., "LinkedIn", "headhunter", "email", etc. Strongly encouraged. If unknown, leave empty and ask the user.',
  );
export const InitiatedBySchema = InitiatedBy.describe(
  'Indicates whether you initiated the contact or the company did (either "user" or "company"). Strongly encouraged. If unknown, ask the user.',
);
export const NotesSchema = z
  .string()
  .describe('Freeform notes about the role, anything not structured above.');
export const RoleIdSchema = z.string().uuid();
