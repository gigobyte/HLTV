import { defaultLoadPage } from './utils/mappers'

export interface HLTVConfig {
  hltvUrl?: string
  hltvStaticUrl?: string
  loadPage?: (url: string) => Promise<string>
}

export const defaultConfig = {
  hltvUrl: 'http://www.hltv.org',
  hltvStaticUrl: 'https://static.hltv.org',
  loadPage: defaultLoadPage
}
