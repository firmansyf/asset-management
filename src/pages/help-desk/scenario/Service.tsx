import axios from '@api/axios'

export function listAction() {
  return axios({
    method: 'get',
    url: 'help-desk/scenario/list-action',
  })
}

export function getScenario(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/scenario',
    params,
  })
}

export function addScenario(data: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/scenario',
    data,
  })
}

export function editScenario(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/scenario/${guid}`,
    data,
  })
}

export function detailScenario(guid: any) {
  return axios(`help-desk/scenario/${guid}`)
}

export function deleteScenario(guid: any) {
  return axios({
    method: 'DELETE',
    url: `help-desk/scenario/${guid}`,
  })
}

export function deleteBulkScenario(data: any) {
  return axios({
    method: 'post',
    url: 'bulk-delete/scenario',
    data,
  })
}

export function exportScenario(data: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/scenario/export',
    data,
  })
}

export function executeScenario(ticket_guid: any, scenario_guid: any) {
  return axios({
    method: 'put',
    url: `help-desk/scenario/${ticket_guid}/${scenario_guid}`,
  })
}

export function getScenarioOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/scenario/option',
    params,
  })
}
