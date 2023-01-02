export interface Team {
  name: string
  id?: number
  logo?: string
}

export const logoFromSrc = (logoSrc: string): string | undefined =>
  logoSrc.includes('placeholder.svg') ? undefined : logoSrc
