/* eslint-disable react-hooks/exhaustive-deps */
import {
  deleteAllTemporaryUsers,
  deleteBulkTemporaryUsers,
  getColumnUser,
  getTemporaryUserUserList,
} from '@api/UserCRUD'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, setUserStatus, toAbsoluteUrl} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {ModalEmailSettings} from '@pages/setup/custom-email-template/modalEmailSettings'
import {
  getEmailName,
  getListDropdownEmailTmp,
  getTemplateEmailSettings,
  updateTemplateEmailName,
} from '@pages/setup/custom-email-template/service'
import {Form, Formik} from 'formik'
// eslint-disable-next-line sonar/no-built-in-override
import {escape} from 'lodash'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

import {addRequestSendEmail} from '../redux/AssetRedux'
import {RequestAddUser} from './RequestAddUser'
import RequestAssetEmail from './RequestAssetEmail'

const RequestAsset: FC = () => {
  const navigate: any = useNavigate()
  const {formatMessage}: any = useIntl()

  const [to, setTo] = useState<number>(0)
  const [from, setFrom] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [columns, setColumns] = useState<any>([])
  const [dataUser, setDataUser] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [selectedUser, setSelectedUser] = useState<number>(0)
  const [dataEmailTemp, setDataEmailTemp] = useState<any>({})
  const [loadingTemp, setLoadingTemp] = useState<boolean>(false)
  const [showModal, setShowModalUser] = useState<boolean>(false)
  const [reloadTempUser, setReloadTempUser] = useState<number>(0)
  const [dataCheckedRequest, setDataCheckedRequest] = useState<any>([])
  const [loadingDatatable, setLoadingDatatable] = useState<boolean>(true)
  const [showModalEmailSettings, setShowModalEmailSettings] = useState<boolean>(false)
  const [reloadLogo, setReloadLogo] = useState<any>(0)
  const [detail, setDetail] = useState<any>({})

  useEffect(() => {
    setLoading(true)
    ToastMessage({type: 'clear'})
    getTemplateEmailSettings()
      .then(({data: {data}}: any) => {
        data && setDetail(data)
      })
      .finally(() => setTimeout(() => setLoading(false), 200))
  }, [reloadLogo])

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataCheckedRequest(ar_guid)
  }

  const confirmSuccessPage = () => {
    navigate('/asset-management/all')
  }

  const onRender = (val: any) => ({
    user_status: setUserStatus(val),
  })

  const handleOnSubmit = (values: any) => {
    setLoading(true)
    setLoadingDatatable(true)
    const page: number = 1
    const limit: number = 1000
    const params_user_themp: any = {page, limit, orderCol, orderDir}

    getTemporaryUserUserList(params_user_themp)
      .then(({data: {data: res}}: any) => {
        if (res?.length > 0) {
          const userDataTemp: any = []
          res?.forEach(({guid}: any) => {
            userDataTemp?.push(guid)
          })

          const userData: any = {
            users: userDataTemp as never[],
          }

          const params: any = {
            subject: values?.subject || dataEmailTemp?.subject || '',
            body: escape(values?.body) || escape(dataEmailTemp?.body) || '',
            signature: values?.signature || dataEmailTemp?.signature || 0,
            footer: values?.footer || dataEmailTemp?.footer || '',
          }

          updateTemplateEmailName(params, dataEmailTemp?.guid)
            .then(() => {
              addRequestSendEmail(userData)
                .then(({data: {message}}: any) => {
                  setLoading(false)
                  setLoadingDatatable(false)
                  Swal.fire({
                    imageUrl: '/images/approved.png',
                    imageWidth: 65,
                    imageHeight: 65,
                    imageAlt: 'Custom image',
                    text: message,
                    showConfirmButton: true,
                    confirmButtonColor: '#050990',
                    confirmButtonText: 'Back to Asset list',
                  }).then(() => {
                    if (message) {
                      confirmSuccessPage()
                    }
                  })
                })
                .catch(({response}: any) => {
                  setLoading(false)
                  const {devMessage, data}: any = response?.data || {}
                  const {fields}: any = data || {}
                  showObjectToast(devMessage, fields)
                })
            })
            .catch(({response}: any) => {
              setLoading(false)
              const {devMessage, data}: any = response?.data || {}
              const {fields}: any = data || {}
              showObjectToast(devMessage, fields)
            })
        } else {
          ToastMessage({message: 'The users field is required.', type: 'error'})
          setLoading(false)
          setLoadingDatatable(false)
        }
      })
      .catch(() => setTimeout(() => setLoading(false), 200))
  }

  const showObjectToast = (devMessage: any, fields: any) => {
    if (!devMessage) {
      Object.keys(fields || {})?.map((item: any) => {
        ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
        return true
      })
    }
  }

  const deletSelectedTemp = useCallback(() => {
    setLoading(true)
    deleteBulkTemporaryUsers({guids: dataCheckedRequest})
      .then(({status, data: {message}}: any) => {
        if (status === 200) {
          ToastMessage({message, type: 'success'})
          setTimeout(() => {
            const crn_page: number = to - from + 1

            setLoading(false)
            setDataCheckedRequest([])
            setReloadTempUser(reloadTempUser + 1)
            setPage(crn_page - dataCheckedRequest?.length === 0 ? page - 1 : page)
          }, 800)
        }
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [dataCheckedRequest])

  const saveUpdateEmailTemplate = (values: any) => {
    setLoadingTemp(true)
    const {subject, guid, body, signature, footer}: any = dataEmailTemp || {}
    const params: any = {
      subject: values?.subject || subject || '',
      body: values?.body || body || '',
      signature: values?.signature || signature || 0,
      footer: values?.footer || footer || '',
      company_logo: values?.company_logo,
    }

    updateTemplateEmailName(params, guid)
      .then(({data: {message}}: any) => {
        setLoadingTemp(false)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setLoadingTemp(false)
        const {devMessage, data}: any = response?.data || {}
        const {fields}: any = data || {}

        if (!devMessage) {
          Object.keys(fields || {})?.map((item: any) => {
            ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
            return true
          })
        }
      })
  }

  const initValues: any = {
    body: dataEmailTemp?.body,
    subject: dataEmailTemp?.subject || '',
    signature: dataEmailTemp?.signature || 0,
    footer: dataEmailTemp?.footer || '',
    company_logo: dataEmailTemp?.company_logo,
  }

  useEffect(() => {
    getColumnUser({})
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
            ({value, label: header, is_sortable}: any) => {
              let val: any = value
              let head: any = header
              value === 'status' && (val = 'user_status')
              header === 'Company Department Name' && (head = 'Department')
              return {
                value: val,
                header: head,
                sort: is_sortable === 1 ? true : false,
              }
            }
          )

          if (mapColumns?.length) {
            let columnsCustom: any = []
            columnsCustom = [...columnsCustom, {header: 'checkbox', width: '20px'}, ...mapColumns]
            setColumns(columnsCustom)
          } else {
            setColumns([])
          }
        }
      )
      .catch(() => '')
  }, [])

  useEffect(() => {
    setLoadingDatatable(true)
    const params: any = {page, limit, orderCol, orderDir}
    const currentLimit: number = limit || 10

    getTemporaryUserUserList(params)
      .then(({data: {data: res_users, meta}}) => {
        const {total, current_page, from, to}: any = meta || {}
        const data_table: any = []
        res_users?.forEach((item: any) => {
          data_table?.push(item)
        })

        setTo(to)
        setFrom(from)
        setLimit(currentLimit)
        setTotalPage(total)
        setPage(current_page)
        setDataUser(matchColumns(data_table, columns))
      })
      .finally(() => setTimeout(() => setLoadingDatatable(false), 800))
  }, [page, limit, orderCol, columns, orderDir, reloadTempUser])

  useEffect(() => {
    setLoadingTemp(true)
    getListDropdownEmailTmp()
      .then(({data: {data: res}}: any) => {
        const myAsset: any = res?.find((data: {name: any}) => data?.name === 'My Asset')
        if (Object.keys(myAsset)?.length > 0) {
          const assetRequest: any = myAsset?.email_templates?.find(
            (data: {unique_id: any}) => data?.unique_id === 'add-asset-request'
          )

          if (assetRequest?.guid) {
            getEmailName(assetRequest?.guid)
              .then(({data: {data: resData}}: any) => {
                setDataEmailTemp(resData || {})
                setTimeout(() => setLoadingTemp(false), 1000)
              })
              .catch(() => {
                setDataEmailTemp({})
                setTimeout(() => setLoadingTemp(false), 1000)
              })
          } else {
            setDataEmailTemp({})
            setTimeout(() => setLoadingTemp(false), 1000)
          }
        }
      })
      .catch(() => {
        setDataEmailTemp({})
        setTimeout(() => setLoadingTemp(false), 1000)
      })
  }, [])

  useEffect(() => {
    // When reload the page (componentWillMount)
    deleteAllTemporaryUsers({})
    // When leaving the page (componentWillUnMount)
    return () => {
      deleteAllTemporaryUsers({})
    }
  }, [])
  return (
    <>
      <PageTitle>{formatMessage({id: `PAGETITLE.REQUEST_ADD_ASSET`})}</PageTitle>
      <div className='card card-custom card-table mb-5'>
        <div className='card-table-header' style={{zIndex: 10}}>
          <div className='row'>
            <div className='col-12 mb-5'>Add users who you want to add their assets.</div>

            <div className='col-12 mb-5'>
              <RequestAddUser
                showModal={showModal}
                selectedUser={selectedUser}
                reloadTempUser={reloadTempUser}
                setSelectedUser={setSelectedUser}
                setShowModalUser={setShowModalUser}
                setReloadTempUser={setReloadTempUser}
              />
            </div>

            <div className='col-12'>
              {dataCheckedRequest?.length > 0 && (
                <button
                  type='button'
                  data-cy='bulkDelete'
                  style={{float: 'right'}}
                  onClick={deletSelectedTemp}
                  className='btn btn-sm btn-primary me-2'
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div
          className='card-body'
          style={{
            marginBottom: '-10px',
          }}
        >
          <div className='row'>
            <div className='col-12' style={{marginBottom: '50px'}}>
              <DataTable
                limit={limit}
                onSort={onSort}
                data={dataUser}
                total={totalPage}
                render={onRender}
                columns={columns}
                onChecked={onChecked}
                loading={loadingDatatable}
                customEmptyTable='No Users'
                onChangeLimit={onChangeLimit}
                onChangePage={(e: any) => setPage(e)}
              />
            </div>
            <Formik enableReinitialize initialValues={initValues} onSubmit={handleOnSubmit}>
              {({values, setFieldValue}: any) => {
                return (
                  <Form>
                    <div className='row'>
                      <div className='col-12 text-end mb-5'>
                        <div
                          className='btn btn-sm btn-secondary'
                          onClick={() => saveUpdateEmailTemplate(values)}
                        >
                          Save Email Template
                        </div>
                      </div>
                    </div>

                    <div
                      className='row py-3'
                      style={{
                        backgroundColor: '#DEDEDE',
                        borderRadius: '5px',
                      }}
                    >
                      <div className='col-12 ps-4 mb-3'>
                        You can change the company logo, subject and email content to you
                        preference.
                      </div>
                      <div className='col-12'>
                        <div
                          className='border border-2 col p-7 d-flex justify-content-center align-items-center flex-column h-auto radius-10 bg-email-body'
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
                                {detail?.header_logo === '1' ? (
                                  <img
                                    alt='Logo'
                                    className={`h-45px me-4`}
                                    src={toAbsoluteUrl('/media/logos/assetdataV1.png')}
                                  />
                                ) : detail?.company_logo !== null ? (
                                  <img
                                    alt='Logo'
                                    className={`h-45px me-4`}
                                    src={detail?.company_logo?.data}
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
                              className='btn btn-primary btn-sm pe-10'
                              onClick={() => setShowModalEmailSettings(true)}
                            >
                              Change Logo
                            </button>
                          </div>
                          <RequestAssetEmail
                            body={values?.body}
                            loading={loadingTemp}
                            setFieldValue={setFieldValue}
                          />
                        </div>
                      </div>
                      <div className='col-12 mt-5 text-end'>
                        <div className='btn btn-sm btn-light me-3' onClick={() => navigate('/')}>
                          Cancel
                        </div>
                        <button disabled={loading} className='btn btn-sm btn-primary' type='submit'>
                          {loading ? (
                            <span className='indicator-progress d-block'>
                              Please wait...
                              <span className='spinner-border spinner-border-sm align-middle ms-2' />
                            </span>
                          ) : (
                            <span className='indicator-label'>Send Email</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>

      <ModalEmailSettings
        detail={detail}
        showModal={showModalEmailSettings}
        setShowModal={setShowModalEmailSettings}
        reload={reloadLogo}
        setReload={setReloadLogo}
        // companyLogo={companyLogo}
      />
    </>
  )
}

export default RequestAsset
