import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'
import { gotScraping } from 'got-scraping'
import { addExtra } from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import puppeteerVanilla from 'puppeteer'
import { sleep } from './utils.js'

export interface HLTVConfig {
  loadPage: (url: string) => Promise<string>
  httpAgent: HttpsAgent | HttpAgent
  loadMatchStatsPage: (url: string) => Promise<string>
}

export const defaultLoadMatchStatsPage = async (url: string) => {
  const puppeteer = addExtra(puppeteerVanilla as any).use(StealthPlugin())
  const options = {
    headless: 'new',
    // headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
  const browser = await puppeteer.launch(options as any)
  const page = await browser.newPage()
  let responseBody: string | undefined = ''
  // let responseData: any
  let responseHeaders

  page.removeAllListeners('request')
  await page.setRequestInterception(true)
  let requestHeaders = {}
  page.on('request', (request) => {
    requestHeaders = Object.assign({}, request.headers(), requestHeaders)
    if (process.env.DEBUG) {
      console.log(
        `[DEBUG] requested headers: \n${JSON.stringify(requestHeaders)}`
      )
    }

    request.continue({ headers: requestHeaders })
  })
  const client = await page.target().createCDPSession()
  client.send('Network.setRequestInterception', {
    patterns: [
      {
        urlPattern: '*',
        resourceType: 'Document',
        interceptionStage: 'HeadersReceived'
      }
    ]
  })

  client.on('Network.requestIntercepted', async (e) => {
    let obj: any = { interceptionId: e.interceptionId }
    if (e.isDownload) {
      await client
        .send('Network.getResponseBodyForInterception', {
          interceptionId: e.interceptionId
        })
        .then((result) => {
          if (result.base64Encoded) {
            // responseData = Buffer.from(result.body, 'base64')
          }
        })
      obj['errorReason'] = 'BlockedByClient'
      responseHeaders = e.responseHeaders
    }
    await client.send('Network.continueInterceptedRequest', obj)
    if (e.isDownload) await page.close()
  })
  try {
    const CHALLENGE_MATCH = 'Checking your browser before accessing'
    const RATE_LIMITED = 'You are being rate limited'
    const JS_AND_COOKIE = 'Enable JavaScript and cookies to continue'
    let response
    let tryCount = 0
    response = await page.goto(url, {
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    })
    responseBody = await response?.text()
    // responseData = await response?.buffer()
    if (
      responseBody?.includes(CHALLENGE_MATCH || 'challenge-platform') ||
      responseBody?.includes(RATE_LIMITED) ||
      responseBody?.includes(JS_AND_COOKIE)
    ) {
      await sleep(5000)
    }
    while (
      (responseBody?.includes(CHALLENGE_MATCH || 'challenge-platform') ||
        responseBody?.includes(RATE_LIMITED) ||
        responseBody?.includes(JS_AND_COOKIE)) &&
      tryCount <= 3
    ) {
      const newResponse = await page.waitForNavigation({
        timeout: 10000,
        waitUntil: 'domcontentloaded'
      })
      if (newResponse) response = newResponse
      responseBody = await response?.text()
      // responseData = await response?.buffer()
      tryCount++
    }
    responseHeaders = response?.headers()
    // const cookies = await page.cookies()
    // if (cookies)
    //   cookies.forEach((cookie) => {
    //     const { name, value, secure, expires, domain, ...options } = cookie
    //   })
  } catch (error) {
    if (!error?.toString().includes('ERR_BLOCKED_BY_CLIENT')) {
    }
  }

  await page.close()
  await browser.close()
  return new Promise<string>((res) => res(responseBody ?? ''))
}
export const defaultLoadPage =
  (httpAgent: HttpsAgent | HttpAgent | undefined) => async (url: string) => {
    const res = await gotScraping({
      url,
      agent: {
        http: httpAgent,
        https: httpAgent as HttpsAgent | undefined
        // http: new HttpsAgent(),
        // https: new HttpsAgent()
      },
      headerGeneratorOptions: {
        browsers: ['firefox'],
        devices: ['desktop'],
        locales: ['en-US'],
        operatingSystems: ['windows']
      }
    })
    return res.body
  }

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent),
  loadMatchStatsPage: defaultLoadMatchStatsPage
}
