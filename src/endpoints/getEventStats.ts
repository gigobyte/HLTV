import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { fetchPage } from '../utils'

export interface GetEventStatsArguments {
  eventId: number
  startDate?: string
  endDate?: string
  flash?: boolean
  opening?: boolean
  pistol?: boolean
}

// TODO : Upgrade types :D

export interface PlayerEventStats {
  ign: string
  team: string
  overviewStats: {
    mapsPlayed: string
    roundsPlayed: string
    kdDiff: string
    kdRatio: string
    rating: string
  }
  flashStats?: {
    flashThrown: string
    flashBlinded: string
    oppFlashed: string
    flashDiff: string
    flashAssists: string
    flashSuccess: string
  }

  pistolStats?: {
    pistolRoundsPlayed: string
    pistolKdDiff: string
    pistolKd: string
    pistolRating: string
  }
  openingStats?: {
    openingKpr: string
    openingDpr: string
    openingAttemps: string
    openingSuccess: string
    openingRating: string
  }
}
const getPistolStats =
  (config: HLTVConfig) =>
  // TODO : add parameters such as sides etc.

  async (options: GetEventStatsArguments) => {
    const query = stringify({
      event: options.eventId,
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {})
    })
    const $p = await fetchPage(
      `https://www.hltv.org/stats/players/pistols?event=${options.eventId}`,
      config.loadPage
    ).then(HLTVScraper)

    const statsList = $p('.stats-table > tbody')
      .children()
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerCol a').text(),
          pistolStats: {
            pistolRoundsPlayed: el.find('.statsDetail').eq(1).text(),
            pistolKdDiff: el.find('.kdDiffCol').text(),
            pistolKd: el.find('.statsDetail').eq(1).text(),
            pistolRating: el.find('.ratingCol').text()
          }
        }
        return player
      })
    return statsList
  }

const getOpeningStats =
  (config: HLTVConfig) =>
  // TODO : add parameters such as sides etc.

  async (options: GetEventStatsArguments) => {
    const query = stringify({
      event: options.eventId,
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {})
    })
    const $o = await fetchPage(
      `https://www.hltv.org/stats/players/openingkills?event=${options.eventId}`,
      config.loadPage
    ).then(HLTVScraper)

    const statsList = $o('.stats-table > tbody > tr')
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerColSmall a').text(),
          openingStats: {
            openingKpr: el.find('.statsDetail').first().text(),
            openingDpr: el.find('.statsDetail').eq(1).text(),
            openingAttemps: el.find('.statsDetail').eq(2).text(),
            openingSuccess: el.find('.statsDetail').eq(3).text(),
            openingRating: el.find('.statsDetail').eq(4).text()
          }
        }
        return player
      })
    return statsList
  }

const getFlashStats =
  (config: HLTVConfig) =>
  // TODO : add parameters such as sides etc.

  async (options: GetEventStatsArguments) => {
    const query = stringify({
      event: options.eventId,
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {})
    })

    const $f = await fetchPage(
      `https://www.hltv.org/stats/players/flashbangs?event=${options.eventId}`,
      config.loadPage
    ).then(HLTVScraper)

    const statsList = $f('.stats-table > tbody > tr')
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerColSmall a').text(),
          flashStats: {
            flashThrown: el.find('.statsDetail').eq(1).text(),
            flashBlinded: el.find('.statsDetail').eq(2).text(),
            oppFlashed: el.find('.flashed-opponent-col').text(),
            flashDiff: el.find('.flash-col').first().text(),
            flashAssists: el.find('.statsDetail').eq(4).text(),
            flashSuccess: el.find('.statsDetail').eq(5).text()
          }
        }
        return player
      })
    return statsList
  }

export const getEventStats =
  (config: HLTVConfig) =>
  // TODO : add parameters such as sides etc.

  async (options: GetEventStatsArguments): Promise<any> => {
    const query = stringify({
      event: options.eventId,
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {})
    })

    const $ = await fetchPage(
      `https://www.hltv.org/stats/players?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    // Overview stats
    const overviewStatsList: PlayerEventStats[] = $('.stats-table > tbody')
      .children()
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerCol a').text(),
          team: el.find('.teamCol a img').attr('title'),
          overviewStats: {
            mapsPlayed: el.find('.statsDetail').first().text(),
            roundsPlayed: el.find('.statsDetail').eq(1).text(),
            kdDiff: el.find('.kdDiffCol').text(),
            kdRatio: el.find('.statsDetail').eq(2).text(),
            rating: el.find('.ratingCol').text()
          }
        }
        return player
      })

    let stats = overviewStatsList

    // Should add other params

    let flashList =
      options.flash === true
        ? await getFlashStats(config)({ eventId: options.eventId })
        : undefined
    let openingList =
      options.opening === true
        ? await getOpeningStats(config)({ eventId: options.eventId })
        : undefined
    let pistolList =
      options.pistol === true
        ? await getPistolStats(config)({ eventId: options.eventId })
        : undefined

    stats.map((overallplayer, i) => {
      flashList?.map((flashplayer) => {
        if (overallplayer.ign === flashplayer.ign) {
          stats[i].flashStats = flashplayer.flashStats
        }
      })

      openingList?.map((openplayer) => {
        if (overallplayer.ign === openplayer.ign) {
          stats[i].openingStats = openplayer.openingStats
        }
      })

      pistolList?.map((pistolplayer) => {
        if (overallplayer.ign === pistolplayer.ign) {
          stats[i].pistolStats = pistolplayer.pistolStats
        }
      })
    })

    return stats
  }
