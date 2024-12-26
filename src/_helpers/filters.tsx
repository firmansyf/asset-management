export const parseFilters: any = (tmp_filters: any) => {
  let filters = {}
  if (tmp_filters && Object.keys(tmp_filters || {})?.length > 0) {
    Object.keys(tmp_filters || {}).map((e: any) => {
      let key = e.replace('filter[', '')
      key = key.replace(']', '')
      filters = {
        ...filters,
        [key]: tmp_filters[e],
      }
      return null
    })
  }
  return filters
}
