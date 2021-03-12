import * as cheerio from 'cheerio'

export interface HLTVPage extends cheerio.Root {
  (selector: string): HLTVPageElement
}

export interface HLTVPageElement {
  length: number

  trimText(): string | undefined
  numFromAttr(attr: string): number | undefined
  numFromText(): number | undefined
  lines(): string[]
  exists(): boolean
  find(selector: string): HLTVPageElement
  attr(attr: string): string
  text(): string
  textThen(then: (value: string) => any): any
  first(): HLTVPageElement
  last(): HLTVPageElement
  toArray(): HLTVPageElement[]
  data(name: string): any
  attrThen(attr: string, then: (value: string) => any): any
  next(selector?: string): HLTVPageElement
}

const attachMethods = (root: cheerio.Cheerio): HLTVPageElement => {
  const obj: HLTVPageElement = {
    length: root.length,

    find(selector: string): HLTVPageElement {
      return attachMethods(root.find(selector))
    },

    attr(attr: string): string {
      return root.attr(attr)!
    },

    attrThen(attr: string, then: (value: string) => any): any {
      return then(root.attr(attr)!)
    },

    text(): string {
      return root.text()
    },

    textThen(then: (value: string) => any): any {
      return then(root.text())
    },

    first(): HLTVPageElement {
      return attachMethods(root.first())
    },

    last(): HLTVPageElement {
      return attachMethods(root.last())
    },

    data(name: string): any {
      return root.data(name)
    },

    trimText(): string | undefined {
      return root.text().trim() || undefined
    },

    numFromAttr(attr: string): number | undefined {
      return Number(root.attr(attr)) || undefined
    },

    numFromText(): number | undefined {
      return Number(root.text()) || undefined
    },

    lines(): string[] {
      return root.text().split('\n')
    },

    exists(): boolean {
      return root.length !== 0
    },

    toArray(): HLTVPageElement[] {
      return root.toArray().map(cheerio.default).map(attachMethods)
    },

    next(selector?: string): HLTVPageElement {
      return attachMethods(root.next(selector))
    }
  }

  return obj
}

export const HLTVScraper = (root: cheerio.Root): HLTVPage => {
  const selector = (selector: string): HLTVPageElement => {
    return attachMethods(root(selector))
  }

  return selector as HLTVPage
}
