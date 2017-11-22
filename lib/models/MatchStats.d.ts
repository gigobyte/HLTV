import Team from './Team';
import Event from './Event';
import MapSlug from '../enums/MapSlug';
interface MatchStats {
    id: number;
    team1: Team;
    team2: Team;
    event: Event;
    date: number;
    map: MapSlug;
    result: {
        team1: number;
        team2: number;
    };
}
export default MatchStats;
