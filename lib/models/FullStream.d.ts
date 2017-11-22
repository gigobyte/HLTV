import StreamCategory from '../enums/StreamCategory';
import Country from './Country';
interface FullStream {
    readonly name: string;
    readonly category: StreamCategory;
    readonly country: Country;
    readonly hltvLink: string;
    readonly realLink?: string;
    readonly viewers: number;
}
export default FullStream;
