import { search } from '../lib/index.ts'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

await search({
  searchItems: 1,
  resultDist: resolve(import.meta.dirname!, 'result_1.json'),
  errorDist: resolve(import.meta.dirname!, 'error_1.json'),
  baseTags: ['other:full color', 'language:chinese'],
})

await search({
  searchItems: 2,
  resultDist: resolve(import.meta.dirname!, 'result_2.json'),
  errorDist: resolve(import.meta.dirname!, 'error_2.json'),
  baseTags: ['language:chinese'],
  extraTags: ['male:shotacon'],
  exisitingItems: JSON.parse(await readFile(resolve(import.meta.dirname!, 'result_1.json'), 'utf-8')),
})
