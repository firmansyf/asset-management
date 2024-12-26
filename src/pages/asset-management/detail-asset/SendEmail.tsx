import {getUserV1} from '@api/UserCRUD'
import {InputTags} from '@components/form/tags'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {sendEmailDetail} from '../redux/AssetRedux'

const validationSchema = Yup.object().shape({
  recipient: Yup.array().test({
    name: 'recipient',
    test: function () {
      const {teamCheck, userCheck, nonUserCheck} = this.parent || {}
      if (!teamCheck && !userCheck && !nonUserCheck) {
        return this.createError({
          message: `Please select at least one recipient`,
        })
      }
      return true
    },
  }),
})

let SendEmail: FC<any> = ({
  showModal,
  setShowModal,
  reloadSendEmail,
  setReloadSendEmail,
  detailAsset,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [include, setInclude] = useState<boolean>(false)

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params = {
      team_guid: value?.teamCheck
        ? value?.team_guid.filter(({value}: any) => value).map(({value}: any) => value)
        : [],
      users: value?.userCheck
        ? value?.user_guid.filter(({value}: any) => value).map(({value}: any) => value)
        : [],
      other_recipient: value?.nonUserCheck ? value?.other_recipient : [],
      notes: value.notes,
      include_file: include ? 1 : 0,
    }

    sendEmailDetail(params, detailAsset?.guid)
      .then((res: any) => {
        ToastMessage({message: res?.data?.message, type: 'success'})
        setLoading(false)
        setShowModal(false)
        setReloadSendEmail(reloadSendEmail + 1)
      })
      .catch((err: any) => {
        errorExpiredToken(err)
        setLoading(false)

        const {data, devMessage} = err?.response?.data || {}
        if (!devMessage) {
          const {fields} = data || {}
          Object.keys(fields || {}).forEach((key: any) => {
            ToastMessage({message: key + ' : ' + fields[key]?.[0], type: 'error'})
            return true
          })
        }
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          team_guid: [],
          user_guid: [],
          other_recipient: [],
          notes: '',
          include_file: false,
          teamCheck: false,
          userCheck: false,
          nonUserCheck: false,
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue, errors, values}: any) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Email Asset</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='mt-2 mb-4'>
                  <label htmlFor='recipient_guid' className={`${configClass?.label} mb-2 required`}>
                    Recipient
                  </label>

                  <div className='row form-check form-check-custom form-check-solid mx-5 mb-3'>
                    <Field
                      type='checkbox'
                      name={`teamCheck`}
                      value={`teamCheck`}
                      checked={values?.teamCheck}
                      className='form-check-input mx-2'
                    />{' '}
                    Teams
                    {values?.teamCheck && (
                      <div className='col-12 ms-5 ps-5 my-3'>
                        <Select
                          sm={true}
                          isMulti
                          id='select-team'
                          name='team_guid'
                          className='col p-0'
                          api={getAlertTeam}
                          params={{orderCol: 'name', orderDir: 'asc'}}
                          reload={false}
                          placeholder='Choose Team'
                          defaultValue={undefined}
                          onChange={(e: any) => {
                            setFieldValue('team_guid', e || [])
                          }}
                          parse={(e: any) => {
                            return {
                              value: e.guid,
                              label: e.name,
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className='row form-check form-check-custom form-check-solid mx-5 mb-3'>
                    <Field
                      type='checkbox'
                      name={`userCheck`}
                      value={`userCheck`}
                      checked={values?.userCheck}
                      className='form-check-input mx-2'
                    />{' '}
                    Users
                    {values?.userCheck && (
                      <div className='col-12 ms-5 ps-5 my-3'>
                        <Select
                          sm={true}
                          isMulti
                          id='select-user'
                          name='user_guid'
                          className='col p-0'
                          api={getUserV1}
                          params={{orderCol: 'first_name', orderDir: 'asc'}}
                          reload={false}
                          placeholder='Choose User'
                          defaultValue={undefined}
                          onChange={(e: any) => {
                            setFieldValue('user_guid', e || [])
                          }}
                          parse={(e: any) => {
                            return {
                              value: e.guid,
                              label: e.first_name + ' ' + e.last_name,
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className='row form-check form-check-custom form-check-solid mx-5 mb-3'>
                    <Field
                      type='checkbox'
                      name={`nonUserCheck`}
                      value={`nonUserCheck`}
                      checked={values?.nonUserCheck}
                      className='form-check-input mx-2'
                    />{' '}
                    Non-users
                    {values?.nonUserCheck && (
                      <div className='col-12 ms-5 ps-5 my-3'>
                        <InputTags
                          type='email'
                          // required={false}
                          placeholder='Enter Email'
                          onChange={(e: any) => setFieldValue('other_recipient', e)}
                        />
                      </div>
                    )}
                  </div>

                  {errors?.recipient && (
                    <div className='fv-plugins-message-container invalid-feedback ms-3 ps-4 pt-3'>
                      {errors?.recipient}
                    </div>
                  )}
                  <ErrorMessage name='recipient' />
                </div>

                <div className='mt-2 mb-4'>
                  <label htmlFor='notes' className={`${configClass?.label} mb-2`}>
                    Notes
                  </label>
                  <Field
                    name='notes'
                    as='textarea'
                    type='text'
                    placeholder='Enter Notes'
                    className={configClass?.form}
                  />
                </div>

                <div className='mt-5 pt-2'>
                  <div className='d-flex align-items-center'>
                    <input
                      id='include_file'
                      name='include_file'
                      type='checkbox'
                      checked={include}
                      onChange={() => {
                        setInclude(!include)
                      }}
                    />
                    <label htmlFor='include_file' className='ms-2'>
                      Include Files
                    </label>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                  {!loading && <span className='indicator-label'>Send Email</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
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

SendEmail = memo(SendEmail, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default SendEmail
