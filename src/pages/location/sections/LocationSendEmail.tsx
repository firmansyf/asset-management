import {sendEmailDetail} from '@api/Service'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const LocationSendEmail: FC<any> = ({
  showModal,
  setShowModal,
  reloadSendEmail,
  setReloadSendEmail,
  detailLocation,
}) => {
  const [loading, setLoading] = useState(false)
  const [include, setInclude] = useState(false)
  const [team, setTeam] = useState([])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const other_value = value?.other_recipient
    let other_recipient = null
    if (other_value !== '') {
      other_recipient = other_value.split(',')
    }

    const params = {
      team_guid: value?.team_guid,
      other_recipient: other_recipient,
      notes: value?.notes,
      include_file: include ? 1 : 0,
    }

    sendEmailDetail(params, detailLocation?.guid)
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
          Object.keys(fields || {})?.map((key: any) => {
            ToastMessage({message: key + ' : ' + fields[key]?.[0], type: 'error'})
            return true
          })
        }
      })
  }

  const onCancel = () => {
    setLoading(false)
    setShowModal(false)
  }

  useEffect(() => {
    getAlertTeam({})
      .then(({data: {data: res}}) => {
        if (res) {
          setTeam(res?.map(({guid, name}) => ({value: guid, label: name})))
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
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Email Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-2'>
                <label htmlFor='team_guid' className={`${configClass?.label}`}>
                  Recipient
                </label>
                <Select
                  sm={true}
                  name='team_guid'
                  className='col p-0'
                  data={team}
                  isClearable={false}
                  placeholder='Select Team'
                  defaultValue={undefined}
                  onChange={(e: any) => {
                    setFieldValue('team_guid', e?.value || {})
                  }}
                />
              </div>

              <div className='mt-2'>
                <label htmlFor='other_recipient' className={`${configClass?.label} required`}>
                  Other Recipient (non-users)
                </label>
                <Field
                  name='other_recipient'
                  as='textarea'
                  type='text'
                  placeholder='Enter Email (Separate multiple emails with comma)'
                  className={configClass?.form}
                />
              </div>

              <div className='mt-2'>
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
              <Button className='btn-sm' variant='secondary' onClick={onCancel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default LocationSendEmail
