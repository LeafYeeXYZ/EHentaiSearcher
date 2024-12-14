一个用来检索被 `e-hentai` 官方屏蔽的 `tag` 的工具, 基于 `puppeteer`, 用 `TypeScript` 编写. 完整配置见 <https://jsr.io/@leaf/e-hentai/doc>.

A tool to retrieve tags that are blocked by the `e-hentai`, based on `puppeteer`, written in `TypeScript`. For full configuration, see <https://jsr.io/@leaf/e-hentai/doc>.

[![JSR Version](https://jsr.io/badges/@leaf/e-hentai)](https://jsr.io/@leaf/e-hentai) [![JSR Scope](https://jsr.io/badges/@psych)](https://jsr.io/@psych) [![JSR Score](https://jsr.io/badges/@leaf/e-hentai/score)](https://jsr.io/@leaf/e-hentai/score)

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
import { search } from '@leaf/e-hentai'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

// 普通用法
// Normal usage
await search({
  searchItems: 1,
  resultDist: resolve(import.meta.dirname!, 'result_1.json'),
  errorDist: resolve(import.meta.dirname!, 'error_1.json'),
  baseTags: ['other:full color', 'language:chinese'],
})

// 用于搜索被屏蔽的标签
// Use for search banned tags
await search({
  searchItems: 2,
  resultDist: resolve(import.meta.dirname!, 'result_2.json'),
  errorDist: resolve(import.meta.dirname!, 'error_2.json'),
  baseTags: ['language:chinese'],
  extraTags: ['male:shotacon'],
  exisitingItems: JSON.parse(await readFile(resolve(import.meta.dirname!, 'result_1.json'), 'utf-8')),
})
```

- 请在搜索完成后手动关闭**页面** (不是浏览器) (控制台会有提示).
- Please manually close the **page** (not the browser) after the search is complete (you will get a notification in the console).
- `MacOS` 用户请提前安装 `Chrome` 浏览器, `Windows` 请手动指定 `chromePath` (可以用自带的 `Edge` 浏览器).
- `MacOS` users please install `Chrome` browser in advance, `Windows` users please specify `chromePath` manually (you can use the built-in `Edge` browser).

```json
// 示例结果 (result_1.json)
// Example result (result_1.json)
[
  {
    "title": "【佐藤ていぎ】異世界転生系即落ちシリーズ｜【男男菊花香个人汉化】【chinese】",
    "url": "https://e-hentai.org/g/3157540/4738949e1a/",
    "tags": [
      "language:chinese",
      "language:translated",
      "male:yaoi",
      "other:full color"
    ],
    "thumbnail": "https://ehgt.org/w/01/677/73319-m4uhaf21.webp"
  }
]
```
