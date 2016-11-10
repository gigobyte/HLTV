//It all begins here
import cheerio from 'cheerio'
import fetch from 'isomorphic-fetch'


async function getHtlv(): Promise {
    const response = await fetch('http://www.hltv.org/').then(res => res)

    return response
}
