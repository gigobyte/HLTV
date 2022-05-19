import { stringify } from 'querystring'
import { HLTVConfig } from '../config'
import { HLTVScraper } from '../scraper'
import { fetchPage, parseNumber } from '../utils'

export interface GetEventStatsArguments {
  eventId: number
  startDate?: string
  endDate?: string
  flash?: boolean
  opening?: boolean
  pistol?: boolean
  side?: 'COUNTER_TERRORIST' | 'COUNTER_TERRORIST'
}

// TODO : Upgrade types :D

export interface PlayerEventStats {
  ign: string
  team: string
  overviewStats: {
    mapsPlayed: number
    roundsPlayed: number
    kdDiff: number
    kdRatio: number
    rating: number
  }
  flashStats?: {
    flashThrown: number
    flashBlinded: string
    oppFlashed: string
    flashDiff: number
    flashAssists: number
    flashSuccess: number
  }

  pistolStats?: {
    pistolRoundsPlayed: number
    pistolKdDiff: number
    pistolKd: number
    pistolRating: number
  }
  openingStats?: {
    openingKpr: number
    openingDpr: number
    openingAttemps: string
    openingSuccess: string
    openingRating: number
  }
}

const createQuery = (options: GetEventStatsArguments) => {
  return stringify({
    event: options.eventId,
    ...(options.startDate ? { startDate: options.startDate } : {}),
    ...(options.endDate ? { endDate: options.endDate } : {}),
    ...(options.side ? { side: options.side } : {})
  })
}

const getPistolStats =
  (config: HLTVConfig) =>
  // TODO : add parameters such as sides etc.

  async (options: GetEventStatsArguments) => {
    const query = createQuery(options)
    const $p = await fetchPage(
      `https://www.hltv.org/stats/players/pistols?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    const statsList = $p('.stats-table > tbody')
      .children()
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerCol a').text(),
          pistolStats: {
            pistolRoundsPlayed: Number(el.find('.statsDetail').eq(1).text()),
            pistolKdDiff: Number(el.find('.kdDiffCol').text()),
            pistolKd: Number(el.find('.statsDetail').eq(1).text()),
            pistolRating: Number(el.find('.ratingCol').text())
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
    const query = createQuery(options)
    const $o = await fetchPage(
      `https://www.hltv.org/stats/players/openingkills?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    const statsList = $o('.stats-table > tbody > tr')
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerColSmall a').text(),
          openingStats: {
            openingKpr: Number(el.find('.statsDetail').first().text()),
            openingDpr: Number(el.find('.statsDetail').eq(1).text()),
            openingAttemps: el.find('.statsDetail').eq(2).text(),
            openingSuccess: el.find('.statsDetail').eq(3).text(),
            openingRating: Number(el.find('.statsDetail').eq(4).text())
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
    const query = createQuery(options)

    const $f = await fetchPage(
      `https://www.hltv.org/stats/players/flashbangs?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    const statsList = $f('.stats-table > tbody > tr')
      .toArray()
      .map((el) => {
        const player = {
          ign: el.find('.playerColSmall a').text(),
          flashStats: {
            flashThrown: Number(el.find('.statsDetail').eq(1).text()),
            flashBlinded: el.find('.statsDetail').eq(2).text(),
            oppFlashed: el.find('.flashed-opponent-col').text(),
            flashDiff: Number(el.find('.flash-col').first().text()),
            flashAssists: Number(el.find('.statsDetail').eq(4).text()),
            flashSuccess: Number(el.find('.statsDetail').eq(5).text())
          }
        }
        return player
      })
    return statsList
  }

export const getEventStats =
  (config: HLTVConfig) =>
  // TODO : add parameters such as sides etc.

  async (options: GetEventStatsArguments) => {
    const query = createQuery(options)

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
            mapsPlayed: Number(el.find('.statsDetail').first().text()),
            roundsPlayed: Number(el.find('.statsDetail').eq(1).text()),
            kdDiff: Number(el.find('.kdDiffCol').text()),
            kdRatio: Number(el.find('.statsDetail').eq(2).text()),
            rating: Number(el.find('.ratingCol').text())
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
