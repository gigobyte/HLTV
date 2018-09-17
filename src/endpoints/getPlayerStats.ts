import FullPlayerStats from '../models/FullPlayerStats'
import Team from '../models/Team'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage } from '../utils/mappers'

const getPlayerStats = (config: HLTVConfig) => async ({ id , startDate, endDate }: { id: number, startDate: string, endDate: string }): Promise<FullPlayerStats> => {
    

    var options = '';
    if (startDate != null && endDate != null) {
        options = '?startDate='+startDate+'&endDate='+endDate;
    }
    const $ = await fetchPage(`${config.hltvUrl}/stats/players/${id}/-${options}`, config.loadPage)

    const name = $('.statsPlayerName').text() || undefined
    const ign = $('.context-item-name').text();

    const image = $('.context-item-image').attr('src');

    const getInfo = function(i) { return $($('.divided-row').find('.large-strong').get(i)); };
    const age = Number(getInfo(1).text()) || undefined;

    const country = {
        name: getInfo(2).text(),
        code: undefined
    }

    let team: Team | undefined
    
    if (getInfo(3).text().trim() !== '-') {
        team = {
            name: getInfo(3).text(),
            id: Number(getInfo(3).attr('href').split('/')[3]),
            image: $($('.image-and-label>img').get(1)).attr('src')
        };
    }

    const getStats = function(i) { return $($($('.stats-row').get(i)).find('span').get(1)).text(); };
    const statistics = {
        kills: getStats(0),
        headshots: getStats(1),
        deaths: getStats(2),
        kdRatio: getStats(3),
        damagePerRound: getStats(4),
        granadeDamagePerRound: getStats(5),
        mapsPlayed: getStats(6),
        roundsPlayed: getStats(7),
        killsPerRound: getStats(8),
        assistsPerRound: getStats(9),
        deathsPerRound: getStats(10),
        savedByTeammatePerRound: getStats(11),
        savedTeammatesPerRound: getStats(12),
        rating: getStats(13)
    };

    return {name, ign, image, age, country, team, statistics};
}

export default getPlayerStats