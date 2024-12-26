import 'react-datetime/css/react-datetime.css'

import {getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {getMaintenanceTaskStatus, putMaintenanceTask} from '@pages/maintenance/Service'
import {Field, Form, Formik} from 'formik'
import {FC, memo, useMemo} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

let AddTask: FC<any> = ({
  showModal,
  setShowModal,
  data,
  setReloadTasks,
  reloadTasks,
  setReload,
  reload,
}) => {
  const initialValues: any = useMemo(() => {
    return {
      ...data,
      task_status_guid: {value: data?.status?.guid, label: data?.status?.name},
      user_guid: {value: data?.user?.guid, label: data?.user?.name},
    }
  }, [data])

  const validationSchema = Yup.object().shape({})

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values: any) => {
          if (data?.guid !== null && data?.guid !== undefined) {
            const params: any = {
              tasks: [
                {
                  guid: data?.guid || '',
                  name: values?.name || '',
                  description: '-',
                  field_type: 'text',
                  user_guid: values?.user_guid?.value || null,
                  task_status_guid: values?.task_status_guid?.value || null,
                },
              ],
            }

            putMaintenanceTask(params)
              .then(({data: {message}}: any) => {
                setShowModal(false)
                ToastMessage({message, type: 'success'})
                setReloadTasks(reloadTasks + 1)
                setReload(!reload)
              })
              .catch((err: any) => {
                if (err.response) {
                  const {devMessage, data, message} = err?.response?.data || {}
                  if (!devMessage) {
                    const {fields} = data || {}
                    if (fields === undefined) {
                      ToastMessage({message, type: 'error'})
                    }

                    if (fields) {
                      Object.keys(fields || {})?.map((item: any) => {
                        ToastMessage({message: fields[item]?.[0], type: 'error'})
                        return true
                      })
                    }
                  }
                }
              })
          }
        }}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>{Object.keys(data || {})?.length > 0 ? 'Edit' : 'Add'} Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-2'>
                <label className={configClass?.label}>Task Name</label>
                <Field
                  type='text'
                  name='name'
                  placeholder='Enter Task Name'
                  className={configClass?.form}
                  data-cy='updateNameTask'
                />
              </div>
              <div className='mt-2'>
                <label className={configClass?.label}>Assign Employee</label>
                <Select
                  sm={'sm'}
                  key={'user_guid'}
                  api={getUserV1}
                  params={false}
                  reload={false}
                  placeholder='Choose Maintenance Status'
                  defaultValue={{value: data?.user?.guid || null, label: data?.user?.name || ''}}
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
              </div>

              <div className='mt-2'>
                <label className={configClass?.label}>Task Status</label>
                <Select
                  sm={'sm'}
                  key={'task_status_guid'}
                  api={getMaintenanceTaskStatus}
                  params={false}
                  reload={false}
                  placeholder='Choose Maintenance Status'
                  defaultValue={{
                    value: data?.status?.guid || null,
                    label: data?.status?.name || '',
                  }}
                  onChange={(e: any) => {
                    setFieldValue('task_status_guid', e)
                  }}
                  parse={(e: any) => {
                    if (data?.guid !== null && data?.guid !== undefined) {
                      return {
                        value: e.guid,
                        label: e.name,
                      }
                    } else {
                      if (e?.unique_id === 'open') {
                        return {
                          value: e.guid,
                          label: e.name,
                        }
                      } else {
                        return {
                          value: '',
                          label: '',
                        }
                      }
                    }
                  }}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                Done
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

AddTask = memo(AddTask, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default AddTask
