import PlayerRanking from '../models/PlayerRanking'
import HLTVConfig from '../models/HLTVConfig'
import { fetchPage, toArray  } from '../utils/mappers'

const getPlayerRanking= (config: HLTVConfig) => async ({ startDate, endDate }: { startDate: string, endDate: string }): Promise<PlayerRanking[]> => {
    

    var options = '';
    if (startDate != null && endDate != null) {
        options = '?startDate='+startDate+'&endDate='+endDate;
    }
    const $ = await fetchPage(`${config.hltvUrl}/stats/players${options}`, config.loadPage)


    let players = [] as PlayerRanking[];
    players = players.concat(toArray($('.player-ratings-table tbody tr')).map(matchEl => {
        var id = Number(matchEl.find('.playerCol a').first().attr('href').split('/')[3]);
        var name = matchEl.find('.playerCol').text();
        var rating = Number(matchEl.find('.ratingCol').text());
        return { id: id, name: name, rating: rating };
    }));


    return players;
}

export default getPlayerRanking