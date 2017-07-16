import * as cheerio from 'cheerio'
import * as fetch from 'isomorphic-fetch'
import MapSlug from '../enums/MapSlug'
import Team from '../models/Team'
import Veto from '../models/Veto'

export const toArray = (elements: Cheerio): Cheerio[] => elements.toArray().map(cheerio)
export const fetchPage = async (url: string) => cheerio.load(await fetch(url).then((res: any) => res.text()))
export const getMapSlug = (map: string): MapSlug => MapSlug[map]

export const mapVetoElementToModel = (el: Cheerio, team1: Team, team2: Team): Veto => {
    const [ teamName, map ] = el.text().replace(/^\d. /, '').split(/removed|picked/);

    return {
        team: [team1, team2].find(t => t.name === teamName.trim()),
        map: getMapSlug(map.trim()),
        type: el.text().includes('picked') ? 'picked' : 'removed'
    }
}
