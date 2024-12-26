import {getUserV1} from '@api/UserCRUD'
import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {
  deleteMaintenanceTask,
  editWorkOrder,
  getMaintenanceTaskStatus,
  putMaintenanceTask,
  setMaintenanceTask,
} from '@pages/maintenance/Service'
import cx from 'classnames'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import * as Yup from 'yup'

import AddTasks from './addTasks'

const TasksSchema = Yup.object().shape({
  name: Yup.string().required('Tasks name is required'),
})

let Tasks: FC<any> = ({detail, setReload, reload}) => {
  const [data, setData] = useState<any>({})
  const [reloadTasks, setReloadTasks] = useState(0)
  const [showDeleteTasks, setShowDeleteTasks] = useState<any>(false)
  const [tasksSelected, setTasksSelected] = useState<any>({})
  const [loadingTasks, setLoadingTasks] = useState<any>(false)
  const [loadingSaveTasks, setLoadingSaveTasks] = useState<any>(false)
  const [guidOpen, setGuidOpen] = useState<any>('')
  const [guidClose, setGuidClose] = useState<any>('')

  const [showEditReminder, setEditShowReminder] = useState<any>(false)

  const initialValue = {
    name: '',
    user_guid: 'private',
  }

  useEffect(() => {
    getMaintenanceTaskStatus({})
      .then(({data: {data: res}}: any) => {
        if (res) {
          const openItem: any = res?.find(({unique_id}: any) => unique_id === 'open')
          const closeItem: any = res?.find(({unique_id}: any) => unique_id === 'close')
          openItem !== undefined && setGuidOpen(openItem?.guid)
          closeItem !== undefined && setGuidClose(closeItem?.guid)
        }
      })
      .catch(() => '')
  }, [])

  const estimation = (duration: any) => {
    const {day, hour, minute} = duration || {}
    let res = 0
    if (duration) {
      res = res + day * 144
      res = res + hour * 60
      res = res + minute
    }
    return duration?.minute !== undefined ? res : duration || 0
  }

  const handleOnSubmit = (value: any, {resetForm}: any) => {
    if (detail?.guid) {
      setLoadingSaveTasks(true)
      setLoadingTasks(true)

      const params: any = {
        maintenance_guid: detail?.guid || '',
        tasks: [
          {
            name: value?.name || '',
            description: '-',
            field_type: 'text',
            user_guid: value?.user_guid?.value || null,
            task_status_guid: guidOpen || null,
          },
        ],
      }

      setMaintenanceTask(params)
        .then((res: any) => {
          if (res) {
            editWorkOrder(
              {
                duration: estimation(detail?.duration) || 0,
                // maintenance_status_guid: detail?.status?.guid || null,
                manual_started_at:
                  detail?.manual_started_at !== null
                    ? moment(detail?.manual_started_at).format('YYYY-MM-DD')
                    : '',
                manual_ended_at:
                  detail?.manual_ended_at !== null
                    ? moment(detail?.manual_ended_at).format('YYYY-MM-DD')
                    : '',
                start_date:
                  detail?.manual_started_at !== null
                    ? moment(detail?.manual_started_at).format('YYYY-MM-DD')
                    : moment().format('YYYY-MM-DD'),
                end_date:
                  detail?.manual_ended_at !== null
                    ? moment(detail?.manual_ended_at).format('YYYY-MM-DD')
                    : moment().add(1, 'day').format('YYYY-MM-DD'),
                duedate:
                  detail?.duedate !== null && detail?.manual_started_at !== null
                    ? moment(detail?.duedate).format('YYYY-MM-DD')
                    : moment().add(2, 'days').format('YYYY-MM-DD'),
                title: detail?.wo_title || '',
                description: detail?.description || '',
                tasks: res?.data?.guid,
                asset_guid: detail?.asset?.guid || '',
                location_guid: detail?.location?.guid || '',
              },
              detail?.guid
            )
              .then(() => {
                setLoadingSaveTasks(false)
                ToastMessage({type: 'success', message: res?.data?.message})
                setReloadTasks(reloadTasks + 1)
                setLoadingTasks(false)
                setReload(!reload)
              })
              .catch((err: any) => {
                setLoadingSaveTasks(false)
                setLoadingTasks(false)
                ToastMessage({type: 'error', message: err?.response?.data?.message})
              })
          }
        })
        .catch((err: any) => {
          setLoadingSaveTasks(false)
          setLoadingTasks(false)

          if (err.response) {
            const {devMessage, data, message} = err?.response?.data || {}
            if (!devMessage) {
              const {fields} = data || {}
              if (fields === undefined) {
                ToastMessage({message: message, type: 'error'})
              }
              if (fields) {
                Object.keys(fields || {})?.map((item: any) => {
                  ToastMessage({message: fields[item]?.[0], type: 'error'})
                  return true
                })
              }
            } else {
              ToastMessage({message: message, type: 'error'})
            }
          }
        })

      resetForm({values: ''})
    }
  }

  const handleDelete = () => {
    if (tasksSelected?.guid) {
      setLoadingTasks(true)
      deleteMaintenanceTask(tasksSelected?.guid)
        .then((res: any) => {
          setLoadingTasks(false)
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadTasks(reloadTasks + 1)
          setShowDeleteTasks(false)
          setLoadingTasks(false)
          setReload(!reload)
        })
        .catch((err: any) => {
          setLoadingTasks(false)
          ToastMessage({type: 'success', message: err?.response?.data?.message})
        })
    }
  }

  const setEditRemender = (item: any) => {
    setEditShowReminder(true)
    setTasksSelected(item)
  }

  const updateStatus = (status: any, item: any) => {
    const {guid, name, user} = item || {}
    const params: any = {
      tasks: [
        {
          guid: guid || '',
          name: name || '',
          description: '-',
          field_type: 'text',
          user_guid: user?.guid || null,
          task_status_guid: status ? guidClose : guidOpen,
        },
      ],
    }

    if (guid) {
      putMaintenanceTask(params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadTasks(reloadTasks + 1)
          setReload(!reload)
        })
        .catch(() => '')
    }
  }

  const msg_alert_remove = [
    'Are you sure want to delete ',
    <strong key='str1' style={{width: '450px', wordWrap: 'break-word'}}>
      {tasksSelected?.name}
    </strong>,
    ' ?',
  ]

  useEffect(() => {
    if (detail?.guid !== undefined) {
      setData(detail?.tasks)
    }
  }, [detail?.guid, detail?.tasks, reloadTasks])

  return (
    <>
      <div className='card border border-gray-300 mt-4'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='tasks' default='tasks'>
            <div className='' data-value='tasks' data-label={`List Task`}>
              <div className='row'>
                <Formik
                  validationSchema={TasksSchema}
                  initialValues={initialValue}
                  enableReinitialize
                  onSubmit={(values: any, {resetForm}) => handleOnSubmit(values, {resetForm})}
                >
                  {({setFieldValue}) => {
                    return (
                      <Form className='justify-content-center' noValidate>
                        <div className='row mb-4'>
                          <div className='col-1'>
                            <Button
                              className='h-25px w-25px btn-icon btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center'
                              type='submit'
                              data-cy='saveTask'
                              style={{marginTop: 8}}
                            >
                              {loadingSaveTasks && (
                                <span className='indicator-progress' style={{display: 'block'}}>
                                  <span className='spinner-border spinner-border-sm align-middle'></span>
                                </span>
                              )}

                              {!loadingSaveTasks && <i className='fas fa-plus text-white' />}
                            </Button>
                          </div>
                          <div className='col-6'>
                            <Field
                              name='name'
                              type='text'
                              placeholder='Add Task'
                              maxLength='50'
                              data-cy='nameTask'
                              className={configClass?.form}
                            />
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='name' />
                            </div>
                          </div>
                          <div className='col-5'>
                            {!loadingTasks && (
                              <Select
                                sm={'sm'}
                                key={'user_guid'}
                                api={getUserV1}
                                params={{
                                  orderCol: 'first_name',
                                  orderDir: 'asc',
                                  'filter[role_name]': 'worker' || '-',
                                }}
                                reload={false}
                                placeholder='Assign Worker'
                                defaultValue={{
                                  value: data?.user?.guid || null,
                                  label: data?.user?.name || '',
                                }}
                                onChange={(e: any) => {
                                  setFieldValue('user_guid', e)
                                }}
                                parse={(e: any) => {
                                  return {
                                    value: e?.guid,
                                    label: `${e?.first_name} ${e?.last_name}`,
                                  }
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </Form>
                    )
                  }}
                </Formik>
                <hr />
              </div>
              <div className='row'>
                {data?.length > 0 &&
                  data?.map((item: any, index: any) => {
                    const {guid, name, user, status} = item || {}
                    const status_chekced: any = status?.unique_id === 'close' ? true : false

                    return (
                      <div
                        className='col-12 mb-3 pb-3'
                        style={{
                          borderBottom: '1px',
                          borderBottomColor: '#CBCAD0',
                          borderBottomStyle: 'dashed',
                        }}
                        key={index}
                      >
                        <div className='row'>
                          <div className='col-1'>
                            <div className='form-check form-check-custom form-check-solid'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                name={guid}
                                defaultChecked={status_chekced}
                                onChange={(e: any) => {
                                  updateStatus(e.target.checked, item)
                                }}
                              />
                            </div>
                          </div>

                          <div className='col-3'>
                            <p style={{marginBottom: '0px', fontSize: '11px'}}>
                              {status?.unique_id === 'close' ? (
                                <span style={{color: 'gray'}}>
                                  <del>{name}</del>
                                </span>
                              ) : (
                                <span>{name}</span>
                              )}
                            </p>
                          </div>

                          <div className='col-3'>
                            <p style={{marginBottom: '0px', fontSize: '11px'}}>
                              {status?.unique_id === 'close' ? (
                                <span style={{color: 'gray'}}>
                                  <del>{user?.name}</del>
                                </span>
                              ) : (
                                <span>{user?.name}</span>
                              )}
                            </p>
                          </div>

                          <div className='col-2'>
                            <p style={{marginBottom: '0px', fontSize: '11px'}}>
                              {status?.unique_id === 'close' ? (
                                <span style={{color: 'gray'}}>
                                  <del>{status?.name}</del>
                                </span>
                              ) : (
                                <span>{status?.name}</span>
                              )}
                            </p>
                          </div>

                          <div className='col-3 float-right'>
                            <Tooltip placement='top' title='Edit'>
                              <span
                                data-cy='editTasks'
                                className={cx(
                                  'btn btn-sm btn-icon border border-dashed h-30px w-30px radius-10 mx-1 btn-light-warning border-warning'
                                )}
                                onClick={() => {
                                  setEditRemender(item)
                                }}
                                style={{cursor: 'pointer'}}
                              >
                                <i className={`las la-pen-nib fs-3`} />
                              </span>
                            </Tooltip>
                            <Tooltip placement='top' title='Delete'>
                              <span
                                data-cy='deleteTasks'
                                className={cx(
                                  'btn btn-sm btn-icon border border-dashed h-30px w-30px radius-10 mx-1 btn-light-danger border-danger'
                                )}
                                onClick={() => {
                                  setShowDeleteTasks(true)
                                  setTasksSelected(item)
                                }}
                                style={{cursor: 'pointer'}}
                              >
                                <i className={`las la-trash-alt fs-3`} />
                              </span>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      <Alert
        key={`delete-task-0`}
        setShowModal={setShowDeleteTasks}
        showModal={showDeleteTasks}
        loading={loadingTasks}
        body={msg_alert_remove}
        type={'delete'}
        title={[
          'Delete ',
          <div key='str2' style={{width: '450px', wordWrap: 'break-word'}}>
            {tasksSelected?.name}
          </div>,
        ]}
        confirmLabel={'Delete'}
        onConfirm={() => {
          handleDelete()
        }}
        onCancel={() => {
          setShowDeleteTasks(false)
        }}
      />

      <AddTasks
        setShowModal={setEditShowReminder}
        showModal={showEditReminder}
        data={tasksSelected}
        setReloadTasks={setReloadTasks}
        reloadTasks={reloadTasks}
        setReload={setReload}
        reload={reload}
      />
    </>
  )
}

Tasks = memo(Tasks, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Tasks
