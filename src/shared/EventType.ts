export enum EventType {
  Major = 'MAJOR',
  InternationalLAN = 'INTLLAN',
  RegionalLAN = 'REGIONALLAN',
  LocalLAN = 'LOCALLAN',
  Online = 'ONLINE',
  Other = 'OTHER'
}

export const fromText = (str: string): EventType | undefined => {
  switch (str) {
    case 'Online':
      return EventType.Online
    case 'Intl. LAN':
      return EventType.InternationalLAN
    case 'Local LAN':
      return EventType.LocalLAN
    case 'Reg. LAN':
      return EventType.RegionalLAN
    case 'Major':
      return EventType.Major
    case 'Other':
      return EventType.Other
  }
}
