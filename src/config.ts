import { Agent as HttpsAgent } from 'https'
import { Agent as HttpAgent } from 'http'
import request from "request";

export interface HLTVConfig {
  loadPage: (url: string) => Promise<string>
  httpAgent: HttpsAgent | HttpAgent
}

export const defaultLoadPage =
  (httpAgent: HttpsAgent | HttpAgent | undefined) => (url: string) =>
      new Promise<string>((resolve) => {
          request.get(
              url,
              {
                  gzip: true,
                  agent: httpAgent
              },
              (err, __, body) => {
                  if (err) {
                      throw err
                  }

                  resolve(body)
              }
          )
      })

const defaultAgent = new HttpsAgent()

export const defaultConfig: HLTVConfig = {
  httpAgent: defaultAgent,
  loadPage: defaultLoadPage(defaultAgent)
}
