import FullMatchMapStats, { PlayerPerformanceStats } from '../models/FullMatchMapStats';
export declare type PlayerPerformanceStatsMap = {
    [key: number]: PlayerPerformanceStats;
};
declare const getMatchMapStats: ({ id }: {
    id: number;
}) => Promise<FullMatchMapStats>;
export default getMatchMapStats;
