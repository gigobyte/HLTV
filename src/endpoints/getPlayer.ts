import FullPlayer from '../models/FullPlayer'
import Team from '../models/Team'
import { HLTV_URL } from '../utils/constants'
import { fetchPage, toArray } from '../utils/mappers'
import * as E from '../utils/parsing'

const getPlayer = async ({ id }: { id: number }): Promise<FullPlayer> => {
    const $ = await fetchPage(`${HLTV_URL}/player/${id}/-`)

    const name = $('.subjectname').text().replace(/".+" /, '').trim() || undefined
    const ign = ($('.subjectname').text().match(/".+"/) as RegExpMatchArray)[0].replace(/"/g, '')

    const shownImageOld = $('.containedImageFrame img')
    const shownImage = shownImageOld.length ? shownImageOld : $('.profileImage')
    const image = !shownImage.attr('src').includes('blankplayer') ? shownImage.attr('src') : undefined

    const coverImage = $('.coverImage').attr('data-bg-image')

    const age = Number($($('.subjectname').next().contents().get(3)).text().trim().split(' ')[0])
    const twitter = $($('.player-some').find('a').get(0)).attr('href')
    const twitch = $($('.player-some').find('a').get(1)).attr('href')
    const facebook = $($('.player-some').find('a').get(2)).attr('href')
    const country = {
        name: $('.subjectname').next().children().first().attr('title'),
        code: (E.popSlashSource($('.subjectname').next().children().first()) as string).split('.')[0]
    }

    let team: Team | undefined

    if ($('.team-logo-container img').length) {
        team = {
            name: $('.team-logo-container img').attr('title'),
            id: Number(E.popSlashSource($('.team-logo-container img')))
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

    return {name, ign, image, coverImage, age, twitter, twitch, facebook, country, team, statistics, achievements}
}

export default getPlayer