/// <reference types="cheerio" />
export declare const text: (el: Cheerio) => string;
export declare const prev: (el: Cheerio) => Cheerio;
export declare const hasChild: (childSelector: string) => (el: Cheerio) => boolean;
export declare const popSlashSource: (el: Cheerio) => string | undefined;
