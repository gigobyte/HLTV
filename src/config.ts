import { defaultLoadPage } from './utils/mappers'
import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'

export interface HLTVConfig {
  hltvUrl?: string
  hltvStaticUrl?: string
  loadPage?: (url: string) => Promise<string>
  httpAgent?: HttpsAgent | HttpAgent
}

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  hltvUrl: 'https://www.hltv.org',
  hltvStaticUrl: 'https://static.hltv.org',
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent)
}
