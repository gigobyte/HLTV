import FullTeam from '../models/FullTeam';
declare const getTeam: ({ id }: {
    id: number;
}) => Promise<FullTeam>;
export default getTeam;
