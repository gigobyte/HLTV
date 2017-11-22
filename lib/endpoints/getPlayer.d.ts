import FullPlayer from '../models/FullPlayer';
declare const getPlayer: ({id}: {
    id: number;
}) => Promise<FullPlayer>;
export default getPlayer;
