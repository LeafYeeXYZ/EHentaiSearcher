import { writeFile } from 'node:fs/promises'
import type { Item, Config } from './types.ts'
import puppeteer from 'npm:puppeteer-core@23.10.4'
import { tagsToUrl } from './utils.ts'

export async function search({
  searchItems,
  resultDist,
  errorDist,
  cookies = [],
  baseTags = [],
  extraTags = [],
  exisitingItems = [],
  chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  viewPort = { width: 1200, height: 700 },
  stopOnDuplicate = false,
}: Config) {
  const url = tagsToUrl(baseTags)
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: chromePath,
    timeout: 0,
  })
  if (cookies.length !== 0) {
    await browser.setCookie(...cookies)
  }
  const page = await browser.newPage()
  await page.setViewport(viewPort)
  await page.setUserAgent(userAgent)
  await page.goto('https://e-hentai.org', { timeout: 0 })
  await page.goto(url, { timeout: 0 })
  console.log('Page loaded, start searching...')

  const result: Item[] = []
  try {
    let currentPage = 1
    for (let i = 2; ; i++) {
      const nextPage = await page.$eval('#dnext', (el) => el.getAttribute('href'))
      if (!nextPage) {
        console.error('Next button not found')
        break
      }
      const element = await page.$(`body > div.ido > div:nth-child(2) > table.itg > tbody > tr:nth-child(${i})`)
      if (!element) {
        currentPage++
        console.log(`Jump to next page ${currentPage}`)
        await page.goto(nextPage, { timeout: 0 })
        await new Promise((resolve) => setTimeout(resolve, +(50 + Math.random() * 50).toFixed(0)))
        i = 2
        continue
      }
      const iframe = await element.$('iframe')
      if (iframe) { // which means it's an ad
        continue
      }
      const tags = await element.$eval('td.glname > a > div:last-child', (el) => {
        const children = el.children
        const _result = []
        for (let i = 0; i < children.length; i++) {
          _result.push(children[i].getAttribute('title'))
        }
        return _result
      })
      if (!extraTags.every((tag) => tags.includes(tag))) {
        continue
      }
      const titleElement = await element.$('td.glname > a > div.glink')
      await titleElement!.hover()
      await new Promise((resolve) => setTimeout(resolve, +(400 + Math.random() * 200).toFixed(0)))
      const title = await titleElement!.evaluate((el) => el.textContent)
      const url = await element.$eval('td.glname > a', (el) => el.getAttribute('href'))
      const thumbnail = await element.$eval('td.gl2c > div.glthumb > div:first-child > img', (el) => el.getAttribute('src'))
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
    await writeFile(resultDist, JSON.stringify([...result, ...exisitingItems], null, 2))
    console.log(`Results saved to ${resultDist}`)

    console.log('Waiting for the page to close...')
    while (true) {
      if (page.isClosed()) {
        await browser.close()
        break
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
  } catch (error) {
    console.error('Error happened, auto save current results...')
    await writeFile(errorDist, JSON.stringify(result, null, 2))
    console.error(`Current results saved to ${errorDist}`)
    throw error
  }
}

export type { Item, Config }
