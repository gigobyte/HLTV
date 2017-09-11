import TeamRanking from '../models/TeamRanking';
declare const getTeamRanking: ({year, month, day}?: {
    year?: string;
    month?: string;
    day?: string;
}) => Promise<TeamRanking[]>;
export default getTeamRanking;
