import axios from '@api/axios'

export function AddForums(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/forum/discussion',
    data: params,
  })
}

export function EditForums(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `help-desk/forum/discussion/${guid}`,
    data: params,
  })
}

export function getForumCategory() {
  return axios({
    method: 'get',
    url: 'help-desk/forum/discussion/categories',
  })
}

export function getForumDisscussion(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/forum/discussion',
    params,
  })
}

export function getForumDetails(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/forum/discussion/${guid}`,
  })
}

export function deleteDisscussionForum(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/forum/discussion/${guid}`,
  })
}

export function replyDisscussionForum(guid: any, params: any) {
  return axios({
    method: 'post',
    url: `help-desk/forum/discussion/${guid}/reply`,
    data: params,
  })
}

export function convertToForum(params: any) {
  return axios({
    method: 'post',
    url: `help-desk/forum/discussion/convert`,
    data: params,
  })
}
