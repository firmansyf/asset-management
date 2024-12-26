import {InputTags} from '@components/form/tags'
import {
  ClearIndicator,
  customStyles,
  DropdownIndicator,
  MultiValueRemove,
} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {sendEmailDetail} from '@pages/insurance/policies/Service'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Select from 'react-select'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  other_recipient: Yup.array().test(
    'len',
    'Other Recipient is required',
    (other: any) => other?.length
  ),
})

let SendEmail: FC<any> = ({
  showModal,
  setShowModal,
  reloadSendEmail,
  setReloadSendEmail,
  detailPolicy,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [include, setInclude] = useState<boolean>(false)
  const [team, setTeam] = useState<any>([])

  const handleSubmit = (value: any) => {
    setLoading(true)

    const params: any = {
      other_recipient: value?.other_recipient?.length > 0 ? value?.other_recipient : [],
      notes: value?.notes !== '' ? value?.notes : '-',
      include_file: include ? 1 : 0,
    }

    if (value?.team_guid?.length > 0) {
      params.team_guid = value?.team_guid?.map((item: any) => item?.value || '')
    } else {
      params.team_guid = []
    }

    sendEmailDetail(params, detailPolicy?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => ToastMessage({type: 'clear'}), 300)
        setTimeout(() => ToastMessage({message, type: 'success'}), 400)
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
          Object.keys(fields || {})?.map((key: any) => {
            ToastMessage({message: key + ' : ' + fields[key][0], type: 'error'})
            return true
          })
        }
      })
  }

  useEffect(() => {
    getAlertTeam({})
      .then(({data: {data: res}}) => {
        if (res) {
          const dataTeam = res.map(({guid, name}: any) => {
            return {
              value: guid,
              label: name,
            }
          })
          setTeam(dataTeam as never[])
        }
      })
      .catch(() => '')
  }, [])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          team_guid: '',
          other_recipient: '',
          notes: '',
          include_file: false,
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue, setSubmitting, values, isSubmitting, errors}) => {
          if (
            isSubmitting &&
            values?.other_recipient?.length === 0 &&
            values?.other_recipient === '' &&
            values?.team_guid === ''
          ) {
            ToastMessage({
              message:
                'Please select at least one team or input at least one email to perform this action.',
              type: 'error',
            })
            setSubmitting(false)
          }

          if (isSubmitting && Object.keys(errors || {})?.length > 0) {
            ScrollTopComponent.goTop()
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Email Insurance Policy</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='mt-2'>
                  <label htmlFor='team_guid' className={`${configClass?.label}`}>
                    Recipient
                  </label>
                  <Select
                    name='team_guid'
                    isMulti
                    placeholder='Select Team'
                    styles={customStyles(true, {})}
                    components={{ClearIndicator, DropdownIndicator, MultiValueRemove}}
                    options={team}
                    value={values.team_guid}
                    onChange={(props: any) => {
                      setFieldValue('team_guid', props)
                    }}
                  />
                </div>

                <div className='mt-4'>
                  <label htmlFor='other_recipient' className={`${configClass?.label} required`}>
                    Other Recipient (non-users)
                  </label>
                  <InputTags
                    type='email'
                    required={errors.other_recipient}
                    placeholder='Enter Email'
                    onChange={(e: any) => setFieldValue('other_recipient', e)}
                  />
                </div>

                <div className='mt-4'>
                  <label htmlFor='notes' className={`${configClass?.label}`}>
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
                  <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                    <input
                      id='include_file'
                      name='include_file'
                      type='checkbox'
                      className='form-check-input border border-gray-300'
                      checked={include}
                      onChange={() => {
                        setInclude(!include)
                      }}
                    />
                    <label
                      htmlFor='include_file'
                      className={`${configClass?.label} ps-2 cursor-pointer`}
                    >
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
