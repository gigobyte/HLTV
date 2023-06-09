import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { Country } from '../shared/Country'
import { Team } from '../shared/Team'
import { Event } from '../shared/Event'
import { fetchPage, generateRandomSuffix, getIdAt, parseNumber } from '../utils'
import { Article } from '../shared/Article'

export interface FullPlayerTeam extends Team {
  startDate: number
  leaveDate?: number
  trophies: Event[]
}

export interface PlayerAchievement {
  event: Event
  place: string
}

export interface FullPlayer {
  id: number
  name?: string
  ign: string
  image?: string
  age?: number
  country: Country
  team?: Team
  twitter?: string
  twitch?: string
  facebook?: string
  instagram?: string
  statistics?: {
    rating: number
    killsPerRound: number
    headshots: number
    mapsPlayed: number
    deathsPerRound: number
    roundsContributed: number
  }
  teams: FullPlayerTeam[]
  achievements: PlayerAchievement[]
  news: Article[]
}

export const getPlayer =
  (config: HLTVConfig) =>
  async ({ id }: { id: number }): Promise<FullPlayer> => {
    const $ = HLTVScraper(
      await fetchPage(
        `https://www.hltv.org/player/${id}/${generateRandomSuffix()}`,
        config.loadPage
      )
    )

    const nameText = $('.playerRealname').trimText()

    const name = nameText === '-' ? undefined : nameText

    const ign = $('.playerNickname').text()

    const imageUrl =
      $('.profile-img').attr('src') || $('.bodyshot-img').attr('src')

    const image =
      imageUrl.includes('bodyshot/unknown.png') ||
      imageUrl.includes('static/player/player_silhouette.png')
        ? undefined
        : imageUrl

    const age = $('.playerAge .listRight').textThen((x) =>
      parseNumber(x.split(' ')[0])
    )

    const twitter = $('.twitter').parent().attr('href')
    const twitch = $('.twitch').parent().attr('href')
    const facebook = $('.facebook').parent().attr('href')
    const instagram = $('.instagram').parent().attr('href')

    const country = {
      name: $('.playerRealname .flag').attr('alt')!,
      code: $('.playerRealname .flag').attrThen(
        'src',
        (x) => x.split('/').pop()?.split('.')[0]!
      )
    }

    const hasTeam = $('.playerTeam .listRight').trimText() !== 'No team'

    let team

    if (hasTeam) {
      team = {
        name: $('.playerTeam a').trimText()!,
        id: $('.playerTeam a').attrThen('href', getIdAt(2))
      }
    }

    const getMapStat = (i: number) =>
      Number(
        $('.playerpage-container')
          .find('.player-stat')
          .eq(i)
          .find('.statsVal')
          .text()
          .replace('%', '')
      )

    const statistics = $('.playerpage-container.empty-state').exists()
      ? undefined
      : {
          rating: getMapStat(0),
          killsPerRound: getMapStat(1),
          headshots: getMapStat(2),
          mapsPlayed: getMapStat(3),
          deathsPerRound: getMapStat(4),
          roundsContributed: getMapStat(5)
        }

    const achievements = $('.achievement-table .team')
      .toArray()
      .map((el) => ({
        place: el.find('.achievement').text(),
        event: {
          name: el.find('.tournament-name-cell a').text(),
          id: el.find('.tournament-name-cell a').attrThen('href', getIdAt(2))
        }
      }))

    const teams = $('.team-breakdown .team')
      .toArray()
      .map((el) => ({
        id: el.find('.team-name-cell a').attrThen('href', getIdAt(2)),
        name: el.find('.team-name').text(),
        startDate: el
          .find('.time-period-cell [data-unix]')
          .first()
          .numFromAttr('data-unix')!,
        leaveDate: el
          .find('.time-period-cell [data-unix]')
          .eq(1)
          .numFromAttr('data-unix'),
        trophies: el
          .find('.trophy-row-trophy a')
          .toArray()
          .map((trophyEl) => ({
            id: trophyEl.attrThen('href', getIdAt(2)),
            name: trophyEl.find('img').attr('title')
          }))
      }))

    const news = $('#newsBox a')
      .toArray()
      .map((el) => ({
        name: el.contents().eq(1).text(),
        link: el.attr('href')
      }))

    return {
      id,
      name,
      ign,
      image,
      age,
      twitter,
      twitch,
      facebook,
      instagram,
      country,
      team,
      statistics,
      achievements,
      teams,
      news
    }
  }
