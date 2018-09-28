import MapSlug from '../enums/MapSlug'

interface MapResult {
    readonly name: MapSlug,
    readonly result: string,
    readonly statsId?: number
}

export default MapResult
