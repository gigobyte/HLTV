import * as cheerio from 'cheerio'
import * as request from 'request'
import { Team } from '../models/Team'
import { Veto } from '../models/Veto'
import { Player } from '../models/Player'
import { Outcome, WeakRoundOutcome } from '../models/RoundOutcome'
import { MapSlug } from '../enums/MapSlug'
import { popSlashSource } from '../utils/parsing'

export const defaultLoadPage = (url: string) =>
  new Promise<string>(resolve => {
    request.get(url, { gzip: true }, (_, __, body) => resolve(body))
  })

export const fetchPage = async (
  url: string,
  loadPage?: (url: string) => Promise<string>
): Promise<CheerioStatic> => {
  return cheerio.load(await loadPage!(url))
}

export const toArray = (elements: Cheerio): Cheerio[] => elements.toArray().map(cheerio)
export const getMapSlug = (map: string): MapSlug => MapSlug[map]

export const mapVetoElementToModel = (el: Cheerio, team1: Team, team2: Team): Veto => {
  const [teamName, map] = el
    .text()
    .replace(/^\d. /, '')
    .split(/removed|picked/)

  if (!map || !teamName) {
    return {
      map: getMapSlug(el.text().split(' ')[1]),
      type: 'other'
    }
  }

  return {
    team: [team1, team2].find(t => t.name === teamName.trim())!,
    map: getMapSlug(map.trim()),
    type: el.text().includes('picked') ? 'picked' : 'removed'
  }
}

export const getMatchPlayer = (playerEl: Cheerio): Player => {
  const link = playerEl.parent().attr('href')

  return {
    name: playerEl.find('.text-ellipsis').text(),
    id: link ? Number(link.split('/')[2]) : undefined
  }
}

export const getMatchFormatAndMap = (mapText: string): { map?: MapSlug; format?: string } => {
  if (mapText && !mapText.includes('bo')) {
    return { map: mapText as MapSlug, format: 'bo1' }
  }

  if (!mapText) {
    return {}
  }

  return { format: mapText }
}

export const mapRoundElementToModel = (team1Id: number, team2Id: number) => (
  el: Cheerio,
  i: number,
  allRoundEls: Cheerio[]
): WeakRoundOutcome => {
  const getOutcome = (el: Cheerio): Outcome | undefined => {
    const outcomeString = (popSlashSource(el) as string).split('.')[0]
    const outcomeTuple = Object.entries(Outcome).find(([_, v]) => v === outcomeString)

    return outcomeTuple && outcomeTuple[1]
  }

  const extractCTOutcomeSideInfo = (index: number) => {
    if (index < 15) {
      return {
        firstHalfCt: team1Id,
        secondHalfCt: team2Id,
        firstHalfT: team2Id,
        secondHalfT: team1Id
      }
    }

    return {
      firstHalfCt: team2Id,
      secondHalfCt: team1Id,
      firstHalfT: team1Id,
      secondHalfT: team2Id
    }
  }

  const extractTOutcomeSideInfo = (index: number) => {
    if (index < 15) {
      return extractCTOutcomeSideInfo(30)
    }

    return extractCTOutcomeSideInfo(0)
  }

  const outcome = getOutcome(el)

  const ctOutcomes = [Outcome.BombDefused, Outcome.CTWin]
  const tOutcomes = [Outcome.BombExploded, Outcome.TWin]

  const ctOutcomeMarker = allRoundEls.findIndex(x => ctOutcomes.includes(getOutcome(x)!))
  const tOutcomeMarker = allRoundEls.findIndex(x => tOutcomes.includes(getOutcome(x)!))

  const outcomeSideInfo =
    ctOutcomeMarker !== -1
      ? extractCTOutcomeSideInfo(ctOutcomeMarker)
      : extractTOutcomeSideInfo(tOutcomeMarker)

  const isFirstHalf = i < 15 || (i >= 30 && i < 45)

  return {
    outcome: outcome,
    score: el.attr('title'),
    ctTeam: isFirstHalf ? outcomeSideInfo.firstHalfCt : outcomeSideInfo.secondHalfCt,
    tTeam: isFirstHalf ? outcomeSideInfo.firstHalfT : outcomeSideInfo.secondHalfT
  }
}

export const getTimestamp = (source: string): number => {
  const [day, month, year] = source.split('/')

  return new Date([month, day, year].join('/')).getTime()
}
