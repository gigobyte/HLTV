import * as request from 'request'
declare var getMatch: any

interface HLTVConfig {
    loadPage: (url: string) => Promise<string>
}

const defaultConfig: HLTVConfig = {
    loadPage: (url: string) => new Promise<string>((resolve) => {
        request.get(url, (_, __, body) => resolve(body))
    })
}

const createHLTVInstance = (config: HLTVConfig) => ({
    getMatch: getMatch(config),
    createInstance: (config: HLTVConfig) => createHLTVInstance(config)
})

const hltvInstance = createHLTVInstance(defaultConfig)

export default hltvInstance
export { hltvInstance as HLTV }