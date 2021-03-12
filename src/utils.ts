import * as cheerio from 'cheerio'
import { v4 as uuidv4 } from 'uuid'

export const fetchPage = async (
  url: string,
  loadPage: (url: string) => Promise<string>
): Promise<cheerio.Root> => {
  const root = cheerio.load(await loadPage(url))

  if (root.html().includes('error code: 1015')) {
    throw new Error(
      'Access denied | www.hltv.org used Cloudflare to restrict access'
    )
  }

  return root
}

export const generateRandomSuffix = () => {
  return uuidv4()
}

export const percentageToDecimalOdd = (odd: number): number =>
  parseFloat(((1 / odd) * 100).toFixed(2))

export function getIdAt(index: number, href: string): number | undefined
export function getIdAt(index: number): (href: string) => number | undefined
export function getIdAt(index?: number, href?: string): any {
  switch (arguments.length) {
    case 1:
      return (href: string) => getIdAt(index!, href)
    default:
      return Number(href!.split('/')[index!]) || undefined
  }
}
