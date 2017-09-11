import Team from './Team';
import Event from './Event';
import MapSlug from '../enums/MapSlug';
interface MatchResult {
    readonly id: number;
    readonly team1: Team;
    readonly team2: Team;
    readonly format: string;
    readonly event: Event;
    readonly map?: MapSlug;
    readonly result: string;
    readonly stars: number;
}
export default MatchResult;
