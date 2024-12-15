import { search } from '../lib/index.ts'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

// Search for 2 most recent items
const a = await search(2)
console.log(a)

// Search for 2 most recent items with tags 'other:full color' and 'language:chinese'
const b = await search(2, {
  baseTags: ['other:full color', 'language:chinese'],
})
console.log(b)

// Search for 2 most recent items and save the result to result_1.json
await search(2, { resultDist: resolve(import.meta.dirname!, 'result_1.json') })

// Search for 2 most recent items with banned tag 'male:shotacon'
// and provide existing items to skip
// Save the result to result_2.json
await search(2, {
  extraTags: ['male:shotacon'],
  exisitingItems: JSON.parse(
    await readFile(resolve(import.meta.dirname!, 'result_1.json'), 'utf-8'),
  ),
  resultDist: resolve(import.meta.dirname!, 'result_2.json'),
})
