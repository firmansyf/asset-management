import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {getAlertTeam} from '@pages/setup/alert/team/Service'
import {ErrorMessage, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Select from 'react-select'

import {getEmailSF, setupEmailSF} from '../Service'

let SettingEmailAlert: FC<any> = ({showModal, setShowModal, setReload, reload}) => {
  const [loading, setLoading] = useState(false)
  const [team, setTeam] = useState('')
  const [teamAlert, setTeamAlert] = useState([])

  useEffect(() => {
    if (showModal) {
      getEmailSF({})
        .then(({data: {data: res}}) => {
          if (res) {
            const {guid} = res
            setTeam(guid)
          }
        })
        .catch(() => '')
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      getAlertTeam({})
        .then(({data: {data: res}}) => {
          if (res) {
            setTeamAlert(
              res?.map(({guid, name}: any) => {
                return {label: name, value: guid}
              })
            )
          }
        })
        .catch(() => '')
    }
  }, [showModal])

  const handleOnSubmit = (values: any) => {
    setLoading(true)
    setupEmailSF(values)
      .then((e: any) => {
        ToastMessage({message: e?.data?.message, type: 'success'})
        setLoading(false)
        setShowModal(false)
        setReload(reload + 1)
      })
      .catch(() => {
        // errorExpiredToken(e);
        setLoading(false)
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik initialValues={{team_guid: team}} enableReinitialize onSubmit={handleOnSubmit}>
        {({setFieldValue, values}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header closeButton>
              <Modal.Title>Setup Email Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='row'>
                <div className='col-4'>
                  <label className={configClass?.label}>Recipient Team</label>
                </div>
                <div className='col-8'>
                  <Select
                    name='team_guid'
                    placeholder='Select team'
                    styles={customStyles(true, {})}
                    components={{ClearIndicator, DropdownIndicator}}
                    options={teamAlert}
                    value={
                      values.team_guid
                        ? teamAlert.find((f: any) => f?.value === values?.team_guid)
                        : ''
                    }
                    onChange={(props: any) => {
                      setFieldValue('team_guid', props?.value)
                    }}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='case_id' />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

SettingEmailAlert = memo(
  SettingEmailAlert,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {SettingEmailAlert}
