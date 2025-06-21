import { z } from 'zod';

export const ContactIdSchema = z.string().uuid();
export const NameSchema = z
  .string()
  .min(1)
  .describe('The name of the contact. Must be provided explicitly.');
export const RoleSchema = z
  .string()
  .min(1)
  .describe(
    "The contact's role or title. If unknown, ask the user for clarification.",
  );
export const EmailSchema = z
  .string()
  .email()
  .optional()
  .describe("The contact's email address. If unknown, leave empty.");
export const LinkedInURLSchema = z
  .string()
  .url()
  .optional()
  .describe("The contact's LinkedIn profile URL. If unknown, leave empty.");
export const PhoneNumberSchema = z
  .string()
  .optional()
  .describe("The contact's phone number. If unknown, leave empty.");
export const NotesSchema = z
  .string()
  .describe('Freeform notes about the contact.');
