import {InputClone} from '@components/form/InputClone'
import {PageLoader} from '@components/loader/cloud'
import {
  ClearIndicator,
  customStyles,
  DropdownIndicator,
  MultiValueRemove,
} from '@components/select/config'
import {Select as SelectDataType} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {
  checkValidDataOptionCF,
  configClass,
  errorValidation,
  FieldMessageError,
  useTimeOutMessage,
} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import orderBy from 'lodash/orderBy'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import Select from 'react-select'
import * as Yup from 'yup'

import {addCustomField, editCustomField, getCustomFieldTypeList} from '../redux/ReduxCustomField'

type ModalCustomFieldProps = {
  showModal: any
  setShowModal: any
  setReloadCustomField: any
  reloadCustomField: any
  customFieldDetail: any
  category: any
  arrOption: any
  setArrayOption: any
}

const CustomFieldSchema: any = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9 ]+$/, "Special character doesn't allowed")
    .required('Custom Field Name is required'),
  datatype: Yup.string().required('Data Type is required'),
  category: Yup.mixed()
    .test({
      name: 'category',
      test: function () {
        const {category} = this.parent || {}

        if (category === 'limited') {
          return this.createError({
            message: `Selected Categorys is required`,
          })
        }
        return true
      },
    })
    .nullable(),
})

