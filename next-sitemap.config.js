/**
 * @type {import('next-sitemap').IConfig}
 * @see https://www.npmjs.com/package/next-sitemap#installation
 */

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
};
