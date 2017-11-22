import Team from './Team';
import Event from './Event';
import MapSlug from '../enums/MapSlug';
interface HeadToHeadResult {
    date: number;
    winner: Team;
    event: Event;
    map: MapSlug;
    result: string;
}
export default HeadToHeadResult;
