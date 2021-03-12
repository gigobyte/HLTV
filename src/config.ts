import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'
import * as request from 'request'
import UserAgent from 'user-agents'

export interface HLTVConfig {
  loadPage: (url: string) => Promise<string>
  httpAgent: HttpsAgent | HttpAgent
}

export const defaultLoadPage = (
  httpAgent: HttpsAgent | HttpAgent | undefined
) => (url: string) =>
  new Promise<string>((resolve) => {
    request.get(
      url,
      {
        gzip: true,
        agent: httpAgent,
        headers: { 'User-Agent': new UserAgent().toString() }
      },
      (_, __, body) => resolve(body)
    )
  })

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent)
}
