export interface Team {
  name: string
  id?: number
  logo?: string
}

export const logoFromSrc = (
  logoSrc: string | undefined
): string | undefined => {
  if (!logoSrc) {
    return undefined
  }

  if (logoSrc.includes('placeholder.svg')) {
    return undefined
  }

  return logoSrc
}
