import { z } from 'zod';

export const TechIndustry = z.enum([
  'Software',
  'Hardware',
  'Cloud Computing',
  'Artificial Intelligence',
  'Cybersecurity',
  'FinTech',
  'HealthTech',
  'E-commerce',
  'Gaming',
  'Social Media',
  'Enterprise Software',
  'Mobile Apps',
  'DevOps',
  'Blockchain',
  'IoT',
  'EdTech',
  'Robotics',
  'Semiconductor',
  'Telecommunications',
  'Data Analytics',
  'Other',
]);

export const CompanySize = z.enum([
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5001-10,000',
  '10,001+',
  'unknown',
]);

export const CompanyIdSchema = z
  .string()
  .uuid()
  .describe('The ID of the company to update');
export const CompanyNameSchema = z
  .string()
  .min(1)
  .describe(
    'The name of the company offering the role. If unclear, ask the user for clarification.',
  );
export const CompanySizeSchema = CompanySize.describe(
  'The approximate size of the company (e.g., "51-200", "5001-10,000"). If unknown, use the "unknown" value. Do not guess.',
);
export const CompanyIndustrySchema = TechIndustry.describe(
  'The industry of the company, e.g., "Fintech", "Cybersecurity". Encouraged to fill when there is high confidence in the value.',
);
export const CompanyLocationSchema = z
  .string()
  .describe(
    'Geographic location of the local company office for the role. If unknown, leave empty rather than using HQ location unless explicitly stated. Precise address is preferred over just city name. Encouraged to fill when there is high confidence in the value.',
  );
export const CompanyNotesSchema = z
  .string()
  .describe(
    'Freeform notes about the company, such as product focus, funding stage, etc.',
  );
