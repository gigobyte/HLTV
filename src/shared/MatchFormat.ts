export enum MatchFormat {
  BO1 = 'bo1',
  BO3 = 'bo3',
  BO5 = 'bo5',
  BO7 = 'bo7',
  Unknown = 'unknown'
}

export enum MatchFormatLocation {
  LAN = 'LAN',
  Online = 'Online'
}

export const fromFullMatchFormat = (format: string): MatchFormat => {
  if (format.includes('Best of 1')) {
    return MatchFormat.BO1
  }

  if (format.includes('Best of 3')) {
    return MatchFormat.BO3
  }

  if (format.includes('Best of 5')) {
    return MatchFormat.BO5
  }

  if (format.includes('Best of 7')) {
    return MatchFormat.BO7
  }

  return MatchFormat.Unknown
}
