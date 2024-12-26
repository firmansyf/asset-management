/* eslint-disable react-hooks/exhaustive-deps */
import Tooltip from '@components/alert/tooltip'
import {Title} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'

// ACTIONS
import AssignToTeam from './actions/AssignToTeam'
import AssignToUser from './actions/AssignToUser'
import Comment from './actions/Comment'
import SendEmailToSubmitter from './actions/SendEmailToSubmitter'
import SetPriorityAs from './actions/SetPriorityAs'
import SetTypeAs from './actions/SetTypeAs'
import Watcher from './actions/Watcher'
import {addScenario, detailScenario, editScenario, listAction} from './Service'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Scenario Name is required').nullable(),
  description: Yup.string().required('Scenario Description is required').nullable(),
  actions: Yup.mixed()
    .test(
      'actions',
      'Scenario must contain at least 1 action',
      (e: any) => e?.filter(({type}: any) => type)?.length > 0
    )
    .nullable(),
})

const Action: FC<any> = ({action, defaultValue, onChange}: any) => {
  switch (action?.unique_name) {
    case 'add-comment':
      return <Comment defaultValue={defaultValue} action={action} onChange={onChange} />
    case 'add-watcher':
      return <Watcher defaultValue={defaultValue} action={action} onChange={onChange} />
    case 'assign-to-team':
      return <AssignToTeam defaultValue={defaultValue} action={action} onChange={onChange} />
    case 'assign-to-user':
      return <AssignToUser defaultValue={defaultValue} action={action} onChange={onChange} />
    case 'set-priority-as':
      return <SetPriorityAs defaultValue={defaultValue} action={action} onChange={onChange} />
    case 'set-type-as':
      return <SetTypeAs defaultValue={defaultValue} action={action} onChange={onChange} />
    case 'send-email-to-submitter':
      return (
        <SendEmailToSubmitter defaultValue={defaultValue} action={action} onChange={onChange} />
      )
    default:
      return null
  }
}

