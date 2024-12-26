import axios from '@api/axios'

export function getTickets(params: any) {
  return axios({
    method: 'GET',
    url: 'help-desk/ticket',
    params,
  })
}

export function getTicketDetail(guid: any) {
  return axios({
    method: 'GET',
    url: `help-desk/ticket/${guid}`,
  })
}

export function addTicket(data: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/ticket',
    data,
  })
}

export function editTicket(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}`,
    data,
  })
}

export function deleteTicket(guid: any) {
  return axios({
    method: 'DELETE',
    url: `help-desk/ticket/${guid}`,
  })
}

export function deleteBulkTicket(params: any) {
  return axios({
    method: 'POST',
    url: 'bulk-delete/ticket',
    data: params,
  })
}

export function getDatabaseTicket(data: object) {
  return axios({
    method: 'GET',
    url: 'setting/database/ticket',
    data,
  })
}

export function getListType(params: object) {
  return axios({
    method: 'get',
    url: 'help-desk/ticket-type',
    params,
  })
}

export function getPriority(data: object) {
  return axios({
    method: 'GET',
    url: 'help-desk/ticket/list-priority',
    data,
  })
}

export function getReportChannel(data: object) {
  return axios({
    method: 'GET',
    url: 'help-desk/ticket/report-channel',
    data,
  })
}

export function getTicketColumn() {
  return axios({
    method: 'GET',
    url: 'help-desk/ticket/setup-column',
  })
}

export function updateTicketColumn(data: object) {
  return axios({
    method: 'POST',
    url: 'help-desk/ticket/setup-column',
    data,
  })
}

export function ticketExport(params: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/ticket/export',
    params,
  })
}

export function printTicket(guid: any, params: any) {
  return axios({
    method: 'get',
    url: `help-desk/ticket/${guid}/print`,
    params,
  })
}

export function updateBookmark(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/bookmark`,
    data,
  })
}

export function updateFlag(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/flag`,
    data,
  })
}

export function updateArchive(data: any, guid: any) {
  return axios({
    method: 'put',
    url: `help-desk/ticket/${guid}/archive`,
    data,
  })
}

export function updateSpam(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/spam`,
    data,
  })
}

export function updatePending(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/pending`,
    data,
  })
}

export function getListFilter() {
  return axios({
    method: 'GET',
    url: 'help-desk/ticket/list-filter',
  })
}

export function getReporter(params: object) {
  return axios({
    method: 'GET',
    url: 'help-desk/contact',
    params,
  })
}

export function assignTo(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/assign-to`,
    data,
  })
}

export function updateApproval(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/approve-reject`,
    data,
  })
}

export function updateStatus(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/update-status`,
    data,
  })
}

export function processLog(guid: any, params: any) {
  return axios({
    method: 'GET',
    params,
    url: `help-desk/ticket/${guid}/history`,
  })
}

export function getConversation(guid: any, params: any) {
  return axios({
    method: 'GET',
    url: `help-desk/ticket/${guid}/conversation`,
    params,
  })
}

export function sendForward(guid: any, params: any) {
  return axios({
    method: 'POST',
    data: params,
    url: `help-desk/ticket/${guid}/forward`,
  })
}

export function getComment(guid: any, params: any) {
  return axios({
    method: 'GET',
    url: `help-desk/ticket/${guid}/comment_box`,
    params,
  })
}

export function sendComment(guid: any, params: any) {
  return axios({
    method: 'POST',
    data: params,
    url: `help-desk/ticket/${guid}/comment_box`,
  })
}

export function sendUnLinkTicket(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/unlinks`,
    data,
  })
}

export function sendLinkTicket(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/links`,
    data,
  })
}

export function sendReplyTicket(guid: any, params: any) {
  return axios({
    method: 'post',
    url: `help-desk/ticket/${guid}/reply`,
    data: params,
  })
}

export function getTodoByTicket(params: object) {
  return axios({
    method: 'GET',
    url: `help-desk/ticket/to-do`,
    params,
  })
}

export function addTodo(params: object) {
  return axios({
    method: 'POST',
    url: `help-desk/ticket/to-do`,
    data: params,
  })
}

export function editTodo(guid: any, params: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/to-do/${guid}`,
    data: params,
  })
}

export function deleteTodo(guid: any) {
  return axios({
    method: 'DELETE',
    url: `help-desk/ticket/to-do/${guid}`,
  })
}

export function updateStatusTodo(params: object) {
  return axios({
    method: 'POST',
    url: `help-desk/ticket/to-do/update-status`,
    data: params,
  })
}

export function getWatcherTicket(params: object) {
  return axios({
    method: 'GET',
    url: `help-desk/ticket-watch`,
    params,
  })
}

export function getUserWatcher(ticket_guid: any) {
  return axios({
    method: 'GET',
    url: `help-desk/ticket-watch/${ticket_guid}/list-user`,
  })
}

export function addWatcherTicket(data: object) {
  return axios({
    method: 'POST',
    url: `help-desk/ticket-watch`,
    data,
  })
}

export function removeWatcherTicket(watcher_guid: any) {
  return axios({
    method: 'DELETE',
    url: `help-desk/ticket-watch/${watcher_guid}`,
  })
}

export function timeLog(params: object) {
  return axios({
    method: 'GET',
    url: `help-desk/time-log`,
    params,
  })
}

export function addTimeLog(data: object) {
  return axios({
    method: 'POST',
    url: `help-desk/time-log`,
    data,
  })
}

export function editTimeLog(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/time-log/${guid}`,
    data,
  })
}

export function deleteTimeLog(guid: any) {
  return axios({
    method: 'DELETE',
    url: `help-desk/time-log/${guid}`,
  })
}

export function updateTimer(time_log_guid: object, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/time-log/${time_log_guid}/update-time`,
    data,
  })
}

export function sendEmailDetail(params: any, guid: any) {
  return axios({
    method: 'post',
    url: `help-desk/ticket/${guid}/send-email`,
    data: params,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/ticket/option',
    params,
  })
}

export function sendTicketAssetLinked(guid: string, params: any) {
  return axios({
    method: 'put',
    url: `help-desk/ticket/${guid}/asset/links`,
    data: params,
  })
}

export function removeTicketAssetLinked(guid: string, params: any) {
  return axios({
    method: 'put',
    url: `help-desk/ticket/${guid}/asset/unlinks`,
    data: params,
  })
}

export function getTicketAssetLinked(guid: string) {
  return axios({
    method: 'get',
    url: `help-desk/ticket/${guid}/asset-linked`,
  })
}

export function closeTicket(guid: string, params: any) {
  return axios({
    method: 'put',
    url: `help-desk/ticket/${guid}/close`,
    data: params,
  })
}

export function sendLinkForum(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/forum/links`,
    data,
  })
}
export function sendUnLinkForum(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `help-desk/ticket/${guid}/forum/unlinks`,
    data,
  })
}
