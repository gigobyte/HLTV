export default interface HLTVConfig {
  hltvUrl?: string
  hltvStaticUrl?: string
  loadPage?: (url: string) => Promise<string>
}
