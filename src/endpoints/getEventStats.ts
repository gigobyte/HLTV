import { stringify } from "querystring";
import { HLTVConfig } from "../config";
import { HLTVScraper } from '../scraper'
import { fetchPage, getIdAt } from '../utils'


export const getEventStats =
    (config: HLTVConfig) =>

        // TODO : add parameters such as sides etc.

        async (options: { eventId: number, startDate?: string, endDate?: string }): Promise<any> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
            })
            const $ = await fetchPage(`https://www.hltv.org/stats/players?event=${options.eventId}`, config.loadPage)
                .then(HLTVScraper)


            // Overview stats
            const overviewStatsList = $(".stats-table > tbody")
                .children()
                .toArray()
                .map(el => {
                    const player = {
                        ign: el.find(".playerCol a").text(),
                        team: el.find(".teamCol a img").attr("title"),
                        mapsPlayed: el.find(".statsDetail").first().text(),
                        roundsPlayed: el.find(".statsDetail").eq(1).text(),
                        kdDiff: el.find(".kdDiffCol").text(),
                        kd: el.find(".statsDetail").eq(2).text(),
                        rating: el.find(".ratingCol").text()
                    }

                    return player
                })


            // Reunification of all data into overviewStatsList (bad thing cuz it mutates data !!!), should export everything to a new array 😀

            // overviewStatsList.map((overallplayer, i) => {
            //     flashStatsList.map(flashplayer => {
            //         if (overallplayer.ign === flashplayer.ign) {
            //             overviewStatsList[i] = { ...overviewStatsList[i], ...flashplayer }
            //         }
            //     })

                // openingStatsList.map(openplayer => {
                //     if (overallplayer.ign === openplayer.ign) {
                //         overviewStatsList[i] = { ...overviewStatsList[i], ...openplayer }
                //     }
                // })

                // pistolStatsList.map(pistolplayer => {
                //     if (overallplayer.ign === pistolplayer.ign) {
                //         overviewStatsList[i] = { ...overviewStatsList[i], ...pistolplayer }
                //     }
                // })



            return { overviewStatsList }

        }

const getPistolStats =
    (config: HLTVConfig) =>

        // TODO : add parameters such as sides etc.

        async (options: { eventId: number, startDate?: string, endDate?: string }): Promise<any> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
            })
            const $pistol = await fetchPage(`https://www.hltv.org/stats/players/pistols?event=${options.eventId}`, config.loadPage)
                .then(HLTVScraper)

            const pistolStatsList = $pistol(".stats-table > tbody")
                .children()
                .toArray()
                .map(el => {
                    const player = {
                        ign: el.find(".playerCol a").text(),
                        pistolRoundsPlayed: el.find(".statsDetail").eq(1).text(),
                        pistolKdDiff: el.find(".kdDiffCol").text(),
                        pistolKd: el.find(".statsDetail").eq(1).text(),
                        pistolRating: el.find(".ratingCol").text()
                    }
                    return player
                })
            return pistolStatsList
        }

const getOpeningStats =
    (config: HLTVConfig) =>

        // TODO : add parameters such as sides etc.

        async (options: { eventId: number, startDate?: string, endDate?: string }): Promise<any> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
            })
            const $opening = await fetchPage(`https://www.hltv.org/stats/players/openingkills?event=${options.eventId}`, config.loadPage)
                .then(HLTVScraper)

            const openingStatsList = $opening(".stats-table > tbody > tr")
                .toArray()
                .map(el => {
                    const player = {
                        ign: el.find(".playerColSmall a").text(),
                        openingKpr: el.find(".statsDetail").first().text(),
                        openingDpr: el.find(".statsDetail").eq(1).text(),
                        openingAttemps: el.find(".statsDetail").eq(2).text(),
                        openingSuccess: el.find(".statsDetail").eq(3).text(),
                        openingRating: el.find(".statsDetail").eq(4).text(),
                    }
                    return player
                })
            return openingStatsList
        }

const getFlashStats =
    (config: HLTVConfig) =>

        // TODO : add parameters such as sides etc.

        async (options: { eventId: number, startDate?: string, endDate?: string }): Promise<any> => {
            const query = stringify({
                ...(options.startDate ? { startDate: options.startDate } : {}),
                ...(options.endDate ? { endDate: options.endDate } : {}),
            })

            const $flash = await fetchPage(`https://www.hltv.org/stats/players/flashbangs?event=${options.eventId}`, config.loadPage)
                .then(HLTVScraper)

            const flashStatsList = $flash(".stats-table > tbody > tr")
                .toArray()
                .map(el => {
                    const player = {
                        ign: el.find(".playerColSmall a").text(),
                        flashThrown: el.find(".statsDetail").eq(1).text(),
                        flashBlinded: el.find(".statsDetail").eq(2).text(),
                        oppFlashed: el.find(".flashed-opponent-col").text(),
                        flashDiff: el.find(".flash-col").first().text(),
                        flashAssists: el.find(".statsDetail").eq(4).text(),
                        flashSuccess: el.find(".statsDetail").eq(5).text()
                    }
                    return player
                })
            return flashStatsList
        }




