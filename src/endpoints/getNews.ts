import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Country } from '../shared/Country'
import { fetchPage } from '../utils'

export interface NewsPreview {
  title: string
  comments: number
  date: number
  country: Country
  link: string
}

export interface GetNewsArguments {
  year?:
    | 2005
    | 2006
    | 2007
    | 2008
    | 2009
    | 2010
    | 2011
    | 2012
    | 2013
    | 2014
    | 2015
    | 2016
    | 2017
    | 2018
    | 2019
    | 2020
    | 2021
    | 2022
  month?:
    | 'january'
    | 'february'
    | 'march'
    | 'april'
    | 'may'
    | 'june'
    | 'july'
    | 'august'
    | 'september'
    | 'october'
    | 'november'
    | 'december'
  eventIds?: number[]
}

export const getNews =
  (config: HLTVConfig) =>
  async ({ year, month, eventIds }: GetNewsArguments = {}): Promise<
    NewsPreview[]
  > => {
    let url = 'https://www.hltv.org/news/archive'

    if (eventIds) {
      url = `${url}?${stringify({ event: eventIds })}`
    } else if (year && month) {
      url = `${url}/${year}/${month}`
    }

    const $ = HLTVScraper(await fetchPage(url, config.loadPage))

    const news = $('.article')
      .toArray()
      .map((el) => {
        const link = el.attr('href')
        const title = el.find('.newstext').text()
        const comments = parseInt(el.find('.newstc').children().last().text())
        const date = new Date(el.find('.newsrecent').text()).getTime()
        const country = {
          name: el.find('.newsflag').attr('alt'),
          code: el.find('.newsflag').attr('src').split('/').pop()!.split('.')[0]
        }

        return { link, title, comments, date, country }
      })

    return news
  }
