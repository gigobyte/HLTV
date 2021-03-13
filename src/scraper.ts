import * as cheerio from 'cheerio'
import { parseNumber } from './utils'

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
  textThen<T>(then: (value: string) => T): T
  first(): HLTVPageElement
  last(): HLTVPageElement
  toArray(): HLTVPageElement[]
  data(name: string): any
  attrThen<T>(attr: string, then: (value: string) => T): T
  next(selector?: string): HLTVPageElement
  eq(index: number): HLTVPageElement
  children(selector?: string): HLTVPageElement
  prev(selector?: string): HLTVPageElement
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

    attrThen<T>(attr: string, then: (value: string) => T): T {
      return then(root.attr(attr)!)
    },

    text(): string {
      return root.text()
    },

    textThen<T>(then: (value: string) => T): T {
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
      return parseNumber(root.attr(attr))
    },

    numFromText(): number | undefined {
      return parseNumber(root.text())
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

    prev(selector?: string): HLTVPageElement {
      return attachMethods(root.prev(selector))
    },

    next(selector?: string): HLTVPageElement {
      return attachMethods(root.next(selector))
    },

    eq(index: number): HLTVPageElement {
      return attachMethods(root.eq(index))
    },

    children(selector?: string): HLTVPageElement {
      return attachMethods(root.children(selector))
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
