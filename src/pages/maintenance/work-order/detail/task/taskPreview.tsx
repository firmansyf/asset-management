import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import Select from 'react-select'

import {listTask} from './service'

const TaskPreview: FC<any> = ({
  detail,
  reload,
  checklist,
  values,
  clickChecklist,
  clickTask,
  loadingDeleteTasks,
  dataNewTasks,
}) => {
  const {guid} = detail || {}

  const [taskData, setTaskData] = useState<any>([])
  const [loadingTask, setLoadingTask] = useState<boolean>(true)
  const [taskDataChecklist, setTaskDataChecklist] = useState<any>([])

  const subTaskValue: any = ['Open', 'On Hold', 'In Progress', 'Completed']

  useEffect(() => {
    if (clickChecklist && checklist?.length > 0) {
      const data: any = []
      checklist?.forEach((item: any) => {
        data?.push(item)
      })
      setTaskDataChecklist(data as never[])
    }
  }, [checklist, clickChecklist, loadingDeleteTasks])

  useEffect(() => {
    if (!clickChecklist && !clickTask) {
      setTaskData([])
      setTaskDataChecklist([])
    }
  }, [clickChecklist, clickTask])

  useEffect(() => {
    setLoadingTask(false)
    setTimeout(() => setLoadingTask(true), 500)

    !clickChecklist && setTaskDataChecklist([])

    setLoadingTask(false)
    setTimeout(() => setLoadingTask(true), 500)
  }, [clickChecklist])

  useEffect(() => {
    clickTask &&
      listTask(guid).then(
        ({
          data: {
            data: {tasks},
          },
        }: any) => {
          tasks && setTaskData(tasks as never[])
        }
      )
  }, [reload, guid, clickTask, loadingDeleteTasks])

  return (
    <div className='row py-5 mx-1'>
      {loadingTask &&
        dataNewTasks &&
        dataNewTasks?.length > 0 &&
        dataNewTasks?.map((item: any, index: number) => {
          const nameTaskGuid: any = values?.['task_status_guid-' + item?.order]
          let optionsCustom: any = []
          if (nameTaskGuid === 'select_dropdown') {
            if (item?.option !== null && item?.option !== undefined && item?.option?.length > 0) {
              const dataOpt: any = item?.option?.map((val: any) => ({
                value: val || '',
                label: val || '',
              }))
              optionsCustom = dataOpt
            }
          } else if (nameTaskGuid === 'sub_task_status') {
            if (subTaskValue && subTaskValue?.length > 0) {
              const dataOpt: any = subTaskValue?.map((val: any) => ({
                value: val || '',
                label: val || '',
              }))
              optionsCustom = dataOpt
            }
          } else {
            optionsCustom = []
          }

          return (
            <div className='col-12' key={index}>
              <div className='card border border-gray-300 mt-5'>
                <div className='card-body row'>
                  <div className='col-12 fw-bolder'>
                    <i className='fas fa-lg fa-clipboard-list text-black me-3'></i>
                    Task Preview
                  </div>
                  <div className='col-12 pt-5'>
                    <p className='pt-1'>{values?.['name-' + item?.order] || '-'}</p>
                  </div>
                  <div className='col-12 py-2'>
                    {nameTaskGuid === 'select_dropdown' || nameTaskGuid === 'sub_task_status' ? (
                      <Select
                        options={optionsCustom}
                        name='text'
                        defaultValue={`${
                          item?.option !== null && item?.option?.length > 0
                            ? item?.option?.[0]
                            : 'Open'
                        }`}
                      />
                    ) : nameTaskGuid === 'number' ? (
                      <input
                        type='number'
                        name='text'
                        className={configClass?.form}
                        style={{height: '38px', fontSize: '12px'}}
                      />
                    ) : nameTaskGuid === 'text' ? (
                      <input
                        type='text'
                        name='text'
                        className={configClass?.form}
                        style={{height: '38px', fontSize: '12px'}}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      {loadingTask &&
        taskData &&
        taskData?.length > 0 &&
        taskData?.map((item: any, index: number) => {
          let optionsCustom: any = []
          if (item?.field_type === 'select_dropdown') {
            if (item?.option !== null && item?.option !== undefined && item?.option?.length > 0) {
              const dataOpt: any = item?.option?.map((val: any) => ({
                value: val || '',
                label: val || '',
              }))
              optionsCustom = dataOpt
            }
          } else if (item?.field_type === 'sub_task_status') {
            if (subTaskValue && subTaskValue?.length > 0) {
              const dataOpt: any = subTaskValue?.map((val: any) => ({
                value: val || '',
                label: val || '',
              }))
              optionsCustom = dataOpt
            }
          } else {
            optionsCustom = []
          }

          return (
            <div className='col-12' key={index}>
              <div className='card border border-gray-300 mt-5'>
                <div className='card-body row'>
                  <div className='col-12 fw-bolder'>
                    <i className='fas fa-lg fa-clipboard-list text-black me-3'></i>
                    Task Preview
                  </div>

                  <div className='col-12 pt-5'>
                    <p className='pt-1'>{item?.name || '-'}</p>
                  </div>

                  <div className='col-12 py-2'>
                    {item?.field_type === 'select_dropdown' ||
                    item?.field_type === 'sub_task_status' ? (
                      <Select
                        options={optionsCustom}
                        name='text'
                        defaultValue={`${
                          item?.option !== null && item?.option?.length > 0
                            ? item?.option?.[0]
                            : 'Open'
                        }`}
                      />
                    ) : item?.field_type === 'number' ? (
                      <input
                        type='number'
                        name='text'
                        className={configClass?.form}
                        style={{height: '38px', fontSize: '12px'}}
                      />
                    ) : item?.field_type === 'text' ? (
                      <input
                        type='text'
                        name='text'
                        className={configClass?.form}
                        style={{height: '38px', fontSize: '12px'}}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      {loadingTask &&
        taskDataChecklist &&
        taskDataChecklist?.length > 0 &&
        taskDataChecklist?.map((item: any, index: number) => {
          let optionsCustom: any = []
          if (item?.field_type === 'select_dropdown') {
            if (item?.option !== null && item?.option !== undefined && item?.option?.length > 0) {
              const dataOpt: any = item?.option?.map((val: any) => ({
                value: val || '',
                label: val || '',
              }))
              optionsCustom = dataOpt
            }
          } else if (item?.field_type === 'sub_task_status') {
            if (subTaskValue && subTaskValue?.length > 0) {
              const dataOpt: any = subTaskValue?.map((val: any) => ({
                value: val || '',
                label: val || '',
              }))
              optionsCustom = dataOpt
            }
          } else {
            optionsCustom = []
          }

          return (
            <div className='col-12' key={index}>
              <div className='card border border-gray-300 mt-5'>
                <div className='card-body row'>
                  <div className='col-12 fw-bolder'>
                    <i className='fas fa-lg fa-clipboard-list text-black me-3'></i>
                    Task Preview
                  </div>

                  <div className='col-12 pt-5'>
                    <p className='pt-1'>{item?.name || '-'}</p>
                  </div>

                  <div className='col-12 py-2'>
                    {item?.field_type === 'select_dropdown' ||
                    item?.field_type === 'sub_task_status' ? (
                      <Select
                        options={optionsCustom}
                        name='text'
                        defaultValue={`${
                          item?.option !== null && item?.option?.length > 0
                            ? item?.option?.[0]
                            : 'Open'
                        }`}
                      />
                    ) : item?.field_type === 'number' ? (
                      <input
                        type='number'
                        name='text'
                        className={configClass?.form}
                        style={{height: '38px', fontSize: '12px'}}
                      />
                    ) : item?.field_type === 'text' ? (
                      <input
                        type='text'
                        name='text'
                        className={configClass?.form}
                        style={{height: '38px', fontSize: '12px'}}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      {loadingTask &&
        dataNewTasks?.length === 0 &&
        taskData?.length === 0 &&
        taskDataChecklist?.length === 0 && (
          <div className='col-12'>
            <div className='card border border-gray-300 mt-5'>
              <div className='card-body fw-bolder'>
                <div className='col-12'>
                  <i className='fas fa-lg fa-clipboard-list text-black me-3'></i>
                  Task Preview
                </div>
                <div className='col-12 pt-5'>
                  <p className='pt-1'>-</p>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export {TaskPreview}
