'import server-only';

import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export default async function scrapeCompanyUrl(url: string) {
  try {
    const browser = await getBrowser();

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const content = await (page as any).evaluate(() => {
      return document.body.innerText;
    });

    await browser.close();

    // feed the content into claude to get the important information about the company

    const { text } = await generateText({
      model: anthropic('claude-3-5-sonnet-20240620'),
      prompt: `You are a linkedin post editor that build posts for sales people on LinkedIn. I scrapped the data for the company / product. I want you to extract any useful information from the scrapped content that may help you write personalized posts for the company / product in the future. The scraped data is as follows: \n {${content}}`,
    });

    return {
      text,
      error: null,
    } as const;
  } catch (error) {
    return {
      error: error,
      text: null,
    } as const;
  }
}

const CHROMIUM_PATH =
  'https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar';

async function getBrowser() {
  if (process.env.VERCEL_ENV === 'production') {
    const chromium = await import('@sparticuz/chromium-min').then(
      (mod) => mod.default
    );

    const puppeteerCore = await import('puppeteer-core').then(
      (mod) => mod.default
    );

    const executablePath = await chromium.executablePath(CHROMIUM_PATH);

    const browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    return browser;
  } else {
    const puppeteer = await import('puppeteer').then((mod) => mod.default);

    const browser = await puppeteer.launch();
    return browser;
  }
}
