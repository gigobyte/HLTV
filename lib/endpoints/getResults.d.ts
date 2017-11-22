import MatchResult from '../models/MatchResult';
declare const getResults: ({pages}?: {
    pages?: number;
}) => Promise<MatchResult[]>;
export default getResults;
