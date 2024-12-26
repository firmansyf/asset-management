import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {FieldMessageError, useTimeOutMessage} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {PageTitle} from '@metronic/layout/core'
import {Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {
  addMaintenanceChecklist,
  editMaintenanceChecklist,
  getDetailMaintenanceChecklist,
} from '../Service'
import FormFirst from './form-first/FormFirst'
import TaskPreview from './task-preview/taskPreview'

const CardAddChecklist: FC<any> = ({urlSearchParams}) => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const params: any = Object.fromEntries(urlSearchParams?.entries())
  const {id}: any = params || {}

  const [arrOption, setArrayOption] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [detailChecklist, setDetailChecklist] = useState<any>([])
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [optionMessage, setOptionMessage] = useState<boolean>(false)

  const AddChecklistSchema: any = Yup.object().shape({
    name: Yup.string().when({
      is: () => true,
      then: () => Yup.string().required('Name is Required.'),
    } as any),
  })

  useEffect(() => {
    setLoadingForm(true)
    if (id) {
      getDetailMaintenanceChecklist(id)
        .then(({data: {data: res}}: any) => {
          if (res) {
            setLoadingForm(false)
            setDetailChecklist(res as never[])
            setArrayOption(res?.tasks)
          }
        })
        .catch(() => setLoadingForm(false))
    } else {
      setLoadingForm(false)
    }
  }, [id])

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      description: value?.description || '',
      name: value?.name || '',
      tasks: value?.tasks || [],
    }

    if (id) {
      editMaintenanceChecklist(params, id)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setOptionMessage(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          navigate('/setup/maintenance/checklist')
        })
        .catch((e: any) => {
          setLoading(false)
          setOptionMessage(true)
          FieldMessageError(e, [])
        })
    } else {
      addMaintenanceChecklist(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setOptionMessage(false)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
          navigate('/setup/maintenance/checklist')
        })
        .catch((e: any) => {
          setLoading(false)
          setOptionMessage(true)
          FieldMessageError(e, [])
        })
    }
  }

  const initValue: any = {
    description: detailChecklist?.description || '',
    name: detailChecklist?.name || '',
    tasks: detailChecklist?.tasks as never[],
  }

  return (
    <>
      {loadingForm ? (
        <PageLoader />
      ) : (
        <>
          <Formik
            initialValues={initValue}
            validationSchema={AddChecklistSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({setFieldValue, isSubmitting, setSubmitting, values, errors, isValidating}: any) => {
              if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
                ToastMessage({
                  message: require_filed_message,
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
                  message: require_filed_message,
                  type: 'error',
                })
              }

              if (isSubmitting && Object.keys(errors || {})?.length > 0) {
                ScrollTopComponent.goTop()
              }

              return (
                <Form className='justify-content-center' noValidate>
                  <div className='card card-custom'>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-sm-12 col-md-6 col-lg-6'>
                          <FormFirst
                            arrOption={arrOption}
                            loadingForm={loadingForm}
                            setFieldValue={setFieldValue}
                            optionMessage={optionMessage}
                            setOptionMessage={setOptionMessage}
                          />

                          <div
                            className='d-flex justify-content-end mt-5 btn-cus'
                            style={{
                              position: 'absolute',
                              left: '29%',
                              bottom: '30px',
                            }}
                          >
                            <button
                              style={{fontSize: '13px'}}
                              className='btn btn-secondary me-2'
                              onClick={() => navigate('/setup/maintenance/checklist')}
                            >
                              Cancel
                            </button>

                            <button
                              type='submit'
                              className='btn btn-primary'
                              style={{fontSize: '13px'}}
                            >
                              {!loading && <span className='indicator-label'>Save</span>}
                              {loading && (
                                <span className='indicator-progress' style={{display: 'block'}}>
                                  Please wait...
                                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                        <div
                          className='col-sm-12 col-md-6 col-lg-6 previewCus'
                          style={{
                            backgroundColor: '#f7f7f7',
                            borderRadius: '10px',
                            minHeight: '100vh',
                          }}
                        >
                          <TaskPreview setFieldValue={setFieldValue} values={values?.tasks || []} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )
            }}
          </Formik>

          <style>
            {`@media screen and (max-width: 420px) {
              .btn-cus {
                bottom: 10px !important;
                z-index: 99;
              }
              .previewCus {
                margin-bottom: 40px !important;
              }
            }`}
          </style>
        </>
      )}
    </>
  )
}

let AddMaintenanceChecklist: FC = () => {
  const intl: any = useIntl()
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params: any = Object.fromEntries(urlSearchParams?.entries())
  const {id}: any = params || {}

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({
          id: id
            ? 'MENU.SETUP.MAINTENANCE.MAINTENANCE_EDIT_CHECKLIST'
            : 'MENU.SETUP.MAINTENANCE.MAINTENANCE_ADD_CHECKLIST',
        })}
      </PageTitle>
      <CardAddChecklist urlSearchParams={urlSearchParams} />
    </>
  )
}

AddMaintenanceChecklist = memo(
  AddMaintenanceChecklist,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddMaintenanceChecklist
