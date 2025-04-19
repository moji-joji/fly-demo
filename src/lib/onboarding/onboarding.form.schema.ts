import { z } from 'zod';

export const onboardingFormSchema = z
  .object({
    // Step 1: User + Company Details
    firstName: z
      .string({ message: 'First name is required' })
      .min(1, "First name can't be empty"),
    lastName: z
      .string({ message: 'Last name is required' })
      .min(1, "Last name can't be empty"),
    companyName: z
      .string({ message: 'Company name is required' })
      .min(1, "Company name can't be empty"),

    // Step 2: Role
    role: z
      .string({ message: 'Please select a profession' })
      .min(1, 'Please select a profession'),
    otherRole: z.string().optional(),

    // Step 3: LinkedIn Goals
    linkedInGoals: z.string().array().min(1, 'Please select a goal'),

    // Step 4: LinkedIn Topics
    linkedInTopics: z.string().array().min(1, 'Please select a topic'),

    // Step 5: Post Tone
    postTone: z
      .string({ message: 'Please select a tone' })
      .min(1, 'Please select a tone'),

    // Step 6: Target Audience
    targetAudience: z
      .string({ message: 'Please select a target audience' })
      .array()
      .min(1, 'Please select a target audience'),
    otherTargetAudience: z.string().optional(),

    // Step 7: Company URL
    companyUrl: z
      .string({ message: 'Company URL is required' })
      .url({ message: 'URL must be valid' })
      .min(1, 'Company URL is required'),
  })
  .refine(
    (data) => {
      if (
        data.role.toLowerCase() === 'other' ||
        data.role.toLowerCase() === 'andere'
      ) {
        return !!data.otherRole && data.otherRole.trim().length > 0;
      }
      return true;
    },
    {
      message: "Role description is required when 'Other' is selected",
      path: ['otherRole'],
    }
  )
  .refine(
    (data) => {
      return (
        data.role.toLowerCase() === 'other' ||
        data.role.toLowerCase() === 'andere' ||
        !data.otherRole
      );
    },
    {
      message: "Other role should only be provided when 'Other' is selected",
      path: ['otherRole'],
    }
  );

export type TOnboardingForm = z.infer<typeof onboardingFormSchema>;
