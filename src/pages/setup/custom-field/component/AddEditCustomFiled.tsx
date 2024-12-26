import {InputClone} from '@components/form/InputClone'
import {PageLoader} from '@components/loader/cloud'
import {Select as SelectDataType} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, FieldMessageError} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import orderBy from 'lodash/orderBy'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addCustomField, editCustomField, getCustomFieldTypeList} from '../redux/ReduxCustomField'

type ModalCustomFieldProps = {
  showModal: any
  setShowModal: any
  setReloadCustomField: any
  reloadCustomField: any
  customFieldDetail: any
  sectionType: string
  formTitle: string
}

const CustomFieldSchema: any = Yup.object().shape({
  name: Yup.string()
    .matches(/^[a-zA-Z0-9 ]+$/, "Special character doesn't allowed")
    .required('Custom Field Name is required'),
  datatype: Yup.string().required('Data Type is required'),
})

let AddEditCustomField: FC<ModalCustomFieldProps> = ({
  showModal,
  setShowModal,
  setReloadCustomField,
  reloadCustomField,
  customFieldDetail,
  sectionType,
  formTitle,
}) => {
  const intl: any = useIntl()

  const [arrOption, setArrayOption] = useState<any>([])
  const [optionType, setOptionType] = useState<string[]>([])
  const [isRequired, setIsRequired] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [optionMessage, setOptionMessage] = useState<boolean>(false)
  const [loadingCustomField, setCustomFieldLoading] = useState<boolean>(false)

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 400)
    setOptionMessage(false)
  }, [showModal])

  useEffect(() => {
    const {options, rules}: any = customFieldDetail || {}
    !!options && setArrayOption(options?.map(({value}: any) => value))

    rules &&
      rules?.length > 0 &&
      rules?.map(({key, value}: any) => {
        if (key === 'required') {
          setIsRequired(value !== 'nullable' ? true : false)
        }
        return null
      })
  }, [customFieldDetail])

  const handleSubmit = (values: any) => {
    setCustomFieldLoading(true)
    const {guid}: any = customFieldDetail || {}

    const params: any = {
      name: values?.name || '',
      options: ['checkbox', 'dropdown', 'radio'].includes(values?.datatype) ? values?.options : [],
      rules: {required: values?.isRequired || false},
      section_type: sectionType,
      section_type_sub: 'additional_information',
      type: values?.datatype || '',
    }

    if (params?.type === 'date_format:Y-m-d H:i:s') {
      params.type = 'datetime'
    }

    if (guid) {
      editCustomField(params, guid)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setArrayOption([])
          setShowModal(false)
          setOptionMessage(false)
          setCustomFieldLoading(false)
          setErrSubmitForm(true)
          setTimeout(() => ToastMessage({type: 'success', message}), 400)
          setReloadCustomField(reloadCustomField + 1)
        })
        .catch((e: any) => {
          setCustomFieldLoading(false)
          FieldMessageError(e, [])

          const {response} = e || {}
          const errors: any = errorValidation({response})
          if (errors?.options) {
            setOptionMessage(errors?.options)
          }
        })
    } else {
      addCustomField(params)
        .then(({data: {message}}: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setArrayOption([])
          setShowModal(false)
          setOptionMessage(false)
          setCustomFieldLoading(false)
          setErrSubmitForm(true)
          setTimeout(() => ToastMessage({type: 'success', message}), 400)
          setReloadCustomField(reloadCustomField + 1)
        })
        .catch((e: any) => {
          setCustomFieldLoading(false)
          FieldMessageError(e, [])

          const {response} = e || {}
          const errors: any = errorValidation({response})
          if (errors?.options) {
            setOptionMessage(errors?.options)
          }
        })
    }
  }

  useEffect(() => {
    if (showModal) {
      getCustomFieldTypeList({})
        .then(({data: res}: any) => {
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
        .catch(() => '')
    }
  }, [showModal])

  const initValues: any = {
    name: customFieldDetail?.name || '',
    datatype: customFieldDetail?.element_type || '',
    isRequired: customFieldDetail ? isRequired : false,
    options: customFieldDetail?.conditions?.options as never[],
  }

  const onClose = () => {
    setShowModal(false)
    setOptionMessage(false)
    setArrayOption([])
    setErrSubmitForm(true)
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={initValues}
        enableReinitialize
        validationSchema={CustomFieldSchema}
        onSubmit={handleSubmit}
      >
        {({setFieldValue, values, isSubmitting, errors, setSubmitting, isValidating}: any) => {
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
                <Modal.Title>
                  {customFieldDetail ? 'Edit' : 'Add'} {formTitle}
                </Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='mt-3'>
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
                            {/* Data Type is required. */}
                          </div>
                        )}
                      </div>
                    </div>

                    {['checkbox', 'dropdown', 'radio'].includes(values?.datatype) && (
                      <div className='form-group row mt-10 mb-5'>
                        <InputClone
                          name='options'
                          defaultValue={arrOption}
                          placeholder='Enter Option'
                          className='col-lg-8 offset-lg-4'
                          onChange={(e: any) => setFieldValue('options', e)}
                          optionMessage={optionMessage}
                          setOptionMessage={setOptionMessage}
                        />
                      </div>
                    )}

                    <div className='row align-items-center'>
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

AddEditCustomField = memo(
  AddEditCustomField,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddEditCustomField
