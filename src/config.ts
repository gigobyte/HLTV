import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'
import fetch from 'node-fetch'
import randomUseragent from 'random-useragent'

export interface HLTVConfig {
  loadPage: (url: string) => Promise<string>
  httpAgent: HttpsAgent | HttpAgent
}

export const defaultLoadPage =
  (httpAgent: HttpsAgent | HttpAgent | undefined) => async (url: string) => {
    const randomUe = randomUseragent.getRandom((ue) =>
      ['/Browsers - Windows', '/Browsers - Linux', '/Browsers - Mac'].includes(
        ue.folder
      )
    )

    let headers: HeadersInit = {}

    if (randomUe) {
      headers['user-agent'] = randomUe
    }

    const response = await fetch(url, {
      agent: httpAgent,
      headers
    })

    return await response.text()
  }

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent)
}
