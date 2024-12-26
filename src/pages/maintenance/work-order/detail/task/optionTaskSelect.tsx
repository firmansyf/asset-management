import Tooltip from '@components/alert/tooltip'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {arrayConcat, configClass} from '@helpers'
import {ErrorMessage, Field} from 'formik'
import {FC, useEffect, useState} from 'react'
import Select from 'react-select'

import {listTypeDropdown} from './service'

const OptionTaskSelect: FC<any> = ({
  setFieldValue,
  tasks,
  detail,
  setShowModalDelete,
  setGuid,
  setTypeChecklist,
  type,
}) => {
  const [optionTask, setOptionTask] = useState<any>({})
  const [optWorker, setOptWorker] = useState<any>([])
  useEffect(() => {
    const dataWorker = arrayConcat([detail?.worker], detail?.additional_worker)
    const res: any = dataWorker?.map(({guid, name}: any) => {
      return {
        value: guid,
        label: name,
      }
    })
    setOptWorker(res)
  }, [detail])

  useEffect(() => {
    listTypeDropdown().then(({data: {data}}: any) => {
      setOptionTask(data)
    })
  }, [])

  useEffect(() => {
    tasks &&
      tasks?.length > 0 &&
      tasks?.forEach((item: any) => {
        setFieldValue(`name-${item?.guid}`, item?.name || '')
        setFieldValue(`description-${item?.guid}`, item?.description || '')
        setFieldValue(`user_guid-${item?.guid}`, item?.user?.guid || '')
        setFieldValue(`task_status_guid-${item?.guid}`, item?.field_type || '')
      })
  }, [tasks, setFieldValue])

  return (
    <div className='row'>
      {tasks &&
        tasks?.length > 0 &&
        tasks?.map((item: any, index: number) => {
          return (
            <div className='col-12 mt-3' key={index}>
              <div className='shadow p-3 mt-1 rounded'>
                <div className='row align-items-center'>
                  <label className='col-3'>Task Name</label>
                  <div className='col-7'>
                    <Field
                      type='text'
                      name={`name-${item?.guid}`}
                      className={configClass?.form}
                      placeholder='Add Task'
                    />

                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name={`name-${item?.guid}`} />
                    </div>
                  </div>

                  <div className='col-2 border-start border-1'>
                    <Tooltip placement='top' title='Delete'>
                      <div
                        className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger border border-dashed border-danger shadow-sm'
                        onClick={() => {
                          setShowModalDelete(true)
                          setGuid(item?.guid)
                          setTypeChecklist(type)
                        }}
                      >
                        <i className='fa fa-lg fa-trash-alt text-danger'></i>
                      </div>
                    </Tooltip>
                  </div>

                  <label className='col-3'>Description</label>
                  <div className='col-7'>
                    <Field
                      type='text'
                      name={`description-${item?.guid}`}
                      className={configClass?.form}
                      placeholder='Description Task'
                    />

                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name={`description-${item?.guid}`} />
                    </div>
                  </div>
                  <div className='col-2'>&nbsp;</div>

                  <label className='col-3'>Worker</label>
                  <div className='col-7'>
                    <Select
                      options={optWorker}
                      placeholder='Select Worker'
                      name={`user_guid-${item?.guid}`}
                      defaultValue={{value: item?.user?.guid, label: item?.user?.name}}
                      components={{ClearIndicator, DropdownIndicator}}
                      styles={customStyles(true, {option: {color: 'black'}})}
                      onChange={({value}: any) =>
                        setFieldValue(`user_guid-${item?.guid}`, value || '')
                      }
                    />

                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='unique_id' />
                    </div>
                  </div>
                  <div className='col-2'>&nbsp;</div>

                  <label className='col-3'>Data Type</label>
                  <div className='col-7'>
                    {Object.keys(optionTask) && Object.keys(optionTask)?.length > 0 && (
                      <Select
                        name={`task_status_guid-${item?.guid}`}
                        options={Object.keys(optionTask || {})?.map((item: any) => {
                          return {
                            value: item || '',
                            label: optionTask?.[item] || '',
                          }
                        })}
                        placeholder='Select Type'
                        defaultValue={{
                          value: item?.field_type,
                          label: optionTask?.[item?.field_type],
                        }}
                        onChange={({value}: any) => {
                          setFieldValue(`task_status_guid-${item?.guid}`, value || '')
                        }}
                        styles={customStyles(true, {option: {color: 'black'}})}
                        components={{ClearIndicator, DropdownIndicator}}
                      />
                    )}

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

export {OptionTaskSelect}
