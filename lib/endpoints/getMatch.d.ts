import FullMatch from '../models/FullMatch';
declare const getMatch: ({ id }: {
    id: number;
}) => Promise<FullMatch>;
export default getMatch;
