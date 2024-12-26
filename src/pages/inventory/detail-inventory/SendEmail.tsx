import {InputTags} from '@components/form/tags'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {sendEmailDetail} from '../redux/InventoryCRUD'

const SendEmail: FC<any> = ({
  showModal,
  setShowModal,
  reloadSendEmail,
  setReloadSendEmail,
  detailInventory,
}) => {
  const [loading, setLoading] = useState(false)
  const [include, setInclude] = useState(false)
  const [team, setTeam] = useState([])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params = {
      team_guid: value?.team_guid,
      other_recipient: value?.other_recipient[0],
      notes: value?.notes,
      include_file: include ? 1 : 0,
    }

    sendEmailDetail(params, detailInventory?.guid)
      .then((res: any) => {
        ToastMessage({message: res?.data?.message, type: 'success'})
        setLoading(false)
        setShowModal(false)
        setReloadSendEmail(reloadSendEmail + 1)
      })
      .catch((err: any) => {
        errorExpiredToken(err)
        setLoading(false)

        const {devMessage, data} = err?.response?.data || {}
        if (!devMessage) {
          const {fields} = data || {}
          Object.keys(fields || {})?.map((item: any) => {
            ToastMessage({message: fields[item]?.[0], type: 'error'})
            return false
          })
        }
      })
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
        {({setFieldValue, errors}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Email Inventory</Modal.Title>
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
                <InputTags
                  name='email'
                  type='email'
                  required={errors.other_recipient}
                  placeholder='Enter Email'
                  onChange={(e: any) => setFieldValue('other_recipient', e)}
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
                    checked={include}
                    className='form-check-input border border-gray-300'
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
        )}
      </Formik>
    </Modal>
  )
}

export {SendEmail}
