import { anthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText } from 'ai';
import { cookies } from 'next/headers';
import { z } from 'zod';

import {
  getLanguageOrFallback,
  getPreferredLanguageFromBrowser,
  priority,
} from '@/lib/i18n/i18n.server';
import { I18N_COOKIE_NAME } from '@/lib/i18n/i18n.settings';
import { monitorError } from '@/lib/monitor-error';

import { createClient as createAdminClient } from '@/services/supabase/admin';
import { createClient } from '@/services/supabase/server';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const bodySchema = z.object({
  messages: z.array(
    z.object({ role: z.enum(['user', 'assistant']), content: z.string() })
  ),
  postId: z.string(),
  userDetails: z.object({
    companyName: z.string(),
    role: z.string(),
    linkedinGoals: z.array(z.string()),
    linkedinTopics: z.array(z.string()),
    postTone: z.string(),
    targetAudience: z.array(z.string()),
    companyUrl: z.string(),
    companyData: z.string(),
  }),
});

export async function POST(req: Request) {
  const { messages, postId, userDetails } = bodySchema.parse(await req.json());
  // the last message should be of the user
  const lastMessage = messages[messages.length - 1];

  if (lastMessage.role !== 'user') {
    throw new Error('The last message should be from the user');
  }

  const supabase = createClient();

  // check if the user is allowed to make this generation
  const { data: allowed, error: allowedError } =
    await supabase.rpc('check_credit');

  if (allowedError) {
    throw allowedError;
  }

  if (!allowed) {
    throw new Error('Not enough credits');
  }

  // If this is the first message, also create a new post entry in the db
  if (messages.length === 1) {
    const { error } = await supabase.from('posts').insert({
      id: postId,
    });

    if (error) {
      monitorError({
        contextName: 'api/chat',
        error,
        contextData: { messages, postId, error },
        fingerprint: ['api/chat', 'post-insert-error'],
      });
      throw error;
    }
  }

  // read the cookies here and send the locale in getSystemPrompt
  const cookie = cookies().get(I18N_COOKIE_NAME)?.value;

  let selectedLanguage: string | undefined = undefined;

  // if the cookie is set, use the language from the cookie
  if (cookie) {
    selectedLanguage = getLanguageOrFallback(cookie);
  }

  // if not, check if the language priority is set to user and
  // use the user's preferred language
  if (!selectedLanguage && priority === 'user') {
    const userPreferredLanguage = getPreferredLanguageFromBrowser();
    selectedLanguage = getLanguageOrFallback(userPreferredLanguage);
  }

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    system: getSystemPrompt({
      language: selectedLanguage === 'de' ? 'German' : 'English',
      companyData: userDetails.companyData,
      companyName: userDetails.companyName,
      linkedInGoals: userDetails.linkedinGoals,
      linkedInTopics: userDetails.linkedinTopics,
      postTone: userDetails.postTone,
      role: userDetails.role,
      targetAudience: userDetails.targetAudience,
      companyUrl: userDetails.companyUrl,
    }),
    messages: convertToCoreMessages(messages),
    onFinish: async (response) => {
      if (response.finishReason !== 'stop')
        return monitorError({
          contextName: 'api/chat',
          error: new Error('The response was not completed'),
          contextData: { response, postId, messages },
          fingerprint: ['api/chat', 'response-not-completed'],
        });

      const { error } = await supabase.from('postIterations').insert({
        isManuallyEdited: false,
        postId,
        text: response.text,
        userMessage: lastMessage.content,
      });

      if (error) {
        monitorError({
          contextName: 'api/chat',
          error,
          contextData: { prompt, messages, postId, response, error },
          fingerprint: ['api/chat', 'post-insert-error'],
        });

        throw error;
      }

      const { data: session } = await supabase.auth.getUser();

      const userId = session.user?.id;

      if (!userId) {
        return monitorError({
          contextName: 'api/chat',
          error: new Error('User not found'),
          contextData: { response, postId, messages },
          fingerprint: ['api/chat', 'user-not-found'],
        });
      }

      // update the users credits
      const supabaseAdmin = createAdminClient();

      const { error: updateCreditsError } = await supabaseAdmin.rpc(
        'subtract_credit',
        {
          user_id: userId,
        }
      );

      if (updateCreditsError) {
        monitorError({
          contextName: 'api/chat',
          error: updateCreditsError,
          contextData: {
            updateCreditsError,
            userId,
            postId,
            response,
          },
          fingerprint: ['api/chat', 'update-credits-error'],
        });
      }
    },
  });

  return result.toAIStreamResponse();
}

function getSystemPrompt({
  language,
  companyData,
  companyName,
  linkedInGoals,
  linkedInTopics,
  postTone,
  role,
  targetAudience,
  companyUrl,
}: {
  language: 'English' | 'German';
  companyData: string;
  companyName: string;
  linkedInGoals: string[];
  linkedInTopics: string[];
  postTone: string;
  role: string;
  targetAudience: string[];
  companyUrl: string;
}) {
  return `You are a professional LinkedIn post writer. The user may ask you to create a new post or make changes to a post. You must politely decline any requests not related to LinkedIn posts.
The LinkedIn post should be good. Here are some qualities you should keep in mind and should incorporate in the LinkedIn post.

- The post should have an attention-grabbing hook as a headline. The hook should be exciting and incite curiosity in the user. Use creative hooks in the start headline of the post. Grab attention of the user.
- Start with a provocative statement or surprising fact (6-15 words). The statement should be attention-grabbing. Use your copywriting skills when writing the headline.
- The post should sound natural to read as if a human wrote it.
- The post should have a good reading structure and consider spacing and breaking into multiple paragraphs. The sentences should be short. Also use one sentence paragraphs, the sentences should be short and easy to read.
- The content should be easy to read and structured in a reader friendly manner. The paragraphs should be short and appropriately spaced. Each paragraph should be short. Have majority of the paragraphs of 1 sentence where appropriate. Like one line paragraphs. Use one line paragraphs. Have more spacing where appropriate between one line paragraphs.
- Make the post sound natural, avoiding headlines or overly formal language.
- Keep sentences short and easy to read with max 8 words per sentence.
- Do use emojis. Use 5 Emojis at max. Do not exceed the limit of 5 emojis in the post, so use 5 emojis at max. The emojis should be relevant to the content of the post.
- The post should be correct in punctuation and grammar.  
- The post should be of 200-350 words.
- Make the headline bold in font. Note that markdown bold technique of ** would not work since it's a linkedin post, do  𝗯𝗼𝗹𝗱 𝗹𝗶𝗸𝗲 𝘁𝗵𝗶𝘀 𝘁𝗲𝘅𝘁  bolding instead. Note: only make the headline bold. The rest of the text should not be bold.
- Do not use hashtags in the post. 

Following is some context regarding the user that can help you write better posts:

Users Profession: ${role}

Buyers Persona that you user is targeting: ${targetAudience}

Company Information / Problem that their product/serevice is trying to solve: ${companyData}

Name of company: ${companyName}

Company URL: ${companyUrl}

Tone of post should be: ${postTone}

LinkedIn Goals: ${linkedInGoals.join(', ')}

LinkedIn Topics: ${linkedInTopics.join(', ')}

Now write a LinkedIn post. The post should be between 200-350 words. The post should be catchy and interesting to the target audience and should make them curious to read more. 
The post should be informative, engaging, and should subtly portray the benefits of the company's product or service. It should not be a sales pitch, instead it should be informative and educational.
The post should develop trust and leadership with the target audience and customers. 
It should subtly tell good things relevant to the company. Feel free to use your knowledge in the domain. The knowledge should be relevant and accurate. 

Your responses should only be the content of the linkedin posts, nothing else.

Your response should be in the language: ${language}

${language === 'German' ? 'The german Du form should be used' : ''}

Start your response directly from the post content. Don't include any other information in your response. If the user requests anything other than creating or editing a LinkedIn post, politely decline.
`;
}
