import {Accordion} from '@components/Accordion'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import cx from 'classnames'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, Fragment, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import * as Yup from 'yup'

import EditRemenderModal from '../form/EditRemenderModal'
import SetRemenderModal from '../form/SetRemenderModal'
import {addTodo, deleteTodo, getTodoByTicket, updateStatusTodo} from '../Service'

const TodoSchema = Yup.object().shape({
  todo_name: Yup.string().required('Todo name is required'),
})

let TicketToDo: FC<any> = ({detailTicket}) => {
  const [data, setData] = useState<any>({})
  const [reloadToDo, setReloadToDo] = useState(0)
  const [showDeleteTodo, setShowDeleteTodo] = useState<any>(false)
  const [todoSelected, setTodoSelected] = useState<any>({})
  const [loadingTodo, setLoadingTodo] = useState<any>(false)
  const [loadingSaveTodo, setLoadingSaveTodo] = useState<any>(false)

  const [showReminder, setShowReminder] = useState<any>(false)
  const [showEditReminder, setEditShowReminder] = useState<any>(false)

  const initialValue = {
    todo_name: '',
    todo_as: 'private',
  }

  const handleOnSubmit = (value: any, {resetForm}: any) => {
    if (detailTicket?.guid) {
      setLoadingSaveTodo(true)
      const params = {
        ticket_guid: detailTicket?.guid,
        name: value.todo_name,
        type: value.todo_as,
        // date_notif: ""
      }

      addTodo(params)
        .then((res: any) => {
          setLoadingSaveTodo(false)
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadToDo(reloadToDo + 1)
          setLoadingTodo(false)
        })
        .catch((err: any) => {
          setLoadingSaveTodo(false)
          const {data} = err?.response?.data
          if (data.fields !== undefined) {
            const error = data.fields
            for (const key in error) {
              const value = error[key]
              ToastMessage({type: 'error', message: value[0]})
            }
          } else {
            ToastMessage({type: 'error', message: err?.response?.data?.message})
          }
        })
      resetForm({values: ''})
    }
  }

  const handleDelete = () => {
    if (todoSelected?.guid) {
      setLoadingTodo(true)
      deleteTodo(todoSelected?.guid)
        .then((res: any) => {
          setLoadingTodo(false)
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadToDo(reloadToDo + 1)
          setShowDeleteTodo(false)
          setLoadingTodo(false)
        })
        .catch(() => '')
    }
  }

  const setRemender = (item: any) => {
    setShowReminder(true)
    setTodoSelected(item)
  }

  const setEditRemender = (item: any) => {
    setEditShowReminder(true)
    setTodoSelected(item)
  }

  const updateStatus = (status: any, guid: any) => {
    const params = {
      guids: [guid],
      status: status ? 'finish' : 'unfinish',
    }

    if (guid) {
      updateStatusTodo(params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setReloadToDo(reloadToDo + 1)
        })
        .catch(() => '')
    }
  }

  const msg_alert_remove = [
    'Are you sure want to delete ',
    <strong key='alert_remove'>{todoSelected?.name}</strong>,
    '?',
  ]

  useEffect(() => {
    if (detailTicket?.guid !== undefined) {
      const filter: any = {ticket_guid: detailTicket?.guid}
      getTodoByTicket({filter})
        .then(({data: {data: res}}: any) => {
          if (res) {
            setData(res)
          }
        })
        .catch(() => '')
    }
  }, [detailTicket?.guid, reloadToDo])

  return (
    <>
      <div className='card border border-gray-300 mt-4'>
        <div className='card-body align-items-center p-0'>
          <Accordion id='todo' default='todo'>
            <div className='' data-value='todo' data-label={`To Do`}>
              <div className='row'>
                <Formik
                  validationSchema={TodoSchema}
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
                              data-cy='saveToDo'
                              style={{marginTop: 8}}
                            >
                              {loadingSaveTodo && (
                                <span className='indicator-progress' style={{display: 'block'}}>
                                  <span className='spinner-border spinner-border-sm align-middle'></span>
                                </span>
                              )}

                              {!loadingSaveTodo && <i className='fas fa-plus text-white' />}
                            </Button>
                          </div>
                          <div className='col-7'>
                            <Field
                              name='todo_name'
                              type='text'
                              placeholder='Add To Do'
                              data-cy='todoName'
                              className={configClass?.form}
                            />
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='todo_name' />
                            </div>
                          </div>
                          <div className='col-4'>
                            <Field
                              as='select'
                              className={configClass?.select}
                              name='todo_as'
                              type='text'
                              onChange={(e: any) => {
                                setFieldValue('todo_as', e?.target?.value)
                              }}
                            >
                              <option value='private'>Private</option>
                              <option value='public'>Public</option>
                            </Field>
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
                    const status_chekced: any = item?.status === 'finish' ? true : false
                    return (
                      <Fragment key={index}>
                        <div
                          className='col-12 mb-3 pb-3'
                          style={{
                            borderBottom: '1px',
                            borderBottomColor: '#CBCAD0',
                            borderBottomStyle: 'dashed',
                          }}
                        >
                          <div className='row'>
                            <div className='col-1'>
                              <div className='form-check form-check-custom form-check-solid'>
                                <input
                                  className='form-check-input'
                                  type='checkbox'
                                  name={item?.guid}
                                  defaultChecked={status_chekced}
                                  onChange={(e: any) => {
                                    updateStatus(e?.target?.checked, item?.guid)
                                  }}
                                />
                              </div>
                            </div>
                            <div className='col-8'>
                              <p style={{marginBottom: '0px'}}>
                                {item?.status === 'finish' ? (
                                  <span style={{color: 'gray'}}>
                                    <del>{item?.name}</del>
                                  </span>
                                ) : (
                                  <span>{item?.name}</span>
                                )}
                                {item?.date_notif !== null ? (
                                  <span
                                    className='badge bg-primary text-wrap'
                                    style={{fontSize: '9px', marginLeft: '10px'}}
                                  >
                                    IN{' '}
                                    {moment(item?.date_notif).diff(moment(), 'days') > 0
                                      ? moment(item?.date_notif).diff(moment(), 'days')
                                      : 0}{' '}
                                    DAYS
                                  </span>
                                ) : (
                                  <span
                                    onClick={() => setRemender(item)}
                                    className='text-primary'
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 'bold',
                                      marginLeft: '10px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Set Reminder
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className='col-3 float-right'>
                              {item.type === 'private' ? (
                                <Tooltip placement='top' title='Private'>
                                  <span
                                    data-cy='typeTodo'
                                    className={cx(
                                      'btn btn-icon border border-dashed h-20px w-20px rounded btn-light-primary border-primary'
                                    )}
                                  >
                                    <i className='fas fa-lock fs-8' />
                                  </span>
                                </Tooltip>
                              ) : (
                                <Tooltip placement='top' title='Public'>
                                  <span
                                    data-cy='typeTodo'
                                    className={cx(
                                      'btn btn-icon border border-dashed h-20px w-20px rounded btn-light-primary border-primary'
                                    )}
                                  >
                                    <i className='fas fa-lock-open fs-8' />
                                  </span>
                                </Tooltip>
                              )}
                              <Tooltip placement='top' title='Edit'>
                                <span
                                  data-cy='editTodo'
                                  className={cx(
                                    'btn btn-icon border border-dashed h-20px w-20px rounded mx-1 btn-light-warning border-warning'
                                  )}
                                  onClick={() => {
                                    setEditRemender(item)
                                  }}
                                  style={{cursor: 'pointer'}}
                                >
                                  <i className={`las la-pen-nib fs-6`} />
                                </span>
                              </Tooltip>
                              <Tooltip placement='top' title='Delete'>
                                <span
                                  data-cy='deleteTodo'
                                  className={cx(
                                    'btn btn-icon border border-dashed h-20px w-20px rounded btn-light-danger border-danger'
                                  )}
                                  onClick={() => {
                                    setShowDeleteTodo(true)
                                    setTodoSelected(item)
                                  }}
                                  style={{cursor: 'pointer'}}
                                >
                                  <i className={`las la-trash-alt fs-6`} />
                                </span>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    )
                  })}
              </div>
            </div>
          </Accordion>
        </div>
      </div>

      <Alert
        setShowModal={setShowDeleteTodo}
        showModal={showDeleteTodo}
        loading={loadingTodo}
        body={msg_alert_remove}
        type={'delete'}
        title={`Delete ${todoSelected?.name}`}
        confirmLabel={'Delete'}
        onConfirm={() => {
          handleDelete()
        }}
        onCancel={() => {
          setShowDeleteTodo(false)
        }}
      />

      <SetRemenderModal
        setShowModalRemender={setShowReminder}
        showModaRemenderl={showReminder}
        reminderData={todoSelected}
        setReloadToDo={setReloadToDo}
        reloadToDo={reloadToDo}
      />

      <EditRemenderModal
        setShowModalRemender={setEditShowReminder}
        showModaRemenderl={showEditReminder}
        reminderData={todoSelected}
        setReloadToDo={setReloadToDo}
        reloadToDo={reloadToDo}
      />
    </>
  )
}

TicketToDo = memo(
  TicketToDo,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TicketToDo
