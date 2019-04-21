export const text = (el: Cheerio) => el.text()
export const prev = (el: Cheerio) => el.prev()
export const hasChild = (childSelector: string) => (el: Cheerio) =>
  el.find(childSelector).length !== 0
  export const hasNoChild = (childSelector: string) => (el: Cheerio) =>
  el.find(childSelector).length === 0
export const popSlashSource = (el: Cheerio) =>
  el
    .attr('src')
    .split('/')
    .pop()
