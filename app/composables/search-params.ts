export function useSearchParams<T extends Record<string, any>>(initialValue: T) {
  const route = useRoute()
  const router = useRouter()

  const searchParams = reactive(initialValue)

  watch(
    () => route.query,
    query => {
      Object.keys(initialValue).forEach(key => {
        searchParams[key] = query[key] ?? initialValue[key]
      })
    },
    {
      immediate: true
    }
  )

  watch(searchParams, params => {
    router.replace({
      query: { ...route.query, ...params }
    })
  })

  return toRefs(searchParams)
}
