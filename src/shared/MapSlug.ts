export enum MapSlug {
  TBA = 'tba',
  Train = 'trn',
  Cobblestone = 'cbl',
  Inferno = 'inf',
  Cache = 'cch',
  Mirage = 'mrg',
  Overpass = 'ovp',
  Dust2 = 'd2',
  Nuke = 'nuke',
  Tuscan = 'tcn',
  Vertigo = 'vertigo',
  Season = '-',
  Default = '-'
}

export const toMapSlug = (map: string): MapSlug => (MapSlug as any)[map]
