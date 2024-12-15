export function tagsToUrl(tags: string[]) {
  if (tags.length === 0) {
    return 'https://e-hentai.org'
  }
  return `https://e-hentai.org/?f_search=${
    tags
      .map((tag) => tag.replace(':', '%3A%22'))
      .map((tag) => tag.replace(' ', '+'))
      .map((tag) => tag + '%22')
      .join('+')
  }`
}
