import {InputClone} from '@components/form/InputClone'
import {Select as AjaxMultiple} from '@components/select/ajaxMultiple'
import {Select as SelectDataType} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {getCustomFieldTypeList} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {addCustomField, editCustomField, getCategory} from '@pages/wizards/redux/WizardService'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import orderBy from 'lodash/orderBy'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

type ModalCustomFieldProps = {
  showModal: any
  setShowModal: any
  setReloadCustomField: any
  reloadCustomField: any
  customFieldDetail: any
  arrOption: any
  setArrayOption: any
}

const CustomFieldSchema: any = Yup.object().shape({
  name: Yup.string().required('Custom Field Name is required.'),
  datatype: Yup.string().required('Data Type is required.'),
})

const ModalCustomField: FC<ModalCustomFieldProps> = ({
  showModal,
  setShowModal,
  setReloadCustomField,
  reloadCustomField,
  customFieldDetail,
  arrOption,
  setArrayOption,
}) => {
  const intl: any = useIntl()

  const [errForm, setErrForm] = useState<boolean>(true)
  const [optionType, setOptionType] = useState<any>([])
  const [listCategories, setListCategories] = useState<any>([])
  const [optionMessage, setOptionMessage] = useState<boolean>(false)
  const [loadingCustomField, setCustomFieldLoading] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  useEffect(() => {
    showModal &&
      getCustomFieldTypeList({}).then(({data: res}: any) => {
        const typeData: any = orderBy(res, 'label', 'asc')
        const dataType: any =
          typeData &&
          typeData?.length > 0 &&
          typeData?.map(({value, label}: any) => ({value: value || '', label: label || ''}))
        setOptionType(dataType as never[])
      })
  }, [showModal])

  useEffect(() => {
    if (customFieldDetail !== undefined) {
      const {conditions}: any = customFieldDetail || {}
      if (conditions && showModal === true) {
        const dataCond: any =
          conditions &&
          conditions?.length > 0 &&
          conditions?.map(({model_value, name}: any) => ({
            label: name || '',
            value: model_value || '',
          }))
        setListCategories(dataCond as never[])
      } else {
        setListCategories([])
      }
    }
  }, [customFieldDetail, showModal])

  const onClose = () => {
    setErrForm(true)
    setArrayOption([])
    setShowModal(false)
    setCustomFieldLoading(false)
  }

  const onSubmit = (values: any) => {
    setCustomFieldLoading(true)
    const {guid} = customFieldDetail || {}
    const params: any = {
      section_type: 'assets',
      name: values?.name || '',
      type: values?.datatype || '',
      section_type_sub: 'additional_information',
      rules: {required: values?.isRequired || false},
      options: ['checkbox', 'dropdown', 'radio']?.includes(values?.datatype) ? values?.options : [],
    }

    if (values?.categorycf === 'limited' && values?.category) {
      const dataCat: any = values?.category?.map(({value}: any) => {
        return {
          model_key: 'category_guid',
          model_type: 'assets',
          model_value: value || '',
        }
      })
      params.conditions = dataCat || []
    }

    if (guid) {
      editCustomField(params, guid)
        .then(({data: {message}}: any) => {
          setArrayOption([])
          setShowModal(false)
          setCustomFieldLoading(false)
          setReloadCustomField(reloadCustomField + 1)
          ToastMessage({message, type: 'success'})
        })
        .catch((e: any) => {
          setCustomFieldLoading(false)
          const errors: any = errorValidation(e)
          if (errors?.options) {
            setOptionMessage(errors?.options)
          }
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
        })
    } else {
      addCustomField(params)
        .then(({data: {message}}: any) => {
          setArrayOption([])
          setShowModal(false)
          setCustomFieldLoading(false)
          setReloadCustomField(reloadCustomField + 1)
          ToastMessage({message, type: 'success'})
        })
        .catch((e: any) => {
          setCustomFieldLoading(false)
          const errors: any = errorValidation(e)
          if (errors?.options) {
            setOptionMessage(errors?.options)
          }
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
        })
    }
  }

  const initValues: any = {
    name: customFieldDetail?.name || '',
    category: listCategories as never[],
    options: customFieldDetail?.options || [],
    datatype: customFieldDetail?.element_type || '',
    isRequired: customFieldDetail?.is_required === 1 ? true : false,
    categorycf: customFieldDetail?.conditions?.length > 0 ? 'limited' : 'all',
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        enableReinitialize
        onSubmit={onSubmit}
        initialValues={initValues}
        validationSchema={CustomFieldSchema}
      >
        {({setFieldValue, values, isSubmitting, setSubmitting, isValidating, errors}: any) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({message: require_filed_message, type: 'error'})
            setErrForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({message: require_filed_message, type: 'error'})
            setErrForm(false)
          }

          if (isSubmitting && Object.keys(errors || {})?.length > 0) {
            ScrollTopComponent.goTop()
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{customFieldDetail ? 'Edit' : 'Add'} a Custom Field</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='mt-3'>
                  <div className='form-group row mb-4'>
                    <label className={`${configClass?.label} required col-lg-4 text-end`}>
                      Custom Field Name
                    </label>
                    <div className='col-lg-8'>
                      <Field
                        type='text'
                        name='name'
                        data-cy='fieldName'
                        placeholder='Enter Custom Field Name'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>

                  <div className='form-group row mb-4'>
                    <label className={`${configClass?.label} required col-lg-4 text-end`}>
                      Data Type
                    </label>
                    <div className='col-lg-8'>
                      <SelectDataType
                        sm='sm'
                        name='datatype'
                        data={optionType}
                        isClearable={false}
                        placeholder='Select Data Type'
                        onChange={({value}: any) => setFieldValue('datatype', value || '')}
                        defaultValue={
                          customFieldDetail?.element_type === 'date_format:Y-m-d H:i:s'
                            ? 'datetime'
                            : customFieldDetail?.element_type
                        }
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='datatype' />
                      </div>
                    </div>
                  </div>

                  {['checkbox', 'dropdown', 'radio']?.includes(values?.datatype) && (
                    <InputClone
                      name='options'
                      defaultValue={arrOption}
                      placeholder='Enter Option'
                      optionMessage={optionMessage}
                      setOptionMessage={setOptionMessage}
                      className='col-lg-8 offset-lg-4 mb-5'
                      onChange={(e: any) => setFieldValue('options', e)}
                    />
                  )}

                  <div className='row mb-4'>
                    <label className={`${configClass?.label} required col-lg-4 text-end`}>
                      Required Field
                    </label>
                    <div className='align-self-center col-lg-8'>
                      <Field
                        id='yes'
                        type='radio'
                        className='me-2 form-check-input'
                        checked={values?.isRequired || false}
                        onClick={() => setFieldValue('isRequired', true)}
                      />
                      <label className='form-check-label' htmlFor='yes'>
                        Yes
                      </label>

                      <Field
                        type='radio'
                        id='optional'
                        checked={!values?.isRequired}
                        className='ms-5 me-2 form-check-input'
                        onClick={() => setFieldValue('isRequired', false)}
                      />
                      <label className='form-check-label' htmlFor='optional'>
                        Optional
                      </label>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='dataRequired' />
                      </div>
                    </div>
                  </div>

                  <div className='row align-items-start mb-4'>
                    <label className={`${configClass?.label} required col-lg-4 text-end mt-1`}>
                      Selected Categories
                    </label>
                    <div className='align-self-center col-lg-8'>
                      <span className='text-black-400'>
                        {intl.formatMessage({
                          id: 'PLEASE_CHOOSE_WHICH_CATEGORY_THIS_FILED_IS_VISIBLE',
                        })}
                      </span>

                      <div className='my-3'>
                        <Field
                          id='all'
                          type='radio'
                          name='all_cateogries'
                          className='me-2 form-check-input'
                          checked={values?.categorycf === 'all'}
                          onClick={() => setFieldValue('categorycf', 'all')}
                        />
                        <label className='form-check-label' htmlFor='all'>
                          All Categories
                        </label>

                        <Field
                          type='radio'
                          id='multiple'
                          name='limited_categories'
                          className='me-2 ms-5 form-check-input'
                          checked={values?.categorycf === 'limited'}
                          onClick={() => setFieldValue('categorycf', 'limited')}
                        />
                        <label className='form-check-label' htmlFor='multiple'>
                          Please Select
                        </label>
                      </div>

                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='categorycf' />
                      </div>

                      {values?.categorycf === 'limited' && (
                        <div className='my-5'>
                          <AjaxMultiple
                            sm={true}
                            isMulti={true}
                            api={getCategory}
                            params={{
                              orderCol: 'name',
                              orderDir: 'asc',
                            }}
                            name='category'
                            className='col p-0'
                            placeholder='Enter Category'
                            defaultValue={values?.category}
                            onChange={(e: any) => setFieldValue('category', e || '')}
                            parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
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

export {ModalCustomField}
