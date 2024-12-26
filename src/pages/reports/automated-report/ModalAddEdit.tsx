import {CustomRadio} from '@components/form/CustomRadio'
import {FrequencyForm} from '@components/form/Frequency'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {MobileTimePicker as TimePicker} from '@mui/x-date-pickers/MobileTimePicker'
import {getAlertTeam as getTeam} from '@pages/setup/alert/team/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {initTableColumns as initColumns} from '../custom-report/constant'
import {createAutomatedReport, getAutomatedSetting, updateAutomatedReport} from '../Service'

const validationSchema: any = Yup.object().shape({
  name: Yup.string().required('Name is required.'),
  type: Yup.string().required('Type is required.'),
  team_guid: Yup.string().required('Team is required.'),
  frequency_value: Yup.array().test(
    '',
    'Frequency Value can not be empty',
    (arr: any) => arr?.length > 0
  ),
})

let ModalAddEdit: FC<any> = ({
  type,
  detail,
  columns = initColumns,
  showModal,
  setShowModal,
  onSubmit,
  onHide,
}) => {
  const intl: any = useIntl()

  const [team, setTeam] = useState<any>([])
  const [date, seChangeDate] = useState<any>(moment())
  const [typeOption, setTypeOption] = useState<any>([])
  const [fileTypeOption, setFileTypeOption] = useState<any>([])
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)

  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 500)
  }, [showModal])

  useEffect(() => {
    if (showModal && detail?.guid && detail?.time) {
      const hour: number = parseInt(detail?.time?.split(':')[0])
      const minute: number = parseInt(detail?.time?.split(':')[1])
      const createdAt: any = moment(detail?.created_at)
        ?.utcOffset(0)
        ?.set({hour, minute})
      seChangeDate(createdAt)
    } else {
      seChangeDate(moment())
    }
  }, [detail, showModal])

  useEffect(() => {
    getAutomatedSetting().then(({data: {data}}: any) => {
      if (data?.type) {
        setTypeOption(
          Object.entries(data?.type || {})?.map((m: any) => ({
            value: m?.[0] || '',
            label: m?.[1] || '',
          }))
        )
      } else {
        setTypeOption([])
      }
      if (data?.file_type) {
        setFileTypeOption(
          Object.entries(data?.file_type || {})?.map((m: any) => ({
            value: m?.[0] || '',
            label: m?.[1] || '',
          }))
        )
      } else {
        setFileTypeOption([])
      }
    })

    getTeam({})
      .then(({data: {data: res}}: any) => {
        setTeam(res?.map(({guid, name}: any) => ({value: guid, label: name})))
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [])

  const initialValues: any = {
    name: detail?.name || '',
    type: detail?.type || 'asset',
    team_guid: detail?.team?.guid || '',
    file_type: detail?.file_type || 'pdf',
    frequency: detail?.frequency || 'daily',
    frequency_value: detail?.frequency_value as never[],
    columns: columns?.map(({value}: any) => value) as never[],
    time: detail?.time
      ? detail?.time?.split(':')?.slice(0, 2)?.join(':')
      : moment()?.format('HH:mm'),
  }

  const handleSubmit: any = (values: any) => {
    const {guid} = detail || {}
    const params: any = {
      ...values,
      time: moment(date)?.format('HH:mm'),
    }

    if (guid) {
      updateAutomatedReport(params, guid)
        .then(({data: {message}}: any) => {
          onSubmit(true)
          setShowModal(false)
          ToastMessage({type: 'success', message})
        })
        .catch(({err}: any) => {
          const {data}: any = err?.response?.data || {}
          const {fields}: any = data || {}

          if (fields) {
            Object.values(errorValidation(err))?.map((message: any) => {
              ToastMessage({type: 'error', message})
              return null
            })
          }
        })
    } else {
      createAutomatedReport(params)
        .then(({data: {message}}: any) => {
          onSubmit(true)
          setShowModal(false)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          const {data}: any = err?.response?.data || {}
          const {fields}: any = data || {}

          if (fields) {
            Object.values(errorValidation(err))?.map((message: any) => {
              ToastMessage({type: 'error', message})
              return null
            })
          }
        })
    }
  }

  const onClose = () => {
    onHide && onHide(true)
    setShowModal(false)
    setErrSubmitForm(true)
    ToastMessage({type: 'clear'})
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({
          setFieldValue,
          touched,
          values,
          errors,
          isSubmitting,
          setSubmitting,
          isValidating,
        }: any) => {
          if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrSubmitForm(false)
            setSubmitting(false)
          }
          if (
            isSubmitting &&
            isValidating &&
            !errSubmitForm &&
            Object.keys(errors || {})?.length > 0
          ) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
          }
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{type === 'edit' ? 'Edit' : 'Add'} Automated Report</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='form-group row mb-4 report-name'>
                    <label className={`${configClass?.label} pt-2 required col-md-3 text-nowrap`}>
                      Report Name
                    </label>
                    <div className='col-md-9'>
                      <Field
                        type='text'
                        name='name'
                        placeholder='Enter Report Name'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>
                  <div className='form-group row mb-4 report-team'>
                    <label className={`${configClass?.label} pt-2 required col-md-3 text-nowrap`}>
                      Team
                    </label>
                    <div className='col-md-9'>
                      <Select
                        sm={true}
                        data={team}
                        name='team_guid'
                        className='col p-0'
                        isClearable={false}
                        placeholder='Select Team'
                        defaultValue={values?.team_guid || ''}
                        onChange={({value}: any) => setFieldValue('team_guid', value || {})}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='team_guid' />
                      </div>
                    </div>
                  </div>
                  <div className='form-group row mb-4 d-none report-type'>
                    <label className={`${configClass?.label} pt-2 required col-md-3 text-nowrap`}>
                      Type
                    </label>
                    <div className='col-md-9'>
                      <Field as='select' name='type' className={configClass?.form}>
                        <option value=''>Choose Type</option>
                        {!!typeOption &&
                          typeOption?.length > 0 &&
                          typeOption?.map(({value, label}: any, index: number) => (
                            <option key={index || 0} value={value || ''}>
                              {label || ''}
                            </option>
                          ))}
                      </Field>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='type' />
                      </div>
                    </div>
                  </div>
                  <div className='form-group row mb-4 report-frequency'>
                    <label className={`${configClass?.label} pt-2 required col-md-3 text-nowrap`}>
                      Frequency
                    </label>
                    <div className='col-md-9'>
                      <FrequencyForm
                        detail={detail}
                        onChange={(e: any) => e}
                        setFieldValue={setFieldValue}
                        touched={touched?.frequency || false}
                      />
                    </div>
                  </div>
                  <div className='form-group row align-items-center mb-4 report-time-to-send'>
                    <label className={`${configClass?.label} pt-2 required col-md-3 text-nowrap`}>
                      Time to send
                    </label>
                    <div className='col-md-4'>
                      <TimePicker
                        ampm={true}
                        value={date}
                        closeOnSelect
                        reduceAnimations
                        // minutesStep={5}
                        ampmInClock={false}
                        onChange={(value: any) => {
                          setFieldValue('time', value || '')
                          seChangeDate(value || '')
                        }}
                      />
                    </div>
                  </div>
                  <div className='form-group row align-items-center mt-5 report-file-type'>
                    <label className={`${configClass?.label} pt-2 required col-md-3 text-nowrap`}>
                      File Type
                    </label>
                    <div className='col-md-9'>
                      <CustomRadio
                        col='col-auto'
                        options={fileTypeOption as never[]}
                        defaultValue={detail?.file_type || 'pdf'}
                        onChange={(e: any) => setFieldValue('file_type', e || '')}
                      />
                    </div>
                  </div>

                  <style>{`
                    .MuiOutlinedInput-notchedOutline {
                      border: 0px;
                      border-bottom: 1px solid #bcbcbc;
                      border-radius: 0px;
                    }
                    .MuiOutlinedInput-input {
                      padding: 10px 0px;
                    }
                  `}</style>
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button type='button' className='btn-sm' variant='secondary' onClick={onClose}>
                  Cancel
                </Button>
                <Button type='submit' className='btn-sm' variant='primary'>
                  <span className='indicator-label text-capitalize'>
                    {type === 'edit' ? 'Save' : 'Add'}
                  </span>
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

ModalAddEdit = memo(
  ModalAddEdit,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalAddEdit
