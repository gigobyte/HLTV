import FullStream from '../models/FullStream';
declare const getStreams: ({ loadLinks }?: {
    loadLinks?: boolean | undefined;
}) => Promise<FullStream[]>;
export default getStreams;
