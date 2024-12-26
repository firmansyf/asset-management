import Prompt from '@components/alert/prompt'
import {Title as FormTitle} from '@components/form/Title'
import {Toolbar} from '@components/layout/Toolbar'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {
  errorValidation,
  hasPermission,
  staticDate,
  staticDayLists,
  staticDayWithId,
  staticMonth,
  useTimeOutMessage,
} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {PageTitle} from '@metronic/layout/core'
import AddLocation from '@pages/location/AddLocation'
import ValidationSchemaLocation from '@pages/location/ValidationSchema'
import {editWorkOrder, getDetailWorkOrder, saveWorkOrder} from '@pages/maintenance/Service'
import {TableInventory} from '@pages/maintenance/work-order/add/maintenance-inven/tableInventory'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {getDatabaseLocation, getDatabaseWorkOrder} from '@pages/setup/databases/Serivce'
import AddMaintenanceCategory from '@pages/setup/maintenance/maintenance-category/AddMaintenanceCategory'
import AddUser from '@pages/user-management/user/AddUser'
import {Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'

import ValidationWo from '../validationSchema'
import AddFile from './add-file/AddFile'
import FormFirst from './form-first/FormFirst'
import FormSecond from './form-second/FormSecond'

let WorkOrderAdd: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const location: any = useLocation()
  const dates: any = staticDate() || {}
  const yearly: any = staticMonth() || {}
  const day: any = staticDayWithId() || {}
  const dayList: any = staticDayLists() || {}

  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference}: any = preferenceStore || {}

  const [files, setFiles] = useState<any>([])
  const [data, setShowData] = useState<any>({})
  const [values, setValues] = useState<any>({})
  const [userDetail, setUserDetail] = useState<any>()
  const [reloadUser, setReloadUser] = useState<any>(1)
  const [preference, setPreference] = useState<any>({})
  const [idWorkOrder, setIDWorkOrder] = useState<any>()
  const [validation, setValidation] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [frequencyList, setFrequencyList] = useState<any>([])
  const [locationDetail, setLocationDetail] = useState<any>()
  const [valuesStat, setValuesStat] = useState<boolean>(false)
  const [workOrderSchema, setWorkOrderSchema] = useState<any>()
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(false)
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [phoneCodeSelected, setPhoneCodeSelected] = useState<any>()
  const [showModalUser, setShowModalUser] = useState<boolean>(false)
  const [showModal, setShowModalLocation] = useState<boolean>(false)
  const [databaseWorkOrder, setDatabaseWorkOrder] = useState<any>({})
  const [checkCityLocation, setCheckCityLocation] = useState<any>([])
  const [_defaultCustomField, setDefaultCustomField] = useState<any>([])
  const [checkStateLocation, setCheckStateLocation] = useState<any>([])
  const [checkStreetLocation, setCheckStreetLocation] = useState<any>([])
  const [checkCountryLocation, setCheckCountryLocation] = useState<any>([])
  const [checkAddressLocation, setCheckAddressLocation] = useState<any>([])
  const [checkPostcodeLocation, setCheckPostcodeLocation] = useState<any>([])
  const [checkLatitudeLocation, setCheckLatitudeLocation] = useState<any>([])
  const [locationSchemaLocation, setLocationSchemaLocation] = useState<any>([])
  const [checkLongitudeLocation, setCheckLongitudeLocation] = useState<any>([])
  const [checkDescriptionLocation, setCheckDescriptionLocation] = useState<any>([])
  const [maintenanceCategoryDetail, setMaintenanceCategoryDetail] = useState<any>()
  const [reloadMaintenanceCategory, setReloadMaintenanceCategory] = useState<number>(1)
  const [showModalMaintenanceCategory, setShowModalMaintenanceCategory] = useState<boolean>(false)

  const {
    maintenance_priority_guid,
    maintenance_category_guid,
    assigned_user_guid,
    assigned_additional_user,
  }: any = databaseWorkOrder || []

  const addFilesPermission: any = hasPermission('maintenance.add-files') || false

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
    if (showModal || showModalMaintenanceCategory || showModalUser) {
      ToastMessage({type: 'clear'})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const urlSearchParams: any = new URLSearchParams(window.location.search)
    const params: any = Object.fromEntries(urlSearchParams?.entries())
    const {id}: any = params || {}

    setIDWorkOrder(id)
    setLoadingForm(true)
    if (id !== undefined) {
      getDetailWorkOrder(id)
        .then(({data: {data: res}}: any) => {
          if (res) {
            const resData: any = {}
            Object.keys(res || {})?.forEach((m: any) => {
              const ignore: any = [
                'status',
                'wo_title',
                // 'guid',
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
                resData['title'] = res?.[m]
              } else if (m === 'status') {
                resData['maintenance_status_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'asset') {
                resData['asset_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'location') {
                resData['location_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'repeating_schedule') {
                resData['maintenance_schedule_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'maintenance_type') {
                resData['maintenance_category_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'worker') {
                resData['assigned_user_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'maintenance_priority') {
                resData['maintenance_priority_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'additional_worker') {
                if (res?.[m]?.length > 0) {
                  resData['assigned_additional_user'] = res?.[m]?.map(({guid, name}: any) => {
                    return {
                      label: name,
                      value: guid,
                    }
                  })
                } else {
                  resData['assigned_additional_user'] = []
                }
              } else if (m === 'team') {
                resData['team_guid'] = res?.[m]?.guid
                  ? {value: res?.[m]?.guid, label: res?.[m]?.name}
                  : ''
              } else if (m === 'duration') {
                resData['duration'] = estimation(res?.[m]) || 0
              } else if (ignore?.includes(m)) {
                return false
              } else {
                resData[m] = res?.[m]
              }
            })
            setShowData(resData || {})
            setFrequencyList(res?.frequency_value as never[])
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
        description: '',
        manual_started_at: '',
        manual_ended_at: '',
        duedate: '',
        frequency: null,
        is_repeat_schedule: false,
        duration: '',
      }

      setShowData(data)
      setFrequencyList([])
      setTimeout(() => setLoadingForm(false), 3000)
    }

    getDatabaseWorkOrder({}).then(({data: {data: result}}: any) => {
      result && setDatabaseWorkOrder(keyBy(result, 'field'))
    })

    getDatabaseLocation({}).then(({data: {data: result}}: any) => {
      if (result) {
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'country_code')
          ?.map((database: any) => setCheckCountryLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'state')
          ?.map((database: any) => setCheckStateLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'city')
          ?.map((database: any) => setCheckCityLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'address')
          ?.map((database: any) => setCheckAddressLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'street')
          ?.map((database: any) => setCheckStreetLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'postcode')
          ?.map((database: any) => setCheckPostcodeLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'description')
          ?.map((database: any) => setCheckDescriptionLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'lat')
          ?.map((database: any) => setCheckLatitudeLocation(database))
        result
          ?.filter((set_location: {field: any}) => set_location?.field === 'long')
          ?.map((database: any) => setCheckLongitudeLocation(database))
      }
    })

    setLoading(true)
    getCustomField({filter: {section_type: 'maintenance'}}).then(
      ({data: {data: res_custom_field}}: any) => {
        setDefaultCustomField(res_custom_field)
        setTimeout(() => setLoading(false), 2000)
      }
    )
  }, [])

  useEffect(() => {
    setValuesStat(false)
    setTimeout(() => {
      Object.keys(values)?.forEach((items: any) => {
        const initData: any = initValue?.[items]?.value || initValue?.[items] || ''
        const valuesData: any = values?.[items]?.value || values?.[items] || ''
        if (items === 'frequency_value') {
          if (values?.[items] && values?.[items]?.length !== initValue?.[items]?.length) {
            setValuesStat(true)
            return false
          }
        } else if (items === 'assigned_user_guid') {
          if (
            values?.[items] &&
            Object.keys(values?.[items])?.length !== Object.keys(initValue?.[items])?.length
          ) {
            setValuesStat(true)
            return false
          }
        } else if (items === 'files') {
          const ImageData: any = data?.[items]?.['photos'] || []
          const VideoData: any = data?.[items]?.['videos'] || []
          const otherData: any = data?.[items]?.['others'] || []
          if (
            values?.[items]?.['others'] &&
            values?.[items]?.['others']?.length !== otherData?.length
          ) {
            setValuesStat(true)
            return false
          } else if (
            values?.[items]?.['photos'] &&
            values?.[items]?.['photos']?.length !== ImageData?.length
          ) {
            setValuesStat(true)
            return false
          } else if (
            values?.[items]?.['videos'] &&
            values?.[items]?.['videos']?.length !== VideoData?.length
          ) {
            setValuesStat(true)
            return false
          }
        } else if (values?.[items] && valuesData !== initData) {
          setValuesStat(true)
          return false
        }
      })
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, data])

  const estimation = (duration: any) => {
    const {day, hour, minute}: any = duration || {}
    let res: any = 0
    if (duration) {
      res = res + day * 144
      res = res + hour * 60
      res = res + minute
    }
    return duration?.minute !== undefined ? res : duration || 0
  }

  const handleSubmit = (values: any) => {
    setLoading(true)
    const params: any = values || {}

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
      params.manual_started_at = moment(values?.manual_started_at).format('YYYY-MM-DD')
      params.start_date = moment(values?.manual_started_at).format('YYYY-MM-DD')
    }
    if (values?.manual_ended_at) {
      params.manual_ended_at = moment(values?.manual_ended_at).format('YYYY-MM-DD')
      params.end_date = moment(values?.manual_ended_at).format('YYYY-MM-DD')
    }

    if (values?.frequency !== null) {
      params.frequency = values?.frequency !== null ? values?.frequency : ''
      params.frequency_value = frequency_time === 0 ? undefined : frequency_time
    }

    if (values?.frequency_value?.length === 0) {
      params.frequency = null
      params.frequency_value = []
    }

    const additional_user_guid: any =
      values?.assigned_additional_user &&
      Object.keys(values?.assigned_additional_user || {})?.length > 0
        ? values?.assigned_additional_user?.map(({value}: any) => value)
        : []

    params.assigned_user_guid = values?.assigned_user_guid?.value || values?.assigned_user_guid
    params.asset_guid = values?.asset_guid?.value || values?.asset_guid || ''
    params.assigned_additional_user = additional_user_guid || []
    params.location_guid = values?.location_guid?.value || values?.location_guid || ''
    params.maintenance_category_guid =
      values?.maintenance_category_guid?.value || values?.maintenance_category_guid || ''
    params.maintenance_schedule_guid =
      values?.maintenance_schedule_guid?.value || values?.maintenance_schedule_guid || ''
    params.team_guid = values?.team_guid?.value || values?.team_guid || ''
    params.maintenance_priority_guid =
      values?.maintenance_priority_guid?.value || values?.maintenance_priority_guid || ''
    Object.prototype.hasOwnProperty.call(params, 'maintenance_priority') &&
      delete params['maintenance_priority']
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
      params.files['photos'] = params?.files?.['photos'] !== null ? params?.files?.['photos'] : []
    }

    if (
      params?.files !== undefined &&
      Object.prototype.hasOwnProperty.call(params?.files, 'others')
    ) {
      params.files['others'] = params?.files?.['others'] !== null ? params?.files?.['others'] : []
    }

    if (idWorkOrder !== undefined) {
      editWorkOrder(params, idWorkOrder)
        .then(({data: {message}}: any) => {
          setTimeout(() => setLoading(false), 800)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setTimeout(() => {
            navigate('/maintenance/work-order/detail/' + idWorkOrder)
          }, 500)
        })
        .catch((e: any) => {
          setTimeout(() => setLoading(false), 800)
          setValidation(errorValidation(e))
          Object.values(errorValidation(e))?.forEach((message: any) => {
            ToastMessage({
              message: message?.includes('Custom field')
                ? message?.replace('value invalid', 'is required')
                : message,
              type: 'error',
            })
          })
        })
    } else {
      saveWorkOrder(params)
        .then(({data}: any) => {
          setTimeout(() => setLoading(false), 800)
          const {message, data: res} = data || {}
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setTimeout(() => {
            navigate('/maintenance/work-order/detail/' + res?.guid)
          }, 500)
        })
        .catch((e: any) => {
          setTimeout(() => setLoading(false), 800)
          setValidation(errorValidation(e))
          Object.values(errorValidation(e))?.forEach((message: any) => {
            ToastMessage({
              message: message?.includes('Custom field')
                ? message?.replace('value invalid', 'is required')
                : message,
              type: 'error',
            })
          })
        })
    }
  }

  const initValue: any = {
    title: data?.title || '',
    description: data?.description || '',
    maintenance_priority_guid: data?.maintenance_priority_guid || '',
    manual_started_at: data?.manual_started_at || data?.end_date || '',
    manual_ended_at: data?.manual_ended_at || data?.start_date || '',
    duedate: data?.duedate || '',
    end_recurring_date: data?.end_recurring_date || '',
    duration: data?.duration || '',
    maintenance_category_guid: data?.maintenance_category_guid || '',
    location_guid: data?.location_guid?.value || '',
    asset_guid: data?.location_guid !== '' ? data?.asset_guid : '',
    assigned_user_guid: data?.assigned_user_guid || '',
    assigned_additional_user: data?.assigned_additional_user || '',
    frequency: data?.frequency || null,
    is_repeat_schedule: data?.frequency !== null ? true : false,
    team_guid: data?.team_guid || '',
    po_number: data?.po_number || '',
    frequency_value: data?.frequency_value || [],
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

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({
          id:
            data?.title !== ''
              ? 'MENU.MAINTENANCE.WORKORDER.UPDATE'
              : 'MENU.MAINTENANCE.WORKORDER.ADD',
        })}
      </PageTitle>

      {loadingForm ? (
        <PageLoader />
      ) : (
        <>
          <div className='card card-custom'>
            <div className='card-body p-0'>
              <Formik
                initialValues={initValue}
                validationSchema={workOrderSchema}
                enableReinitialize
                onSubmit={handleSubmit}
              >
                {({
                  setFieldValue,
                  values,
                  errors,
                  isSubmitting,
                  isValidating,
                  setSubmitting,
                }: any) => {
                  setValues(values || {})
                  if (
                    isSubmitting &&
                    isValidating &&
                    Object.keys(errors || {})?.length > 0 &&
                    errors?.frequency?.length !== 38
                  ) {
                    ToastMessage({
                      message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
                      type: 'error',
                    })
                    setSubmitting(false)
                  }

                  if (isSubmitting && Object.keys(errors || {})?.length > 0) {
                    ScrollTopComponent.goTop()
                  }

                  return (
                    <>
                      <Prompt
                        when={valuesStat}
                        message='This page contains unsaved changes. Do you still wish to leave the page ?'
                        onLocationChange={() => ''}
                      />
                      <Form className='justify-content-center' noValidate>
                        <div className='row'>
                          <FormTitle title='Work Order Details' sticky={false} />
                          <FormFirst
                            day={day}
                            data={data}
                            dates={dates}
                            yearly={yearly}
                            dayList={dayList}
                            database={databaseWorkOrder}
                            frequencyList={frequencyList}
                            setFrequencyList={setFrequencyList}
                          />

                          <FormSecond
                            data={data}
                            setFiles={setFiles}
                            reloadUser={reloadUser}
                            database={databaseWorkOrder}
                            setUserDetail={setUserDetail}
                            setShowModalUser={setShowModalUser}
                            setLocationDetail={setLocationDetail}
                            setShowModalLocation={setShowModalLocation}
                            reloadMaintenanceCategory={reloadMaintenanceCategory}
                            setMaintenanceCategoryDetail={setMaintenanceCategoryDetail}
                            setShowModalMaintenanceCategory={setShowModalMaintenanceCategory}
                          />
                        </div>

                        {location?.pathname === '/maintenance/work-order/edit' && (
                          <div className='mt-5'>
                            <FormTitle title='Inventory' sticky={false} />
                            <TableInventory idWo={idWorkOrder} />
                          </div>
                        )}

                        {addFilesPermission && (
                          <div className='mt-5'>
                            <FormTitle title='Documents Required' sticky={false} />
                            <AddFile
                              validation={validation}
                              files={data?.files || {}}
                              setFieldValue={setFieldValue}
                            />
                          </div>
                        )}

                        <Toolbar dir='right'>
                          <button
                            type='button'
                            disabled={loading}
                            className='d-inline-flex align-items-center col-auto btn btn-sm btn-secondary radius-50 py-1 ps-1 pe-3 border border-secondary me-3'
                            onClick={() => {
                              if (data?.title !== '') {
                                navigate('/maintenance/work-order/detail/' + idWorkOrder)
                              } else {
                                navigate('/maintenance/work-order')
                              }
                            }}
                          >
                            <div
                              className='btn btn-icon w-25px h-25px btn-secondary rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <i className='las la-times fs-4 text-black' />
                            </div>
                            <div className='px-2 fw-bold'>Cancel</div>
                          </button>
                          <button
                            type='submit'
                            disabled={loading}
                            className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 py-1 ps-1 pe-3 border border-primary'
                          >
                            <div
                              className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              {loading ? (
                                <span className='indicator-progress d-block'>
                                  <span className='spinner-border spinner-border-sm w-20px h-20px align-middle'></span>
                                </span>
                              ) : (
                                <i className='las la-check fs-4 text-white' />
                              )}
                            </div>
                            <div className='px-2 fw-bold'>
                              {loading ? 'Please wait...' : 'Save'}
                            </div>
                          </button>
                        </Toolbar>
                      </Form>
                    </>
                  )
                }}
              </Formik>
            </div>
          </div>

          <AddMaintenanceCategory
            showModal={showModalMaintenanceCategory}
            setShowModal={setShowModalMaintenanceCategory}
            detailMaintenanceCategory={maintenanceCategoryDetail}
            reloadMaintenanceCategory={reloadMaintenanceCategory}
            setReloadMaintenanceCategory={setReloadMaintenanceCategory}
          />

          <AddUser
            files={files}
            setFiles={setFiles}
            defaultRole={'worker'}
            userDetail={userDetail}
            reloadUser={reloadUser}
            preference={preference}
            showModal={showModalUser}
            setReloadUser={setReloadUser}
            setShowModalUser={setShowModalUser}
            phoneCodeSelected={phoneCodeSelected}
            setPhoneCodeSelected={setPhoneCodeSelected}
          />

          <ValidationSchemaLocation
            checkCity={checkCityLocation}
            checkState={checkStateLocation}
            checkStreet={checkStreetLocation}
            checkAddress={checkAddressLocation}
            checkCountry={checkCountryLocation}
            checkPostcode={checkPostcodeLocation}
            checkLatitude={checkLatitudeLocation}
            checkLongitude={checkLongitudeLocation}
            checkDescription={checkDescriptionLocation}
            setLocationSchema={setLocationSchemaLocation}
          />

          <AddLocation
            showModal={showModal}
            onClickForm={onClickForm}
            setOnClickForm={setOnClickForm}
            reloadLocation={reloadLocation}
            locationDetail={locationDetail}
            setReloadLocation={setReloadLocation}
            locationSchema={locationSchemaLocation}
            setShowModalLocation={setShowModalLocation}
          />

          <ValidationWo
            checkWorker={assigned_user_guid}
            setWorkOrderSchema={setWorkOrderSchema}
            checkPriority={maintenance_priority_guid}
            checkCategory={maintenance_category_guid}
            checkAdditionalWorker={assigned_additional_user}
          />
        </>
      )}
    </>
  )
}

WorkOrderAdd = memo(
  WorkOrderAdd,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default WorkOrderAdd
