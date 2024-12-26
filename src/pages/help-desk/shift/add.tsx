import {getUserV1} from '@api/UserCRUD'
import {AddInputBtn} from '@components/button/Add'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select as SelectAjax} from '@components/select/ajax'
import {Select as SelectMultiple} from '@components/select/ajaxMultiple'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, hasPermission} from '@helpers'
import {addShifts, editShifts, getWorkingHours} from '@pages/help-desk/shift/Service'
import {AddEdit as AddEditWH} from '@pages/help-desk/working-hour/AddEdit'
import AddUser from '@pages/user-management/user/AddUser'
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

const FormSchema: any = Yup.object().shape({
  name: Yup.string().required('Shift Name is required'),
  agents: Yup.array().test('len', 'Agents is required', (item: any) => item?.length),
  working_hour: Yup.string().required('Working Hours is required'),
})

const Shift: FC<any> = ({showModal, setShowModal, detail, reload, setReload, setDataChecked}) => {
  const intl: any = useIntl()

  const [files, setFiles] = useState<any>([])
  const [detailWH, setDetailWH] = useState<any>({})
  const [userDetail, setUserDetail] = useState<any>()
  const [errForm, setErrForm] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadAgent, setReloadAgent] = useState<number>(0)
  const [reloadUser, setReloadUser] = useState<number>(0)
  const [reloadWH, setReloadWH] = useState<boolean>(false)
  const [loadingWH, setLoadingWH] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [loadingAgent, setLoadingAgent] = useState<boolean>(true)
  const [showModalUser, setShowModalUser] = useState<boolean>(false)
  const [showModalWHAdd, setShowModalWHAdd] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const permissionWHView: any = hasPermission('help-desk.working-hour.view') || false

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleSubmit = (value: any) => {
    setLoading(true)
    const {guid} = detail || {}
    const params: any = {
      name: value?.name || '',
      working_hour_guid: value?.working_hour || value?.working_hour?.value || '',
    }

    if (value?.agents?.length > 0) {
      params.users = value?.agents?.map((item: any) => item?.value)
    } else {
      params.users = []
    }

    if (guid) {
      editShifts(params, guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setDataChecked([])
          setShowModal(false)
          setReload(reload + 1)
          successMessage(message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          const {devMessage, data, message} = err?.response?.data || {}
          const {fields} = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item !== 'file.data' && item !== 'file.title') {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                }
                return true
              })
            }
          }
        })
    } else {
      addShifts(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setDataChecked([])
          setShowModal(false)
          setReload(reload + 1)
          successMessage(message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorExpiredToken(err)
          const {devMessage, data, message} = err?.response?.data || {}
          const {fields} = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item !== 'file.data' && item !== 'file.title') {
                  ToastMessage({message: fields?.[item]?.[0] || 'Error.', type: 'error'})
                }
                return true
              })
            }
          }
        })
    }
  }

  useEffect(() => {
    setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  useEffect(() => {
    setLoadingAgent(false)
    setTimeout(() => setLoadingAgent(true), 500)
    setTimeout(() => setReloadAgent(reloadAgent + 1), 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, reloadUser])

  const initValues: any = {
    name: detail?.name || '',
    working_hour: detail?.working_hour_name || '',
    agents:
      detail?.users && detail?.users.length > 0
        ? detail?.users?.map(({guid, first_name, last_name}: any) => {
            return {
              value: guid || '',
              label: (first_name || '') + ' ' + (last_name || ''),
            }
          })
        : [],
  }

  const closeModal = () => {
    setShowModal(false)
    setErrForm(true)
    ToastMessage({type: 'clear'})
  }

  useEffect(() => {
    setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
  }, [showModal])

  useEffect(() => {
    setLoadingAgent(false)
    setTimeout(() => setLoadingAgent(true), 500)
  }, [showModal, reloadUser])

  useEffect(() => {
    setLoadingWH(false)
    setTimeout(() => setLoadingWH(true), 500)
  }, [showModal, reloadWH])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={closeModal}>
      <Formik
        initialValues={initValues}
        validationSchema={FormSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({values, setFieldValue, setSubmitting, isSubmitting, errors, isValidating}: any) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{detail ? 'Edit' : 'Add'} Shift</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='mb-5'>
                    <label htmlFor='name' className={`${configClass?.label} required`}>
                      Shift Name
                    </label>
                    <InputText
                      name='name'
                      type='text'
                      errors={errors}
                      onClickForm={onClickForm}
                      className={configClass?.form}
                      placeholder='Enter Shift Name'
                    />
                  </div>

                  <div className='mb-5'>
                    <label className={`${configClass?.label} required`} htmlFor='description'>
                      Agents
                    </label>
                    {loadingAgent && (
                      <div className='d-flex align-items-center input-group input-group-solid input-group-sm'>
                        <SelectMultiple
                          sm={true}
                          id='agents'
                          name='agents'
                          isMulti={true}
                          api={getUserV1}
                          params={{
                            'filter[role_name]': 'agent',
                            orderCol: 'fullname',
                            orderDir: 'asc',
                          }}
                          isClearable={false}
                          className='col p-0'
                          reload={reloadUser}
                          placeholder='Select Agents'
                          defaultValue={values?.agents || []}
                          onChange={(e: any) => setFieldValue('agents', e || {})}
                          parse={({guid, fullname}: any) => ({value: guid, label: fullname})}
                        />
                        <AddInputBtn
                          size={configClass?.size}
                          onClick={() => {
                            setFiles([])
                            setUserDetail(undefined)
                            setShowModalUser(true)
                          }}
                        />
                        <AddUser
                          files={files}
                          defaultRole={'agent'}
                          setFiles={setFiles}
                          userDetail={userDetail}
                          reloadUser={reloadUser}
                          showModal={showModalUser}
                          setReloadUser={setReloadUser}
                          setShowModalUser={setShowModalUser}
                        />
                      </div>
                    )}

                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='agents' />
                    </div>
                  </div>

                  {permissionWHView && (
                    <div className='mb-5'>
                      <label className={`${configClass?.label} required`} htmlFor='working_hour'>
                        Working Hours
                      </label>
                      {loadingWH && (
                        <div className='d-flex align-items-center input-group input-group-solid input-group-sm'>
                          <SelectAjax
                            sm={true}
                            reload={reloadWH}
                            id='working_hour'
                            name='working_hour'
                            className='col p-0'
                            isClearable={false}
                            api={getWorkingHours}
                            placeholder='Select Working Hours'
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={({value}: any) => setFieldValue('working_hour', value || '')}
                            defaultValue={{
                              value: detail?.working_hours?.guid || '',
                              label: detail?.working_hours?.name || '',
                            }}
                          />

                          <AddInputBtn
                            size={configClass?.size}
                            onClick={() => {
                              setDetailWH(undefined)
                              setShowModalWHAdd(true)
                            }}
                          />
                          <AddEditWH
                            showModal={showModalWHAdd}
                            setShowModal={setShowModalWHAdd}
                            setReload={setReloadWH}
                            reload={reloadWH}
                            detail={detailWH}
                          />
                        </div>
                      )}

                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='working_hour' />
                      </div>
                    </div>
                  )}
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                  {!loading && (
                    <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                      {detail ? 'Save' : 'Add'}
                    </span>
                  )}

                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={closeModal}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

const AddShift = memo(
  Shift,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddShift
