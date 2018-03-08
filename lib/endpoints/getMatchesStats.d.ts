import MatchStats from '../models/MatchStats';
import MatchType from '../enums/MatchType';
import Map from '../enums/Map';
export declare type GetMatchesStatsParams = {
    startDate?: string;
    endDate?: string;
    matchType?: MatchType;
    maps?: Map[];
};
declare const getMatchesStats: ({ startDate, endDate, matchType, maps }?: GetMatchesStatsParams) => Promise<MatchStats[]>;
export default getMatchesStats;
