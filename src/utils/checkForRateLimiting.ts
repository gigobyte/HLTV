export const checkForRateLimiting = ($: cheerio.Root) => {
  if ($.html().includes('error code: 1015')) {
    throw new Error(
      'Access denied | www.hltv.org used Cloudflare to restrict access'
    )
  }
}
