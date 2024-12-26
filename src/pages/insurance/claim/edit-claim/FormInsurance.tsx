import 'react-datetime/css/react-datetime.css'

import {getLocationDetail, getLocationV1, sendUpdatePeril} from '@api/Service'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {PageLoader} from '@components/loader/cloud'
import {Select as SelectAjax} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {
  configClass,
  preferenceDate,
  preferenceDateTime,
  preferenceTime,
  validationViewDate,
} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {ErrorMessage, Field} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Datetime from 'react-datetime'

import {getPerils} from '../Service'

let FormInsurance: FC<any> = ({
  optionPerils,
  optionDocument,
  detail,
  setShowData,
  setFieldValue,
  values,
  setIncidentTimestamp,
  validation,
  reload,
  setReload,
  formChange,
  setFormChange,
  loading,
}) => {
  const pref_date: any = preferenceDate()
  const pref_time: any = preferenceTime()
  const pref_date_time: any = preferenceDateTime()

  const [alertPeril, showAlertPeril] = useState<boolean>(false)
  const [loadingPeril, showLoadingPeril] = useState<boolean>(false)
  const [dataSelectedPeril, setSelectedPeril] = useState<string>('')
  const [isAnyDocuments, setIsAnyDocuments] = useState<boolean>(false)
  const [detailInsuranceClaim, setDetailInsuranceClaim] = useState<any>({})
  const [detailLocation, setDetailLocation] = useState<any>({})
  useEffect(() => {
    if (detail) {
      setDetailInsuranceClaim(detail)
    }
  }, [detail])

  useEffect(() => {
    if (detail?.documents?.length) {
      const docLength: any = detail?.documents
        ?.map(({files}: any) => files?.length || 0)
        ?.reduce((a: any, b: any) => a + b)
      setIsAnyDocuments(docLength > 0)
    }
  }, [detail?.documents])

  const dataLocationDetailQuery: any = useQuery({
    queryKey: ['getLocationDetail', {guid: detailInsuranceClaim?.location_guid}],
    queryFn: async () => {
      if (detailInsuranceClaim?.location_guid) {
        const res: any = await getLocationDetail(detailInsuranceClaim?.location_guid)
        const dataResult: any = res?.data?.data || {}
        // setFieldValue('sitename', dataResult?.name)
        // setFieldValue('sitename_id', dataResult?.site_id)
        // setFieldValue('location_guid', dataResult?.guid)
        // setFieldValue('location', dataResult)
        setDetailLocation(dataResult)
        return dataResult
      } else {
        return {}
      }
    },
  })
  const site: any = dataLocationDetailQuery?.data || {}
  const _loadingForm: any = !dataLocationDetailQuery?.isFetched

  useEffect(() => {
    if (values?.incident_timestamp !== undefined) {
      setIncidentTimestamp(values?.incident_timestamp)
    }
  }, [setIncidentTimestamp, values?.incident_timestamp])

  const onChangeSite = (location_guid: any) => {
    if (location_guid !== '') {
      setDetailInsuranceClaim((prev: any) => ({...prev, location_guid}))
    }
  }

  const onChangePeril = (e: any) => {
    showLoadingPeril(true)
    if (detail?.guid !== undefined) {
      const peril = optionPerils.find(({guid}: any) => guid === e)
      sendUpdatePeril(
        {
          insurance_claim_peril_guid: peril?.guid || '',
        },
        detail?.guid
      )
        .then(({data: res}: any) => {
          const {guid, deductible_amount, name} = peril || {}
          const doc = optionDocument?.filter(({peril}: any) => peril?.guid === guid)

          const param_peril: any = {
            deductible_amount: deductible_amount,
            guid: guid,
            name: name,
          }

          if (detail?.insurance_claim_peril?.guid !== guid) {
            const data_new = {
              ...detail,
              insurance_claim_peril: param_peril,
              documents: doc?.map((e: any) => {
                return {...e, files: []}
              }),
            }
            setShowData(data_new)
          }

          setReload && setReload(!reload)
          setFieldValue('insurance_claim_peril.guid', peril?.guid)
          showAlertPeril(false)
          showLoadingPeril(false)
          ToastMessage({type: 'success', message: res?.message})
        })
        .catch((err: any) => {
          showLoadingPeril(false)
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        })
    }
  }

  useEffect(() => {
    setFieldValue('sitename', detailLocation?.name)
    setFieldValue('sitename_id', detailLocation?.site_id)
    setFieldValue('location_guid', detailLocation?.guid)
    setFieldValue('location', detailLocation)
  }, [detailLocation, setFieldValue])

  if (loading) {
    return <PageLoader height={250} />
  }
  return (
    <>
      <div className='col-4 mb-5'>
        <label className={`${configClass?.label} required`}>Case ID</label>
        <Field
          type='text'
          name='case_id'
          placeholder='Enter Case ID'
          className={configClass?.form}
          readOnly
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='case_id' />
        </div>

        {validation?.case_id && (
          <div className='fv-plugins-message-container invalid-feedback mt-0'>
            {validation?.case_id}
          </div>
        )}
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Damages</label>
        <Field
          type='text'
          name='damages'
          placeholder='Enter Damages'
          className={configClass?.form}
          onBlur={(e: any) => {
            const damages: string = detail?.damages !== null ? detail?.damages : ''
            if (damages !== e.target.value) {
              setFormChange({...formChange, damages: true})
            } else {
              setFormChange({...formChange, damages: false})
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='damages' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Details of Damages</label>
        <Field
          type='text'
          name='damages_details'
          placeholder='Enter Details of Damages'
          className={configClass?.form}
          onBlur={(e: any) => {
            const damagesDetails: string =
              detail?.damages_details !== null ? detail?.damages_details : ''
            if (damagesDetails !== e.target.value) {
              setFormChange({...formChange, details_of_damages: true})
            } else {
              setFormChange({...formChange, details_of_damages: false})
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='damages_details' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Sitename</label>
        {Object.keys(detail || {})?.length > 0 && (
          <SelectAjax
            className='col p-0'
            api={getLocationV1}
            params={false}
            reload={false}
            placeholder='Choose SiteName'
            defaultValue={{value: detail?.location?.guid, label: detail?.location?.name}}
            onChange={({value}: any) => {
              onChangeSite(value)
              const siteNameGuid: string =
                detail?.location?.guid !== null ? detail?.location?.guid : ''
              if (siteNameGuid !== value) {
                setFormChange({...formChange, site_name: true})
              } else {
                setFormChange({...formChange, site_name: false})
              }
            }}
            parse={(e: any) => {
              return {
                value: e.guid,
                label: e.name,
              }
            }}
          />
        )}
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='sitename' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Site ID</label>
        <div className={configClass?.readOnly}>{site?.site_id || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Region</label>
        <div className={configClass?.readOnly}>{site?.region || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Territory Manager</label>
        <div className={configClass?.readOnly}>{site?.tm?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>{`TM's Superior 1`}</label>
        <div className={configClass?.readOnly}>{site?.tm_super1?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>{`TM's Superior 2`}</label>
        <div className={configClass?.readOnly}>{site?.tm_super2?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>{`Regional Engineer`}</label>
        <div className={configClass?.readOnly}>{site?.re?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>{`RE's Superior 1`}</label>
        <div className={configClass?.readOnly}>{site?.re_super1?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>{`RE's Superior 2`}</label>
        <div className={configClass?.readOnly}>{site?.re_super2?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>{`Digital RE`}</label>
        <div className={configClass?.readOnly}>{site?.re_digital?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Digital Superior 1</label>
        <div className={configClass?.readOnly}>{site?.digital_super1?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Digital Superior 2</label>
        <div className={configClass?.readOnly}>{site?.digital_super2?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Incident Date and Time</label>
        <Datetime
          closeOnSelect
          inputProps={{
            autoComplete: 'off',
            className: configClass?.form,
            name: 'incident_timestamp',
            placeholder: 'Enter Incident Date and Time',
          }}
          onChange={(e: any) => {
            const m = moment(e).format('YYYY-MM-DD HH:mm:ss')
            setFieldValue('incident_timestamp', m)
            const incidentTimestamp: string =
              detail?.incident_timestamp !== null ? detail?.incident_timestamp : ''
            if (incidentTimestamp !== m) {
              setFormChange({...formChange, incident_timestamp: true})
            } else {
              setFormChange({...formChange, incident_timestamp: false})
            }
          }}
          // initialValue={detail?.incident_timestamp}
          initialValue={
            moment(detail?.incident_timestamp).isValid()
              ? moment(detail?.incident_timestamp).format(pref_date_time)
              : ''
          }
          dateFormat={pref_date}
          timeFormat={pref_time}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='incident_timestamp' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Police Report Date</label>
        <Datetime
          closeOnSelect
          inputProps={{
            autoComplete: 'off',
            className: configClass?.form,
            name: 'police_report_date',
            placeholder: 'Enter Police Report Date',
          }}
          onChange={(e: any) => {
            const m = moment(e).format('YYYY-MM-DD')
            const m_validate = moment(e).format('YYYY-MM-DD HH:mm:ss')
            setFieldValue('police_report_date', m)
            const policeReportDate: string =
              detail?.police_report_date !== null ? detail?.police_report_date : ''
            if (policeReportDate !== m_validate) {
              setFormChange({...formChange, police_report_date: true})
            } else {
              setFormChange({...formChange, police_report_date: false})
            }
          }}
          initialValue={
            moment(detail?.police_report_date).isValid()
              ? moment(detail?.police_report_date).format(pref_date)
              : ''
          }
          dateFormat={pref_date}
          timeFormat={false}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='police_report_date' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Police Report No</label>
        <Field
          type='text'
          name='police_report_no'
          placeholder='Enter Police Report No'
          className={configClass?.form}
          onBlur={(e: any) => {
            const policeReportNo: string =
              detail?.police_report_no !== null ? detail?.police_report_no : ''
            if (policeReportNo !== e.target.value) {
              setFormChange({...formChange, police_report_no: true})
            } else {
              setFormChange({...formChange, police_report_no: false})
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='police_report_no' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Import Date and Time</label>
        <div className={configClass?.readOnly}>
          {validationViewDate(values?.import_date_and_time, pref_date_time)}
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Any Suspicions</label>
        <div className='row mt-1'>
          <div className='col-auto'>
            <label className='form-check py-2 border border-gray-300 bg-light radius-50 ps-10 pe-5 cursor-pointer'>
              <input
                className='form-check-input'
                style={{transform: 'scale(0.75)'}}
                type='radio'
                name='suspicions'
                checked={values?.suspicions === 1}
                onChange={() => {
                  setFieldValue('suspicions', 1)
                  const suspicions: number = detail?.suspicions !== null ? detail?.suspicions : ''
                  if (suspicions !== 1) {
                    setFormChange({...formChange, suspicions: true})
                  } else {
                    setFormChange({...formChange, suspicions: false})
                  }
                }}
              />
              <span className='fw-bold ms-n1'>Yes</span>
            </label>
          </div>
          <div className='col-auto ms-n2'>
            <label className='form-check py-2 border border-gray-300 bg-light radius-50 ps-10 pe-5 cursor-pointer'>
              <input
                className='form-check-input'
                style={{transform: 'scale(0.75)'}}
                type='radio'
                name='suspicions'
                checked={values?.suspicions === 0}
                onChange={() => {
                  setFieldValue('suspicions', 0)
                  const suspicions: number = detail?.suspicions !== null ? detail?.suspicions : ''
                  if (suspicions !== 0) {
                    setFormChange({...formChange, suspicions: true})
                  } else {
                    setFormChange({...formChange, suspicions: false})
                  }
                }}
              />
              <span className='fw-bold ms-n1'>No</span>
            </label>
          </div>
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Suspicions Details</label>
        <div className='mb-5'>
          <Field
            name='suspicions_details'
            as='textarea'
            type='text'
            rows={2}
            value={values?.suspicions_details || ''}
            placeholder='Enter Suspicions Details'
            className={values?.suspicions === 0 ? configClass?.readOnly : configClass?.form}
            disabled={values?.suspicions === 0}
            onBlur={(e: any) => {
              const suspicionsDetails: string =
                detail?.suspicions_details !== null ? detail?.suspicions_details : ''
              if (suspicionsDetails !== e.target.value) {
                setFormChange({...formChange, suspicions_details: true})
              } else {
                setFormChange({...formChange, suspicions_details: false})
              }
            }}
          />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Brief Description</label>
        <Field
          type='text'
          name='brief_description'
          placeholder='Enter Brief Description'
          className={configClass?.form}
          onBlur={(e: any) => {
            const briefDescription: string =
              detail?.brief_description !== null ? detail?.brief_description : ''
            if (briefDescription !== e.target.value) {
              setFormChange({...formChange, brief_description: true})
            } else {
              setFormChange({...formChange, brief_description: false})
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='brief_description' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Action Taken</label>
        <Field
          type='text'
          name='action_taken'
          placeholder='Enter Action Taken'
          className={configClass?.form}
          onBlur={(e: any) => {
            const actionTaken: string = detail?.action_taken !== null ? detail?.action_taken : ''
            if (actionTaken !== e.target.value) {
              setFormChange({...formChange, action_taken: true})
            } else {
              setFormChange({...formChange, action_taken: false})
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='action_taken' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Approved by (RS)</label>
        <Field
          type='text'
          name='claim_approver'
          placeholder='Enter Approved by (RS)'
          className={configClass?.form}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='claim_approver' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Case Title</label>
        <Field
          type='text'
          name='case_title'
          placeholder='Enter Job Title'
          className={configClass?.form}
          onBlur={(e: any) => {
            const caseTitle: string = detail?.case_title !== null ? detail?.case_title : ''
            if (caseTitle !== e.target.value) {
              setFormChange({...formChange, case_title: true})
            } else {
              setFormChange({...formChange, case_title: false})
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='case_title' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={`${configClass?.label} required`}>Type of Peril</label>
        {isAnyDocuments && (
          <Tooltip
            active={true}
            placement='right'
            title='This type of peril has document. Remove all documents To change this type of peril.'
          >
            <div className='float-right d-inline ms-1'>
              <i className='fa fa-info-circle text-primary' />
            </div>
          </Tooltip>
        )}
        <SelectAjax
          sm={true}
          className='col p-0'
          name='insurance_claim_peril.guid'
          api={getPerils}
          // isDisabled={isAnyDocuments}
          params={false}
          reload={false}
          placeholder='Enter Type of Peril'
          defaultValue={{
            value: detail?.insurance_claim_peril?.guid,
            label: detail?.insurance_claim_peril?.name,
          }}
          onChange={({value}: any) => {
            if (value !== detail?.insurance_claim_peril?.guid) {
              showAlertPeril(true)
            }
            setSelectedPeril(value)
          }}
          parse={(e: any) => {
            return {
              value: e.guid,
              label: e.name,
            }
          }}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='insurance_claim_peril.guid' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Report Time</label>
        <Datetime
          closeOnSelect
          inputProps={{
            autoComplete: 'off',
            className: configClass?.form,
            name: 'claim_time',
            placeholder: 'Enter Report Time',
          }}
          onChange={(e: any) => {
            const m = moment(e).format('YYYY-MM-DD HH:mm:ss')
            setFieldValue('claim_time', m)
            const claimTime: string = detail?.claim_time !== null ? detail?.claim_time : ''
            if (claimTime !== m) {
              setFormChange({...formChange, claim_time: true})
            } else {
              setFormChange({...formChange, claim_time: false})
            }
          }}
          initialValue={
            moment(detail?.claim_time).isValid()
              ? moment(detail?.claim_time).format(pref_date_time)
              : ''
          }
          dateFormat={pref_date}
          timeFormat={pref_time}
        />
        <div className='fv-plugins-message-container invalid-feedback'>
          <ErrorMessage name='claim_time' />
        </div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>Status</label>
        <div className={configClass?.readOnly}>{detail?.insurance_claim_status?.name || '-'}</div>
      </div>
      <div className='col-4 mb-5'>
        <label className={configClass?.label}>GR Status</label>
        <div className={configClass?.readOnly}>{detail?.gr_status || '-'}</div>
      </div>

      <Alert
        setShowModal={showAlertPeril}
        showModal={alertPeril}
        loading={loadingPeril}
        body={['Are you sure to change the Type of Peril ?']}
        body2={['Document with no matching type ( if any ) ', 'will be moved to Other Documents.']}
        type={'confirm'}
        title={'Change Peril'}
        confirmLabel={'Confirm'}
        onConfirm={() => {
          onChangePeril(dataSelectedPeril)
        }}
        onCancel={() => {
          setFieldValue('insurance_claim_peril.guid', detail?.insurance_claim_peril?.guid)
          showAlertPeril(false)
        }}
      />
    </>
  )
}

FormInsurance = memo(
  FormInsurance,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default FormInsurance
