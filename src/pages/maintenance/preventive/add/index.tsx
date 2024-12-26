import {Title as FormTitle} from '@components/form/Title'
import {Toolbar} from '@components/layout/Toolbar'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {
  errorValidation,
  staticDate,
  staticDayLists,
  staticDayWithId,
  staticMonth,
  useTimeOutMessage,
} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {PageTitle} from '@metronic/layout/core'
import AddLocation from '@pages/location/AddLocation'
import ValidationSchema from '@pages/maintenance/preventive/add/validationSchema'
import {editPreventive, getDetailPreventive, savePreventive} from '@pages/maintenance/Service'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {getDatabaseWorkOrder} from '@pages/setup/databases/Serivce'
import AddMaintenanceCategory from '@pages/setup/maintenance/maintenance-category/AddMaintenanceCategory'
import AddUser from '@pages/user-management/user/AddUser'
import {Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import AddFile from './add-file/AddFile'
import FormFirst from './form-first/FormFirst'

const ToolBarElement: FC<any> = ({isValid, isSubmitting, loading, setErrForm, data}) => {
  const navigate: any = useNavigate()
  return (
    <Toolbar dir='right'>
      <Button
        type='button'
        disabled={loading}
        className='btn btn-sm btn-secondary mx-2 radius-50'
        onClick={() => {
          setErrForm(true)
          if (data?.title !== '') {
            navigate('/maintenance/preventive')
          } else {
            navigate('/maintenance/preventive')
          }
        }}
      >
        Cancel
      </Button>
      <button
        disabled={!isValid} // || isSubmitting
        type='submit'
        className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 py-1 ps-1 pe-3 border border-primary'
      >
        <div
          className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
          style={{background: 'rgba(255,255,255,0.35)'}}
        >
          {isSubmitting ? (
            <span className='indicator-progress d-block'>
              <span className='spinner-border spinner-border-sm w-20px h-20px align-middle'></span>
            </span>
          ) : (
            <i className='las la-check fs-4 text-white' />
          )}
        </div>
        <div className='px-2 fw-bold'>{isSubmitting ? 'Please wait...' : 'Save'}</div>
      </button>
    </Toolbar>
  )
}

let AddPreventive: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const dates: any = staticDate() || {}
  const yearly: any = staticMonth() || {}
  const day: any = staticDayWithId() || {}
  const dayList: any = staticDayLists() || {}
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference}: any = preferenceStore || {}

  const [files, setFiles] = useState<any>([])
  const [data, setShowData] = useState<any>({})
  const [userDetail, setUserDetail] = useState<any>()
  const [reloadUser, setReloadUser] = useState<any>(1)
  const [preference, setPreference] = useState<any>({})
  const [validation, setValidation] = useState<any>({})
  const [errForm, setErrForm] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [idPreventive, setIDPreventive] = useState<any>()
  const [frequencyList, setFrequencyList] = useState<any>([])
  const [locationDetail, setLocationDetail] = useState<any>()
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(false)
  const [preventiveSchema, setPreventiveSchema] = useState<any>()
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [defaultCustomField, setDefaultCustomField] = useState([])
  const [phoneCodeSelected, setPhoneCodeSelected] = useState<any>()
  const [showModalUser, setShowModalUser] = useState<boolean>(false)
  const [showModal, setShowModalLocation] = useState<boolean>(false)
  const [databasePreventive, setDatabasePreventive] = useState<any>({})
  const [maintenanceCategoryDetail, setMaintenanceCategoryDetail] = useState<any>()
  const [reloadMaintenanceCategory, setReloadMaintenanceCategory] = useState<number>(1)
  const [showModalMaintenanceCategory, setShowModalMaintenanceCategory] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const {
    maintenance_priority_guid,
    maintenance_category_guid,
    assigned_user_guid,
    assigned_additional_user,
  }: any = databasePreventive || []

  const initValue: any = {
    name: data?.name || '',
    title: data?.title || '',
    duedate: data?.duedate || '',
    duration: data?.duration || '',
    frequency: data?.frequency || null,
    description: data?.description || '',
    manual_ended_at: data?.end_date || '',
    manual_started_at: data?.start_date || '',
    frequency_value: data?.frequency_value || [],
    location_guid: data?.location_guid?.value || '',
    location_label: data?.location_guid?.label || '',
    assigned_user_guid: data?.assigned_user_guid || '',
    end_recurring_date: data?.end_recurring_date || '',
    is_repeat_schedule: data?.frequency !== null ? true : false,
    asset_guid: data?.location_guid !== '' ? data?.asset_guid : '',
    assigned_additional_user: data?.assigned_additional_user || '',
    maintenance_priority_guid: data?.maintenance_priority_guid || '',
    maintenance_category_guid: data?.maintenance_category_guid || '',
    frequency_value_monthly:
      data?.frequency === 'monthly' && data?.frequency_value?.length > 0
        ? data?.frequency_value?.join(',')
        : undefined,
    frequency_value_month:
      data?.frequency === 'yearly' && data?.frequency_value?.length > 0
        ? data?.frequency_value?.[0]?.split(' ')?.[1]
        : undefined,
    frequency_value_day:
      data?.frequency === 'yearly' && data?.frequency_value?.length > 0
        ? data?.frequency_value?.[0]?.split(' ')?.[0]
        : undefined,
  }

  const estimation = (duration: any) => {
    const {day, hour, minute}: any = duration || {}
    let res = 0
    if (duration) {
      res = res + day * 144
      res = res + hour * 60
      res = res + minute
    }
    return duration?.minute !== undefined ? res : duration || 0
  }

  const handleSubmit = (values: any) => {
    setLoading(true)
    const params: any = values

    let frequency_time: any = []
    if (values?.frequency === 'monthly') {
      frequency_time = values?.frequency_value_monthly?.split(',')
    } else if (values?.frequency === 'yearly') {
      frequency_time = [values?.frequency_value_day + ' ' + values?.frequency_value_month]
    } else if (values?.frequency === 'daily' || values?.frequency === 'weekly') {
      frequency_time = frequencyList
    }

    if (values?.duedate) {
      params.duedate = moment(values?.duedate).format('YYYY-MM-DD')
    }

    if (values?.end_recurring_date) {
      params.end_recurring_date = moment(values?.end_recurring_date).format('YYYY-MM-DD')
    }

    if (values?.manual_started_at) {
      params.start_date = moment(values?.manual_started_at).format('YYYY-MM-DD')
      Object.prototype.hasOwnProperty.call(params, 'manual_started_at') &&
        delete params['manual_started_at']
    }

    if (values?.manual_ended_at) {
      params.end_date = moment(values?.manual_ended_at).format('YYYY-MM-DD')
      Object.prototype.hasOwnProperty.call(params, 'manual_ended_at') &&
        delete params['manual_ended_at']
    }

    if (values?.frequency !== null) {
      params.frequency = values?.frequency !== null ? values?.frequency : ''
      params.frequency_value = frequency_time === 0 ? undefined : frequency_time
    }

    if (
      (values?.frequency === null || values?.frequency === undefined) &&
      values?.frequency_value?.length === 0
    ) {
      Object.prototype.hasOwnProperty.call(params, 'frequency') && delete params['frequency']
      Object.prototype.hasOwnProperty.call(params, 'frequency_value') &&
        delete params['frequency_value']
    }

    const additional_user_guid: any =
      values?.assigned_additional_user &&
      Object.keys(values?.assigned_additional_user || {})?.length > 0
        ? values?.assigned_additional_user?.map(({value}: any) => value)
        : []

    params.assigned_user_guid = values?.assigned_user_guid?.value || values?.assigned_user_guid
    params.asset_guid = values?.asset_guid?.value || ''
    params.assigned_additional_user = additional_user_guid || []
    params.location_guid = values?.location_guid?.value || values?.location_guid || ''
    params.maintenance_category_guid =
      values?.maintenance_category_guid?.value || values?.maintenance_category_guid || ''
    // params.team_guid = values?.team_guid?.value || values?.team_guid || ''
    params.maintenance_priority_guid = values?.maintenance_priority_guid?.value || ''
    Object.prototype.hasOwnProperty.call(params, 'team_guid') && delete params['team_guid']
    Object.prototype.hasOwnProperty.call(params, 'maintenance_schedule_guid') &&
      delete params['maintenance_schedule_guid']
    Object.prototype.hasOwnProperty.call(params, 'po_number') && delete params['po_number']
    Object.prototype.hasOwnProperty.call(params, 'tasks') && delete params['tasks']
    Object.prototype.hasOwnProperty.call(params, 'is_repeat_schedule') &&
      delete params['is_repeat_schedule']
    Object.prototype.hasOwnProperty.call(params, 'frequency_value_monthly') &&
      delete params['frequency_value_monthly']
    Object.prototype.hasOwnProperty.call(params, 'frequency_value_month') &&
      delete params['frequency_value_month']
    Object.prototype.hasOwnProperty.call(params, 'frequency_value_day') &&
      delete params['frequency_value_day']
    Object.prototype.hasOwnProperty.call(params, 'time_log') && delete params['time_log']
    Object.prototype.hasOwnProperty.call(params, 'documents') && delete params['documents']
    Object.prototype.hasOwnProperty.call(params, 'is_flag') && delete params['is_flag']
    Object.prototype.hasOwnProperty.call(params, 'is_star') && delete params['is_star']
    Object.prototype.hasOwnProperty.call(params, 'linked_maintenances') &&
      delete params['linked_maintenances']

    params?.files !== undefined &&
      Object.prototype.hasOwnProperty.call(params?.files, 'videos') &&
      delete params.files['videos']

    if (
      params?.files !== undefined &&
      Object.prototype.hasOwnProperty.call(params?.files, 'photos')
    ) {
      params.files['photos'] = params?.files['photos'] !== null ? params?.files['photos'] : []
    }

    if (
      params?.files !== undefined &&
      Object.prototype.hasOwnProperty.call(params?.files, 'others')
    ) {
      params.files['others'] = params?.files['others'] !== null ? params?.files['others'] : []
    }

    Object.prototype.hasOwnProperty.call(params, 'location_label') &&
      delete params['location_label']

    if (idPreventive !== undefined) {
      editPreventive(params, idPreventive)
        .then(({data: {message}}: any) => {
          setLoading(false)
          useTimeOutMessage('clear', 100)
          useTimeOutMessage('success', 150, message)
          setTimeout(() => navigate('/maintenance/preventive'), 500) //detail/' + idPreventive
        })
        .catch((e: any) => {
          setLoading(false)
          setValidation(errorValidation(e))
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
        })
    } else {
      savePreventive(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          useTimeOutMessage('clear', 100)
          useTimeOutMessage('success', 150, message)
          setTimeout(() => navigate('/maintenance/preventive'), 500) //detail/' + data?.data?.guid
        })
        .catch((e: any) => {
          setLoading(false)
          setValidation(errorValidation(e))
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
        })
    }
  }

  useEffect(() => {
    if (dataPreference) {
      const {date_format, time_format, timezone, default_company_guid}: any = dataPreference || {}
      setPreference({
        date_format: date_format,
        time_format: time_format,
        timezone: timezone,
        default_company_guid: default_company_guid,
      })
    }
  }, [dataPreference])

  useEffect(() => {
    setLoading(true)
    getCustomField({filter: {section_type: 'maintenance'}}).then(
      ({data: {data: res_custom_field}}: any) => {
        setDefaultCustomField(res_custom_field)
        setTimeout(() => setLoading(false), 2000)
      }
    )

    getDatabaseWorkOrder({}).then(({data: {data: result}}: any) => {
      result && setDatabasePreventive(keyBy(result, 'field'))
    })
  }, [])

  useEffect(() => {
    const urlSearchParams: any = new URLSearchParams(window?.location?.search)
    const params = Object.fromEntries(urlSearchParams.entries())
    const {id} = params || {}

    setIDPreventive(id)
    setLoadingForm(true)
    if (id !== undefined) {
      getDetailPreventive(id)
        .then(({data: {data: res}}: any) => {
          if (res) {
            const resData: any = {}
            Object.keys(res || {})?.forEach((m: any) => {
              const ignore: any = [
                'status',
                'wo_title',
                'guid',
                'wo_id',
                'is_archive',
                'timer_mode',
                'created_at',
                'updated_at',
                'activity_status_action',
                'signature_file',
                'signature_comment',
                'parts',
                'scheduler_settings',
                'request_files',
                'equipment',
                'maintenance_type',
                'repeating_schedule',
                'maintenance_priority',
                'worker',
                'location',
                'asset',
                'asset_category',
                'created_by',
                'approval',
                'is_flag',
              ]

              if (m === 'wo_title') {
                resData['title'] = res[m]
              } else if (m === 'status') {
                resData['maintenance_status_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'asset') {
                resData['asset_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'location') {
                resData['location_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'repeating_schedule') {
                resData['maintenance_schedule_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'maintenance_type') {
                resData['maintenance_category_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'worker') {
                resData['assigned_user_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'maintenance_priority') {
                resData['maintenance_priority_guid'] = res[m]?.guid
                  ? {value: res[m]?.guid, label: res[m]?.name}
                  : ''
              } else if (m === 'additional_worker') {
                if (res[m]?.length > 0) {
                  resData['assigned_additional_user'] = res?.[m]?.map(({guid, name}: any) => {
                    return {
                      label: name,
                      value: guid,
                    }
                  })
                } else {
                  resData['assigned_additional_user'] = []
                }
              } else if (m === 'duration') {
                resData['duration'] = estimation(res[m]) || 0
              } else if (ignore?.includes(m)) {
                return false
              } else {
                resData[m] = res[m]
              }
            })
            setShowData(resData)
            setFrequencyList(res?.frequency_value)
            setTimeout(() => setLoadingForm(false), 3000)
          }
        })
        .catch(() => {
          setShowData({})
          setFrequencyList([])
          setTimeout(() => setLoadingForm(false), 3000)
        })
    } else {
      const data: any = {
        title: '',
        duedate: '',
        duration: '',
        frequency: null,
        description: '',
        manual_ended_at: '',
        manual_started_at: '',
        is_repeat_schedule: false,
      }

      setShowData(data)
      setFrequencyList([])
      setTimeout(() => setLoadingForm(false), 3000)
    }
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({
          id:
            data?.title !== ''
              ? 'MENU.MAINTENANCE.PREVENTIVE.UPDATE'
              : 'MENU.MAINTENANCE.PREVENTIVE.ADD',
        })}
      </PageTitle>

      {loadingForm ? (
        <PageLoader />
      ) : (
        <>
          <div className='card card-custom'>
            <div className='card-body p-0'>
              <Formik
                enableReinitialize
                onSubmit={handleSubmit}
                initialValues={initValue}
                validationSchema={preventiveSchema}
              >
                {({
                  values,
                  setFieldValue,
                  setSubmitting,
                  isSubmitting,
                  errors,
                  isValidating,
                }: any) => {
                  if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
                    ToastMessage({
                      message: `${require_filed_message}`,
                      type: 'error',
                    })
                    setErrForm(false)
                    setSubmitting(false)
                  }

                  if (
                    isSubmitting &&
                    isValidating &&
                    !errForm &&
                    Object.keys(errors || {})?.length > 0
                  ) {
                    ToastMessage({
                      message: `${require_filed_message}`,
                      type: 'error',
                    })
                    setErrForm(false)
                  }

                  if (isSubmitting && Object.keys(errors || {})?.length > 0) {
                    ScrollTopComponent.goTop()
                  }

                  return (
                    <Form className='justify-content-center' noValidate>
                      <div className='row'>
                        <FormTitle title='Preventive Details' sticky={false} />
                        <FormFirst
                          yearly={yearly}
                          data={data}
                          setFieldValue={setFieldValue}
                          values={values}
                          frequencyList={frequencyList}
                          setFrequencyList={setFrequencyList}
                          dayList={dayList}
                          dates={dates}
                          day={day}
                          setLocationDetail={setLocationDetail}
                          setShowModalLocation={setShowModalLocation}
                          reloadLocation={reloadLocation}
                          setUserDetail={setUserDetail}
                          setShowModalUser={setShowModalUser}
                          reloadUser={reloadUser}
                          setMaintenanceCategoryDetail={setMaintenanceCategoryDetail}
                          setShowModalMaintenanceCategory={setShowModalMaintenanceCategory}
                          reloadMaintenanceCategory={reloadMaintenanceCategory}
                          setFiles={setFiles}
                          database={databasePreventive}
                          defaultCustomField={defaultCustomField}
                          errors={errors}
                          onClickForm={onClickForm}
                        />
                      </div>

                      <div className='mt-5'>
                        <FormTitle title='Documents Required' sticky={false} />
                        <AddFile
                          validation={validation}
                          setFieldValue={setFieldValue}
                          files={data?.files}
                        />
                      </div>

                      <ToolBarElement
                        isValid={!errors?.length}
                        isSubmitting={isSubmitting}
                        loading={loading}
                        setErrForm={setErrForm}
                        data={data}
                      />
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>

          <AddMaintenanceCategory
            showModal={showModalMaintenanceCategory}
            setShowModal={setShowModalMaintenanceCategory}
            setReloadMaintenanceCategory={setReloadMaintenanceCategory}
            reloadMaintenanceCategory={reloadMaintenanceCategory}
            detailMaintenanceCategory={maintenanceCategoryDetail}
          />

          <AddUser
            showModal={showModalUser}
            userDetail={userDetail}
            setShowModalUser={setShowModalUser}
            setReloadUser={setReloadUser}
            reloadUser={reloadUser}
            phoneCodeSelected={phoneCodeSelected}
            setPhoneCodeSelected={setPhoneCodeSelected}
            preference={preference}
            files={files}
            setFiles={setFiles}
            defaultRole={'worker'}
          />

          <AddLocation
            showModal={showModal}
            setShowModalLocation={setShowModalLocation}
            setReloadLocation={setReloadLocation}
            reloadLocation={reloadLocation}
            locationDetail={locationDetail}
            onClickForm={onClickForm}
            setOnClickForm={setOnClickForm}
            SetAddDataModal={undefined}
            modalType={undefined}
          />

          <ValidationSchema
            checkPriority={maintenance_priority_guid}
            checkCategory={maintenance_category_guid}
            checkWorker={assigned_user_guid}
            checkAdditionalWorker={assigned_additional_user}
            setPreventiveSchema={setPreventiveSchema}
          />
        </>
      )}
    </>
  )
}

AddPreventive = memo(AddPreventive, (prev: any, next: any) => prev?.trigger === next?.trigger)
export default AddPreventive
