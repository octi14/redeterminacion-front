import {
  filterSiteNavigationItems,
  getVisibleSiteNavigationItems,
} from '~/utils/siteNavigation'

export function useSiteSearch() {
  const userStore = useUserStore()

  const visibleItems = computed(() => getVisibleSiteNavigationItems(userStore))

  const search = (query) => filterSiteNavigationItems(visibleItems.value, query)

  return {
    visibleItems,
    search,
  }
}
