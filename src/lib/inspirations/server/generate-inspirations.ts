import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { cookies } from 'next/headers';
import { z } from 'zod';
import 'server-only';

import {
  getLanguageOrFallback,
  getPreferredLanguageFromBrowser,
  priority,
} from '@/lib/i18n/i18n.server';
import { I18N_COOKIE_NAME } from '@/lib/i18n/i18n.settings';

type TAlreadyGeneratedInspiration = {
  inspiration: string;
  theme: string;
};

type TAlreadyGeneratedInspirations = {
  saved: TAlreadyGeneratedInspiration[];
  others: TAlreadyGeneratedInspiration[];
};

type TArgs = {
  companyName: string;
  role: string;
  linkedInGoals: string[];
  linkedInTopics: string[];
  postTone: string;
  targetAudience: string[];
  companyUrl: string;
  companyData: string;
  language?: string;
  alreadyGeneratedInspirations?: TAlreadyGeneratedInspirations;
};

export default async function generateInspirations(data: TArgs) {
  // read the cookies here and send the locale in getInspirationPrompt
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

  const { object } = await generateObject({
    model: openai('gpt-4o-2024-05-13'),
    schema: z.object({
      data: z
        .array(
          z.object({
            inspiration: z.string(),
            theme: z.string(),
          })
        )
        .length(3),
    }),
    prompt: getInspirationPrompt({
      ...data,
      language: selectedLanguage === 'de' ? 'German' : 'English',
    }),
  });

  return object.data;
}

function getInspirationPrompt(data: TArgs) {
  return `You are a professional LinkedIn post writer. I will provide you with information about a person's career/ job role, the ideal customer persona of their target market, the product of the company, and what pain point they are solving for their customers. You have to give me 3 different LinkedIn post ideas/inspirations that can be used to write posts on LinkedIn, the main objective is to build an authentic thought and leadership brand with the target audience and customers. We also have to build trust and impress them. The ideas should be more to help them and to be seen as an authentic thought leader in their domain. The 3 inspirations should have 3 different themes and should not be very similar. 
 
  The user wants to talk about topics
  ${data.linkedInTopics}
  and wants to achieve goals
  ${data.linkedInGoals}
  and wants a post tone of
  ${data.postTone}

  The three inspirations should be categorized into these 4:

Educational (Educational and informative content)
Engagement (Increase audience’s engagement and involvement)
Leadership (Build trust, leadership and fan following)
XReasonsPost (X reasons why...)

Make sure to be creative and dont just write the same type of content for all 3 inspirations. The inspirations should be unique and different from each other. I will be using these inspirations to generate the actual LinkedIn posts later on. The inspirations need to use the information provided below to create the posts. I will provide you with information about the user and their company/product details. Use this info to create the inspirations.
Be creative and make sure the inspirations are catchy and interesting. The inspirations should be between 15-20 words. You should use your own additonal relevant and accurate information along with the provided information to create the inspirations.
The inspirations should be relevant to the user's job role, the company's product, and the target audience. The inspirations should be catchy and interesting to the target audience and should make them curious to read more. The inspirations should be in the language: ${data.language}
The inspiration should create thought leadership and subtly be relevant to sell the product or service of the company. It should not be a sales pitch, instead it should be informative and educational but should also portray benefits of the company's product or service. The inspirations should be creative and catchy and should make the reader curious to read more. The inspirations should be in the language: ${data.language}

Here is the information about the user and their preferences.
- Job role: 
	${data.role}

- Target audience for LinkedIn posts:
  ${data.targetAudience.join(', ')}

- Company name:
  ${data.companyName}

- Company URL:
  ${data.companyUrl}

Here are the details of the company and the product/service:
- Company name: {companyName}

- Company URL: ${data.companyUrl}

- Product/Service of the company:
  ${data.companyData}

Now write 3 different post inspirations for LinkedIn posts. Each should be around 15-20 words and should have an interesting and catchy headline. The headline should also act as an inspiration and should convey the theme and idea as this will be later used to generate an entire linkedin post using LLMs. Add a little catchiness and hook to the inspiration so that it entices the readers and makes them curious to read more. 
Note: Don't always write about the product/service/company, do add value and inspirations related to the industry and relevant field.

Here are some examples of content inspirations just for reference, don’t copy paste these:

1. Why high absenteeism is not always a sign of unhappy employees, but an opportunity for real change in the corporate culture.

2. The inconvenient truth: How traditional HR methods slow down productivity rather than promote it.

3. New Work is dead - long live New Work? Why we urgently need to rethink the concept in order to survive in today's working world.


Note: You just have to generate the post inspiration, a general idea, theme of the actual post will be conveyed through it. Later on the inspiration will be used to generate the actual post. Do use your own knowledge and accurate extra information if needed. Don’t put in hashtags in the inspiration output. For company name use placeholder {companyName}, it is not necessary to mention companyName in the inspiration, only do so if it makes sense and is highly relevant.

Important: Each inspiration must be between 15-20 words not longer or less than that. It should be catchy creative and also convey the idea and basis for the linkedin post later on.

Each inspiration must be greater than 15 words and less than 20 words. Give longer inspirations as we need more context to write the linkedin post later on. If the response of inspiration is less than 15 words, don't write that write something longer.Infuse as much information as you can into the inspiration and make it long but under the 20 word limit.

${getAlreadyGeneratedInspirationsPrompt(data.alreadyGeneratedInspirations)}


Keep in mind that sales people will be using these inspirations and posts to grow audience, build authentic leadership and provide value. But don't make it sound like a sales pitch or as if we are selling something directly. Make the sales element subtle and hidden in value and information and relevant.



Your response should be in the language: ${data.language}
`;
}

function getAlreadyGeneratedInspirationsPrompt(
  data?: TAlreadyGeneratedInspirations
) {
  if (!data) return '';

  return `Here are some inspirations that you have already generated for the user, the users saved some of them which they liked. The saved ones are:

${data.saved
  .map(
    (inspiration) =>
      `Inspiration: ${inspiration.inspiration} 
Theme: ${inspiration.theme}`
  )
  .join('\n')}

The other inspirations that were generated by you are:

${data.others
  .map(
    (inspiration) =>
      `Inspiration: ${inspiration.inspiration}
Theme: ${inspiration.theme}`
  )
  .join('\n')}

Now, generate 3 new inspirations for the user. Make sure they are unique and different from the ones that have already been generated and similar to the ones that have been saved by the user. The inspirations should be catchy and interesting and should make the reader curious to read more. They should be different from the ones that have already been generated and should be relevant to the user's job role, the company's product, and the target audience.`;
}
