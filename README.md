一个用来检索被 `e-hentai` 官方屏蔽的 `tag` 的工具, 基于 `puppeteer`, 用
`TypeScript` 编写. 完整配置见 <https://jsr.io/@leaf/e-hentai/doc>.

A tool to retrieve tags that are blocked by the `e-hentai`, based on
`puppeteer`, written in `TypeScript`. For full configuration, see
<https://jsr.io/@leaf/e-hentai/doc>.

[![JSR Version](https://jsr.io/badges/@leaf/e-hentai)](https://jsr.io/@leaf/e-hentai)
[![JSR Scope](https://jsr.io/badges/@leaf)](https://jsr.io/@leaf)
[![JSR Score](https://jsr.io/badges/@leaf/e-hentai/score)](https://jsr.io/@leaf/e-hentai/score)

- `MacOS` 用户请提前安装 `Chrome` 浏览器, `Windows` 请手动指定 `chromePath`
  (可以用自带的 `Edge` 浏览器).
- `MacOS` users please install `Chrome` browser in advance, `Windows` users
  please specify `chromePath` manually (you can use the built-in `Edge`
  browser).

```bash
# 安装
# Install
npx jsr add @leaf/e-hentai # if using npm
bunx jsr add @leaf/e-hentai # if using bun
deno add jsr:@leaf/e-hentai # if using deno
pnpm dlx jsr add @leaf/e-hentai # if using pnpm
yarn dlx jsr add @leaf/e-hentai # if using yarn
```

```typescript
import { search } from '../lib/index.ts'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

// Search for 2 most recent items
const a = await search(2)
console.log(a.result)

// Search for 2 most recent items with tags 'other:full color' and 'language:chinese'
const b = await search(2, {
  baseTags: ['other:full color', 'language:chinese'],
})
console.log(b.result)

// Search for 2 most recent items and save the result to result_1.json
await search(2, { resultDist: resolve(import.meta.dirname!, 'result_1.json') })

// Search for 2 most recent items with banned tag 'male:shotacon'
// and provide existing items to skip
// Save the result to result_2.json
await search(2, {
  extraTags: ['male:shotacon'],
  // Note: The return result will contain the existing items with the new items
  exisitingItems: JSON.parse(
    await readFile(resolve(import.meta.dirname!, 'result_1.json'), 'utf-8'),
  ),
  resultDist: resolve(import.meta.dirname!, 'result_2.json'),
})
```

```json
// 示例结果 (result_1.json)
// Example result (result_1.json)
[
  {
    "title": "[OHS (おーえいちえす)] スレイブ・セレナ [Digital]",
    "url": "https://e-hentai.org/g/3158455/ea9393ae4d/",
    "tags": [
      "parody:original",
      "female:nakadashi",
      "female:rape",
      "female:slave",
      "male:bbm",
      "male:dilf"
    ],
    "thumbnail": "https://ehgt.org/w/01/275/57753-6vc5iik3.webp"
  },
  {
    "title": "[JackOfBullets] The Giantess Next Door",
    "url": "https://e-hentai.org/g/3158454/2c241c9f30/",
    "tags": [
      "language:english",
      "female:giantess",
      "male:snuff",
      "artist:jackofbullets",
      "other:3d"
    ],
    "thumbnail": "https://ehgt.org/w/01/678/69115-scnf2k04.webp"
  }
]
```
