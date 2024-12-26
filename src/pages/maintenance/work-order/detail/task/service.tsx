import axios from '@api/axios'

export function createTaskWO(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-task',
    data: params,
  })
}

export function updateTaskWO(params: any) {
  return axios({
    method: 'put',
    url: 'maintenance-task',
    data: params,
  })
}

export function deleteTaskWO(guid: any) {
  return axios({
    method: 'delete',
    url: `maintenance-task/${guid}`,
  })
}

export function updateValueWO(params: any) {
  return axios({method: 'put', url: 'maintenance-task/value', data: params})
}

export function listTask(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance/${guid}`,
  })
}

// Andpoint for dropdown Task Type
export function listTypeDropdown() {
  return axios({
    method: 'get',
    url: `maintenance-task/type`,
  })
}
