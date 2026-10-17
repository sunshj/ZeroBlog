import { useFuse } from '@vueuse/integrations/useFuse'

export async function fuseSearchContent(search: Ref<string>) {
  const [articleSections, noteSections] = await Promise.all([
    queryCollectionSearchSections('articles'),
    queryCollectionSearchSections('notes')
  ])

  const sections = [...articleSections, ...noteSections]

  const { results } = useFuse(search, sections, {
    fuseOptions: {
      minMatchCharLength: 2,
      distance: 150,
      includeMatches: true,
      useExtendedSearch: true,
      keys: ['title', 'content']
    }
  })

  return results
}
