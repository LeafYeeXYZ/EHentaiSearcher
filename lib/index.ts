import { writeFile } from 'node:fs/promises'
import type { Config, Item } from './types.ts'
import { tagsToUrl } from './utils.ts'
import puppeteer from 'npm:puppeteer-core@23.10.4'
import type { Browser } from 'npm:puppeteer-core@23.10.4'

/**
 * Search for items on e-hentai.org
 * @param searchItems Number of items to search
 * @param config Configuration for the search
 * @param config.resultDist Absolute path of result (ends with .json) (optional)
 * @param config.errorDist Absolute path of error (ends with .json) (optional)
 * @param config.cookies cookies for authentication (optional, default [])
 * @param config.baseTags Base tags (tags that are not banned) (optional, default [])
 * @param config.extraTags Extra tags (tags that are banned) (optional, default [])
 * @param config.exisitingItems Exsiting items, will be skipped (optional, default [])
 * @param config.chromePath Executable path of the Chrome (optional, default '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
 * @param config.userAgent User agent for the browser (optional, default 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/
 * @param config.viewPort View port for the browser (optional, default { width: 1200, height: 700 })
 * @param config.stopOnDuplicate Stop searching when duplicate item found (optional, default false)
 * @param config.autoCloseBroswer Auto close browser after search (optional, default true)
 */
export async function search(searchItems: number, {
  resultDist,
  errorDist,
  cookies = [],
  baseTags = [],
  extraTags = [],
  exisitingItems = [],
  chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  viewPort = { width: 1200, height: 700 },
  stopOnDuplicate = false,
  autoCloseBroswer = true,
}: Config = {}): Promise<
  { result: Item[]; success: true } | {
    result: Item[]
    success: false
    error: unknown
  }
> {
  const result: Item[] = []
  let browser: Browser | null = null
  try {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: chromePath,
      timeout: 0,
    })
    if (cookies.length !== 0) {
      await browser.setCookie(...cookies)
    }
    // Launch browser and page
    const page = await browser.newPage()
    await page.setViewport(viewPort)
    await page.setUserAgent(userAgent)
    await page.goto('https://e-hentai.org', { timeout: 0 })
    await page.goto(tagsToUrl(baseTags), { timeout: 0 })
    console.log('Page loaded, start searching...')
    // Start searching
    let currentPage = 1
    for (let i = 2;; i++) {
      const nextPage = await page.$eval(
        '#dnext',
        (el) => el.getAttribute('href'),
      )
      if (!nextPage) {
        console.error('Next button not found')
        break
      }
      const element = await page.$(
        `body > div.ido > div:nth-child(2) > table.itg > tbody > tr:nth-child(${i})`,
      )
      if (!element) {
        currentPage++
        console.log(`Jump to next page ${currentPage}`)
        await page.goto(nextPage, { timeout: 0 })
        await new Promise((resolve) =>
          setTimeout(resolve, +(50 + Math.random() * 50).toFixed(0))
        )
        i = 2
        continue
      }
      const iframe = await element.$('iframe')
      if (iframe) { // which means it's an ad
        continue
      }
      const tags = await element.$eval(
        'td.glname > a > div:last-child',
        (el) => {
          const children = el.children
          const _result = []
          for (let i = 0; i < children.length; i++) {
            _result.push(children[i].getAttribute('title'))
          }
          return _result
        },
      )
      if (!extraTags.every((tag) => tags.includes(tag))) {
        continue
      }
      const titleElement = await element.$('td.glname > a > div.glink')
      await titleElement!.hover()
      await new Promise((resolve) =>
        setTimeout(resolve, +(400 + Math.random() * 200).toFixed(0))
      )
      const title = await titleElement!.evaluate((el) => el.textContent)
      const url = await element.$eval(
        'td.glname > a',
        (el) => el.getAttribute('href'),
      )
      const thumbnail = await element.$eval(
        'td.gl2c > div.glthumb > div:first-child > img',
        (el) => el.getAttribute('src'),
      )
      if (exisitingItems.some((item) => item.url === url)) {
        console.log(`Item already exists: ${title}`)
        if (stopOnDuplicate) {
          console.log('Search completed')
          break
        } else {
          continue
        }
      }
      console.log(`Successfully get item: ${title}`)
      result.push({ title, url, tags, thumbnail })
      if (result.length >= searchItems) {
        console.log('Search completed')
        break
      }
    }
    // Save results
    if (resultDist) {
      await writeFile(
        resultDist,
        JSON.stringify([...result, ...exisitingItems], null, 2),
      )
      console.log(`Results saved to ${resultDist}`)
    }
    // Close browser
    if (!autoCloseBroswer) {
      console.log('Waiting for the page to close...')
      while (true) {
        if (page.isClosed()) {
          break
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }
    }
    return { result, success: true }
  } catch (error) {
    if (errorDist) {
      await writeFile(errorDist, JSON.stringify(result, null, 2))
      console.error(`Error happened, save current results to ${errorDist}`)
    }
    return { result, success: false, error }
  } finally {
    browser?.close()
  }
}

export type { Config, Item }
