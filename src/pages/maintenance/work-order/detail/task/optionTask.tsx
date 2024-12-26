import Tooltip from '@components/alert/tooltip'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {arrayConcat, configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import {FC, useEffect, useState} from 'react'
import Select from 'react-select'

import {listTypeDropdown} from './service'

const OptionTask: FC<any> = ({
  setFieldValue,
  detail,
  setShowModalDelete,
  setGuid,
  setTypeChecklist,
  type,
  dataNewTasks,
}) => {
  const [optWorker, setOptWorker] = useState<any>([])
  const [optionTask, setOptionTask] = useState<any>({})

  useEffect(() => {
    const {worker, additional_worker} = detail || {}
    if (worker && additional_worker) {
      const dataWorker: any = arrayConcat([worker], additional_worker)
      const res: any = dataWorker?.map(({guid, name}: any) => ({
        value: guid || '',
        label: name || '',
      }))
      setOptWorker(res as never[])
    }
  }, [detail])

  useEffect(() => {
    listTypeDropdown().then(({data: {data}}: any) => {
      data && setOptionTask(data)
    })
  }, [])

  return (
    <div className='row'>
      {dataNewTasks &&
        dataNewTasks?.length > 0 &&
        dataNewTasks?.map((item: any, key: number) => {
          return (
            <div className='col-12 mt-3' key={key}>
              <div className='shadow p-3 mt-1 rounded'>
                <div className='row align-items-center'>
                  <label className='col-3 required'>Task Name</label>
                  <div className='col-7'>
                    <Field
                      type='text'
                      name={`name-${item?.order}`}
                      className={configClass?.form}
                      placeholder='Add Task'
                    />

                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='name' />
                    </div>
                  </div>

                  <div className='col-2 border-start border-1'>
                    <Tooltip placement='top' title='Delete'>
                      <div
                        className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger border border-dashed border-danger shadow-sm'
                        onClick={() => {
                          setTypeChecklist(type)
                          setShowModalDelete(true)
                          setGuid(item?.order || null)
                        }}
                      >
                        <i className='fa fa-lg fa-trash-alt text-danger'></i>
                      </div>
                    </Tooltip>
                  </div>

                  <label className='col-3 required'>Description</label>
                  <div className='col-7'>
                    <Field
                      type='text'
                      name={`description-${item?.order}`}
                      className={configClass?.form}
                      placeholder='Description Task'
                    />

                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='description' />
                    </div>
                  </div>
                  <div className='col-2'>&nbsp;</div>

                  <label className='col-3 required'>Worker</label>
                  <div className='col-7'>
                    <Select
                      options={optWorker}
                      placeholder='Select Worker'
                      name={`user_guid-${item?.order}`}
                      components={{ClearIndicator, DropdownIndicator}}
                      styles={customStyles(true, {option: {color: 'black'}})}
                      onChange={({value}: any) => {
                        setFieldValue(`user_guid-${item?.order}`, value || '')
                      }}
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='unique_id' />
                    </div>
                  </div>
                  <div className='col-2'>&nbsp;</div>

                  <label className='col-3 required'>Data Type</label>
                  <div className='col-7'>
                    <Select
                      placeholder='Select Type'
                      name={`task_status_guid-${item?.order}`}
                      components={{ClearIndicator, DropdownIndicator}}
                      styles={customStyles(true, {option: {color: 'black'}})}
                      onChange={({value}: any) =>
                        setFieldValue(`task_status_guid-${item?.order}`, value || '')
                      }
                      options={Object.keys(optionTask)?.map((item: any) => {
                        return {
                          value: item || '',
                          label: optionTask?.[item] || '',
                        }
                      })}
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='options' />
                    </div>
                  </div>
                  <div className='col-2'>&nbsp;</div>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export {OptionTask}
