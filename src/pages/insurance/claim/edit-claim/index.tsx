/* eslint-disable react-hooks/exhaustive-deps */
import {ButtonPill} from '@components/button'
import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getDocument} from '@pages/setup/insurance/claim-document/Service'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {Form, Formik} from 'formik'
import {omit} from 'lodash'
import moment from 'moment'
import {FC, useEffect, useRef, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'

import {editInsuranceClaim, getAccessEdit, getDetailInsuranceClaim, getPerils} from '../Service'
import AddRONumber from './AddRONumber'
import BlockEdit from './BlockFiles'
import {DefaultFormChange} from './DefaultFormChange'
import FormInsurance from './FormInsurance'
import MandatoryEdit from './MandatoryEdit'
import TableDocument from './TableDocument'
import TableInvoice from './TableInvoice'
import TableRONumber from './TableRONumber'
import {UnsaveFormConfirm} from './UnsaveFormConfirm'

const validationSchema = Yup.object().shape({
  incident_timestamp: Yup.string().nullable(),
  police_report_date: Yup.string()
    .test({
      name: 'invoice_date',
      test: function () {
        const {police_report_date, incident_timestamp} = this.parent || {}

        if (incident_timestamp !== undefined) {
          const currentDate: any = moment(police_report_date).format('YYYY-MM-DD')
          const IncidentDate: any = moment(incident_timestamp).format('YYYY-MM-DD')
          if (moment(currentDate).isBefore(IncidentDate)) {
            return this.createError({
              message: `Police Report Date should be after Incident Date and Time`,
            })
          }
        }
        return true
      },
    })
    .nullable(),
  claim_time: Yup.string()
    .test({
      name: 'invoice_date',
      test: function () {
        const {claim_time, incident_timestamp} = this.parent || {}

        const currentDate: any = moment(claim_time).format('YYYY-MM-DD')
        const IncidentDate: any = moment(incident_timestamp).format('YYYY-MM-DD')

        if (moment(currentDate).isBefore(IncidentDate)) {
          return this.createError({
            message: `Report Time should be after Incident Date and Time`,
          })
        }
        return true
      },
    })
    .nullable(),
})

const CardEditInsurance: FC<any> = () => {
  const navigate: any = useNavigate()
  const params_url: any = useParams()
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const permissions: any = user?.permissions?.map(({name}: any) => name)
  const queryClient: any = useQueryClient()
  const formRef: any = useRef()

  const [reload, setReload] = useState<boolean>(false)
  const [validation, setValidation] = useState<any>({})
  const [idInsurance, setIDInsurance] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [blank_mandatory, setMandatoryBlank] = useState<any>([])
  const [incidentTimestamp, setIncidentTimestamp] = useState<any>({})
  const [showAddRONumber, setShowAddRONumber] = useState<boolean>(false)
  const [messageBlockEdit, setMessageBlockEdit] = useState<boolean>(false)
  const [temporaryDataConfirm, setTemporaryDataConfirm] = useState<any>([])
  const [showBlankMandatory, setShowBlankMandatory] = useState<boolean>(false)
  const [showModalBlockEdit, setShowModalBlockEdit] = useState<boolean>(false)
  const [formChange, setFormChange] = useState<any>(DefaultFormChange)
  const [showModalConfimSave, setShowModalConfimSave] = useState<boolean>(false)
  const [keepOnPage, setKeepOnPage] = useState<boolean>(false)
  const [reloadData, setReloadData] = useState<any>(0)
  const [confirmAction, setConfirmAction] = useState<string>('')
  const [tmpRO, setTmpRO] = useState<any>([])
  const [tmpLocation, setTmpLocation] = useState<any>({})
  const [currentValue, setCurrentValue] = useState<any>({})

  // Table invoice
  const [detailInvoice, setDetailInvoice] = useState<any>()
  const [showAddInvoice, setShowAddInvoice] = useState<boolean>(false)
  const [, setShowModalDelete] = useState<boolean>(false) //showModalDelete
  const [showModalDeleteDoc, setShowModalDeleteDoc] = useState<boolean>(false)
  const [showModalDeleteInvoice, setShowModalDeleteInvoice] = useState<boolean>(false)
  const [mode, setMode] = useState<string>('')
  // table document
  const [showModalDoc, setShowModalDocument] = useState<boolean>(false)
  const [guidDoc, setShowGuidDocument] = useState<any>('')
  const [detailDoc, setDetailDoc] = useState<any>()

  const detailInsuranceClaimKey: any = [
    'getDetailInsuranceClaim',
    {params_url, tmpRO, reload, reloadData},
  ]

  const dataDocumentQuery: any = useQuery({
    queryKey: ['getDocumentInsuranceClaim'],
    queryFn: async () => {
      const res: any = await getDocument({limit: 1000})
      const dataResult: any = res?.data?.data || []
      return dataResult
    },
  })
  const optionDocument: any = dataDocumentQuery?.data || []

  const dataPerilsQuery: any = useQuery({
    queryKey: ['getPerilsInsuranceClaim'],
    queryFn: async () => {
      const res: any = await getPerils({limit: 1000})
      const dataResult: any = res?.data?.data || []
      return dataResult
    },
  })
  const optionPerils: any = dataPerilsQuery?.data || []

  useEffect(() => {
    const {guid} = params_url || {}
    setIDInsurance(guid)
  }, [reload, reloadData])

  useQuery({
    queryKey: ['getAccessEdit', {params_url, reload, reloadData}],
    queryFn: async () => {
      const {guid} = params_url || {}
      if (guid) {
        const api: any = await getAccessEdit(guid)
        const res: any = api?.data?.data || {}
        if (res?.message) {
          setMessageBlockEdit(res?.message)
          setShowModalBlockEdit(true)
        } else {
          setShowModalBlockEdit(false)
        }
        return []
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: (err: any) => {
      const {message} = err?.data || {}
      if (message) {
        setMessageBlockEdit(message)
        setShowModalBlockEdit(true)
      }
    },
  })

  const detailInsuranceClaimQuery: any = useQuery({
    queryKey: detailInsuranceClaimKey,
    queryFn: async () => {
      const {guid} = params_url || {}
      if (guid) {
        const res: any = await getDetailInsuranceClaim(guid)
        const dataResult: any = res?.data?.data || []
        if (tmpRO?.length > 0) {
          dataResult.ro_data_infos = tmpRO
        }
        return {
          currentPeril: dataResult?.insurance_claim_peril,
          detailInsuranceClaim: {...dataResult, ...tmpLocation},
        }
      } else {
        return {currentPeril: {}, detailInsuranceClaim: {}}
      }
    },
  })
  const {currentPeril, detailInsuranceClaim}: any = detailInsuranceClaimQuery?.data || {}
  const loadingPage: any = !detailInsuranceClaimQuery?.isFetched && !detailInsuranceClaim?.guid

  const handleSubmit = (values: any) => {
    setLoading(true)

    const params: any = omit(values, ['ro_status'])
    const {ro_data_infos} = values || {}
    params.documents = detailInsuranceClaim?.documents || []
    params.insurance_claim_peril = detailInsuranceClaim?.insurance_claim_peril || {}
    if (!moment(params?.invoice_date).isValid()) {
      params.invoice_date = moment().format('YYYY-MM-DD')
    }

    if (ro_data_infos?.length > 0) {
      const tmp_ro_data_infos: any = ro_data_infos?.map((e: any) => ({
        ...e,
        invoice_date: e?.invoice_date === 'N/A' ? '' : e?.invoice_date,
        ro_status_guid: e?.ro_status?.value || e?.ro_status?.guid,
        ro_status: {
          value: e?.ro_status?.value || e?.ro_status?.guid,
          label: e?.ro_status?.label || e?.ro_status?.name,
        },
      }))
      params.ro_data_infos = tmp_ro_data_infos
    }

    if (values?.police_report_date === 'N/A') {
      params.police_report_date = ''
    }

    if (values?.import_date_and_time) {
      params.import_date_and_time = moment(values.import_date_and_time).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }

    if (values?.ro_status?.guid !== undefined && values?.ro_status?.guid !== null) {
      params.ro_status = values?.ro_status
    } else {
      params.ro_status = ''
    }

    if (values?.claim_time !== 'Invalid date') {
      params.claim_time = values.claim_time
    } else {
      params.claim_time = ''
    }

    if (values?.police_report_date !== 'Invalid date') {
      params.police_report_date = values.police_report_date
    } else {
      params.police_report_date = ''
    }

    if (values?.incident_timestamp !== 'Invalid date') {
      params.incident_timestamp = values.incident_timestamp
    } else {
      params.incident_timestamp = ''
    }

    const successMessage = (message: any) => {
      setTimeout(() => ToastMessage({type: 'clear'}), 300)
      setTimeout(() => ToastMessage({message, type: 'success'}), 400)
    }

    editInsuranceClaim(params, idInsurance)
      .then(({data: {message}}) => {
        successMessage(message)
        setLoading(false)
        setTemporaryDataConfirm([])
        queryClient.invalidateQueries({queryKey: detailInsuranceClaimKey})
        if (!keepOnPage) {
          setTimeout(() => {
            navigate('/insurance-claims/' + idInsurance + '/detail')
          }, 500)
        } else {
          setReloadData(reloadData + 1)
          setLoading(false)
          setShowBlankMandatory(false)
          setShowModalConfimSave(false)
          setFormChange(DefaultFormChange)
        }
        setKeepOnPage(false)
      })
      .catch((e: any) => {
        setLoading(false)
        setValidation(errorValidation(e))
        Object.values(errorValidation(e))?.forEach((message: any) => {
          if (message !== 'error.err_insurance_claim_blank_mandatory_fields') {
            ToastMessage({message, type: 'error'})
          }
        })

        const {data: res} = e?.response || {}
        const {data} = res || {}
        const {blank_mandatory_fields} = data || {}
        if (blank_mandatory_fields) {
          setMandatoryBlank(blank_mandatory_fields)
          setShowBlankMandatory(true)
          setTemporaryDataConfirm(params)
        }
      })
  }

  return (
    <div className='card card-custom'>
      <div className='card-body px-0'>
        <Formik
          innerRef={formRef}
          initialValues={{
            ...detailInsuranceClaim,
            ...(formRef?.current?.values || {}),
            ...(currentValue || {}),
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({setFieldValue, values, resetForm}) => (
            <Form className='justify-content-center' noValidate>
              <div className='row'>
                <FormInsurance
                  detail={detailInsuranceClaim}
                  loading={loadingPage}
                  setShowData={(e: any) => {
                    queryClient.setQueryData(
                      detailInsuranceClaimKey,
                      ({currentPeril, detailInsuranceClaim}: any) => {
                        const detailInsuranceClaimCurrent: any = {
                          currentPeril,
                          detailInsuranceClaim: {
                            ...detailInsuranceClaim,
                            ...(formRef?.current?.values || {}),
                            documents: e?.documents || [],
                          },
                        }
                        return detailInsuranceClaimCurrent
                      }
                    )
                  }}
                  setFieldValue={(key: any, val: any) => {
                    setFieldValue(key, val)
                    if (['sitename', 'sitename_id', 'location_guid', 'location']?.includes(key)) {
                      setTmpLocation((prev: any) => {
                        return {...prev, [key]: val}
                      })
                    } else {
                      setCurrentValue({[key]: val})
                      formRef?.current?.setValues((prev: any) => ({...prev, [key]: val}))
                    }
                  }}
                  values={values}
                  optionPerils={optionPerils}
                  optionDocument={optionDocument}
                  setIncidentTimestamp={setIncidentTimestamp}
                  validation={validation}
                  reload={reload}
                  setReload={setReload}
                  formChange={formChange}
                  setFormChange={setFormChange}
                />
              </div>
              <div className='mt-5'>
                <div className='mb-3 pt-4'>
                  <ButtonPill
                    title='Add RO Number'
                    icon='plus'
                    radius={5}
                    onClick={() => {
                      setShowAddRONumber(true)
                      // setIncidentTimestamp(incidentTimestamp)
                    }}
                  />
                </div>
                <TableRONumber
                  id={idInsurance}
                  data={detailInsuranceClaim}
                  loadingPage={loadingPage}
                  setFieldValue={setFieldValue}
                  incidentTimestamp={incidentTimestamp}
                  setIncidentTimestamp={setIncidentTimestamp}
                  currentPeril={currentPeril}
                  onChange={(e: any) => {
                    queryClient.setQueryData(
                      detailInsuranceClaimKey,
                      ({currentPeril, detailInsuranceClaim}: any) => {
                        const tmpData: any = e || []
                        setTmpRO(tmpData)
                        const detailInsuranceClaimCurrent: any = {
                          ...detailInsuranceClaim,
                          ...(formRef?.current?.values || {}),
                          ro_data_infos: tmpData,
                        }
                        formRef?.current?.setValues(detailInsuranceClaimCurrent)
                        return {
                          currentPeril,
                          detailInsuranceClaim: detailInsuranceClaimCurrent,
                        }
                      }
                    )
                  }}
                />
              </div>
              <div className='mt-5'>
                <TableInvoice
                  data={detailInsuranceClaim}
                  loadingPage={loadingPage}
                  setReload={setReload}
                  reload={reload}
                  permissions={permissions}
                  formChange={formChange}
                  setShowModalConfimSave={setShowModalConfimSave}
                  detailInvoice={detailInvoice}
                  setDetailInvoice={setDetailInvoice}
                  showAddInvoice={showAddInvoice}
                  setShowAddInvoice={setShowAddInvoice}
                  showModalDelete={showModalDeleteInvoice}
                  setShowModalDelete={setShowModalDeleteInvoice}
                  mode={mode}
                  setMode={setMode}
                  setConfirmAction={setConfirmAction}
                />
              </div>
              <div className='mt-5 mb-5'>
                <div className='mb-3 pt-4 fw-bolder'>Documents :</div>
                <TableDocument
                  permissions={permissions}
                  data={detailInsuranceClaim}
                  loadingPage={loadingPage}
                  setReload={setReload}
                  reload={reload}
                  optionDocument={optionDocument}
                  currentPeril={currentPeril}
                  user={user}
                  formChange={formChange}
                  setShowModalConfimSave={setShowModalConfimSave}
                  guidDoc={guidDoc}
                  setShowGuidDocument={setShowGuidDocument}
                  detailDoc={detailDoc}
                  setDetailDoc={setDetailDoc}
                  showModalDoc={showModalDoc}
                  setShowModalDocument={setShowModalDocument}
                  showModalDelete={showModalDeleteDoc}
                  setShowModalDelete={setShowModalDeleteDoc}
                  mode={mode}
                  setMode={setMode}
                  setConfirmAction={setConfirmAction}
                />
              </div>
              <div className='float-end p-5 mt-5'>
                <button
                  type='button'
                  disabled={loading}
                  className='btn btn-sm btn-secondary mx-2'
                  onClick={() => navigate('/insurance-claims/' + idInsurance + '/detail')}
                >
                  Cancel
                </button>
                <button type='submit' disabled={loading} className='btn btn-sm btn-primary'>
                  {!loading && <span className='indicator-label'>Save</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
              <UnsaveFormConfirm
                showModal={showModalConfimSave}
                setShowModal={setShowModalConfimSave}
                handleSubmit={handleSubmit}
                setKeepOnPage={setKeepOnPage}
                values={values}
                detailInvoice={detailInvoice}
                setDetailInvoice={setDetailInvoice}
                setShowAddInvoice={setShowAddInvoice}
                setShowModalDelete={setShowModalDelete}
                setMode={setMode}
                resetForm={resetForm}
                setFormChange={setFormChange}
                confirmAction={confirmAction}
                setConfirmAction={setConfirmAction}
                detailDoc={detailDoc}
                setDetailDoc={setDetailDoc}
                guidDoc={guidDoc}
                setShowGuidDocument={setShowGuidDocument}
                setShowModalDocument={setShowModalDocument}
              />
            </Form>
          )}
        </Formik>
      </div>

      <AddRONumber
        id={idInsurance}
        setShowModal={setShowAddRONumber}
        incidentTimestamp={incidentTimestamp}
        showModal={showAddRONumber}
        data={{}}
        setShowData={(e: any) => {
          queryClient.setQueryData(
            detailInsuranceClaimKey,
            ({currentPeril, detailInsuranceClaim}: any) => {
              const tmpData: any = (detailInsuranceClaim?.ro_data_infos || []).concat(e)
              setTmpRO(tmpData)
              const detailInsuranceClaimCurrent: any = {
                ...detailInsuranceClaim,
                ...(formRef?.current?.values || {}),
                ro_data_infos: tmpData,
              }
              formRef?.current?.setValues(detailInsuranceClaimCurrent)
              return {
                currentPeril,
                detailInsuranceClaim: detailInsuranceClaimCurrent,
              }
            }
          )
        }}
      />
      <MandatoryEdit
        setShowModal={setShowBlankMandatory}
        showModal={showBlankMandatory}
        mandatory={blank_mandatory}
        temporaryDataConfirm={temporaryDataConfirm}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <BlockEdit
        showModal={showModalBlockEdit}
        setShowModal={setShowModalBlockEdit}
        id={idInsurance}
        message={messageBlockEdit}
      />
    </div>
  )
}

const InsuranceClaimEdit: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.INSURANCE.CLAIM_UPDATE'})}
      </PageTitle>
      <CardEditInsurance />
    </>
  )
}

export default InsuranceClaimEdit
