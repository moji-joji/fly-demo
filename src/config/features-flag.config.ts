import { z } from 'zod';

type LanguagePriority = 'user' | 'application';

const FeatureFlagsSchema = z.object({
  languagePriority: z
    .enum(['user', 'application'], {
      required_error: 'Provide the variable NEXT_PUBLIC_LANGUAGE_PRIORITY',
      description: `If set to user, use the user's preferred language. If set to application, use the application's default language.`,
    })
    .default('application'),
});

const featuresFlagConfig = FeatureFlagsSchema.parse({
  languagePriority: process.env
    .NEXT_PUBLIC_LANGUAGE_PRIORITY as LanguagePriority,
} satisfies z.infer<typeof FeatureFlagsSchema>);

export default featuresFlagConfig;

function getBoolean(value: unknown, defaultValue: boolean) {
  if (typeof value === 'string') {
    return value === 'true';
  }

  return defaultValue;
}
