import * as cheerio from 'cheerio'
import * as fetch from 'isomorphic-fetch'
import Team from '../models/Team'
import Veto from '../models/Veto'
import Player from '../models/Player'
import { MapStatistic } from '../models/FullTeam'
import { Outcome, WeakRoundOutcome } from '../models/RoundOutcome'
import MapSlug from '../enums/MapSlug'
import * as E from '../utils/parsing'

export const fetchPage = async (url: string) => cheerio.load(await fetch(url).then((res: any) => res.text()))
export const toArray = (elements: Cheerio): Cheerio[] => elements.toArray().map(cheerio)
export const getMapSlug = (map: string): MapSlug => MapSlug[map]

export const mapVetoElementToModel = (el: Cheerio, team1: Team, team2: Team): Veto => {
    const [ teamName, map ] = el.text().replace(/^\d. /, '').split(/removed|picked/)

    if (!map || !teamName) {
        return {
            map: getMapSlug(el.text().split(' ')[1]),
            type: 'other'
        }
    }

    return {
        team: [team1, team2].find(t => t.name === teamName.trim()) as Team,
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

export const getMatchFormatAndMap = (mapText: string): {map?: MapSlug, format?: string} => {
    if (mapText && !mapText.includes('bo')) {
        return { map: mapText as MapSlug, format: 'bo1'}
    }

    if (!mapText) {
        return {}
    }

    return { format: mapText }
}

export const mapRoundElementToModel = (team1Id: number, team2Id: number) => (el: Cheerio, i: number): WeakRoundOutcome => {
    const outcomeString = (E.popSlashSource(el) as string).split('.')[0]
    const outcome = Object.entries(Outcome).find(([_, v]) => v === outcomeString) as Outcome | undefined

    return {
        outcome: outcome && outcome[1] as Outcome,
        score: el.attr('title'),
        ctTeam: i < 15 ? team1Id : team2Id,
        tTeam: i < 15 ? team2Id : team1Id
    }
}

export const getMapsStatistics = (source: string): {[key: string]: MapStatistic} | undefined => {
    const valueRegex = /"value":"(\d|\.)+%?"/g
    const labelRegex = /label":"\w+/g
    const splitRegex = /%?"/

    if (!source.match(labelRegex)) {
        return;
    }

    const maps = (source.match(labelRegex) as RegExpMatchArray).map(x => x.split(':"')[1])
    const values = (source.match(valueRegex) as RegExpMatchArray).map(x => Number(x.split(':"')[1].split(splitRegex)[0]))

    const getStats = index => ({
        winningPercentage: values[index],
        ctWinningPercentage: values[index + maps.length * 1],
        tWinningPercentage: values[index + maps.length * 2],
        timesPlayed: values[index + maps.length * 3]
    })

    return maps.reduce((stats, map, i) => ({
        ...stats, [MapSlug[map]]: getStats(i)
    }), {})
}

export const getTimestamp = (source: string): number => {
    const [ day, month, year ] = source.split('/')

    return new Date([month, day, year].join('/')).getTime()
}