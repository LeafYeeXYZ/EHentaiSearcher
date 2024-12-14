import type { Cookie } from 'npm:puppeteer-core@23.10.4'

/** Result for each item */
export type Item = {
  /** Title of the item */
  title: string
  /** URL of the item */
  url: string
  /** Tags of the item */
  tags: string[]
  /** Thumbnail url of the item */
  thumbnail: string
}

/** Configuration for the search */
export type Config = {
  /** 
   * [Optional] Cookies for authentication
   * 
   * @default []
   */
  cookies?: Cookie[]
  /** 
   * Executable path of the Chrome
   * 
   * @default '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
   */
  chromePath?: string
  /** 
   * Base tags (tags that are not banned)
   * 
   * @default '[]'
   */
  baseTags?: string[]
  /** 
   * Extra tags (tags that are banned)
   * 
   * @default '[]'
   */
  extraTags?: string[]
  /** 
   * Exsiting items, will be skipped
   * 
   * @default '[]'
   */
  exisitingItems?: Item[]
  /** 
   * Absolute path of result (ends with .json)
   */
  resultDist: string
  /** 
   * Absolute path of error (ends with .json)
   */
  errorDist: string
  /** 
   * User agent for the browser
   * 
   * @default 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
   */
  userAgent?: string
  /** 
   * Viewport of the browser
   * @default '{ width: 1200, height: 700 }'
   */
  viewPort?: {
    width: number
    height: number
  }
  /** 
   * Stop searching when duplicate items are found
   * 
   * @default 'false'
   */
  stopOnDuplicate?: boolean
  /** 
   * Number of items to search
   */
  searchItems: number
}