const AddEditScenario: FC<any> = () => {
  const intl: any = useIntl()
  const params: any = useParams()
  const navigate: any = useNavigate()

  const [actionSource, setActionSource] = useState<any>([])
  const [detail, setDetail] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [actions, setActions] = useState<any>([])
  const [errForm, setErrForm] = useState<any>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [redirect, setRedirect] = useState<boolean>(false)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const initialValues: any = {
    name: detail?.name || '',
    description: detail?.description || '',
    actions:
      detail?.actions?.length > 0
        ? detail?.actions?.map(({type_guid: type, values: value}: any) => ({type, value}))
        : [],
  }

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const onSubmit: any = (value: any) => {
    setLoading(true)

    const params: any = {
      name: value?.name || '',
      description: value?.description || '',
      actions: value?.actions?.map(({type, value}: any) => {
        return {
          type: type || '',
          value: value || '',
        }
      }),
    }

    if (detail?.guid) {
      editScenario(params, detail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          successMessage(message)
          setTimeout(() => {
            setRedirect(true)
          }, 2000)
        })
        .catch((e: any) => {
          setLoading(false)
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    } else {
      addScenario(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          successMessage(message)
          setTimeout(() => {
            setRedirect(true)
          }, 2000)
        })
        .catch((e: any) => {
          setLoading(false)
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    setLoadingForm(true)
    if (params?.guid) {
      detailScenario(params?.guid).then(({data: {data: res}}: any) => {
        setDetail(res)
        setTimeout(() => setLoadingForm(false), 800)
      })
    } else {
      setTimeout(() => setLoadingForm(false), 800)
    }
  }, [params?.guid])

  useEffect(() => {
    listAction().then(({data: {data: res}}: any) => {
      setActionSource(
        res
          ?.sort((a: any, b: any) => (a?.name > b?.name ? 1 : -1))
          ?.map(({guid, name, type, unique_name}: any) => ({
            value: guid,
            label: name,
            type,
            unique_name,
          }))
      )
      if (detail?.actions?.length > 0) {
        const actionsFromDetail: any = detail?.actions
          ?.sort((a: any, b: any) => (a?.name > b?.name ? 1 : -1))
          ?.map(({unique_name}: any) => {
            const act: any = res?.find(({unique_name: uname}: any) => uname === unique_name)
            return {type: act?.guid || null, value: act?.name}
          })
        setActions(actionsFromDetail)
      }
    })
  }, [detail?.actions])

  const actionList: any = useMemo(() => {
    const existingActions: any = actions
      ?.sort((a: any, b: any) => (a?.label < b?.label ? 1 : -1))
      ?.filter(({type}: any) => type)
      ?.map(({type}: any) => type)
    return actionSource?.filter(({value}: any) => !(existingActions || [])?.includes(value))
  }, [actions, actionSource])

  useEffect(() => {
    redirect && navigate('/setup/help-desk/scenario')
  }, [redirect])

  return (
    <div className='row mt-2'>
      <PageTitle breadcrumbs={[]}>{detail?.guid ? 'Edit Scenario' : 'Add Scenario'}</PageTitle>

      {loadingForm ? (
        <PageLoader />
      ) : (
        <>
          <div className='col-12 mb-5'>
            <div className='d-flex align-items-center'>
              <div
                className='btn btn-sm btn-light-primary radius-50 p-2'
                onClick={() => navigate(-1)}
              >
                <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
                  <i className='las la-arrow-left text-white' />
                </span>
                <span className='px-2'>Back</span>
              </div>

              <h3 className='mb-0 text-primary ms-3 text-capitalize'>
                {detail?.name || 'Add Scenario'}
              </h3>

              <Tooltip
                active={true}
                placement='right'
                title='Scenario : Let you execute a series of updates to the ticket with a single click. They help you quickly handle multiple scenarios. For example, you could create a scenario ”Assign to QA Team” and add comment ”Please check this ticket” in a single click whenever an ticket related to login is submitter.'
              >
                <sup className='ms-2'>
                  <i className='fa fa-info-circle text-primary' />
                </sup>
              </Tooltip>
            </div>
          </div>

          <div className='col-12'>
            <Formik
              enableReinitialize
              onSubmit={onSubmit}
              initialValues={initialValues}
              validationSchema={validationSchema}
            >
              {({setFieldValue, setSubmitting, isSubmitting, errors, isValidating}: any) => {
                if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
                  ToastMessage({
                    message: require_filed_message,
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
                    message: require_filed_message,
                    type: 'error',
                  })
                }

                return (
                  <Form className='justify-content-center' noValidate>
                    <div className=''>
                      <div className='mb-5'>
                        <label htmlFor='name' className={`${configClass?.label} required`}>
                          Scenario Name
                        </label>
                        <Field
                          name='name'
                          type='text'
                          autoComplete='off'
                          className={configClass?.form}
                          placeholder='Enter Scenario Name'
                        />
                        <div className='fv-plugins-message-container invalid-feedback mt-2'>
                          <ErrorMessage name='name' />
                        </div>
                      </div>

                      <div className='mb-5'>
                        <label
                          htmlFor='description'
                          className={`${configClass.label} required d-block`}
                        >
                          Scenario Description
                        </label>
                        <Field
                          name='description'
                          as='textarea'
                          type='text'
                          placeholder='Input Scenario Description'
                          className={`${configClass?.form} required`}
                        />
                        <div className='fv-plugins-message-container mt-0 invalid-feedback mt-2'>
                          <ErrorMessage name='description' />
                        </div>
                      </div>

                      <Title title='Actions' sticky={false} className='m-2' />
                      <ErrorMessage
                        name='actions'
                        render={(actions: any) => (
                          <div className='bg-light-danger rounded p-3 text-danger fs-7 mb-3'>
                            <i className='fa fa-info-circle text-danger me-2' />
                            {actions}
                          </div>
                        )}
                      />

                      <div className='row'>
                        {actions?.map((m: any, index: number) => {
                          const indexKey: number = index + 1
                          const selectedAction: any =
                            actionSource?.find(({value}: any) => value === m?.type) || {}

                          const defaultValue: any =
                            detail?.actions?.find(
                              ({unique_name}: any) => unique_name === selectedAction?.unique_name
                            ) || {}

                          return (
                            <div className='col-md-6 my-4 d-flex flex-column' key={indexKey}>
                              <div className='h-100 p-3 pt-8 border border-2 rounded position-relative'>
                                <div className='position-absolute top-0 mt-n5'>
                                  <div className='btn btn-sm bg-white radius-50 p-2'>
                                    <span className='btn btn-icon w-20px h-20px bg-f2 rounded-circle ms-2'>
                                      {index + 1}
                                    </span>
                                    <span className='px-2'>
                                      {selectedAction?.label || 'Add Action'}
                                    </span>
                                  </div>
                                </div>

                                <div className='position-absolute top-0 end-0 mt-n3 me-n3'>
                                  <div className='bg-white radius-50 p-2'>
                                    <span
                                      className='btn btn-icon w-20px h-20px bg-f2 rounded-circle'
                                      onClick={() => {
                                        const act: any = actions
                                        act?.splice(index, 1)
                                        setActions([...act])
                                        setFieldValue('actions', [...act])
                                      }}
                                    >
                                      <i className='las la-times text-dark' />
                                    </span>
                                  </div>
                                </div>

                                <Select
                                  name='actions'
                                  isClearable={false}
                                  defaultValue={m?.type}
                                  placeholder='Choose Action'
                                  sm={configClass?.size === 'sm'}
                                  data={
                                    detail?.guid
                                      ? [
                                          ...actionList,
                                          {value: m?.type, label: selectedAction?.label},
                                        ]?.filter(({value}: any) => value)
                                      : actionList
                                  }
                                  onChange={({value: val, label}: any) => {
                                    const act: any = actions?.map((a: any, i: any) => {
                                      if (i === index) {
                                        a.type = val
                                        a.label = label || a?.label
                                        a.value = null
                                      }
                                      return a
                                    })
                                    setActions(act)
                                    setFieldValue('actions', act)
                                  }}
                                />

                                {selectedAction?.unique_name && (
                                  <Action
                                    action={selectedAction}
                                    defaultValue={defaultValue?.values}
                                    onChange={(e: any) => {
                                      const act: any = actions?.map((a: any) => {
                                        if (a?.type === e?.type) {
                                          // a = e
                                          a.type = e?.type || a?.type || ''
                                          a.label = a?.label || ''
                                          if (
                                            a?.label === 'Send Email to Submitter' ||
                                            m.value === 'Send Email to Submitter'
                                          ) {
                                            a.value = {
                                              subject: e?.value?.subject || '',
                                              body: e?.value?.body || '',
                                            }
                                          } else {
                                            a.value = e?.value || a?.value || null
                                          }
                                        }
                                        return a
                                      })
                                      setActions(act)
                                      setFieldValue('actions', act)
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          )
                        })}

                        {actions?.length < actionSource?.length && (
                          <div className='col-md-6 my-4 d-flex flex-column'>
                            <div
                              className='h-100 d-flex align-items-center justify-content-center border border-2 rounded'
                              style={{minHeight: 75}}
                            >
                              <div
                                className='btn btn-sm btn-light-primary radius-50 p-2'
                                onClick={() => setActions((prev: any) => [...prev, {}])}
                              >
                                <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
                                  <i className='las la-plus text-white' />
                                </span>
                                <span className='px-2'>Add Action</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='text-end'>
                      <div className='separator border-3 mb-5 mt-2' />
                      <button
                        className='btn btn-sm btn-light me-3'
                        type='button'
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>

                      <button className='btn btn-sm btn-primary' type='submit'>
                        {!loading ? (
                          <span className='indicator-label'>
                            <i className='las la-plus' />
                            {detail?.guid ? 'Save' : 'Add'}
                          </span>
                        ) : (
                          <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </>
      )}
    </div>
  )
}

export default AddEditScenario
