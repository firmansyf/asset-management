/* eslint-disable react-hooks/exhaustive-deps */
import 'cropperjs/dist/cropper.css'

import {getAssetBulkTemp} from '@api/Service'
import {FileUpload} from '@components/FileUpload'
import {FormCF} from '@components/form/CustomField'
import DateRange from '@components/form/date-range'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {customStyles, DropdownIndicator} from '@components/select/config'
import {Select as ReactSelect} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {configClass, errorExpiredToken, KTSVG, preferenceDate, urlToFile} from '@helpers'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, Fragment, memo, useEffect, useRef, useState} from 'react'
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'
import Cropper from 'react-cropper'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import Select from 'react-select'

import AddPoliceAsset from './form/AddPolicesAsset'
import {
  addInsurancePolicies,
  deleteDocumentInsurance,
  editInsurancePolicies,
  getAssetSelectedInsurancePolicies,
  getDetailInsurancePolicies,
  getDocumentInsurancePolicies,
  postAttachAssetInsurance,
  postDocumentInsurance,
} from './Service'

let AddPolicy: FC<any> = ({
  policyDetail,
  setShowModalPolicy,
  showModal,
  setReloadPolicy,
  reloadPolicy,
  optDatabase,
  insuranceSchema,
  onClickForm,
  setOnClickForm,
  reloadAsset,
  setReloadAsset,
  setDefaultPhoneNumber,
  defaultPhoneNumber,
  // mode,
}) => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const location: any = useLocation()
  const cropperRef: any = useRef(null)
  const pref_date: any = preferenceDate()

  const {token, preference: preferenceStore}: any = useSelector(
    ({token, preference}: any) => ({token, preference}),
    shallowEqual
  )
  const {preference: dataPreference, currency, phone_code: dataPhoneCode} = preferenceStore || {}
  const path: any = location.pathname || ''

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const [image, setImage] = useState<any>()
  const [src, setSRC] = useState<any>(null)
  const [rot, setRotate] = useState<number>(0)
  const [endDate, setEndDate] = useState<any>()
  const [keyword, _setKeyword] = useState<any>()
  const [typeFile, setType] = useState<string>('')
  const [result, setResult] = useState<string>('')
  const [document, setDocument] = useState<any>({})
  const [phoneCode, setPhoneCode] = useState<any>()
  const [startDate, setStartDate] = useState<any>()
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [errForm, setErrForm] = useState<boolean>(true)
  const [customField, setCustomField] = useState<any>([])
  const [formEdit, setFormEdit] = useState<boolean>(false)
  const [optCurrency, setOptionCurrency] = useState<any>([])
  const [toggleAsset, setToggleAsset] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [loadingPolicy, setLoadingPolicy] = useState<boolean>(false)
  const [totalPageExistingAsset, setTotalPage] = useState<number>(0)
  const [phoneCodeMatchPref, setPhodeCodeMatchPref] = useState<any>()
  const [pageExistingAsset, setPageExistingAsset] = useState<number>(1)
  const [preferenceCurrency, setPreferenceCurrency] = useState<any>([])
  const [secondErrSubmit, setSecondErrSubmit] = useState<boolean>(false)
  const [loadingExistingAsset, setLoadingAsset] = useState<boolean>(true)
  const [attachExistingAsset, setAttachExistingAsset] = useState<any>([])
  const [limitExistingAsset, setLimitExistingAsset] = useState<number>(10)
  const [orderCol, setOrderColExistingAsset] = useState<string>('asset_id')
  const [reloadExistingAsset, setReloadExistingAsset] = useState<number>(1)
  const [_loadingAttachAsset, setLoadingAttachAsset] = useState<boolean>(true)
  const [orderDirExistingAsset, setOrderDirExistingAsset] = useState<string>('asc')
  const [showFormCF, setShowFormCF] = useState<boolean>(false)

  useEffect(() => {
    setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 1000)
  }, [showModal])

  useEffect(() => {
    if (showModal && customField?.length === 0) {
      setTimeout(() => {
        setShowFormCF(true)
      }, 500)
    }
  }, [showModal])

  const onNewAsset = () => {
    navigate('/asset-management/add')
  }

  const onAttachAsset = () => {
    setToggleAsset(!toggleAsset)
  }

  const onSubmitDocument = (guid: any, params: any) => {
    if (Object.keys(document || {})?.length > 0 && params?.data !== undefined) {
      deleteDocumentInsurance(guid, document?.guid)
        .then(() => {
          postDocumentInsurance(params, guid)
            .then(() => '')
            .catch(({response}: any) => {
              if (response) {
                const {devMessage, data, message} = response?.data || {}
                const {fields} = data || {}

                if (!devMessage) {
                  if (fields === undefined) {
                    ToastMessage({message, type: 'error'})
                  }

                  if (fields) {
                    Object.keys(fields || {})?.map((item: any) => {
                      ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                      return true
                    })
                  }
                }
              }
            })
        })
        .catch(({response}: any) => {
          if (response) {
            const {devMessage, data, message} = response?.data || {}
            const {fields} = data || {}

            if (!devMessage) {
              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              }

              if (fields) {
                Object.keys(fields || {})?.map((item: any) => {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                  return true
                })
              }
            }
          }
        })
    } else {
      if (params?.data !== undefined) {
        postDocumentInsurance(params, guid)
          .then(({data: {message}}: any) => {
            ToastMessage({type: 'success', message})
          })
          .catch(({response}: any) => {
            if (response) {
              const {devMessage, data, message} = response?.data || {}
              const {fields} = data || {}

              if (!devMessage) {
                if (fields === undefined) {
                  ToastMessage({message, type: 'error'})
                }

                if (fields && Object.keys(fields || {})?.length > 0) {
                  Object.keys(fields || {})?.map((item: any) => {
                    if (item !== 'data') {
                      ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                    }
                    return true
                  })
                }
              }
            }
          })
      }
    }
  }

  const resultCustomField = (values: any, custom_fields_value: any) => {
    return values?.global_custom_fields
      ? Object.entries(values?.global_custom_fields || {})?.forEach((key: any, item: any) => {
          const guid: any = Number(key?.[0]) === item ? key?.[1]?.guid : key?.[0]
          const value: any = key?.[1]?.value || ''
          custom_fields_value[guid] = value || ''
        })
      : {}
  }

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({message, type: 'success'}), 400)
  }

  const handleSubmit = (values: any, actions: any) => {
    setLoadingPolicy(true)

    let errorOnSubmit: boolean = true
    if (values?.phone_number !== undefined && values?.phone_number?.length > 15) {
      if (values?.phone_number?.length > 15) {
        setLoadingPolicy(false)
        actions.setSubmitting(false)
        actions.setFieldError('phone_number', 'Maximum phone number length is 15 digits')
      }
    } else {
      errorOnSubmit = false
    }

    const paramsDocument: any = {
      title: image?.title || '',
      data: typeFile?.indexOf('image') >= 0 ? result : image?.data,
      description:
        values?.descr_document !== '' && values?.descr_document !== undefined
          ? values?.descr_document
          : document?.description !== '' && document?.description !== undefined
          ? document?.description
          : '',
    }

    const custom_fields_value: any = {}
    resultCustomField(values, custom_fields_value)

    const params: any = {
      name: values?.name || '',
      email: values?.email || '',
      limit: values?.limit || '',
      premium: values?.premium || '',
      insurer: values?.insurer || '',
      coverage: values?.coverage || '',
      is_active: values?.is_active || '',
      policy_no: values?.policy_no || '',
      deductible: values?.deductible || '',
      is_upload_file: image ? true : false,
      description: values?.description || '',
      files: image ? [paramsDocument || {}] : [],
      global_custom_fields: custom_fields_value || {},
      contact_person: values?.contact_person || '',
      end_date: moment(values?.end_date || '').format('YYYY-MM-DD'),
      start_date: moment(values?.start_date || '').format('YYYY-MM-DD'),
      currency_limit: values?.currency_limit ? values?.currency_limit?.value : '',
      currency_deductible: values?.currency_deductible ? values?.currency_deductible?.value : '',
      currency_premium: values?.currency_premium ? values?.currency_premium?.value : '',
      phone_number: values?.phone_number
        ? '+' + (values?.country_code || '') + ' ' + (values?.phone_number || '')
        : '',
    }

    if (!errorOnSubmit) {
      if (policyDetail) {
        const {guid}: any = policyDetail || {}
        editInsurancePolicies(params, guid)
          .then(({data: {message}}: any) => {
            setRotate(0)
            setEndDate(null)
            setStartDate(null)
            setOnClickForm(false)
            setLoadingPolicy(false)
            setShowModalPolicy(false)
            onSubmitAttachAsset(guid)
            setReloadPolicy(reloadPolicy + 1)
            onSubmitDocument(guid, paramsDocument)
            successMessage(message)

            if (path?.split('/')?.[3] === 'detail') {
              navigate(`/insurance/policies/detail/${guid || ''}`)
            }
          })
          .catch((e: any) => {
            errorExpiredToken(e)
            setLoadingPolicy(false)
            const {response} = e || {}

            if (response) {
              const {devMessage, data, message}: any = response?.data || {}
              const {fields}: any = data || {}

              if (!devMessage) {
                if (fields === undefined) {
                  ToastMessage({message, type: 'error'})
                }

                if (fields && Object.keys(fields || {})?.length > 0) {
                  Object.keys(fields || {})?.map((item: any) => {
                    if (item === 'file.description') {
                      ToastMessage({message: 'Document Description is Required', type: 'error'})
                    } else {
                      if (item?.includes('global_custom_fields')) {
                        if (fields?.[item] !== 'The global custom fields field is required.') {
                          actions.setFieldError(item || '', fields?.[item]?.[0] || '', false)
                        }
                      } else {
                        ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                      }
                    }
                    return true
                  })
                }
              }
            }
          })
      } else {
        addInsurancePolicies(params)
          .then((res: any) => {
            const {message, data} = res?.data || {}
            setRotate(0)
            setEndDate(null)
            setStartDate(null)
            setOnClickForm(false)
            setLoadingPolicy(false)
            setShowModalPolicy(false)
            setReloadPolicy(reloadPolicy + 1)
            onSubmitAttachAsset(data?.guid || '')
            successMessage(message)
          })
          .catch((e: any) => {
            errorExpiredToken(e)
            setLoadingPolicy(false)
            const {response}: any = e || {}

            if (response) {
              const {devMessage, data, message}: any = response?.data || {}
              const {fields}: any = data || {}

              if (!devMessage) {
                if (fields === undefined) {
                  ToastMessage({message, type: 'error'})
                }

                if (fields && Object.keys(fields || {})?.length > 0) {
                  Object.keys(fields || {})?.map((item: any) => {
                    if (item === 'file?.description') {
                      ToastMessage({message: 'Document Description is Required', type: 'error'})
                    } else {
                      if (item?.includes('global_custom_fields')) {
                        if (fields?.[item] !== 'The global custom fields field is required.') {
                          actions.setFieldError(item || '', fields?.[item]?.[0] || '', false)
                        }
                      } else {
                        ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                      }
                    }
                    return true
                  })
                }
              }
            }
          })
      }
    }
  }

  const onSubmitAttachAsset = (guid: any) => {
    const page: number = 1
    const limit: number = 1000
    const orderCol: string = 'name'
    const orderDir: string = 'asc'
    const params_asset: any = {page, limit, orderCol, orderDir}

    getAssetBulkTemp(params_asset, 'insurance_policy').then(({data: {data: res_asset}}) => {
      const data_attach_asset: any = []
      res_asset?.forEach((item: any) => {
        data_attach_asset?.push(item?.guid)
      })

      if (data_attach_asset?.length > 0) {
        postAttachAssetInsurance({asset_guids: data_attach_asset}, guid)
          .then(() => setReloadAsset(reloadAsset + 1))
          .catch(({response}: any) => {
            const {devMessage, data, message} = response?.data || {}
            const {fields} = data || {}

            if (!devMessage) {
              if (fields === undefined) {
                ToastMessage({message, type: 'error'})
              }

              if (fields && Object.keys(fields || {})?.length > 0) {
                Object.keys(fields || {})?.forEach((item: any) => {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                })
              }
            }
          })
      }
    })
  }

  useEffect(() => {
    if (currency) {
      const res: any = currency?.map((e: any) => {
        return {
          ...e,
          key: e?.country + '-' + e?.key,
          value: e?.key + ' - ' + e?.value?.split('-')?.[0],
          label: e?.key,
        }
      })
      setOptionCurrency(
        res?.map(({key: value, value: label, label: cusLabel}: any) => ({value, label, cusLabel}))
      )
    }
  }, [currency])

  useEffect(() => {
    const {guid} = policyDetail || {}
    if (guid && showModal) {
      setLoadingAttachAsset(true)
      const page: number = pageExistingAsset
      const limit: number = limitExistingAsset
      const orderDir: string = orderDirExistingAsset

      getAssetSelectedInsurancePolicies(guid, {page, limit, keyword, orderDir, orderCol})
        .then(({data: {data: res_asset, meta}}: any) => {
          const {current_page, total, from}: any = meta || {}
          const newLimitExistingAsset: number = limitExistingAsset
          setPageFrom(from)
          setTotalPage(total)
          setPageExistingAsset(current_page)
          setLimitExistingAsset(newLimitExistingAsset)

          if (res_asset) {
            const dataAsset: any = res_asset?.map((res: any) => {
              const {asset_id, asset_name, category_name} = res || {}
              return {
                asset_id: asset_id || '-',
                name: asset_name || '-',
                category: category_name || '-',
                delete: 'Delete',
                original: res,
              }
            })

            if (dataAsset?.length > 0) {
              setToggleAsset(false)
              setFormEdit(true)
            }
            setAttachExistingAsset(dataAsset as never[])
          }
          setTimeout(() => setLoadingAsset(false), 800)
        })
        .catch(() => setTimeout(() => setLoadingAsset(false), 800))
    }
  }, [
    policyDetail,
    pageExistingAsset,
    limitExistingAsset,
    orderDirExistingAsset,
    orderCol,
    keyword,
    reloadAsset,
    reloadExistingAsset,
    showModal,
  ])

  useEffect(() => {
    if (policyDetail && showModal) {
      getDocumentInsurancePolicies(policyDetail?.guid, {})
        .then(({data: {data: res_doc}}) => {
          res_doc = res_doc?.filter((f: any) => !Object.values(f || {})?.includes(null))
          if (res_doc && res_doc?.[0]) {
            const {description, file_url, file_type} = res_doc?.[0] || {}
            urlToFile(`${file_url}?token=${token}`, '').then((file: any) => {
              setImage({data: file?.base64 || '', title: description})
              setSRC(file?.base64 || '')
              setType(file_type)
              setDocument(res_doc?.[0])
            })
          } else {
            setImage(undefined)
            setSRC(null)
            setType('')
            setDocument({})
          }
        })
        .catch(() => '')
    } else {
      setImage(undefined)
      setSRC(null)
      setType('')
      setDocument({})
    }
  }, [policyDetail, showModal, token])

  useEffect(() => {
    if (showModal) {
      if (policyDetail?.guid) {
        getDetailInsurancePolicies(policyDetail?.guid)
          .then(({data: {data: res_loc}}) => {
            setCustomField(res_loc?.custom_fields)
          })
          .catch(() => '')
      } else {
        getCustomField({filter: {section_type: 'insurance_policy'}})
          .then(({data: {data: res_loc}}) => {
            setCustomField(res_loc)
          })
          .catch(({response}: any) => {
            const {message} = response?.data || {}
            ToastMessage({type: 'error', message})
          })
      }
    }
  }, [showModal, policyDetail?.guid])

  useEffect(() => {
    if (showModal) {
      setStartDate(undefined)
      setEndDate(undefined)

      if (policyDetail !== undefined) {
        policyDetail?.start_date && setStartDate(new Date(policyDetail?.start_date))
        policyDetail?.end_date && setEndDate(new Date(policyDetail?.end_date))
      }
    }
  }, [showModal, policyDetail])

  useEffect(() => {
    if (dataPhoneCode && dataPhoneCode?.length > 0) {
      const data: any = dataPhoneCode?.map(({key, label}) => ({
        value: key || '',
        label: `${label || ''} (+${key || ''})`,
      }))
      setPhoneCode(data as never[])
    }
  }, [dataPhoneCode])

  useEffect(() => {
    showModal && setPhodeCodeMatchPref(dataPreference)
  }, [dataPreference, showModal])

  useEffect(() => {
    if (dataPreference) {
      const cekCurrency: any = optCurrency?.filter(
        ({cusLabel}: any) => cusLabel === dataPreference?.currency
      )
      setPreferenceCurrency(cekCurrency)
    }
  }, [optCurrency, dataPreference])

  const onCrop = () => {
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper
    setResult(cropper?.getCroppedCanvas()?.toDataURL())
  }

  const rotateImage = (v: any) => {
    let rotate = v + 90
    if (v === 270) {
      rotate = 0
    }
    const imageElement: any = cropperRef?.current
    const cropper: any = imageElement?.cropper
    cropper?.rotate(rotate)
  }

  const onChangeUploadInvoice = (e: any) => {
    if (e?.[0]) {
      let data: any = ''
      e?.forEach((m: any) => {
        const reader: any = new FileReader()
        reader.readAsDataURL(m)
        reader.onload = () => {
          const {name, type: type_file}: any = m
          data = {data: reader?.result, title: name}
          setType(type_file)

          setSRC(reader?.result)
          setImage(data)
        }
      })
    }
  }

  const initValues = {
    descr_document: policyDetail
      ? document
        ? Object.keys(document || {})?.length > 0
          ? document?.description !== '-'
            ? document?.description
            : ''
          : ''
        : ''
      : '',
    is_active: policyDetail ? policyDetail?.is_active === 1 : true,
    name: policyDetail?.name || '',
    description: policyDetail?.description || '',
    email: (policyDetail?.email !== '-' ? policyDetail?.email : '') || '',
    insurer: policyDetail?.insurer !== '-' ? policyDetail?.insurer : '',
    policy_no: policyDetail?.policy_no !== '-' ? policyDetail?.policy_no : '',
    contact_person: policyDetail?.contact_person !== '-' ? policyDetail?.contact_person : '',
    phone_number: defaultPhoneNumber !== '' ? defaultPhoneNumber?.split(' ')?.[1] : '',
    country_code:
      policyDetail !== undefined && defaultPhoneNumber !== ''
        ? defaultPhoneNumber?.split(' ')?.[0]
        : phoneCodeMatchPref?.phone_code,
    coverage: policyDetail?.coverage !== '-' ? policyDetail?.coverage : '',
    start_date: policyDetail?.start_date || '',
    end_date: policyDetail?.end_date || '',
    limit: (policyDetail?.limit ? Number(policyDetail?.limit) : '') || '',
    deductible: (policyDetail?.deductible ? Number(policyDetail?.deductible) : '') || '',
    premium: (policyDetail?.premium ? Number(policyDetail?.premium) : '') || '',
    currency_limit:
      policyDetail?.currency_limit !== undefined
        ? optCurrency?.filter(
            ({value}: any) =>
              value ===
              policyDetail?.currency_limit?.iso_code + '-' + policyDetail?.currency_limit?.currency
          )?.[0]
        : preferenceCurrency?.length > 0
        ? preferenceCurrency[0]
        : optCurrency[0],
    currency_deductible:
      policyDetail?.currency_deductible !== undefined
        ? optCurrency?.filter(
            ({value}: any) =>
              value ===
              policyDetail?.currency_deductible?.iso_code +
                '-' +
                policyDetail?.currency_deductible?.currency
          )?.[0]
        : preferenceCurrency?.length > 0
        ? preferenceCurrency[0]
        : optCurrency[0],
    currency_premium:
      policyDetail?.currency_premium !== undefined
        ? optCurrency?.filter(
            ({value}: any) =>
              value ===
              policyDetail?.currency_premium?.iso_code +
                '-' +
                policyDetail?.currency_premium?.currency
          )?.[0]
        : preferenceCurrency?.length > 0
        ? preferenceCurrency[0]
        : optCurrency[0],
    global_custom_fields:
      customField?.filter(({value}: any) => value)?.map(({guid, value}: any) => ({guid, value})) ||
      [],
  }

  const typeFileEx: any = [
    'jpg',
    'jpeg',
    'png',
    'image/jpeg',
    'image/png',
    'pdf',
    'application/pdf',
    'doc',
    'docx',
    'application/document',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv',
    'xls',
    'xlsx',
    'application/sheet',
    'application/ms-excel',
    'application/vnd.ms-excel',
    'video/*',
  ]

  const onClose = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setShowModalPolicy(false)
    setOnClickForm(false)
    setSecondErrSubmit(false)
    setDefaultPhoneNumber('')
    setAttachExistingAsset([])
    setFormEdit(false)
    ToastMessage({type: 'clear'})
  }

  return (
    <Modal dialogClassName='modal-lg' size='lg' show={showModal} onHide={onClose}>
      <Formik
        validationSchema={insuranceSchema}
        initialValues={initValues}
        enableReinitialize //={!showModal}
        onSubmit={handleSubmit}
      >
        {({setFieldValue, setSubmitting, errors, values, isSubmitting}) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
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
            !errForm &&
            Object.keys(errors || {})?.length > 0 &&
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
              <Modal.Header closeButton>
                <Modal.Title>{policyDetail ? 'Edit' : 'Add'} Insurance Policy</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='col-md-12'>
                    <Tabs defaultActiveKey='tab-details'>
                      <Tab eventKey='tab-details' title='Details'>
                        <div className='row mb-3' style={{marginTop: '10px'}}>
                          {optDatabase?.map((database: any, i: number) => {
                            if (database?.field?.toLowerCase() === 'name') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-12 mb-5'>
                                      <label
                                        htmlFor='name'
                                        className={`${configClass?.label} 
                                            ${database?.is_required ? 'mb-2 required' : 'mb-2'}
                                          `}
                                      >
                                        {database?.label}
                                      </label>
                                      <Field
                                        name='name'
                                        type='text'
                                        placeholder={'Enter ' + database?.label}
                                        className={configClass?.form}
                                      />
                                      {errors?.name && (
                                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                          <ErrorMessage name='name' />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'description') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-12 mb-5'>
                                      <label
                                        htmlFor='description'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <Field
                                        style={{fontSize: '12px'}}
                                        name='description'
                                        as='textarea'
                                        type='text'
                                        placeholder={'Enter ' + database?.label}
                                        className={configClass?.form}
                                      />
                                      {errors?.description && (
                                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                          <ErrorMessage name='description' />
                                          {/* This policy description is required */}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'email') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='email'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database
                                          ? database?.label?.charAt(0)?.toUpperCase() +
                                            database?.label?.slice(1)
                                          : ''}
                                      </label>
                                      <InputText
                                        name='email'
                                        type='email'
                                        placeholder={
                                          'Enter ' +
                                          (database
                                            ? database?.label?.charAt(0)?.toUpperCase() +
                                              database?.label?.slice(1)
                                            : '')
                                        }
                                        errors={errors}
                                        className={configClass?.form}
                                      />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'insurer') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='insurer'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <InputText
                                        name='insurer'
                                        type='text'
                                        placeholder={'Enter ' + database?.label}
                                        errors={errors}
                                        className={configClass?.form}
                                      />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'policy_no') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='policy_no'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <InputText
                                        name='policy_no'
                                        type='text'
                                        placeholder={'Enter ' + database?.label}
                                        errors={errors}
                                        className={configClass?.form}
                                      />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'contact_person') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='contact_person'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <InputText
                                        name='contact_person'
                                        type='text'
                                        placeholder={'Enter ' + database?.label}
                                        errors={errors}
                                        className={configClass?.form}
                                      />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'coverage') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='coverage'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <InputText
                                        name='coverage'
                                        type='text'
                                        placeholder={'Enter ' + database?.label}
                                        errors={errors}
                                        className={configClass?.form}
                                      />
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else {
                              return null
                            }
                          })}
                        </div>

                        <div className='col-12'>
                          <hr />
                        </div>

                        <div className='row mb-3'>
                          {optDatabase?.map((database: any, i: number) => {
                            if (database?.field?.toLowerCase() === 'phone_number') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-lg-6 col-md-12 mb-5'>
                                      <label
                                        htmlFor='phone_number'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <div className='d-flex align-items-center input-group input-group-solid'>
                                        <div className='w-170px'>
                                          <ReactSelect
                                            sm={true}
                                            className='col p-0'
                                            name='country_code'
                                            placeholder='Enter Country Code'
                                            data={phoneCode}
                                            defaultValue={values?.country_code}
                                            onChange={(e: any) =>
                                              setFieldValue('country_code', e?.value || '')
                                            }
                                          />
                                        </div>
                                        <Field
                                          style={{fontSize: '12px'}}
                                          name='phone_number'
                                          type='text'
                                          // minLength='8'
                                          maxLength='13'
                                          placeholder={'Enter ' + database?.label}
                                          className={configClass?.form}
                                          onChange={({target: {value}}: any) => {
                                            setFieldValue(
                                              'phone_number',
                                              value?.replace(/\D/g, '') || ''
                                            )
                                          }}
                                        />
                                      </div>
                                      <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                        <ErrorMessage name='phone_number' />
                                      </div>
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'limit') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='limit'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <div className='d-flex align-items-center input-group input-group-solid'>
                                        <div className='w-100px'>
                                          <Select
                                            name='currency_limit'
                                            placeholder='Enter '
                                            styles={customStyles(true, {input: {margin: 0}})}
                                            options={optCurrency}
                                            value={values?.currency_limit}
                                            components={{
                                              DropdownIndicator,
                                              Option: ({innerProps, data}: any) => (
                                                <div
                                                  {...innerProps}
                                                  style={{
                                                    borderBottom: '1px solid #EBEBEB',
                                                    padding: '0.5rem',
                                                    fontSize: '9pt',
                                                  }}
                                                >
                                                  {data?.label}
                                                </div>
                                              ),
                                            }}
                                            getOptionValue={(option: any) => option?.value}
                                            getOptionLabel={(option: any) => option?.cusLabel}
                                            onChange={(e: any) => {
                                              setFieldValue('currency_limit', e)
                                            }}
                                          />
                                        </div>
                                        <Field
                                          name='limit'
                                          type='number'
                                          placeholder={'Enter ' + database?.label}
                                          className={configClass?.form}
                                        />
                                      </div>
                                      {errors?.limit && (
                                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                          {/* This limit is required */}
                                          <ErrorMessage name='limit' />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'start_date') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6  mb-5'>
                                      <label
                                        htmlFor='start_date'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label?.toLowerCase() === 'start date' && 'Date'}
                                      </label>

                                      <DateRange
                                        modal={false}
                                        minDate={moment().subtract(5, 'y')?.toDate()}
                                        value={{
                                          startDate: policyDetail?.start_date || startDate || '',
                                          endDate: policyDetail?.end_date || endDate || '',
                                        }}
                                        onChange={({startDate, endDate}: any) => {
                                          const from_date: any = startDate
                                            ? moment(startDate || '')?.format('Y-MM-DD')
                                            : ''
                                          const to_date: any = endDate
                                            ? moment(endDate || '')?.format('Y-MM-DD')
                                            : ''
                                          setStartDate(from_date)
                                          setFieldValue('start_date', from_date)
                                          setEndDate(to_date)
                                          setFieldValue('end_date', to_date)
                                        }}
                                      >
                                        {!startDate || !endDate ? (
                                          <span className='text-gray-500'>Select Date</span>
                                        ) : startDate === endDate ? (
                                          <span>{moment(startDate || '')?.format(pref_date)}</span>
                                        ) : (
                                          <span>
                                            {moment(
                                              startDate || policyDetail?.start_date || ''
                                            )?.format(pref_date)}
                                            <span className='mx-2'>-</span>
                                            {moment(
                                              endDate || policyDetail?.end_date || ''
                                            )?.format(pref_date)}
                                          </span>
                                        )}
                                      </DateRange>

                                      <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                        <ErrorMessage name='start_date' />
                                      </div>
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'deductible') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='deductible'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <div className='d-flex align-items-center input-group input-group-solid'>
                                        <div className='w-100px'>
                                          <Select
                                            name='currency_deductible'
                                            placeholder='Enter '
                                            styles={customStyles(true, {input: {margin: 0}})}
                                            options={optCurrency}
                                            value={values?.currency_deductible}
                                            components={{
                                              DropdownIndicator,
                                              Option: ({innerProps, data}: any) => (
                                                <div
                                                  {...innerProps}
                                                  style={{
                                                    borderBottom: '1px solid #EBEBEB',
                                                    padding: '0.5rem',
                                                    fontSize: '9pt',
                                                  }}
                                                >
                                                  {data?.label}
                                                </div>
                                              ),
                                            }}
                                            getOptionValue={(option: any) => option?.value}
                                            getOptionLabel={(option: any) => option?.cusLabel}
                                            onChange={(e: any) => {
                                              setFieldValue('currency_deductible', e)
                                            }}
                                          />
                                        </div>
                                        <Field
                                          name='deductible'
                                          type='number'
                                          placeholder={'Enter ' + database?.label}
                                          className={configClass?.form}
                                        />
                                      </div>
                                      <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                        <ErrorMessage name='deductible' />
                                      </div>
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else if (database?.field?.toLowerCase() === 'premium') {
                              return (
                                <Fragment key={i}>
                                  {database?.is_selected && (
                                    <div className='col-md-6 mb-5'>
                                      <label
                                        htmlFor='premium'
                                        className={`${configClass?.label} ${
                                          database?.is_required ? 'mb-2 required' : 'mb-2'
                                        }`}
                                      >
                                        {database?.label}
                                      </label>
                                      <div className='d-flex align-items-center input-group input-group-solid'>
                                        <div className='w-100px'>
                                          <Select
                                            name='currency_premium'
                                            placeholder='Enter '
                                            styles={customStyles(true, {input: {margin: 0}})}
                                            options={optCurrency}
                                            value={values?.currency_premium}
                                            components={{
                                              DropdownIndicator,
                                              Option: ({innerProps, data}: any) => (
                                                <div
                                                  {...innerProps}
                                                  style={{
                                                    borderBottom: '1px solid #EBEBEB',
                                                    padding: '0.5rem',
                                                    fontSize: '9pt',
                                                  }}
                                                >
                                                  {data?.label}
                                                </div>
                                              ),
                                            }}
                                            getOptionValue={(option: any) => option?.value}
                                            getOptionLabel={(option: any) => option?.cusLabel}
                                            onChange={(e: any) => {
                                              setFieldValue('currency_premium', e)
                                            }}
                                          />
                                        </div>
                                        <Field
                                          name='premium'
                                          type='number'
                                          placeholder={'Enter ' + database?.label}
                                          className={configClass?.form}
                                        />
                                      </div>
                                      {errors?.premium && (
                                        <div className='fv-plugins-message-container mt-0 invalid-feedback'>
                                          <ErrorMessage name='premium' />
                                          {/* This premium is required */}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Fragment>
                              )
                            } else {
                              return null
                            }
                          })}
                        </div>

                        <FormCF
                          type='insurance_policy'
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
                      </Tab>

                      <Tab eventKey='tab-assets' title='Assets'>
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
                                    onAttachAsset()
                                  }}
                                >
                                  Attach Exisiting Asset
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <AddPoliceAsset
                            showModal={showModal}
                            policyDetail={policyDetail}
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

                      <Tab eventKey='tab-documents' title='Documents'>
                        <div className='mt-4 mb-4'>
                          <label htmlFor='descr_document' className={`${configClass?.label}`}>
                            Description
                          </label>
                          <Field
                            style={{fontSize: '12px'}}
                            name='descr_document'
                            as='textarea'
                            type='text'
                            placeholder='Enter Description'
                            className={configClass?.form}
                            // value={values?.descr_document}
                          />
                        </div>

                        <div>
                          <div className='mb-4'>
                            <label className={`${configClass?.label}`}>Upload File</label>
                            <FileUpload
                              name='files'
                              onChange={onChangeUploadInvoice}
                              accept={typeFileEx?.join(',') || ''}
                            >
                              <button
                                type='button'
                                className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary py-4 w-100 text-start min-w-150px'
                              >
                                <KTSVG
                                  className='svg-icon-3x ms-n1'
                                  path='/media/icons/duotone/Files/Selected-file.svg'
                                />
                                <span className='text-gray-800 pt-6'>
                                  {intl.formatMessage({
                                    id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE',
                                  })}
                                </span>
                              </button>
                            </FileUpload>
                          </div>
                          <div className='mt-5 text-center'>
                            {/* {image && <img alt='img-document' width={300} src={result} />} */}
                            {typeFile && typeFile?.indexOf('image') >= 0 && (
                              <>
                                {src && (
                                  <>
                                    <Cropper
                                      src={src}
                                      style={{height: 400, width: '100%'}}
                                      initialAspectRatio={1 / 1}
                                      autoCropArea={1}
                                      guides={false}
                                      crop={onCrop}
                                      ref={cropperRef}
                                      viewMode={2}
                                    />
                                    <Button
                                      className='mt-5'
                                      onClick={() => {
                                        rotateImage(rot)
                                      }}
                                    >
                                      Rotate
                                    </Button>
                                  </>
                                )}
                              </>
                            )}
                            {typeFile && typeFile?.indexOf('image') <= 0 && src && (
                              <ViewerCustom type={typeFile} src={src} />
                            )}
                          </div>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>

                  <div className='row'>
                    <div className='col-12' style={{marginTop: '10px'}}>
                      <div className='d-flex align-items-center'>
                        <input
                          id='is_active'
                          name='is_active'
                          type='checkbox'
                          checked={values?.is_active}
                          onChange={(e: any) => {
                            setFieldValue('is_active', e?.target?.checked)
                          }}
                        />
                        <label htmlFor='is_active' className='ms-2'>
                          <strong>Active</strong>
                        </label>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={loadingPolicy} className='btn-sm' type='submit' variant='primary'>
                  {!loadingPolicy && (
                    <span
                      className='indicator-label'
                      onClick={() => {
                        setOnClickForm(true)
                        setSecondErrSubmit(true)
                      }}
                    >
                      {policyDetail ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loadingPolicy && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

AddPolicy = memo(AddPolicy)
export {AddPolicy}
