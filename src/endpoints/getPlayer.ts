import FullPlayer from '../models/FullPlayer'
import Team from '../models/Team'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray } from '../utils/mappers'
import * as E from '../utils/parsing'

const getPlayer = (config: HLTVConfig) => async ({ id }: { id: number }): Promise<FullPlayer> => {
    const $ = await fetchPage(`${config.hltvUrl}/player/${id}/-`, config.loadPage)

    const name = $('.player-realname').text().trim() || undefined
    const ign = $('.player-nick').text()

    const image = $('.bodyshot-img').attr('src') || $('.bodyshot-img-square').attr('src')

    const age = Number($('.profile-player-stat-value').first().text().split(' ')[0]) || undefined
    const twitter = $('.twitter').parent().attr('href')
    const twitch = $('.twitch').parent().attr('href')
    const facebook = $('.facebook').parent().attr('href')
    const country = {
        name: $('.player-realname .flag').attr('alt'),
        code: (E.popSlashSource($('.player-realname .flag')) as string).split('.')[0]
    }

    let team: Team | undefined
    
    if ($('.profile-player-stat-value.bold').text().trim() !== '-') {
        team = {
            name: $('.profile-player-stat-value a').text().trim(),
            id: Number($('.profile-player-stat-value a').attr('href').split('/')[2])
        }
    }

    const getMapStat = (i) => Number($($('.standard-box .two-col').find('.cell').get(i)).find('.statsVal').text().replace('%', ''))

    const statistics = {
        rating: getMapStat(0),
        killsPerRound: getMapStat(1),
        headshots: getMapStat(2),
        mapsPlayed: getMapStat(3),
        deathsPerRound: getMapStat(4),
        roundsContributed: getMapStat(5)
    }


    const achievements = toArray($('.achievement')).map(achEl => ({
        place: $(achEl.contents().get(1)).text().split(' at')[0],
        event: {
            name: $(achEl.contents().get(2)).text(),
            id: Number($(achEl.contents().get(2)).attr('href').split('/')[2])
        }
    }))

    return {name, ign, image, age, twitter, twitch, facebook, country, team, statistics, achievements}
}

export default getPlayer