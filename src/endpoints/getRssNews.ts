import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { fetchPage } from '../utils'

export interface RssArticle {
    title: string
    description: string
    link: string
    date: number
}

const urlify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex)
}


export const getRssNews = (config: HLTVConfig) =>
    async (): Promise<RssArticle[]> => {
        const url = 'https://www.hltv.org/rss/news'
        const test = await fetchPage(url, config.loadPage)
        const $ = HLTVScraper(await fetchPage(url, config.loadPage))
        const news = $('item').toArray()
            .map((el) => {
                const title = el.find('title').text()
                const description = el.find('description').text()
                // @ts-ignore
                const link = urlify(el.text())[0]
                const date = new Date(el.find('pubDate').text()).getTime()
                return {title, description, link, date}
            })
        return news
    }
