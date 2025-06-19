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
    'The job title being tracked (e.g., "Senior Backend Engineer"). Required.',
  );
export const LevelSchema = z
  .string()
  .describe('Seniority level of the role, e.g., "Mid", "Senior", "Staff".');
export const TechStackSchema = z
  .array(z.string())
  .describe(
    'List of technologies relevant to the role (e.g., ["TypeScript", "PostgreSQL"]).',
  );
export const CompensationRequestedSchema = z
  .unknown()
  .describe(
    'The compensation you requested, structured as JSON with fields like base, bonus, equity.',
  );
export const CompensationOfferedSchema = z
  .unknown()
  .describe(
    'The compensation the company offered you, structured similarly to compensation_requested.',
  );
export const StatusSchema = z
  .string()
  .describe(
    'The current status of this application or role (e.g., "open", "offer", "rejected").',
  );
export const SourceSchema = z
  .string()
  .describe(
    'How the role opportunity originated: e.g., "LinkedIn", "headhunter", "email", etc. Strongly encouraged.',
  );
export const InitiatedBySchema = InitiatedBy.describe(
  'Indicates whether you initiated the contact or the company did (either "user" or "company"). Strongly encouraged.',
);
export const NotesSchema = z
  .string()
  .describe('Freeform notes about the role, anything not structured above.');
export const RoleIdSchema = z.string().uuid();
