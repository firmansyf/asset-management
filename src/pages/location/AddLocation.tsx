/* eslint-disable sonar/arrow-function-convention */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  addLocation,
  editLocation,
  getAssetBulkTemp,
  getAssetLocation,
  getLocationDetail,
  getLocationStatus,
  postAttachAsset,
} from '@api/Service'
import {FormCF} from '@components/form/CustomField'
import {PageLoader} from '@components/loader/cloud'
import GoogleMaps from '@components/maps'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {addEditFormPermission, configClass, hasPermission, KTSVG} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {keyBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'

import {getCustomField} from '../setup/custom-field/redux/ReduxCustomField'
import {getDatabaseLocation} from '../setup/databases/Serivce'
import AddLocationAsset from './form/AddLocationAsset'
import {
  getErrorMessage,
  initValueOption,
  setLatitudeInitVal,
  setLongitudeInitValue,
  setParmsLatitudeValue,
  setParmsLongitudeValue,
  setParmsValue,
} from './helper/AddLocationHelper'
import {FormInsurance} from './InsuranceFrom'
import {SiteLocationForm} from './SiteLocationForm'
import ValidationSchema from './ValidationSchema'

type ModalAddlocationProps = {
  showModal: any
  setShowModalLocation: any
  setReloadLocation: any
  reloadLocation: any
  locationDetail: any
  locationSchema?: any
  editCountry?: any
  setEditCountry?: any
  re_super1?: any
  re_super2?: any
  tm_super1?: any
  tm_super2?: any
  re_digital?: any
  digital_super1?: any
  digital_super2?: any
  region?: any
  tm?: any
  onClickForm?: any
  setOnClickForm?: any
  SetAddDataModal?: any
  modalType?: any
}

let AddLocation: FC<ModalAddlocationProps> = ({
  showModal,
  setShowModalLocation,
  setReloadLocation,
  reloadLocation,
  locationDetail,
  onClickForm,
  setOnClickForm = () => '',
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const location: any = useLocation()
  const {token, preference: preferenceStore}: any = useSelector(
    ({token, preference}: any) => ({token, preference}),
    shallowEqual
  )
  const {feature, preference: dataPreference, country: dataCountry}: any = preferenceStore || {}

  const [db, setDB] = useState<any>({})
  const [pageExistingAsset, setPageExistingAsset] = useState<number>(1)
  const [images, setImages] = useState<any>([])
  const [photos, setPhotos] = useState<any>([])
  const [keyword, _setKeyword] = useState<string>('')
  const [detail, setDetail] = useState<any>({})
  const [limitExistingAsset, setLimitExistingAsset] = useState<number>(10)
  const [country, setCountry] = useState<any>([])
  const [errForm, setErrForm] = useState<any>(true)
  const [mapCountry, setMapCountry] = useState<any>({})
  const [totalPageExistingAsset, setTotalPage] = useState<number>(0)
  const [customField, setCustomField] = useState<any>([])
  const [orderDirExistingAsset, setOrderDirExistingAsset] = useState<string>('asc')
  const [attachExistingAsset, setAttachExistingAsset] = useState<any>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [orderCol, setOrderColExistingAsset] = useState<string>('asset_id')
  const [dataLatitude, setDataLatitude] = useState<any>('')
  const [reloadAsset, setReloadAsset] = useState<number>(1)
  const [dataLongitude, setDataLongitude] = useState<any>('')
  const [locationStatus, setLocationStatus] = useState<any>([])
  const [toggleAsset, setToggleAsset] = useState<boolean>(true)
  const [fileValidation, setFileValidation] = useState<any>([])
  const [loadingExistingAsset, setLoadingAsset] = useState<boolean>(true)
  const [currentLocation, setCurrentLocation] = useState<any>([])
  const [defaultLatitude, setDefaultLatitude] = useState<string>('')
  const [countryPreference, setCountryPreference] = useState<any>({})
  const [defaultLongitude, setDefaultLongitude] = useState<string>('')
  const [coordinates, setCoordinates] = useState<any>({lat: 0, lng: 0})
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false)
  const [secondErrSubmit, setSecondErrSubmit] = useState<boolean>(false)
  const [defaultLocationStatus, setDefaultLocationStatus] = useState<any>('')
  const [customFieldDefaultValue, setCustomFieldDefaultValue] = useState<any>()
  const [isEnableFeatureInsurance, setIsEnableFeatureInsurance] = useState<boolean>(false)
  const [formEdit, setFormEdit] = useState<boolean>(false)
  const [reloadExistingAsset, setReloadExistingAsset] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [showFormCF, setShowFormCF] = useState<boolean>(false)
  const [visibility, setVisibility] = useState<string>('invisible')
  const [getValues, setGetValues] = useState<any>()

  const [locationSchema, setLocationSchema] = useState<any>([])
  const [checkCountry, setCheckCountry] = useState<any>([])
  const [checkState, setCheckState] = useState<any>([])
  const [checkCity, setCheckCity] = useState<any>([])
  const [checkAddress, setCheckAddress] = useState<any>([])
  const [checkStreet, setCheckStreet] = useState<any>([])
  const [checkPostcode, setCheckPostcode] = useState<any>([])
  const [checkDescription, setCheckDescription] = useState<any>([])
  const [checkLatitude, setCheckLatitude] = useState<any>([])
  const [checkLongitude, setCheckLongitude] = useState<any>([])

  const [checkSuperior1, setCheckReSuperior1] = useState<any>([])
  const [checkSuperior2, setCheckReSuperior2] = useState<any>([])
  const [checkDigital, setCheckReDigital] = useState<any>([])
  const [checkRegional, setCheckRegional] = useState<any>([])
  const [checkDigitalSuperior1, setCheckDigitalSuperior1] = useState<any>([])
  const [checkDigitalSuperior2, setCheckDigitalSuperior2] = useState<any>([])
  const [checkTmSuperior1, setCheckTmSuperior1] = useState<any>([])
  const [checkTmSuperior2, setCheckTmSuperior2] = useState<any>([])
  const [checkTerritoryManager, setCheckTerritoryManager] = useState<any>([])

  const addLocationPermission: any = hasPermission('location.add') || false
  const editLocationPermission: any = hasPermission('location.edit') || false
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    if (showModal) {
      ToastMessage({type: 'clear'})
    }
  }, [showModal])

  useEffect(() => {
    showModal &&
      addEditFormPermission(
        setShowModalLocation,
        setShowForm,
        locationDetail,
        addLocationPermission,
        editLocationPermission,
        'Add Location',
        'Edit Location'
      )
  }, [
    showModal,
    setShowModalLocation,
    locationDetail,
    addLocationPermission,
    editLocationPermission,
  ])

  useEffect(() => {
    if (showModal && customField?.length === 0) {
      setTimeout(() => {
        setShowFormCF(true)
      }, 500)
    }
  }, [showModal])

  useEffect(() => {
    if (showModal && showFormCF) {
      setTimeout(() => {
        setVisibility('visible')
      }, 2000)
    }
  }, [showModal, showFormCF])

  useEffect(() => {
    if (currentLocation !== undefined && currentLocation?.length > 1) {
      const map_country_code: any = currentLocation?.find(
        (obj: any) => obj?.types?.[0] === 'country'
      )?.short_name
      const map_country_name: any = currentLocation?.find(
        (obj: any) => obj?.types?.[0] === 'country'
      )?.long_name
      setMapCountry({
        value: map_country_code || '',
        label: map_country_name || '',
      })
    }
  }, [currentLocation])

  useEffect(() => {
    showModal &&
      feature &&
      feature?.length > 0 &&
      feature?.forEach((item: any) => {
        item?.unique_name === 'insurance_claim' &&
          item?.value === 1 &&
          setIsEnableFeatureInsurance(true)
      })
  }, [showModal, feature])

  useEffect(() => {
    if (showModal) {
      getDatabaseLocation({}).then(({data: {data: result}}: any) => {
        setDB(keyBy(result, 'field'))
        if (result) {
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'country_code')
            ?.map((database: any) => setCheckCountry(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'state')
            ?.map((database: any) => setCheckState(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'city')
            ?.map((database: any) => setCheckCity(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'address')
            ?.map((database: any) => setCheckAddress(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'street')
            ?.map((database: any) => setCheckStreet(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'postcode')
            ?.map((database: any) => setCheckPostcode(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'description')
            ?.map((database: any) => setCheckDescription(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'lat')
            ?.map((database: any) => setCheckLatitude(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'long')
            ?.map((database: any) => setCheckLongitude(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 're_super1')
            ?.map((database: any) => setCheckReSuperior1(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 're_super2')
            ?.map((database: any) => setCheckReSuperior2(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 're_digital')
            ?.map((database: any) => setCheckReDigital(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'digital_super1')
            ?.map((database: any) => setCheckDigitalSuperior1(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'digital_super2')
            ?.map((database: any) => setCheckDigitalSuperior2(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 're')
            ?.map((database: any) => setCheckRegional(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'tm_super1')
            ?.map((database: any) => setCheckTmSuperior1(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'tm_super1')
            ?.map((database: any) => setCheckTmSuperior2(database))
          result
            ?.filter((set_location: {field: any}) => set_location?.field === 'tm')
            ?.map((database: any) => setCheckTerritoryManager(database))
        }
      })

      getLocationStatus().then(({data: {data: result}}) => {
        const location = result?.find(({unique_id}: any) => unique_id === 'available')
        const {guid}: any = location || {}
        setDefaultLocationStatus(guid || '')
        setLocationStatus(result)
      })
    }
  }, [showModal])

  useEffect(() => {
    if (showModal) {
      if (locationDetail) {
        const promises: any = locationDetail?.photos?.map(
          (m: any) =>
            new Promise((resolve: any) => {
              try {
                const xhr: any = new XMLHttpRequest()
                xhr.onload = () => {
                  const reader: any = new FileReader()
                  reader.onloadend = () => {
                    const arrData = {
                      dataURL: reader?.result || '',
                      file: {
                        name: m?.title || '',
                      },
                    }
                    resolve(arrData)
                  }
                  reader.readAsDataURL(xhr.response)
                }
                xhr.open('GET', `${m?.download_url || ''}?token=${token || ''}`)
                xhr.responseType = 'blob'
                xhr.send()
                // eslint-disable-next-line sonar/no-ignored-exceptions
              } catch (error) {
                resolve(null)
              }
            })
        )
        Promise.all(promises).then((mediaArray: any) => {
          setImages(mediaArray)
        })
        setDataLatitude(locationDetail?.lat || 0)
        setDataLongitude(locationDetail?.long || 0)
      } else {
        setImages([])
      }
    }
  }, [showModal, locationDetail, token])

  useEffect(() => {
    if (showModal) {
      if (locationDetail) {
        getLocationDetail(locationDetail?.guid)
          .then(({data: {data: res_loc}}: any) => {
            setDetail(res_loc)
            setCustomField(res_loc?.custom_fields)
            const custom_fields_value: any = res_loc?.custom_fields?.map((item: any) => {
              return {
                [`${item?.guid || ''}`]: {value: item?.value || ''},
              }
            })
            const convertToObj: any = custom_fields_value.reduce(
              (a: any, b: any) => Object.assign(a, b),
              {}
            )
            setCustomFieldDefaultValue(convertToObj)
            setCoordinates({lat: res_loc?.lat, lng: res_loc?.long})
          })
          .catch(() => '')
      } else {
        getCustomField({filter: {section_type: 'locations'}})
          .then(({data: {data: res_loc}}: any) => {
            setCustomField(res_loc)
            const custom_fields_value_def: any = res_loc?.map((item: any) => {
              return {
                [`${item?.guid || ''}`]: {value: item?.value || ''},
              }
            })
            const convertToObjDef: any = custom_fields_value_def.reduce(
              (a: any, b: any) => Object.assign(a, b),
              {}
            )
            setCustomFieldDefaultValue(convertToObjDef)
          })
          .catch(() => '')
      }
    }
  }, [showModal, locationDetail])

  useEffect(() => {
    if (locationDetail !== undefined && showModal) {
      const {guid} = locationDetail
      setLoadingAsset(true)
      const page: number = pageExistingAsset
      const orderDir: string = orderDirExistingAsset
      const limit: number = limitExistingAsset
      getAssetLocation({
        keyword,
        page,
        orderDir,
        orderCol,
        limit,
        location_guid: guid,
      })
        .then(({data: {data: res_asset, meta}}: any) => {
          const {current_page, total, from}: any = meta || {}
          const newLimitExistingAsset: number = limitExistingAsset
          setLimitExistingAsset(newLimitExistingAsset)
          setTotalPage(total)
          setPageExistingAsset(current_page)
          setPageFrom(from)
          if (res_asset) {
            const dataAsset = res_asset?.map((res: any) => {
              const {asset_id, name, category}: any = res || {}
              const {name: category_name}: any = category || {}
              return {
                asset_id: asset_id || '-',
                name: name || '-',
                category: category_name || '-',
                delete: 'Delete',
                original: res,
              }
            })
            if (dataAsset?.length > 0) {
              setToggleAsset(false)
              setFormEdit(true)
            }
            setAttachExistingAsset(dataAsset)
          }
          setTimeout(() => setLoadingAsset(false), 800)
        })
        .catch(() => setTimeout(() => setLoadingAsset(false), 800))
    }
  }, [
    locationDetail,
    pageExistingAsset,
    limitExistingAsset,
    orderDirExistingAsset,
    orderCol,
    keyword,
    reloadAsset,
    showModal,
    reloadExistingAsset,
  ])

  useEffect(() => {
    if (Object.keys(dataPreference || {})?.length > 0 && showModal) {
      const {country_code, country} = dataPreference || {}
      setCountryPreference({
        value: country_code || '',
        label: country || '',
      })
    }
  }, [dataPreference, showModal])

  const resultCustomField = (values: any, custom_fields_value: any) => {
    return values?.global_custom_fields
      ? Object.entries(values?.global_custom_fields || {})?.map((key: any, item: any) => {
          const guid: any = Number(key?.[0]) === item ? key?.[1]?.guid : key?.[0]
          const value: any = key?.[1]?.value || ''
          custom_fields_value[guid] = value || ''
          return null
        })
      : {}
  }

  const handleOnSubmit = (values: any, actions: any) => {
    setLoadingLocation(true)

    const custom_fields_value: any = {}
    resultCustomField(values, custom_fields_value)

    const params: any = {
      address: setParmsValue(values?.address),
      street: setParmsValue(values?.street),
      description: setParmsValue(values?.description),
      city: setParmsValue(values?.city),
      country_code: setParmsValue(values?.country),
      location_availability_guid: setParmsValue(values?.location_status),
      status: 0,
      name: setParmsValue(values?.location),
      postcode: setParmsValue(values?.postal_code),
      state: setParmsValue(values?.state),
      lat: setParmsLatitudeValue(dataLatitude, defaultLatitude),
      long: setParmsLongitudeValue(dataLongitude, defaultLongitude),
      photos: photos as never[],
      global_custom_fields: custom_fields_value as never[],
      region: setParmsValue(values?.region),
      site_id: setParmsValue(values?.site_id),
      tm: setParmsValue(values?.tm?.value),
      tm_super1: setParmsValue(values?.tm_super1?.value),
      tm_super2: setParmsValue(values?.tm_super2?.value),
      re: setParmsValue(values?.re?.value),
      re_super1: setParmsValue(values?.re_super1?.value),
      re_super2: setParmsValue(values?.re_super2?.value),
      re_digital: setParmsValue(values?.re_digital?.value),
      digital_super1: setParmsValue(values?.digital_super1?.value),
      digital_super2: setParmsValue(values?.digital_super2?.value),
    }

    if (locationDetail) {
      const {guid}: any = locationDetail
      editLocation(params, guid)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setShowForm(false)
          onSubmitAttachAsset(guid)
          setLoadingLocation(false)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
          setTimeout(() => {
            setShowModalLocation(false)
            setVisibility('invisible')
            setReloadLocation(reloadLocation + 1)
            navigate('/location/location/detail/' + guid)
          }, 1000)
        })
        .catch(({response}: any) => {
          setLoadingLocation(false)
          getErrorMessage(response, actions)
        })
    } else {
      addLocation(params)
        .then(({data: {message, data: res}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setPhotos([])
          setImages([])
          setShowForm(false)
          setLoadingLocation(false)
          onSubmitAttachAsset(res?.guid)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
          if (location?.pathname === '/location/location') {
            setTimeout(() => navigate('/location/location/detail/' + res?.guid), 1000)
          } else {
            setShowModalLocation(false)
            setVisibility('invisible')
            setReloadLocation(reloadLocation + 1)
          }

          if (modalType === 'asset') {
            SetAddDataModal({
              value: res?.guid || '',
              label: values?.location || '',
              modules: 'asset.location',
            })
          }
        })
        .catch(({response}: any) => {
          setLoadingLocation(false)
          getErrorMessage(response, actions)
        })
    }
  }

  const onSubmitAttachAsset = (guid: any) => {
    const limit: number = 1000
    const page: number = 1
    const orderCol: string = 'name'
    const orderDir: string = 'asc'
    const params_asset = {page, limit, orderCol, orderDir}
    getAssetBulkTemp(params_asset, 'location')
      .then(({data: {data: res_asset}}) => {
        const data_attach_asset: any = []
        res_asset?.forEach((item: any) => {
          data_attach_asset.push(item?.guid)
        })

        if (data_attach_asset?.length > 0) {
          postAttachAsset({asset_guids: data_attach_asset}, guid)
            .then(() => {
              setReloadAsset(reloadAsset + 1)
            })
            .catch(({response}: any) => {
              const {devMessage, data, message} = response?.data || {}
              const {fields} = data || {}
              if (!devMessage) {
                fields === undefined && ToastMessage({message, type: 'error'})

                fields &&
                  Object.keys(fields)?.map((item: any) => {
                    ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                    return null
                  })
              }
            })
        }
      })
      .catch(() => '')
  }

  const onChangeUploadImageVideo = (imageList: ImageListType) => {
    if (imageList?.length > 3) {
      ToastMessage({type: 'error', message: 'User upload more than 3 photos'})
    }
    if (imageList[0]) {
      const dataUpload = imageList?.map((m: any) => {
        return {
          data: m?.dataURL || '',
          title: m?.file?.name || '',
        }
      })
      setPhotos(dataUpload as never[])
    } else {
      setPhotos([])
    }
    setImages(imageList as never[])
  }

  const onNewAsset = () => {
    navigate('/asset-management/add')
  }

  const onAttachAsset = (e: any) => {
    setToggleAsset(!!e)
  }

  const onClose = () => {
    setShowModalLocation(false)
    setImages([])
    setPhotos([])
    setOnClickForm(false)
    setLoadingLocation(false)
    setDataLatitude('')
    setDataLongitude('')
    setCoordinates({lat: 0, lng: 0})
    setDefaultLatitude('')
    setDefaultLongitude('')
    setErrForm(true)
    setSecondErrSubmit(false)
    setShowForm(false)
    setFormEdit(false)
    setAttachExistingAsset([])
    setToggleAsset(true)
    setShowFormCF(false)
    setVisibility('invisible')
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }

  const onLocateOnMap = () => {
    setCoordinates({lat: dataLatitude, lng: dataLongitude})
  }

  const initValues: any = {
    location: initValueOption(locationDetail?.name, ''),
    description: initValueOption(locationDetail?.description, ''),
    address: initValueOption(locationDetail?.address, ''),
    street: initValueOption(locationDetail?.street, ''),
    city: initValueOption(locationDetail?.city, ''),
    state: initValueOption(locationDetail?.state, ''),
    postal_code: initValueOption(locationDetail?.postcode, ''),
    country:
      locationDetail?.country_code !== undefined
        ? locationDetail?.country_code
        : dataPreference?.country_code || countryPreference || mapCountry,
    location_status: initValueOption(locationDetail?.availability?.guid, defaultLocationStatus),
    latitude: setLatitudeInitVal(locationDetail, dataLatitude, defaultLatitude),
    longitude: setLongitudeInitValue(locationDetail, dataLongitude, defaultLongitude),
    global_custom_fields: customFieldDefaultValue,
    site_id: initValueOption(locationDetail?.site_id, ''),
    region: initValueOption(locationDetail?.region, ''),
    tm: {value: locationDetail?.tm?.guid, label: locationDetail?.tm?.name} || {},
    re: {value: locationDetail?.re?.guid, label: locationDetail?.re?.name} || {},
    tm_super1:
      {value: locationDetail?.tm_super1?.guid, label: locationDetail?.tm_super1?.name} || {},
    tm_super2:
      {value: locationDetail?.tm_super2?.guid, label: locationDetail?.tm_super2?.name} || {},
    re_super1:
      {value: locationDetail?.re_super1?.guid, label: locationDetail?.re_super1?.name} || {},
    re_super2:
      {value: locationDetail?.re_super2?.guid, label: locationDetail?.re_super2?.name} || {},
    re_digital:
      {value: locationDetail?.re_digital?.guid, label: locationDetail?.re_digital?.name} || {},
    digital_super1:
      {
        value: locationDetail?.digital_super1?.guid,
        label: locationDetail?.digital_super1?.name,
      } || {},
    digital_super2:
      {
        value: locationDetail?.digital_super2?.guid,
        label: locationDetail?.digital_super2?.name,
      } || {},
  }

  useEffect(() => {
    if (showModal && dataCountry) {
      setCountry(dataCountry?.map(({iso_code: value, name: label}: any) => ({value, label})))
    }
  }, [showModal])

  return (
    <>
      <Modal dialogClassName='modal-lg' show={showForm} onHide={onClose}>
        <Formik
          initialValues={initValues}
          enableReinitialize={getValues?.location_status === '' ? true : false}
          validationSchema={locationSchema}
          onSubmit={handleOnSubmit}
        >
          {({setFieldValue, errors, values, setSubmitting, isSubmitting, isValidating}) => {
            setGetValues(values)
            if (
              isSubmitting &&
              errForm &&
              Object.keys(errors || {})?.length > 0 &&
              errors?.location?.length !== 1
            ) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
              setErrForm(false)
              setSubmitting(false)
              setSecondErrSubmit(false)
            }

            if (
              isSubmitting &&
              isValidating &&
              !errForm &&
              Object.keys(errors)?.length > 0 &&
              errors?.location?.length !== 1 &&
              secondErrSubmit
            ) {
              ToastMessage({
                message: require_filed_message,
                type: 'error',
              })
              setSecondErrSubmit(false)
            }

            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>{locationDetail ? 'Edit' : 'Add'} Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {visibility === 'invisible' && (
                    <div className='row' style={{height: '300px'}}>
                      <div className='col-12 text-center'>
                        <PageLoader height={250} />
                      </div>
                    </div>
                  )}
                  <div
                    className={`row ${visibility}`}
                    style={visibility === 'invisible' ? {height: '10px'} : {minHeight: '270px'}}
                  >
                    <span className='text-black-400 mb-3'>
                      {intl.formatMessage({id: 'ADD_LOCATION_DESCRIPTION'})}
                    </span>
                    <div className='mt-3'>
                      <div className='row'>
                        <div className='col-md-6 mb-4'>
                          <div className='mb-4'>
                            <label htmlFor='location' className={`${configClass.label} required`}>
                              Location
                            </label>
                            <Field
                              name='location'
                              type='text'
                              autoComplete='off'
                              className={`${configClass?.form} text-dark }`}
                              placeholder='Enter Location'
                            />
                          </div>
                          {errors?.location?.length !== 1 && (
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='location' />
                            </div>
                          )}
                        </div>
                        <div className='col-md-6'>
                          <label
                            htmlFor='location_status'
                            className={`${configClass.label} required`}
                          >
                            Location Status
                          </label>
                          <Field as='select' name='location_status' className={configClass?.select}>
                            {Array.isArray(locationStatus) &&
                              locationStatus?.map(({guid, name}: any, index: number) => {
                                return (
                                  <option key={index || 0} value={guid || ''}>
                                    {name || '-'}
                                  </option>
                                )
                              })}
                          </Field>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='location_status' />
                          </div>
                          <div className='form-text mb-4'></div>
                        </div>
                        <div className='col-md-12' style={{marginTop: '10px'}}>
                          <Tabs defaultActiveKey='details'>
                            <Tab eventKey='details' title='Details'>
                              {db?.description?.is_selected && (
                                <div className='row'>
                                  <div className='col-md-12 mt-4 mb-4'>
                                    {db?.description?.is_required && (
                                      <label
                                        htmlFor='description'
                                        className={`${configClass.label} required`}
                                      >
                                        Description
                                      </label>
                                    )}
                                    {!db?.description?.is_required && (
                                      <label
                                        htmlFor='description'
                                        className={`${configClass.label}`}
                                      >
                                        Description
                                      </label>
                                    )}
                                    <Field
                                      type='text'
                                      name='description'
                                      placeholder='Enter Description'
                                      className={configClass?.form}
                                    />
                                    {db?.description?.is_required && (
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='description' />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className='row'>
                                {db?.address?.is_selected && (
                                  <div className='col-md-6 mb-4'>
                                    {db?.address?.is_required && (
                                      <label
                                        htmlFor='address'
                                        className={`${configClass.label} required`}
                                      >
                                        Address 1
                                      </label>
                                    )}
                                    {!db?.address?.is_required && (
                                      <label htmlFor='address' className={`${configClass.label}`}>
                                        Address 1
                                      </label>
                                    )}
                                    <Field
                                      type='text'
                                      name='address'
                                      placeholder='Enter Address 1'
                                      className={configClass?.form}
                                    />
                                    {db?.address?.is_required && (
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='address' />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {db?.street?.is_selected && (
                                  <div className='col-md-6 mb-4'>
                                    {db?.street?.is_required && (
                                      <label
                                        htmlFor='street'
                                        className={`${configClass.label} required`}
                                      >
                                        Address 2
                                      </label>
                                    )}
                                    {!db?.street?.is_required && (
                                      <label htmlFor='street' className={`${configClass.label}`}>
                                        Address 2
                                      </label>
                                    )}
                                    <Field
                                      type='text'
                                      name='street'
                                      placeholder='Enter Address 2'
                                      className={configClass?.form}
                                    />
                                    <div className='fv-plugins-message-container invalid-feedback'>
                                      <ErrorMessage name='street' />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className='row'>
                                {db?.city?.is_selected && (
                                  <div className='col-md-6 mb-4'>
                                    {db?.city?.is_required && (
                                      <label
                                        htmlFor='city'
                                        className={`${configClass.label} required`}
                                      >
                                        City
                                      </label>
                                    )}
                                    {!db?.city?.is_required && (
                                      <label htmlFor='city' className={`${configClass.label}`}>
                                        City
                                      </label>
                                    )}
                                    <Field
                                      type='text'
                                      name='city'
                                      placeholder='Enter City'
                                      className={configClass?.form}
                                    />
                                    {db?.city?.is_required && (
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='city' />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {db?.state?.is_selected && (
                                  <div className='col-md-6 mb-4'>
                                    {db?.state?.is_required && (
                                      <label
                                        htmlFor='state'
                                        className={`${configClass.label} required`}
                                      >
                                        State/Province
                                      </label>
                                    )}
                                    {!db?.state?.is_required && (
                                      <label htmlFor='state' className={`${configClass.label}`}>
                                        State/Province
                                      </label>
                                    )}
                                    <Field
                                      type='text'
                                      name='state'
                                      placeholder='Enter State/Province'
                                      className={configClass?.form}
                                    />
                                    {db?.state?.is_required && (
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='state' />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {db?.postcode?.is_selected && (
                                  <div className='col-md-6 mb-4'>
                                    {db?.postcode?.is_required && (
                                      <label
                                        htmlFor='postal_code'
                                        className={`${configClass.label} required`}
                                      >
                                        ZIP/Postal Code
                                      </label>
                                    )}
                                    {!db?.postcode?.is_required && (
                                      <label
                                        htmlFor='postal_code'
                                        className={`${configClass.label}`}
                                      >
                                        ZIP/Postal Code
                                      </label>
                                    )}
                                    <Field
                                      type='text'
                                      maxLength='10'
                                      name='postal_code'
                                      placeholder='Enter Zip/Postal Code'
                                      className={configClass?.form}
                                      value={values?.postal_code}
                                      onChange={({target}: any) => {
                                        setFieldValue(
                                          'postal_code',
                                          // target?.value?.replace(/\D/g, '') || ''
                                          target?.value || ''
                                        )
                                      }}
                                    />
                                    {db?.postcode?.is_required && (
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='postal_code' />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {db?.country_code?.is_selected && (
                                  <div className='col-md-6 mb-4'>
                                    {db?.country_code?.is_required && (
                                      <label
                                        htmlFor='country'
                                        className={`${configClass.label} required`}
                                      >
                                        Country
                                      </label>
                                    )}
                                    {!db?.country_code?.is_required && (
                                      <label htmlFor='country' className={`${configClass.label}`}>
                                        Country
                                      </label>
                                    )}
                                    <Select
                                      sm={true}
                                      data={country}
                                      name='country'
                                      placeholder='Choose Country'
                                      isClearable={false}
                                      defaultValue={values?.country}
                                      onChange={(e: any) => {
                                        setFieldValue('country', e?.value)
                                      }}
                                    />
                                    {db?.country_code?.is_required && (
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='country' />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {isEnableFeatureInsurance && <SiteLocationForm />}
                              </div>

                              <FormCF
                                type='location'
                                itemClass='col-md-6 mb-3'
                                labelClass='col-md-5'
                                errors={errors}
                                defaultValue={customField}
                                onChange={(e: any) => setFieldValue('global_custom_fields', e)}
                                onClickForm={onClickForm}
                                showForm={showFormCF}
                                setShowForm={setShowFormCF}
                                defaultCustomField={customField}
                              />

                              {db?.lat?.is_selected && db?.long?.is_selected && (
                                <div className='mt-5'>
                                  <div className='form-group'>
                                    <label className={configClass?.label}>GPS Coordinates</label>
                                    <div className='separator'></div>
                                  </div>
                                  <div className='form-group row'>
                                    <div className='col-md-6 mt-4'>
                                      {db?.lat?.is_required && (
                                        <label
                                          htmlFor='latitude'
                                          className={`${configClass?.label} required`}
                                        >
                                          Latitude
                                        </label>
                                      )}
                                      {!db?.lat?.is_required && (
                                        <label
                                          htmlFor='latitude'
                                          className={`${configClass?.label} required`}
                                        >
                                          Latitude
                                        </label>
                                      )}
                                      <Field
                                        type='text'
                                        name='latitude'
                                        placeholder='Enter Latitude'
                                        onInput={({target}: any) => {
                                          setDataLatitude(target?.value || '')
                                        }}
                                        className={configClass?.form}
                                      />
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='latitude' />
                                      </div>
                                    </div>
                                    <div className='col-md-6 mt-4'>
                                      {db?.long?.is_required && (
                                        <label
                                          htmlFor='longitude'
                                          className={`${configClass.label} required`}
                                        >
                                          Longitude
                                        </label>
                                      )}
                                      {!db?.long?.is_required && (
                                        <label
                                          htmlFor='longitude'
                                          className={`${configClass.label}`}
                                        >
                                          Longitude
                                        </label>
                                      )}
                                      <Field
                                        type='text'
                                        name='longitude'
                                        placeholder='Enter Longitude'
                                        onInput={(e: any) => {
                                          setDataLongitude(e?.target?.value || '')
                                        }}
                                        className={configClass?.form}
                                      />
                                      <div className='fv-plugins-message-container invalid-feedback'>
                                        <ErrorMessage name='longitude' />
                                      </div>
                                    </div>
                                    <div className='col-12 text-center mt-5'>
                                      <div
                                        className='btn btn-primary btn-sm'
                                        onClick={onLocateOnMap}
                                      >
                                        Locate on Map
                                      </div>
                                    </div>
                                    <div
                                      className='col-12'
                                      style={{paddingTop: '5px', height: '250px'}}
                                    >
                                      <p
                                        className='text-gray-400 my-1 text-center'
                                        style={{fontSize: '11px'}}
                                      >
                                        Or you can move / drag the map marker to get coordinates
                                      </p>
                                      <GoogleMaps
                                        latitude={coordinates?.lat}
                                        longitude={coordinates?.lng}
                                        onChange={(e: any, address_components: any) => {
                                          setCurrentLocation(address_components)
                                          setDataLatitude(e?.lat)
                                          setDataLongitude(e?.lng)
                                          setFieldValue('latitude', e?.lat)
                                          setFieldValue('longitude', e?.lng)
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className='row mt-10'>
                                <div className='col-md-12 mt-4'>
                                  <label className={`${configClass.label}`}> Photos </label>
                                  <ImageUploading
                                    value={images}
                                    onChange={onChangeUploadImageVideo}
                                    maxNumber={4}
                                    multiple
                                    acceptType={['jpg', 'jpeg', 'png']}
                                  >
                                    {({
                                      imageList,
                                      onImageUpload,
                                      onImageUpdate,
                                      onImageRemove,
                                      dragProps,
                                      errors,
                                    }) => (
                                      <div className='upload__image-wrapper'>
                                        <button
                                          type='button'
                                          {...dragProps}
                                          onClick={(e: any) => {
                                            e.preventDefault()
                                            onImageUpload()
                                          }}
                                          className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-6 py-7 text-start w-100 min-w-150px'
                                        >
                                          <KTSVG
                                            className='svg-icon-3x ms-n1'
                                            path='/media/icons/duotone/Interface/Image.svg'
                                          />
                                          <span className='text-gray-800 pt-6'>
                                            {intl.formatMessage({
                                              id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE',
                                            })}
                                          </span>
                                        </button>
                                        <span
                                          className='text-gray-400 mb-3'
                                          style={{fontSize: '11px', paddingLeft: '3px'}}
                                        >
                                          {/* Maximum Upload 3 Photos. */}
                                          {errors?.maxNumber && (
                                            <span className='text-danger fw-bolder'>
                                              Maximum Upload 3 Photos.
                                            </span>
                                          )}
                                        </span>
                                        <div className='my-2'>
                                          {errors?.acceptType && (
                                            <span className='text-danger'>
                                              {intl.formatMessage({
                                                id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW',
                                              })}
                                            </span>
                                          )}
                                        </div>
                                        <div className='row'>
                                          {imageList?.map((image, index) => {
                                            const index_key: number = index + 1
                                            return (
                                              <div
                                                key={index_key}
                                                className='image-item my-3 border-dashed border-muted col-3 mx-2'
                                                style={{position: 'relative', padding: '5px'}}
                                              >
                                                <img
                                                  src={image?.dataURL}
                                                  alt=''
                                                  style={{width: '100%'}}
                                                />
                                                <div
                                                  className='image-item__btn-wrapper'
                                                  style={{
                                                    marginTop: '-38px',
                                                    marginLeft: '5px',
                                                    position: 'absolute',
                                                  }}
                                                >
                                                  <button
                                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                    onClick={(e: any) => {
                                                      e.preventDefault()
                                                      onImageUpdate(index)
                                                    }}
                                                  >
                                                    <KTSVG
                                                      path='/media/icons/duotone/Communication/Write.svg'
                                                      className='svg-icon-3'
                                                    />
                                                  </button>
                                                  <button
                                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                                    onClick={(e: any) => {
                                                      e.preventDefault()
                                                      const validate = fileValidation
                                                      fileValidation &&
                                                        Object.keys(fileValidation || {}).includes(
                                                          `files.photos.${index}.data`
                                                        ) &&
                                                        delete validate[
                                                          `files.photos.${index}.data`
                                                        ]
                                                      setFileValidation(validate)
                                                      onImageRemove(index)
                                                    }}
                                                  >
                                                    <KTSVG
                                                      path='/media/icons/duotone/General/Trash.svg'
                                                      className='svg-icon-3'
                                                    />
                                                  </button>
                                                </div>
                                                <div>{image?.file?.name}</div>
                                                {fileValidation &&
                                                  Object.keys(fileValidation || {}).includes(
                                                    `files.photos.${index}.data`
                                                  ) && (
                                                    <div className='text-danger'>
                                                      {fileValidation[
                                                        `files.photos.${index}.data`
                                                      ].replace(`files.photos.${index}.`, '')}
                                                    </div>
                                                  )}
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </ImageUploading>
                                </div>
                              </div>
                            </Tab>
                            {location?.pathname !== '/asset-management/add' && (
                              <Tab eventKey='assets' title='Assets'>
                                {toggleAsset ? (
                                  <div className='mt-5'>
                                    <div className='row  text-center'>
                                      <div className='col-12 mt-5'>
                                        <span className='text-black-400'>
                                          {intl.formatMessage({
                                            id: 'PLEASE_SELECT_EITHER_TO_ADD_NEW_ASSET_OR_CHOOSE_FROM_EXISTING_ASSET',
                                          })}
                                        </span>
                                      </div>
                                      <div className='col-12 mt-5 mb-1'>
                                        <button
                                          type='button'
                                          className='btn btn-primary'
                                          style={{marginRight: '10px'}}
                                          onClick={onNewAsset}
                                        >
                                          Add New Asset
                                        </button>
                                        <button
                                          type='button'
                                          className='btn btn-primary'
                                          onClick={() => {
                                            onAttachAsset(false)
                                          }}
                                        >
                                          Attach Exisiting Asset
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <AddLocationAsset
                                    showModal={showModal}
                                    locationDetail={locationDetail}
                                    attachExistingAsset={attachExistingAsset}
                                    formEdit={formEdit}
                                    setLimitExistingAsset={setLimitExistingAsset}
                                    limitExistingAsset={limitExistingAsset}
                                    totalPageExistingAsset={totalPageExistingAsset}
                                    setPageExistingAsset={setPageExistingAsset}
                                    pageExistingAsset={pageExistingAsset}
                                    setOrderDirExistingAsset={setOrderDirExistingAsset}
                                    orderDirExistingAsset={orderDirExistingAsset}
                                    setOrderColExistingAsset={setOrderColExistingAsset}
                                    loadingExistingAsset={loadingExistingAsset}
                                    reloadExistingAsset={reloadExistingAsset}
                                    setReloadExistingAsset={setReloadExistingAsset}
                                    pageFrom={pageFrom}
                                  />
                                )}
                              </Tab>
                            )}
                            {isEnableFeatureInsurance && (
                              <Tab eventKey='insurance' title='Insurance'>
                                <FormInsurance
                                  values={values}
                                  detail={detail}
                                  db={{
                                    checkSuperior1,
                                    checkSuperior2,
                                    checkTmSuperior1,
                                    checkTmSuperior2,
                                    checkRegional,
                                    checkTerritoryManager,
                                    checkDigital,
                                    checkDigitalSuperior1,
                                    checkDigitalSuperior2,
                                  }}
                                />
                              </Tab>
                            )}
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    disabled={loadingLocation}
                    className='btn-sm'
                    type='submit'
                    variant='primary'
                  >
                    {!loadingLocation && (
                      <span
                        className='indicator-label'
                        onClick={() => {
                          setOnClickForm(true)
                          setSecondErrSubmit(true)
                        }}
                      >
                        {locationDetail ? 'Save' : 'Add'}
                      </span>
                    )}
                    {loadingLocation && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  <Button className='btn-sm' variant='secondary' onClick={onClose}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>
      <ValidationSchema
        setLocationSchema={setLocationSchema}
        checkCountry={checkCountry}
        checkState={checkState}
        checkCity={checkCity}
        checkAddress={checkAddress}
        checkStreet={checkStreet}
        checkPostcode={checkPostcode}
        checkDescription={checkDescription}
        checkLatitude={checkLatitude}
        checkLongitude={checkLongitude}
      />
    </>
  )
}

AddLocation = memo(
  AddLocation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddLocation
