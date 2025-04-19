import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { z } from 'zod';

import { monitorError } from '@/lib/monitor-error';

import { createClient as createAdminClient } from '@/services/supabase/admin';
import { createClient } from '@/services/supabase/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const bodySchema = z.object({
  prompt: z.string(),
  initialPost: z.string().optional(),
  postId: z.string(),
  userDetails: z.object({
    profession: z.string(),
    buyerPersona: z.string(),
    productInfo: z.string(),
  }),
});

type TUserDetails = z.infer<typeof bodySchema>['userDetails'];

export async function POST(req: Request) {
  const { prompt, initialPost, postId, userDetails } = bodySchema.parse(
    await req.json()
  );

  const supabase = createClient();

  const { data: allowed, error: allowedError } =
    await supabase.rpc('check_credit');

  if (allowedError) {
    throw allowedError;
  }

  if (!allowed) {
    throw new Error('Not enough credits');
  }

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    system: getSystemPrompt(userDetails, initialPost),
    prompt,
    onFinish: async (event) => {
      // if initial post is not provided, create a new post and save the generated message as a new post iteration
      if (!initialPost) {
        const { error } = await supabase.from('posts').insert({
          id: postId,
          isSaved: false,
        });

        if (error)
          return monitorError({
            contextName: 'api/completion',
            error,
            contextData: { prompt, initialPost, postId, event },
            fingerprint: ['api/completion', 'post-insert-error'],
          });
      }

      // save the generated message as a new post iteration
      const { error } = await supabase.from('postIterations').insert({
        postId,
        text: event.text,
        isManuallyEdited: false,
        userMessage: prompt,
      });

      if (error)
        return monitorError({
          contextName: 'api/completion',
          error,
          contextData: { prompt, initialPost, postId, event },
          fingerprint: ['api/completion', 'post-iteration-insert-error'],
        });

      const { data: session } = await supabase.auth.getUser();

      const userId = session.user?.id;

      if (!userId) {
        console.error('User not found');
        return;
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
        console.log(error);
      }
    },
  });

  return result.toAIStreamResponse();
}

function getSystemPrompt(userDetails: TUserDetails, initialPost?: string) {
  // if initial post is provided, we will the prompt should be telling the AI to edit the post.
  if (!initialPost)
    return `
You are a professional LinkedIn post writer. The user will ask you to create a new LinkedIn post.  The LinkedIn post should be good. Here are some qualities you should keep in mind and should incorporate in the LinkedIn post. 

- The post should have an attention-grabbing hook

- The post should sound natural to read as if a human wrote it.

- The post should have a good reading structure and consider spacing and breaking into multiple paragraphs


- The post should be correct in punctuation and grammar.

- The post should be of 1000 letters.

Following is some context regarding the user that can help you write better posts:

Users Profession: ${userDetails.profession}

Buyers Persona that you user is targeting: ${userDetails.buyerPersona}

Company Information / Problem that their product is trying to solve: ${userDetails.productInfo}

Your responses should only be the content of the linkedin posts, nothing else. If the user requests anything other than creating a linkedin post, politely decline.
  `;
  else
    return `
You are a professional LinkedIn post writer. The user will ask you to make changes to the following linkedin post that you generated previously;

POST START

${initialPost}

POST END

The new LinkedIn post after the requested changes should be good. Here are some qualities you should keep in mind and should incorporate in the LinkedIn post.
- The post should have an attention-grabbing hook.
- The post should sound natural to read as if a human wrote it.
- The post should have a good reading structure and consider spacing and breaking into multiple paragraphs.
- The post should be correct in punctuation and grammar.
- The post should be of 1000 letters.

Following is some context regarding the user that can help you write better posts:

Users Profession: ${userDetails.profession}

Buyers Persona that you user is targeting: ${userDetails.buyerPersona}

Company Information / Problem that their product is trying to solve: ${userDetails.productInfo}

Your responses should only be the content of the linkedin posts, nothing else. Do not entertain any other requests other than making changes to the provided post. Politely decline any other requests.
  `;
}