let AddCustomFieldAsset: FC<ModalCustomFieldProps> = ({
  showModal,
  setShowModal,
  setReloadCustomField,
  reloadCustomField,
  customFieldDetail,
  category,
  arrOption,
  setArrayOption,
}) => {
  const intl: any = useIntl()

  const [optionType, setOptionType] = useState<string[]>([])
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [optionMessage, setOptionMessage] = useState<boolean>(false)
  const [loadingCustomField, setCustomFieldLoading] = useState<boolean>(false)

  const onSubmit = (values: any) => {
    setCustomFieldLoading(true)
    const {guid}: any = customFieldDetail || {}
    const params: any = {
      section_type: 'assets',
      name: values?.name || '',
      type: values?.datatype || '',
      options: ['checkbox', 'dropdown', 'radio'].includes(values?.datatype) ? values?.options : [],
      section_type_sub: 'additional_information',
      rules: {required: values?.isRequired || false},
    }

    if (values?.categorycf === 'limited' && values?.category) {
      const dataCat: any = values?.category?.map(({value}: any) => {
        return {
          model_type: 'assets',
          model_value: value || '',
          model_key: 'category_guid',
        }
      })
      params.conditions = dataCat as never[]
    }

    if (params?.type === 'date_format:Y-m-d H:i:s') {
      params.type = 'datetime'
    }

    if (guid) {
      if (checkValidDataOptionCF(values?.datatype, values?.options)) {
        editCustomField(params, guid)
          .then(({data: {message}}: any) => {
            setArrayOption([])
            setShowModal(false)
            setOptionMessage(false)
            setCustomFieldLoading(false)
            setErrSubmitForm(true)
            useTimeOutMessage('clear', 200)
            useTimeOutMessage('success', 250, message)
            setReloadCustomField(reloadCustomField + 1)
          })
          .catch((e: any) => {
            setCustomFieldLoading(false)
            FieldMessageError(e, [])

            const {response}: any = e || {}
            const errors: any = errorValidation({response})
            if (errors?.options) {
              setOptionMessage(errors?.options)
            }
          })
      } else {
        setOptionMessage(true)
        setCustomFieldLoading(false)
      }
    } else {
      addCustomField(params)
        .then(({data: {message}}: any) => {
          setCustomFieldLoading(false)
          setShowModal(false)
          setArrayOption([])
          setErrSubmitForm(true)
          setOptionMessage(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          setReloadCustomField(reloadCustomField + 1)
        })
        .catch((e: any) => {
          setCustomFieldLoading(false)
          FieldMessageError(e, [])

          const {response}: any = e || {}
          const errors: any = errorValidation({response})
          if (errors?.options) {
            setOptionMessage(errors?.options)
          }
        })
    }
  }

  const onClose = () => {
    setShowModal(false)
    setOptionMessage(false)
    setArrayOption([])
    setErrSubmitForm(true)
    useTimeOutMessage('clear', 200)
  }

  const initialValues: any = {
    name: customFieldDetail?.name || '',
    options: customFieldDetail?.options || [],
    datatype: customFieldDetail?.element_type || '',
    isRequired: customFieldDetail?.is_required || false,
    categorycf: customFieldDetail?.conditions?.length > 0 ? 'limited' : 'all',
    category:
      customFieldDetail?.conditions?.length > 0
        ? customFieldDetail?.conditions?.map(({model_detail}: any) => {
            return {value: model_detail?.guid, label: model_detail?.name}
          })
        : [],
  }

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
    setOptionMessage(false)
    showModal &&
      getCustomFieldTypeList({}).then(({data: res}: any) => {
        const typeData: any = orderBy(res, 'label', 'asc')
        setOptionType(
          typeData?.map(({value, label}: any) => {
            return {
              value: value || '',
              label: label || '',
            }
          })
        )
      })
  }, [showModal])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={CustomFieldSchema}
        onSubmit={onSubmit}
      >
        {({setFieldValue, values, isSubmitting, errors, isValidating, setSubmitting}: any) => {
          if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
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
              message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),
              type: 'error',
            })
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{customFieldDetail ? 'Edit' : 'Add'} Custom Field Asset</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className=''>
                    <div className='form-group row align-items-center mb-4'>
                      <label className={`${configClass?.label} required col-lg-4 text-end`}>
                        Custom Field Name
                      </label>
                      <div className='col-lg-8'>
                        <Field
                          type='text'
                          name='name'
                          placeholder='Enter Custom Field Name'
                          className={configClass?.form}
                        />
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='name' />
                        </div>
                      </div>
                    </div>

                    <div className='form-group row align-items-center mb-4'>
                      <label className={`${configClass?.label} required col-lg-4 text-end`}>
                        Data Type
                      </label>
                      <div className='col-lg-8'>
                        <SelectDataType
                          sm='sm'
                          name='datatype'
                          placeholder='Select Data Type'
                          isClearable={false}
                          defaultValue={
                            customFieldDetail?.element_type === 'date_format:Y-m-d H:i:s'
                              ? 'datetime'
                              : customFieldDetail?.element_type
                          }
                          data={optionType}
                          onChange={({value: val}: any) => {
                            setFieldValue('datatype', val)
                          }}
                        />

                        {errors?.datatype && (
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='datatype' />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='form-group row mb-4'>
                      {['checkbox', 'dropdown', 'radio'].includes(values?.datatype) && (
                        <InputClone
                          name='options'
                          defaultValue={arrOption}
                          placeholder='Enter Option'
                          className='col-lg-8 offset-lg-4 mt-1'
                          onChange={(e: any) => setFieldValue('options', e)}
                          optionMessage={optionMessage}
                          setOptionMessage={setOptionMessage}
                        />
                      )}
                    </div>

                    <div className='row align-items-center mb-4'>
                      <label className={`${configClass?.label} required col-lg-4 text-end`}>
                        Required Field
                      </label>
                      <div className='align-self-center col-lg-8'>
                        <div className='form-check form-check-inline'>
                          <Field
                            type='radio'
                            id='requireTrue'
                            onClick={() => {
                              setFieldValue('isRequired', true)
                            }}
                            checked={!!values?.isRequired}
                            className='form-check-input'
                          />
                          <label className='form-check-label' htmlFor='required-yes'>
                            Yes
                          </label>
                        </div>
                        <div className='form-check form-check-inline'>
                          <Field
                            type='radio'
                            id='requireFalse'
                            onClick={() => {
                              setFieldValue('isRequired', false)
                            }}
                            checked={!values?.isRequired}
                            className='form-check-input'
                          />
                          <label className='form-check-label' htmlFor='required-optional'>
                            Optional
                          </label>
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='dataRequired' />
                        </div>
                      </div>
                    </div>

                    <div className='row mb-4'>
                      <label className={`${configClass?.label} required col-lg-4 text-end mt-1`}>
                        Selected Categories
                      </label>

                      <div className='align-self-center col-lg-8'>
                        <span className='text-black-400'>
                          {intl.formatMessage({
                            id: 'PLEASE_CHOOSE_WHICH_CATEGORY_THIS_FILED_IS_VISIBLE',
                          })}
                        </span>

                        <div className='align-self-center col-lg-12 mt-5'>
                          <div
                            className='form-check form-check-inline'
                            style={{paddingLeft: '27px'}}
                          >
                            <Field
                              type='radio'
                              name='all_cateogries'
                              checked={values?.categorycf === 'all'}
                              onClick={() => {
                                setFieldValue('categorycf', 'all')
                              }}
                              className='form-check-input'
                            />
                            <label className='form-check-label'>All Categories</label>
                          </div>
                          <div
                            className='form-check form-check-inline'
                            style={{paddingLeft: '27px'}}
                          >
                            <Field
                              type='radio'
                              name='limited_categories'
                              className='form-check-input'
                              checked={values?.categorycf === 'limited'}
                              onClick={() => {
                                setFieldValue('categorycf', 'limited')
                              }}
                            />
                            <label className='form-check-label'>Please Select</label>
                          </div>
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='categorycf' />
                        </div>
                        {values?.categorycf === 'limited' && (
                          <div className='mt-2'>
                            <Select
                              noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
                              inputId='category'
                              name='category'
                              value={values?.category || ''}
                              options={
                                Array.isArray(category) && category?.length > 0
                                  ? category?.map(({guid, name}: any) => ({
                                      value: guid,
                                      label: name,
                                    }))
                                  : []
                              }
                              isMulti
                              styles={customStyles(true, {})}
                              components={{ClearIndicator, DropdownIndicator, MultiValueRemove}}
                              placeholder='Enter Category'
                              className='p-0'
                              onChange={(value: any) => {
                                setFieldValue('category', value || [])
                              }}
                            />
                            <div className='fv-plugins-message-container invalid-feedback'>
                              <ErrorMessage name='category' />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loadingCustomField && (
                    <span className='indicator-label'>{customFieldDetail ? 'Save' : 'Add'}</span>
                  )}
                  {loadingCustomField && (
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

AddCustomFieldAsset = memo(
  AddCustomFieldAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddCustomFieldAsset
