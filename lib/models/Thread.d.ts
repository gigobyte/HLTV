import ThreadCategory from '../enums/ThreadCategory';
interface Thread {
    readonly title: string;
    readonly link: string;
    readonly replies: number;
    readonly category: ThreadCategory;
}
export default Thread;
