export enum GameMap {
  TBA = 'tna',
  Train = 'de_train',
  Cobblestone = 'de_cbble',
  Inferno = 'de_inferno',
  Cache = 'de_cache',
  Mirage = 'de_mirage',
  Overpass = 'de_overpass',
  Dust2 = 'de_dust2',
  Nuke = 'de_nuke',
  Tuscan = 'de_tuscan',
  Vertigo = 'de_vertigo',
  Season = 'de_season',
  Default = 'default'
}

export const fromMapSlug = (slug: string): GameMap => {
  switch (slug) {
    case 'tba':
      return GameMap.TBA
    case 'trn':
      return GameMap.Train
    case 'cbl':
      return GameMap.Cobblestone
    case 'inf':
      return GameMap.Inferno
    case 'cch':
      return GameMap.Cache
    case 'mrg':
      return GameMap.Mirage
    case 'ovp':
      return GameMap.Overpass
    case 'd2':
      return GameMap.Dust2
    case 'nuke':
      return GameMap.Nuke
    case 'tcn':
      return GameMap.Tuscan
    case 'vertigo':
      return GameMap.Vertigo
    case '-':
      return GameMap.Default
    default:
      return GameMap.Default
  }
}

export const fromMapName = (name: string): GameMap => {
  switch (name) {
    case 'TBA':
      return GameMap.TBA
    case 'Train':
      return GameMap.Train
    case 'Cobblestone':
      return GameMap.Cobblestone
    case 'Inferno':
      return GameMap.Inferno
    case 'Cache':
      return GameMap.Cache
    case 'Mirage':
      return GameMap.Mirage
    case 'Overpass':
      return GameMap.Overpass
    case 'Dust2':
      return GameMap.Dust2
    case 'Nuke':
      return GameMap.Nuke
    case 'Tuscan':
      return GameMap.Tuscan
    case 'Vertigo':
      return GameMap.Vertigo
    case 'Default':
      return GameMap.Default
    default:
      return GameMap.Default
  }
}
