/* eslint-disable react-hooks/exhaustive-deps */
import {Toolbar} from '@components/layout/Toolbar'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, staticDayLists, useTimeOutMessage} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {PageTitle} from '@metronic/layout/core'
import AddLocation from '@pages/location/AddLocation'
import ValidationSchemaLocation from '@pages/location/ValidationSchema'
import {getDatabaseLocation, getDatabaseRequest} from '@pages/setup/databases/Serivce'
import ModalAddMintenanceCategory from '@pages/setup/maintenance/maintenance-category/AddMaintenanceCategory'
import AddUser from '@pages/user-management/user/AddUser'
import {Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import moment from 'moment'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import {AddRequest, EditRequest, getDetailRequest, updateStatusSingle} from './core/service'
import {FormFirst} from './formAdd/FormFirst'
import {FormSecond} from './formAdd/FormSecond'
import ValidationSchema from './formAdd/ValidationSchema'
import {ModalSingleReject} from './ModalSingleReject'

let AddEditRequest: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const {currentUser: user, preference: preferenceStore}: any = useSelector(
    ({currentUser, preference}: any) => ({currentUser, preference}),
    shallowEqual
  )
  const urlSearchParams: any = new URLSearchParams(window.location.search)
  const params: any = Object.fromEntries(urlSearchParams.entries())
  const {preference: dataPreference}: any = preferenceStore || {}
  const {role_name}: any = user || {}
  const {id}: any = params || {}

  const [files, setFiles] = useState<any>([])
  const [dueDate, setDueDate] = useState<any>()
  const [photos, setPhotos] = useState<any>([])
  const [resGuid, setResGuid] = useState<string>('')
  const [preference, setPreference] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadUser, setReloadUser] = useState<number>(1)
  const [reloadData, setReloadData] = useState<number>(0)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [detailRequest, setDetailRequest] = useState<any>()
  const [locationDetail, setLocationDetail] = useState<any>()
  const [requestSchema, setRequestSchema] = useState<any>([])
  const [frequencyList, setFrequencyList] = useState<any>([])
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [endRecuringDate, setEndRecuringDate] = useState<any>()
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [databaseRequest, setDatabaseRequest] = useState<any>({})
  const [showModalUser, setShowModalUser] = useState<boolean>(false)
  const [checkCityLocation, setCheckCityLocation] = useState<any>([])
  const [checkStateLocation, setCheckStateLocation] = useState<any>([])
  const [showModalReject, setShowModalReject] = useState<boolean>(false)
  const [checkStreetLocation, setCheckStreetLocation] = useState<any>([])
  const [checkCountryLocation, setCheckCountryLocation] = useState<any>([])
  const [checkAddressLocation, setCheckAddressLocation] = useState<any>([])
  const [showModalLocation, setShowModalLocation] = useState<boolean>(false)
  const [checkPostcodeLocation, setCheckPostcodeLocation] = useState<any>([])
  const [checkLatitudeLocation, setCheckLatitudeLocation] = useState<any>([])
  const [checkLongitudeLocation, setCheckLongitudeLocation] = useState<any>([])
  const [locationSchemaLocation, setLocationSchemaLocation] = useState<any>([])
  const [checkDescriptionLocation, setCheckDescriptionLocation] = useState<any>([])
  const [detailMaintenanceCategory, setDetailMaintenanceCategory] = useState<any>()
  const [reloadMaintenanceCategory, setReloadMaintenanceCategory] = useState<number>(0)
  const [showModalMaintentanceCategory, setShowModalMaintenanceCategory] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    if (showModalLocation || showModalUser || showModalMaintentanceCategory) {
      ToastMessage({type: 'clear'})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const OnApproveReject = useCallback(
    (value: any) => {
      let params: any = {}
      if (value === 'approve') {
        params = {
          status: 'approved',
          reason: value?.reason || '',
        }
      }

      updateStatusSingle(params, id)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setReloadData(reloadData + 1)
          ToastMessage({type: 'success', message})
          setTimeout(() => navigate('/maintenance/request'), 1000)
        })
        .catch(() => setLoading(false))
    },
    [id, reloadData, navigate]
  )

  const dayList: any = staticDayLists() || {}

  const setFrequencyTime = (value: any) => {
    if (value?.frequency === 'monthly') {
      return value?.frequency_value_monthly?.split(',')
    } else if (value?.frequency === 'yearly') {
      const customDay: any =
        value?.frequency_value_day < 10
          ? '0' + value?.frequency_value_day
          : value?.frequency_value_day
      return [customDay + ' ' + value?.frequency_value_month]
    } else if (value?.frequency === 'daily' || value?.frequency === 'weekly') {
      return frequencyList
    } else {
      return []
    }
  }

  const setFrequencyValueDay = (detailRequest: any) => {
    if (detailRequest?.frequency === 'yearly') {
      if (detailRequest?.frequency_value?.[0]?.split(' ')?.[0] < 10) {
        return detailRequest?.frequency_value?.[0]?.split(' ')?.[0]?.split('0')?.[1]?.toString()
      } else {
        return detailRequest?.frequency_value?.[0]?.split(' ')?.[0]?.toString()
      }
    } else {
      return ''
    }
  }

  const setAssignedAdditionalUser = (detailRequest: any) => {
    if (detailRequest !== undefined) {
      const data: any = detailRequest?.additional_worker?.map(
        ({worker_guid, worker_name}: any) => ({value: worker_guid || '', label: worker_name || ''})
      )
      return data as never[]
    } else {
      return []
    }
  }

  const paramValValidation = (value_1: any, value_2: any) => {
    if (value_1) {
      return value_1
    } else {
      return value_2
    }
  }

  const errorMessage = (error_response: any) => {
    if (error_response) {
      const {devMessage, data, message}: any = error_response?.data || {}
      if (!devMessage) {
        const {fields}: any = data || {}
        if (fields === undefined) {
          ToastMessage({message, type: 'error'})
        }
        fields &&
          Object.keys(fields || {})?.map((item: any) => {
            if (item === 'frequency_value.0') {
              ToastMessage({message: 'Invalid Date', type: 'error'})
            } else {
              ToastMessage({message: fields?.[item]?.[0], type: 'error'})
            }
            return true
          })
      }
    }
  }

  const handleOnSubmit = (value: any) => {
    setLoading(true)
    let frequency_time: any = []
    frequency_time = setFrequencyTime(value)

    const additional_user_guid: any =
      value?.assigned_additional_user && Object.keys(value?.assigned_additional_user)?.length > 0
        ? value?.assigned_additional_user?.map(({value}: any) => value)
        : []

    const params: any = {
      title: value?.title || '',
      due_date: value?.due_date || '',
      duration: value?.duration || '',
      is_repeat_schedule: value?.is_repeat_schedule ? true : false,
      end_recuring_date: moment(value?.end_recuring_date)?.format('YYYY-MM-DD'),
      frequency: value?.frequency || '',
      frequency_value: frequency_time?.length === 0 ? undefined : frequency_time,
      worker_guid: value?.assigned_user_guid?.value,
      // team_guid: value?.team_guid,
      asset_guid: value?.asset_guid?.value,
      location_guid: paramValValidation(value?.location_guid?.value, value?.location_guid),
      inventory_guid: paramValValidation(value?.inventory_guid?.value, value?.inventory_guid),
      description: paramValValidation(value?.description, ''),
      additional_worker: additional_user_guid,
      maintenance_category_guid: paramValValidation(
        value?.maintenance_category_guid?.value,
        value?.maintenance_category_guid
      ),
      maintenance_priority_guid: paramValValidation(
        value?.maintenance_priority_guid?.value,
        value?.maintenance_priority_guid
      ),
      photo: photos,
      file: value?.file,
    }

    if (id) {
      EditRequest(id, params)
        .then(({data: {message}}: any) => {
          setResGuid(id)
          setDueDate(null)
          setLoading(false)
          setReloadData(reloadData + 1)
          setTimeout(() => setRedirect(true), 1000)
          useTimeOutMessage('clear', 300)
          useTimeOutMessage('success', 350, message)
        })
        .catch((err: any) => {
          setLoading(false)
          errorMessage(err?.response)
        })
    } else {
      AddRequest(params)
        .then(({data: {message, data: res}}: any) => {
          setDueDate(null)
          setLoading(false)
          setResGuid(res?.guid)
          setReloadData(reloadData + 1)
          setTimeout(() => setRedirect(true), 1000)
          useTimeOutMessage('clear', 300)
          useTimeOutMessage('success', 350, message)
        })
        .catch(({response}: any) => {
          setLoading(false)
          errorMessage(response)
        })
    }
  }

  const initialValues: any = {
    title: paramValValidation(detailRequest?.title, ''),
    due_date: paramValValidation(detailRequest?.due_date, ''),
    duration: paramValValidation(detailRequest?.duration, ''),
    is_repeat_schedule: detailRequest?.is_repeat_schedule ? true : false,
    end_recuring_date: detailRequest?.end_recuring_date || moment()?.format('Y-MM-DD'),
    frequency: paramValValidation(detailRequest?.frequency, ''),
    frequency_value_monthly:
      detailRequest?.frequency === 'monthly' ? detailRequest?.frequency_value?.join(',') : null,
    frequency_value_day: setFrequencyValueDay(detailRequest),
    frequency_value_month:
      detailRequest?.frequency === 'yearly'
        ? detailRequest?.frequency_value?.[0]?.split(' ')?.[1]?.toString()
        : '',
    assigned_user_guid:
      detailRequest !== undefined &&
      detailRequest?.worker_guid !== '' &&
      detailRequest?.worker_guid !== null
        ? {value: detailRequest?.worker_guid, label: detailRequest?.worker_name}
        : '',
    assigned_additional_user: setAssignedAdditionalUser(detailRequest),
    team_guid: detailRequest?.team_guid,

    inventory_guid: detailRequest?.inventory_guid,
    description: detailRequest?.description,
    maintenance_category_guid: detailRequest?.maintenance_category_guid,
    maintenance_priority_guid: detailRequest?.maintenance_priority_guid,
    location_guid:
      detailRequest !== undefined &&
      detailRequest?.location_guid !== '' &&
      detailRequest?.location_guid !== null
        ? {value: detailRequest?.location_guid, label: detailRequest?.location_name}
        : '',
    asset_guid:
      detailRequest !== undefined &&
      detailRequest?.asset_guid !== '' &&
      detailRequest?.asset_guid !== null
        ? {value: detailRequest?.asset_guid, label: detailRequest?.asset_name}
        : '',
  }

  useEffect(() => {
    setFrequencyList(detailRequest?.frequency_value)
  }, [detailRequest])

  useEffect(() => {
    if (detailRequest !== undefined) {
      detailRequest?.due_date && setDueDate(new Date(detailRequest?.due_date))
      detailRequest?.end_recuring_date &&
        setEndRecuringDate(new Date(detailRequest?.end_recuring_date))
    }
  }, [detailRequest])

  useEffect(() => {
    setLoadingForm(true)
    if (id) {
      getDetailRequest(id)
        .then(({data: {data: result}}: any) => {
          result && setDetailRequest(result)
          setTimeout(() => setLoadingForm(false), 3000)
        })
        .catch(() => setTimeout(() => setLoadingForm(false), 3000))
    } else {
      setTimeout(() => setLoadingForm(false), 3000)
    }
  }, [id])

  useEffect(() => {
    if (dataPreference) {
      const {date_format, time_format, timezone, default_company_guid} = dataPreference
      setPreference({
        date_format: date_format,
        time_format: time_format,
        timezone: timezone,
        default_company_guid: default_company_guid,
      })
    }
  }, [dataPreference])

  useEffect(() => {
    getDatabaseLocation({}).then(({data: {data: result}}) => {
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

    getDatabaseRequest({}).then(({data: {data: result}}: any) => {
      result && setDatabaseRequest(keyBy(result, 'field'))
    })
  }, [])

  useEffect(() => {
    if (redirect) {
      navigate(`/maintenance/request/detail/${resGuid}`)
    }
  }, [redirect])

  const scrollToTop = (isSubmitting: any, errors: any) => {
    if (isSubmitting && Object.keys(errors || {})?.length > 0) {
      ScrollTopComponent.goTop()
    }
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: id ? 'MAINTENANCE.REQUEST.EDIT' : 'MAINTENANCE.REQUEST.ADD'})}
      </PageTitle>

      {loadingForm ? (
        <PageLoader />
      ) : (
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={requestSchema}
          onSubmit={handleOnSubmit}
        >
          {({values, setFieldValue, errors, isSubmitting, isValidating}: any) => {
            if (isSubmitting && isValidating && Object.keys(errors || {})?.length > 0) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
            }
            scrollToTop(isSubmitting, errors)
            return (
              <Form>
                <div className={configClass?.row}>
                  <FormFirst
                    setFieldValue={setFieldValue}
                    values={values}
                    dayList={dayList}
                    detail={detailRequest}
                    frequencyList={frequencyList}
                    setFrequencyList={setFrequencyList}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    database={databaseRequest}
                    setShowModalUser={setShowModalUser}
                    reloadUser={reloadUser}
                  />

                  <FormSecond
                    detail={detailRequest}
                    setFieldValue={setFieldValue}
                    setPhoto={setPhotos}
                    values={values}
                    endRecuringDate={endRecuringDate}
                    setEndRecuringDate={setEndRecuringDate}
                    database={databaseRequest}
                    setDetailMaintenanceCategory={setDetailMaintenanceCategory}
                    setShowModalMaintenanceCategory={setShowModalMaintenanceCategory}
                    reloadMaintenanceCategory={reloadMaintenanceCategory}
                    setLocationDetail={setLocationDetail}
                    setShowModalLocation={setShowModalLocation}
                  />
                </div>
                <Toolbar dir='right'>
                  {detailRequest && role_name === 'owner' && (
                    <>
                      {detailRequest?.status_name === 'Approved' ? (
                        <>
                          <Button
                            className='d-inline-flex align-items-center col-auto btn btn-sm btn-danger radius-50 py-1 ps-1 pe-3 border border-danger me-2'
                            disabled
                          >
                            <div
                              className='btn btn-icon w-25px h-25px btn-danger rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <i className='la la-times  fs-4 text-white'></i>
                            </div>
                            <div className='px-2 fw-bold'>Reject</div>
                          </Button>
                          <Button
                            className='d-inline-flex align-items-center col-auto btn btn-sm btn-success radius-50 py-1 ps-1 pe-3 border border-success me-2'
                            disabled
                          >
                            <div
                              className='btn btn-icon w-25px h-25px btn-success rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <i className='la la-thumbs-o-up icon-lg fs-4 text-white'></i>
                            </div>
                            <div className='px-2 fw-bold'>Approve</div>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className='d-inline-flex align-items-center col-auto btn btn-sm btn-danger radius-50 py-1 ps-1 pe-3 border border-danger me-2'
                            onClick={() => {
                              setShowModalReject(true)
                            }}
                          >
                            <div
                              className='btn btn-icon w-25px h-25px btn-danger rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <i className='la la-times fs-4 text-white'></i>
                            </div>
                            <div className='px-2 fw-bold'>Reject</div>
                          </Button>

                          <Button
                            className='d-inline-flex align-items-center col-auto btn btn-sm btn-success radius-50 py-1 ps-1 pe-3 border border-success me-2'
                            onClick={() => OnApproveReject('approve')}
                          >
                            <div
                              className='btn btn-icon w-25px h-25px btn-success rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <i className='la la-thumbs-o-up icon-lg fs-4 text-white'></i>
                            </div>
                            <div className='px-2 fw-bold'>Approve</div>
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  <Button
                    className='d-inline-flex align-items-center col-auto btn btn-sm btn-secondary radius-50 py-1 ps-1 pe-3 border border-secondary me-2'
                    onClick={() => {
                      navigate('/maintenance/request')
                    }}
                  >
                    <div
                      className='btn btn-icon w-25px h-25px btn-secondary rounded-circle'
                      style={{background: 'rgba(255,255,255,0.35)'}}
                    >
                      <i className='la la-angle-left icon-lg fs-4 text-gray'></i>
                    </div>
                    <div className='px-2 fw-bold'>Cancel</div>
                  </Button>

                  {detailRequest?.status_name === 'Approved' ? (
                    <Button
                      type='submit'
                      disabled
                      className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 py-1 ps-1 pe-3 border border-primary me-2'
                    >
                      <div
                        className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
                        style={{background: 'rgba(255,255,255,0.35)'}}
                      >
                        <i className='las la-check fs-4 text-white' />
                      </div>
                      <div className='px-2 fw-bold'>Save</div>
                    </Button>
                  ) : (
                    <Button
                      type='submit'
                      data-cy='submitRequest'
                      className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 py-1 ps-1 pe-3 border border-primary me-2'
                    >
                      {!loading && (
                        <>
                          <div
                            className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
                            style={{background: 'rgba(255,255,255,0.35)'}}
                          >
                            <i className='las la-check fs-4 text-white' />
                          </div>
                          <div className='px-2 fw-bold'>Save</div>
                        </>
                      )}
                      {loading && (
                        <>
                          <div
                            className='btn btn-icon w-25px h-25px btn-primary rounded-circle indicator-progress'
                            style={{background: 'rgba(255,255,255,0.35)'}}
                          >
                            <span className='spinner-border spinner-border-sm align-middle'></span>
                          </div>
                          <div className='px-2 fw-bold'>Please wait...</div>
                        </>
                      )}
                    </Button>
                  )}
                </Toolbar>
              </Form>
            )
          }}
        </Formik>
      )}
      <ModalSingleReject
        showModalRejectStatus={showModalReject}
        setShowModalRejectStatus={setShowModalReject}
        setReloadData={reloadData}
        reloadData={setReloadData}
        guid={id}
      />
      <ValidationSchema setRequestSchema={setRequestSchema} database={databaseRequest} />

      <ModalAddMintenanceCategory
        setReloadMaintenanceCategory={setReloadMaintenanceCategory}
        reloadMaintenanceCategory={reloadMaintenanceCategory}
        showModal={showModalMaintentanceCategory}
        setShowModal={setShowModalMaintenanceCategory}
        detailMaintenanceCategory={detailMaintenanceCategory}
      />

      <AddUser
        showModal={showModalUser}
        userDetail={undefined}
        setShowModalUser={setShowModalUser}
        setReloadUser={setReloadUser}
        reloadUser={reloadUser}
        preference={preference}
        files={files}
        setFiles={setFiles}
        defaultRole={'worker'}
      />

      <ValidationSchemaLocation
        setLocationSchema={setLocationSchemaLocation}
        checkCountry={checkCountryLocation}
        checkState={checkStateLocation}
        checkCity={checkCityLocation}
        checkAddress={checkAddressLocation}
        checkStreet={checkStreetLocation}
        checkPostcode={checkPostcodeLocation}
        checkDescription={checkDescriptionLocation}
        checkLatitude={checkLatitudeLocation}
        checkLongitude={checkLongitudeLocation}
      />

      <AddLocation
        showModal={showModalLocation}
        setShowModalLocation={setShowModalLocation}
        setReloadLocation={setReloadLocation}
        reloadLocation={reloadLocation}
        locationDetail={locationDetail}
        locationSchema={locationSchemaLocation}
        setOnClickForm={setOnClickForm}
        onClickForm={onClickForm}
        SetAddDataModal={undefined}
        modalType={undefined}
      />
    </>
  )
}

AddEditRequest = memo(
  AddEditRequest,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddEditRequest
