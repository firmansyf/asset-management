import {getUserV1} from '@api/UserCRUD'
import {AddInputBtn} from '@components/button/Add'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select as Ajax} from '@components/select/ajax'
import {Select as AjaxMultiple} from '@components/select/ajaxMultiple'
import {ToastMessage} from '@components/toast-message'
import {
  addEditFormPermission,
  configClass,
  errorExpiredToken,
  FieldMessageError,
  hasPermission,
  useTimeOutMessage,
} from '@helpers'
import {AddEdit as AddEditWH} from '@pages/help-desk/working-hour/AddEdit'
import AddUser from '@pages/user-management/user/AddUser'
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addAlertTeam, editAlertTeam, getWorkingHourTeams} from './Service'

const AlertTeamSchema: any = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  members: Yup.array().test({
    name: 'members',
    test: function () {
      const {members} = this.parent || {}
      if (members?.length <= 0) {
        return this.createError({
          message: `Members is required`,
        })
      }
      return true
    },
  }),
})

let AddAlertTeam: FC<any> = ({showModal, setShowModal, setReload, reload, detail, features}) => {
  const intl: any = useIntl()

  const [files, setFiles] = useState<any>([])
  const [members, setMember] = useState<any>([])
  const [detailWH, setDetailWH] = useState<any>({})
  const [userDetail, setUserDetail] = useState<any>()
  const [errForm, setErrForm] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadUser, setReloadUser] = useState<number>(1)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [reloadWH, setReloadWH] = useState<boolean>(false)
  const [loadingWH, setLoadingWH] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(false)
  const [loadingMember, setLoadingMember] = useState<boolean>(false)
  const [showModalUser, setShowModalUser] = useState<boolean>(false)
  const [showModalWHAdd, setShowModalWHAdd] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addTeamPermission: any = hasPermission('team.add') || false
  const editTeamPermission: any = hasPermission('team.edit') || false

  useEffect(() => {
    if (showModal) {
      setTimeout(() => ToastMessage({type: 'clear'}), 800)
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        detail,
        addTeamPermission,
        editTeamPermission,
        'Add Team',
        'Edit Team'
      )
    }
  }, [showModal, setShowModal, detail, addTeamPermission, editTeamPermission])

  useEffect(() => {
    setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 500)
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      if (detail !== undefined) {
        const {members}: any = detail || {}
        if (members) {
          setMember(
            members?.map(({guid, first_name, last_name}: any) => {
              return {
                label: `${first_name} ${last_name}` || '',
                value: guid || '',
              }
            })
          )
        }
      } else {
        setMember([])
      }
    } else {
      setMember([])
    }
  }, [showModal, detail])

  useEffect(() => {
    setLoadingWH(false)
    setTimeout(() => setLoadingWH(true), 800)
  }, [reloadWH])

  const handleOnSubmit = (value: any) => {
    setLoading(true)
    const {guid}: any = detail || {}
    const params: any = {
      name: value?.name || '',
      description: value?.description || '',
      user_guids: value?.members?.length > 0 ? value?.members?.map(({value}: any) => value) : [],
      working_hour_guid:
        value?.working_hour && value?.working_hour !== '-' && value?.working_hour !== undefined
          ? value?.working_hour
          : '',
    }

    if (guid) {
      editAlertTeam(params, guid)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          setLoading(false)
          errorExpiredToken(e)
          FieldMessageError(e, [])
        })
    } else {
      addAlertTeam(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowForm(false)
          setShowModal(false)
          setReload(reload + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((e: any) => {
          setLoading(false)
          FieldMessageError(e, [])
        })
    }
  }

  const initValues: any = {
    name: detail?.name || '',
    members: members || [],
    description: detail?.description || '',
    working_hour: detail?.working_hour?.guid || '',
  }

  const onClose = () => {
    setShowModal(false)
    setErrForm(true)
    setOnClickForm(false)
    setShowForm(false)
    useTimeOutMessage('clear', 400)
  }

  useEffect(() => {
    setLoadingMember(false)
    setTimeout(() => setLoadingMember(true), 500)
  }, [showModal, reloadUser])

  useEffect(() => {
    setLoadingWH(false)
    setTimeout(() => setLoadingWH(true), 500)
  }, [showModal, reloadWH])

  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
      <Formik
        initialValues={initValues}
        validationSchema={AlertTeamSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
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
                <Modal.Title>{detail ? 'Edit' : 'Add'} Team</Modal.Title>
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
                    <label className={`${configClass?.label} required`} htmlFor='name'>
                      Name
                    </label>
                    <InputText
                      name='name'
                      type='text'
                      onClickForm={onClickForm}
                      className={configClass?.form}
                      placeholder='Enter Alert Team Name'
                    />
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='name' />
                    </div>
                  </div>

                  <div className='mb-5'>
                    <label className={configClass?.label} htmlFor='description'>
                      Description
                    </label>
                    <InputText
                      type='text'
                      as='textarea'
                      name='description'
                      className={configClass?.form}
                      placeholder='Enter Description'
                    />
                  </div>

                  <div className='mb-5'>
                    <label className={`${configClass?.label} required`} htmlFor='description'>
                      Members
                    </label>
                    {loadingMember && (
                      <div className='d-flex align-items-center input-group input-group-solid input-group-sm'>
                        <AjaxMultiple
                          sm={true}
                          isMulti={true}
                          api={getUserV1}
                          reload={reloadUser}
                          isClearable={false}
                          className='col p-0'
                          placeholder='Select Member'
                          defaultValue={values?.members || ''}
                          params={{orderCol: 'fullname', orderDir: 'asc'}}
                          onChange={(e: any) => setFieldValue('members', e || '')}
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
                          showModal={showModalUser}
                          userDetail={userDetail}
                          setShowModalUser={setShowModalUser}
                          setReloadUser={setReloadUser}
                          reloadUser={reloadUser}
                          files={files}
                          setFiles={setFiles}
                          defaultRole={''}
                          preference
                        />
                      </div>
                    )}

                    {values?.members?.length === 0 && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='members' />
                      </div>
                    )}
                  </div>

                  {features?.help_desk === 1 && (
                    <div className='mb-5'>
                      <label className={configClass?.label} htmlFor='working_hour'>
                        Working Hours
                      </label>
                      {loadingWH && (
                        <div className='d-flex align-items-center input-group input-group-solid input-group-sm'>
                          <Ajax
                            sm={true}
                            reload={reloadWH}
                            className='col p-0'
                            api={getWorkingHourTeams}
                            placeholder='Select Working Hours'
                            params={{orderCol: 'name', orderDir: 'asc'}}
                            parse={({guid, name}: any) => ({value: guid, label: name})}
                            onChange={({value}: any) => setFieldValue('working_hour', value || '')}
                            defaultValue={{
                              value: detail?.working_hour?.guid || '',
                              label: detail?.working_hour?.name || '',
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
                    </div>
                  )}
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
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
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
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

AddAlertTeam = memo(
  AddAlertTeam,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {AddAlertTeam}
