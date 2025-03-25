import { useFuse } from '@vueuse/integrations/useFuse'

export async function fuseSearchContent(search: Ref<string>) {
  const { integrity, api } = useRuntimeConfig().public.content
  const url = `${api.baseURL}/search${integrity ? `-${integrity}` : ''}`

  const { data } = useNuxtData(url)
  if (!data.value) {
    data.value = await $fetch<any>(url)
  }

  const { results } = useFuse(search, data.value, {
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
