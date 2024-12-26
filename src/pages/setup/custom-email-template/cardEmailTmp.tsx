import {ToastMessage} from '@components/toast-message'
import {configClass, FieldMessageError, toAbsoluteUrl, useTimeOutMessage} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {Field, Form, Formik} from 'formik'
// eslint-disable-next-line sonar/no-built-in-override
import {escape} from 'lodash'
import {FC, Fragment, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'

import EmailTemplates from './email-templates'
import {ModalEmailSettings} from './modalEmailSettings'
import {
  defaultEmailName,
  getListDropdownEmailTmp,
  getTemplateEmailSettings,
  updateTemplateEmailName,
} from './service'

interface Props {
  data: any
  guids: any
  setGuid: any
  loading?: boolean
  showModalEmailSettings: any
  setShowModalEmailSettings: any
  setLoading?: (e?: any) => void
}

const CardEmailTmp: FC<Props> = ({
  data,
  guids,
  setGuid,
  loading,
  setLoading = () => '',
  showModalEmailSettings,
  setShowModalEmailSettings,
}) => {
  const [dataEmail, setDataEmail] = useState<any>()
  const [reload, setReload] = useState<any>(0)

  const listDropdownEmailQuery: any = useQuery({
    queryKey: ['getListDropdownEmailTmp'],
    queryFn: async () => {
      const api: any = await getListDropdownEmailTmp()
      const res: any = api?.data?.data
      const dataResult: any = res?.map(({name, email_templates, guid}: any) => {
        return {
          value: guid || '',
          name: name || '',
          email: email_templates || '',
        }
      })
      return dataResult
    },
  })

  const emailList: any = listDropdownEmailQuery?.data || []

  const isTemplateEmailSettings = useQuery({
    queryKey: ['getTemplateEmail', reload],
    queryFn: async () => {
      const res: any = await getTemplateEmailSettings()
      return res?.data?.data
    },
  })

  const isDetailEmail = isTemplateEmailSettings?.data || []

  const handleOnSubmit = (values: any) => {
    setLoading(true)
    const params: any = {
      subject: values?.subject || '',
      body: escape(values?.body) || '',
      signature: values?.signature || '',
      footer: values?.footer || '',
    }

    updateTemplateEmailName(params, guids)
      .then(({data: {message}}: any) => {
        setLoading(false)
        useTimeOutMessage('success', 0, message)
      })
      .catch((e: any) => {
        setLoading(false)
        FieldMessageError(e, [])
      })
  }

  const defaultRestore = () => {
    defaultEmailName(guids)
      .then(({data: {data}}: any) => {
        data && setDataEmail(data)
        useTimeOutMessage('success', 0, 'Success has been restore email')
      })
      .finally(() => setLoading(false))
  }

  const initValue: any = {
    subject: data?.subject || dataEmail?.subject || '',
    body: dataEmail?.body || data?.body || '',
    signature: data?.signature || dataEmail?.signature || false,
    footer: data?.footer || dataEmail?.footer || '',
  }

  useEffect(() => {
    useTimeOutMessage('clear', 2000)
    return () => {
      useTimeOutMessage('clear', 2000)
    }
  }, [])

  return (
    <>
      <Formik enableReinitialize initialValues={initValue} onSubmit={handleOnSubmit}>
        {({values}: any) => {
          return (
            <Form>
              <div className='card border border-2'>
                <div className='card-body'>
                  <div className='row mb-5'>
                    <div className='col-sm-12 col-md-6 col-lg-5 p-0 mb-3'>
                      <Field
                        as='select'
                        name='email_list'
                        defaultValue=''
                        className={configClass?.select}
                        onChange={({target: {value}}: any) => {
                          setGuid(value || '')
                          setLoading(true)
                          ToastMessage({type: 'clear'})
                        }}
                      >
                        <option value=''>Choose Email</option>
                        {Array.isArray(emailList) &&
                          emailList?.length > 0 &&
                          emailList?.map(({name, email}: any, index: number) => {
                            return (
                              <optgroup key={index} className='optGroup-email' label={name || ''}>
                                {email?.map(({name, unique_id, guid}: any, i: any) => {
                                  return (
                                    <Fragment key={i || 0}>
                                      <option
                                        className={`opt-email opt-email-${unique_id || ''}`}
                                        value={`${guid || ''}`}
                                        key={i || 0}
                                        id={unique_id || ''}
                                      >
                                        {name || '-'}
                                      </option>
                                    </Fragment>
                                  )
                                })}
                              </optgroup>
                            )
                          })}
                      </Field>
                    </div>
                    <div className='col-sm-12 col-md-6 col-lg-7 p-0 mb-3 alert-setting'>
                      <Button
                        variant='btn btn-sm btn-primary float-end'
                        onClick={() => setShowModalEmailSettings(true)}
                      >
                        Email Settings
                      </Button>
                    </div>
                  </div>

                  {guids ? (
                    <>
                      <div className='row'>
                        <div
                          className='border border-2 col-12 p-7 d-flex justify-content-center align-items-center flex-column h-auto radius-10 bg-email-body'
                          style={{
                            background: '#fff',
                          }}
                        >
                          <div className='mb-1'>
                            {loading ? (
                              <span className='me-2'>
                                <span className='mx-2 spinner-border spinner-border-sm'></span>
                                <span>Please wait...</span>
                              </span>
                            ) : (
                              <>
                                {isDetailEmail?.header_logo === '1' ? (
                                  <img
                                    alt='Logo'
                                    className={`h-45px me-4`}
                                    src={toAbsoluteUrl('/media/logos/assetdataV1.png')}
                                  />
                                ) : isDetailEmail?.company_logo !== null ? (
                                  <img
                                    alt='Logo'
                                    className={`h-45px me-4`}
                                    src={isDetailEmail?.company_logo?.data}
                                  />
                                ) : (
                                  <img
                                    alt='Logo'
                                    className={`h-45px me-4`}
                                    src={toAbsoluteUrl('/media/logos/assetdataV1.png')}
                                  />
                                )}
                              </>
                            )}
                            <button
                              type='button'
                              className='btn btn-primary btn-sm'
                              onClick={() => setShowModalEmailSettings(true)}
                            >
                              Change Logo
                            </button>
                          </div>

                          {/* Body Email */}
                          <EmailTemplates body={values?.body} loading={loading} />
                        </div>
                      </div>

                      <div className='row mt-5'>
                        {/* d-flex justify-content-between */}
                        <div className='col-6 p-0 btn-restore'>
                          <Button
                            type='reset'
                            onClick={defaultRestore}
                            className='btn btn-sm btn-light-primary'
                          >
                            Restore Default
                          </Button>
                        </div>

                        <div className='col-6 p-0'>
                          <Button className='btn btn-sm float-end' variant='secondary' type='reset'>
                            Cancel
                          </Button>
                          <Button
                            form-id=''
                            type='submit'
                            variant='primary'
                            className='btn btn-sm me-2 float-end'
                          >
                            {!loading && <span className='indicator-label'>Save</span>}
                            {loading && (
                              <span className='indicator-progress' style={{display: 'block'}}>
                                Please wait...
                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='d-flex flex-center h-300px'>
                      <div className='text-center'>
                        <img
                          src={'/media/svg/others/no-data.png'}
                          alt='no-data'
                          style={{opacity: 0.5}}
                          className='w-auto h-100px'
                        />
                        <div className='text-gray-400 fw-bold fs-6 mt-3'>
                          Please Select Email...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          )
        }}
      </Formik>

      <ModalEmailSettings
        detail={isDetailEmail}
        showModal={showModalEmailSettings}
        setShowModal={setShowModalEmailSettings}
        reload={reload}
        setReload={setReload}
        // companyLogo={companyLogo}
      />
    </>
  )
}

export {CardEmailTmp}
