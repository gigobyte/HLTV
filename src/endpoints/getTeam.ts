import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Article } from '../shared/Article'
import { Country } from '../shared/Country'
import { Player } from '../shared/Player'
import { fetchPage, generateRandomSuffix, getIdAt, parseNumber } from '../utils'

export enum TeamPlayerType {
  Coach = 'Coach',
  Starter = 'Starter',
  Substitute = 'Substitute',
  Benched = 'Benched'
}

export interface FullTeamPlayer extends Player {
  type: TeamPlayerType
  timeOnTeam: string
  mapsPlayed: number
}

export interface FullTeam {
  id: number
  name: string
  logo?: string
  facebook?: string
  twitter?: string
  instagram?: string
  country: Country
  rank?: number
  players: FullTeamPlayer[]
  rankingDevelopment: number[]
  news: Article[]
}

export const getTeam =
  (config: HLTVConfig) =>
  async ({ id }: { id: number }): Promise<FullTeam> => {
    const $ = HLTVScraper(
      await fetchPage(
        `https://www.hltv.org/team/${id}/${generateRandomSuffix()}`,
        config.loadPage
      )
    )

    const name = $('.profile-team-name').text()
    const logoSrc = $('.teamlogo').attr('src')
    const logo = logoSrc.includes('placeholder.svg') ? undefined : logoSrc
    const facebook = $('.facebook').parent().attr('href')
    const twitter = $('.twitter').parent().attr('href')
    const instagram = $('.instagram').parent().attr('href')
    const rank = parseNumber(
      $('.profile-team-stat .right').first().text().replace('#', '')
    )

    const players = $('.players-table tbody tr')
      .toArray()
      .map((el) => ({
        name: el
          .find(
            '.playersBox-playernick-image .playersBox-playernick .text-ellipsis'
          )
          .text(),
        id: el
          .find('.playersBox-playernick-image')
          .attrThen('href', getIdAt(2)),
        timeOnTeam: el.find('td').eq(2).trimText()!,
        mapsPlayed: el.find('td').eq(3).numFromText()!,
        type: getPlayerType(el.find('.player-status').text())!
      }))
      .concat(
        ...($('.coach-table').exists()
          ? [
              {
                id: $('.coach-table .playersBox-playernick-image').attrThen(
                  'href',
                  getIdAt(2)
                ),
                name: $(
                  '.coach-table .playersBox-playernick-image .playersBox-playernick .text-ellipsis'
                ).text(),
                timeOnTeam: $('.coach-table tbody tr')
                  .first()
                  .find('td')
                  .eq(1)
                  .trimText()!,
                mapsPlayed: $('.coach-table tbody tr')
                  .first()
                  .find('td')
                  .eq(2)
                  .numFromText()!,
                type: TeamPlayerType.Coach
              }
            ]
          : [])
      )

    let rankingDevelopment

    try {
      const rankings = JSON.parse($('.graph').attr('data-fusionchart-config')!)
      rankingDevelopment = rankings.dataSource.dataset[0].data.map((x: any) =>
        parseNumber(x.value)
      )
    } catch {
      rankingDevelopment = []
    }

    const country = {
      name: $('.team-country .flag').attr('alt'),
      code: $('.team-country .flag').attrThen(
        'src',
        (x) => x.split('/').pop()?.split('.')[0]!
      )
    }

    const news = $('#newsBox a')
      .toArray()
      .map((el) => ({
        name: el.contents().eq(1).text(),
        link: el.attr('href')
      }))

    return {
      id,
      name,
      logo,
      facebook,
      twitter,
      instagram,
      country,
      rank,
      players,
      rankingDevelopment,
      news
    }
  }

function getPlayerType(text: string): TeamPlayerType | undefined {
  if (text === 'STARTER') {
    return TeamPlayerType.Starter
  }
  if (text === 'BENCHED') {
    return TeamPlayerType.Benched
  }
  if (text === 'SUBSTITUTE') {
    return TeamPlayerType.Substitute
  }
}
