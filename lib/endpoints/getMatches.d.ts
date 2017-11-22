import UpcomingMatch from '../models/UpcomingMatch';
import LiveMatch from '../models/LiveMatch';
declare const getMatches: () => Promise<(UpcomingMatch | LiveMatch)[]>;
export default getMatches;
