import { stringify } from 'querystring'
import type { HLTVConfig } from '../config.js'
import {
  getContainerByText,
  getPlayersByContainer,
  type GetTeamStatsArguments
} from './getTeamStats.js'
import { fromMapName, toMapFilter } from '../shared/GameMap.js'
import { HLTVScraper, type HLTVPageElement } from '../scraper.js'
import { fetchPage, generateRandomSuffix } from '../utils.js'

export const getDetailedTeamMapStats =
  (config: HLTVConfig) => async (options: GetTeamStatsArguments) => {
    const query = stringify({
      ...(options.startDate ? { startDate: options.startDate } : {}),
      ...(options.endDate ? { endDate: options.endDate } : {}),
      ...(options.matchType ? { matchType: options.matchType } : {}),
      ...(options.rankingFilter
        ? { rankingFilter: options.rankingFilter }
        : {}),
      ...(options.maps ? { maps: options.maps.map(toMapFilter) } : {}),
      ...(options.bestOfX ? { bestOfX: options.bestOfX } : {})
    })
    // let $ = HLTVScraper(
    //   await fetchPage(
    //     `https://www.hltv.org/stats/teams/${options.id}/-?${query}`,
    //     config.loadPage
    //   )
    // )
    // const currentLineup = getPlayersByContainer(
    //   getContainerByText($, 'Current lineup')
    // )
    // const currentRosterQuery = stringify({
    //   lineup: currentLineup.map((x) => x.id!),
    //   minLineupMatch: 0
    // })
    const mp$ = await fetchPage(
      `https://www.hltv.org/stats/teams/maps/${
        options.id
      }/${generateRandomSuffix()}?${query}`,
      config.loadPage
    ).then(HLTVScraper)

    const getMapStat = (mapEl: HLTVPageElement, i: number) =>
      mapEl.find('.stats-row').eq(i).children().last().text()

    const parseMapStats = async (url: string) => {
      const mps$ = await fetchPage(
        'https://www.hltv.org' + url + generateRandomSuffix(),
        config.loadPage
      ).then(HLTVScraper)
      const stats = mps$('.stats-rows.standard-box').children().toArray()
      const tRoundWinPercent = stats
        .at(-1)
        ?.find('span')
        .toArray()
        .at(-1)
        ?.text()
      console.log('🚀 ~ parseMapStats ~ tRoundWinPercent:', tRoundWinPercent)
    }

    const mapStats = mp$('.two-grid .col .stats-rows')
      .toArray()
      .reduce(
        (stats, mapEl) => {
          const mapName = fromMapName(
            mapEl.prev().find('.map-pool-map-name').text()
          )

          const mapUrl = mapEl.prev().find('.map-pool a').attr('href')
          parseMapStats(mapUrl)

          const [wins, draws, losses] = getMapStat(mapEl, 0)
            .split(' / ')
            .map(Number)

          stats[mapName] = {
            wins,
            draws,
            losses,
            winRate: Number(getMapStat(mapEl, 1).split('%')[0]),
            totalRounds: Number(getMapStat(mapEl, 2)),
            roundWinPAfterFirstKill: Number(getMapStat(mapEl, 3).split('%')[0]),
            roundWinPAfterFirstDeath: Number(getMapStat(mapEl, 4).split('%')[0])
          }

          return stats
        },
        {} as Record<string, any>
      )
  }
