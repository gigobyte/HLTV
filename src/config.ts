import { defaultLoadPage } from './utils/mappers'
import { Agent as httpsAgent } from 'https'
import { Agent as httpAgent } from 'http'

export interface HLTVConfig {
  hltvUrl?: string
  hltvStaticUrl?: string
  loadPage?: (url: string) => Promise<string>
  httpAgent?: httpsAgent | httpAgent
}

const defaultAgent = new httpsAgent();

export const defaultConfig: HLTVConfig = {
  hltvUrl: 'https://www.hltv.org',
  hltvStaticUrl: 'https://static.hltv.org',
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent),
}
