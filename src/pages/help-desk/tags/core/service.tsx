import axios from '@api/axios'

// Get Tags
export function getTags(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/tag',
    params,
  })
}

// Add Tags
export function addTags(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/tag',
    params,
  })
}

// Edit Tags
export function editTags(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `help-desk/tag/${guid}`,
    data: params,
  })
}

// Delete Tags
export function deleteTag(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/tag/${guid}`,
  })
}

// Bulk Delete Tag
export function bulkDeleteTags(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/tag/bulk-delete',
    data: params,
  })
}

// Export Tag
export function exportTag(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/tag/export',
    params,
  })
}

//Detail Tags

export function detailTags(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/tag/${guid}`,
  })
}

export function getTagsOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/tag/option',
    params,
  })
}
