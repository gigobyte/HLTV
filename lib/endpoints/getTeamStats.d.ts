import FullTeamStats from '../models/FullTeamStats';
declare const getTeamStats: ({ id }: {
    id: number;
}) => Promise<FullTeamStats>;
export default getTeamStats;
