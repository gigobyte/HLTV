import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'

async function fetchLink(link: string): function {
    const response = await fetch(link).then(res => res.text())

    return cheerio.load(response)
}
