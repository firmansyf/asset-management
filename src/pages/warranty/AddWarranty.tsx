/* eslint-disable react-hooks/exhaustive-deps */
import 'react-datetime/css/react-datetime.css'

import {FormCF} from '@components/form/CustomField'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, errorValidation, preferenceDate} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Datetime from 'react-datetime'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {getAssetV1} from '../asset-management/redux/AssetRedux'
import {getCustomField} from '../setup/custom-field/redux/ReduxCustomField'
import {addWarranty, editWarranty, getDetailWarranty} from './redux/WarrantyCRUD'

let AddWarranty: FC<any> = ({
  warrantyDetail,
  setShowModaWarranty,
  showModal,
  setReloadWarranty,
  reloadWarranty,
  optDatabase,
  setValidationNonCF,
  onClickForm,
  setOnClickForm,
  defaultCustomField,
}) => {
  const intl = useIntl()
  const pref_date: any = preferenceDate()

  const [optlength, setOptLength] = useState<any>({})
  const [optExpired, setOptExpired] = useState<any>({})
  const [customField, setCustomField] = useState<any>([])
  const [showForm, setShowForm] = useState<boolean>(false)
  const [optAssetGuid, setOptAssetGuid] = useState<any>({})
  const [purchaseDate, setPurchaseDate] = useState<any>(null)
  const [optDescription, setOptDescription] = useState<any>({})
  const [dataAssetGuid, setAssetGuid] = useState<any>(undefined)
  const [validationSchema, setValidationSchema] = useState<any>([])
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [visibility, setVisibility] = useState<string>('invisible')
  const [secondErrSubmit, setSecondErrSubmit] = useState<boolean>(false)
  const [loadingWarranty, setLoadingWarranty] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const resultCustomField: any = (values: any, custom_fields_value: any) => {
    return values?.global_custom_fields
      ? Object.entries(values?.global_custom_fields || {})?.forEach((key: any, item: any) => {
          const guid: any = Number(key?.[0]) === item ? key?.[1]?.guid : key?.[0]
          const value: any = key?.[1]?.value || ''
          custom_fields_value[guid] = value || ''
        })
      : {}
  }

  const handleSubmit = (values: any, actions: any) => {
    setLoadingWarranty(true)
    const {guid}: any = warrantyDetail || {}
    const custom_fields_value: any = {}
    resultCustomField(values, custom_fields_value)

    const params: any = {
      asset_guid: values?.asset_guid || '',
      description: values?.description || '',
      expired: values?.expired || '',
      length: values?.length || '',
      global_custom_fields: custom_fields_value as never[],
    }

    const successMessage = (message: any) => {
      setTimeout(() => ToastMessage({type: 'clear'}), 300)
      setTimeout(() => ToastMessage({message, type: 'success'}), 400)
    }

    if (guid) {
      editWarranty(params, guid)
        .then(({data: {message}}: any) => {
          setLoadingWarranty(false)
          setShowModaWarranty(false)
          setShowForm(false)
          setVisibility('invisible')
          setReloadWarranty(reloadWarranty + 1)
          successMessage(message)
          setPurchaseDate(moment().format(pref_date))
        })
        .catch((e: any) => {
          errorValidation(e)
          errorExpiredToken(e)
          setLoadingWarranty(false)

          const {devMessage, data, message}: any = e?.response?.data || {}
          const {fields}: any = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item?.includes('global_custom_fields')) {
                  if (fields?.[item] !== 'The global custom fields field is required.') {
                    actions?.setFieldError(item || '', fields?.[item]?.[0] || '', false)
                  }
                } else {
                  ToastMessage({message: fields?.[item]?.[0] || 'Error.', type: 'error'})
                }
                return true
              })
            }
          }
        })
    } else {
      addWarranty(params)
        .then(({data: {message}}: any) => {
          setLoadingWarranty(false)
          setShowModaWarranty(false)
          setShowForm(false)
          setVisibility('invisible')
          setReloadWarranty(reloadWarranty + 1)
          successMessage(message)
          setPurchaseDate(null)
        })
        .catch((e: any) => {
          errorValidation(e)
          errorExpiredToken(e)
          setLoadingWarranty(false)

          const {devMessage, data, message}: any = e?.response?.data || {}
          const {fields}: any = data || {}

          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item?.includes('global_custom_fields')) {
                  if (fields?.[item] !== 'The global custom fields field is required.') {
                    actions?.setFieldError(item || '', fields?.[item]?.[0] || '')
                  }
                } else {
                  ToastMessage({message: fields?.[item]?.[0] || 'Error.', type: 'error'})
                }
                return true
              })
            }
          }
        })
    }
  }

  useEffect(() => {
    if (showModal && defaultCustomField?.length === 0) {
      setTimeout(() => setShowForm(true), 500)
    }
  }, [showModal])

  useEffect(() => {
    if (showModal && showForm) {
      setTimeout(() => setVisibility('visible'), 2000)
    }
  }, [showModal, showForm])

  useEffect(() => {
    const {expired}: any = warrantyDetail || {}
    setPurchaseDate(expired ? moment(expired).format(pref_date) : '')
  }, [warrantyDetail, pref_date])

  useEffect(() => {
    let validationShape: any = {}

    if (optDatabase) {
      optDatabase
        ?.filter(({field}: any) => field === 'asset_name')
        ?.forEach((database: any) => {
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              asset_guid: Yup.string().required('Asset is required'),
            }
          }
          setOptAssetGuid(database)
        })

      optDatabase
        ?.filter(({field}: any) => field === 'expired')
        ?.forEach((database: any) => {
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              expired: Yup.mixed().test({
                name: 'expired',
                test: function () {
                  const {expired} = this.parent || {}
                  if (expired === undefined) {
                    return this.createError({
                      message: `Warranty Expiration Date is required`,
                    })
                  }
                  return true
                },
              }),
            }
          }
          setOptExpired(database)
        })

      optDatabase
        ?.filter(({field}: any) => field === 'description')
        ?.forEach((database: any) => {
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              description: Yup.string().required('Warranty Description is required'),
            }
          }
          setOptDescription(database)
        })

      optDatabase
        ?.filter(({field}: any) => field === 'length')
        ?.forEach((database: any) => {
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              length: Yup.string().required('Warranty Period is required'),
            }
          }
          setOptLength(database)
        })
    }

    setValidationSchema(Yup.object().shape(validationShape))
  }, [optDatabase])

  useEffect(() => {
    const {guid}: any = warrantyDetail || {}
    if (guid && showModal) {
      getDetailWarranty(guid)
        .then(
          ({
            data: {
              data: {custom_fields},
            },
          }: any) => {
            setTimeout(() => {
              setCustomField(custom_fields as never[])
            }, 500)
          }
        )
        .catch(() => '')
    } else {
      getCustomField({'filter[section_type]': 'warranty'})
        .then(({data: {data: res_cus}}: any) => {
          setTimeout(() => {
            setCustomField(res_cus as never[])
          }, 500)
        })
        .catch(({response}: any) => {
          const {message} = response?.data || {}
          ToastMessage({type: 'error', message})
        })
    }
  }, [warrantyDetail, showModal])

  useEffect(() => {
    const {asset_guid, asset_id, asset_name}: any = warrantyDetail || {}
    asset_guid &&
      setAssetGuid({
        value: asset_guid || '',
        label: `${asset_id || ''} ${asset_name || ''}`,
      })
  }, [warrantyDetail, showModal])

  const iniValues: any = {
    length: warrantyDetail?.length || '',
    asset_guid: warrantyDetail?.asset_guid || '',
    description: warrantyDetail?.description || '',
    expired: warrantyDetail?.expired || '',
    global_custom_fields: customField
      ?.filter(({value}: any) => value)
      ?.map(({guid, value}: any) => ({guid, value})) as never[],
  }

  const onClose = () => {
    setAssetGuid({})
    setOnClickForm(false)
    setValidationNonCF(true)
    setLoadingWarranty(false)
    setSecondErrSubmit(false)
    setShowModaWarranty(false)
    setPurchaseDate(null)
    setShowForm(false)
    setVisibility('invisible')
    ToastMessage({type: 'clear'})
  }

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      <Formik
        initialValues={iniValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue, setSubmitting, errors, isSubmitting}: any) => {
          if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrSubmitForm(false)
            setSubmitting(false)
            setSecondErrSubmit(false)
          }
          if (
            isSubmitting &&
            !errSubmitForm &&
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
                <Modal.Title>{warrantyDetail?.guid ? 'Edit' : 'Add'} Warranty</Modal.Title>
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
                  style={visibility === 'invisible' ? {height: '10px'} : {minHeight: '160px'}}
                >
                  {showForm && (
                    <div className='row'>
                      {optAssetGuid?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='name'
                            className={`${configClass?.label} ${
                              optAssetGuid?.is_required ? 'required' : ''
                            }`}
                          >
                            {optAssetGuid?.label}
                          </label>
                          <Select
                            sm={true}
                            name='asset_guid'
                            className='col p-0 asset_guid_cypress'
                            id='assetGuid'
                            api={getAssetV1}
                            params={{
                              orderCol: 'asset_id',
                              orderDir: 'asc',
                              filter: {has_warranty: 0},
                            }}
                            placeholder='Choose Asset'
                            isClearable={false}
                            defaultValue={warrantyDetail?.asset_guid ? dataAssetGuid : {}}
                            onChange={({value}: any) => setFieldValue('asset_guid', value || '')}
                            parse={({asset_guid, asset_id, asset_name}: any) => ({
                              value: asset_guid || '',
                              label: `${asset_id || ''} ${asset_name || ''}`,
                            })}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='asset_guid' />
                          </div>
                        </div>
                      )}
                      {optDescription?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='name'
                            className={`${configClass?.label} ${
                              optDescription?.is_required ? 'required' : ''
                            }`}
                          >
                            {optDescription?.label}
                          </label>
                          <InputText
                            name='description'
                            type='text'
                            className={configClass?.form}
                            placeholder={'Enter ' + optDescription?.label}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='description' />
                          </div>
                        </div>
                      )}

                      {optExpired?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='name'
                            className={`${configClass?.label} ${
                              optExpired?.is_required ? 'required' : ''
                            }`}
                          >
                            {optExpired?.label}
                          </label>
                          <div className='input-group input-group-solid'>
                            <span className='input-group-text pe-0'>
                              <i className='fa fa-calendar-alt text-primary'></i>
                            </span>
                            <Datetime
                              closeOnSelect
                              className='col'
                              inputProps={{
                                autoComplete: 'off',
                                className: configClass?.form,
                                name: 'expired',
                                placeholder: 'Enter ' + optExpired?.label,
                                readOnly: true,
                              }}
                              onChange={(e: any) => {
                                const m = moment(e).format('YYYY-MM-DD')
                                setPurchaseDate(m)
                                setFieldValue('expired', m)
                              }}
                              isValidDate={(currentDate: any) => {
                                const yesterday = moment().subtract(1826, 'day')
                                return currentDate?.isAfter(yesterday)
                              }}
                              dateFormat={pref_date}
                              value={purchaseDate}
                              timeFormat={false}
                            />
                          </div>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='expired' />
                          </div>
                        </div>
                      )}

                      {optlength?.is_selected && (
                        <div className={configClass?.grid}>
                          <label
                            htmlFor='name'
                            className={`${configClass?.label} ${
                              optlength?.is_required ? 'required' : ''
                            }`}
                          >
                            {optlength?.label}
                          </label>
                          <div className='input-group input-group-sm input-group-solid'>
                            <Field
                              name='length'
                              type='number'
                              min='0'
                              placeholder={'Enter ' + optlength?.label}
                              className={configClass?.form}
                            />
                            <span className='input-group-text ps-0'>
                              <span className='text-gray-600'>Month(s)</span>
                            </span>
                          </div>
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='length' />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <FormCF
                    type='warranty'
                    itemClass='col-md-6 mb-3'
                    labelClass='col-md-5'
                    errors={errors}
                    defaultValue={customField}
                    onChange={(e: any) => setFieldValue('global_custom_fields', e)}
                    onClickForm={onClickForm}
                    showForm={showForm}
                    setShowForm={setShowForm}
                    defaultCustomField={defaultCustomField}
                  />
                </div>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  type='submit'
                  variant='primary'
                  className='btn-sm'
                  disabled={loadingWarranty}
                >
                  {!loadingWarranty && (
                    <span
                      className='indicator-label'
                      onClick={() => {
                        setOnClickForm(true)
                        setSecondErrSubmit(true)
                      }}
                    >
                      {warrantyDetail ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loadingWarranty && (
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
  )
}

AddWarranty = memo(
  AddWarranty,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AddWarranty}
