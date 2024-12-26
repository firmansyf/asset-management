import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {DatatableLoader} from '@components/loader/table'
import {ToastMessage} from '@components/toast-message'
import {configClass, KTSVG, preferenceDate, validationViewDate} from '@helpers'
import {includes} from 'lodash'
import {FC, Fragment, memo, useEffect, useState} from 'react'

import ModalUploadInvoice from '../detail/UploadFile'
import {deleteDocument} from '../Service'
import ShowFile from './ShowFile'

let TableDocument: FC<any> = ({
  data,
  setReload,
  reload,
  optionDocument,
  permissions,
  currentPeril,
  user,
  formChange,
  setShowModalConfimSave,
  detailDoc,
  setDetailDoc,
  guidDoc,
  setShowGuidDocument,
  showModalDoc,
  setShowModalDocument,
  showModalDelete,
  setShowModalDelete,
  mode,
  setMode,
  setConfirmAction,
  loadingPage,
}) => {
  const pref_date = preferenceDate()

  const idInsurance = data?.guid
  const {first_name, last_name}: any = user || {}
  const isCurrentPeril: any = currentPeril?.guid === data?.insurance_claim_peril?.guid
  const type = 'document'
  const [showModalView, setShowModalView] = useState<boolean>(false)
  const [loading, setLoadingDelete] = useState<boolean>(false)
  const [documents, setDocuments] = useState<any>([])

  useEffect(() => {
    setDocuments(data?.documents || [])
  }, [data?.documents])

  const confirmDelete = () => {
    const {guid} = detailDoc || {}
    deleteDocument(idInsurance, guid)
      .then((e: any) => {
        ToastMessage({message: e?.data?.message, type: 'success'})
        setLoadingDelete(false)
        setShowModalDelete(false)
        setReload(reload + 1)
      })
      .catch(() => {
        setLoadingDelete(false)
      })
  }

  const deleteLocalDoc = (guid: any, index: any) => {
    setDocuments(
      documents?.map((m: any) => {
        if (m.guid === guid) {
          m.files?.splice(index, 1)
        }
        return m
      })
    )
  }

  const msg_alert = [
    'Are you sure you want to delete this doc: ',
    <strong key='doc_name'>{detailDoc?.title || ''}</strong>,
    ' ?',
  ]

  const onAddDocument = (item: any) => {
    if (includes(formChange, true)) {
      setConfirmAction('add-document')
      setShowModalConfimSave(true)
    } else {
      setMode('edit')
      setDetailDoc(undefined)
      setShowGuidDocument(item)
      setShowModalDocument(true)
    }
  }

  const onEditDocument = (item: any, documentGuid: any) => {
    if (includes(formChange, true)) {
      setConfirmAction('edit-document')
      setDetailDoc(item)
      setShowGuidDocument(documentGuid)
      setShowModalConfimSave(true)
    } else {
      setDetailDoc(item)
      setShowGuidDocument(documentGuid)
      setShowModalDocument(true)
    }
  }

  const onDeleteDocument = (item: any, documentGuid: any, index: any) => {
    if (includes(formChange, true)) {
      setConfirmAction('remove-document')
      setDetailDoc(item)
      setShowGuidDocument(documentGuid)
      setShowModalConfimSave(true)
    } else {
      if (item?.local) {
        deleteLocalDoc(documentGuid, index)
      } else {
        setDetailDoc(item)
        setShowModalDelete(true)
      }
    }
  }

  if (loadingPage) {
    return (
      <>
        <table className='table table-borderless table-striped table-hover'>
          <thead className='table-header-blue'>
            <tr className='table-tr-border-none'>
              <th className='fw-bolder text-center px-2'>Upload</th>
              <th className='fw-bolder'>Document</th>
              <th className='fw-bolder'>File Name</th>
              <th className='fw-bolder'>Comment/Description</th>
              <th className='fw-bolder'>Upload By</th>
              <th className='fw-bolder'>Upload Date</th>
              <th className='fw-bolder text-center'>Action</th>
            </tr>
          </thead>
        </table>
        <DatatableLoader className='my-5' count={2} />
      </>
    )
  }
  return (
    <>
      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Insurance Claim Doc'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDelete()
        }}
        onCancel={() => {
          setShowModalDelete(false)
        }}
      />
      <ShowFile data={detailDoc} showModal={showModalView} setShowModal={setShowModalView} />
      <ModalUploadInvoice
        id={idInsurance}
        idDoc={guidDoc}
        type={type}
        detail={detailDoc}
        mode={mode}
        setReload={() => {
          if (isCurrentPeril) {
            setReload(reload + 1)
          }
        }}
        reload={reload}
        showModal={showModalDoc}
        showModalDelete={showModalDelete}
        setShowModal={setShowModalDocument}
        isCurrentPeril={isCurrentPeril}
        onSubmit={(e: any) => {
          setDocuments(
            documents?.map((m: any) => {
              if (m?.guid === e?.insurance_claim_document_guid) {
                const file: any = {
                  guid: e?.insurance_claim_document_guid,
                  url: e?.file?.data || null,
                  title: e?.file?.title || '-',
                  comments: e?.comments,
                  uploaded_date: new Date(),
                  uploaded_by: {name: `${first_name} ${last_name}`},
                  mime_type: e?.file?.data?.split(';')?.[0]?.split(':')[1] || 'image/jpeg',
                  local: true,
                }
                m.files = m.files.concat(file)
              }
              return m
            })
          )
        }}
      />
      <table className='table table-borderless table-striped table-hover'>
        <thead className='table-header-blue'>
          <tr className='table-tr-border-none'>
            {permissions?.includes('insurance_claim.document_upload') && (
              <th className='fw-bolder text-center px-2'>Upload</th>
            )}
            <th className='fw-bolder'>Document</th>
            <th className='fw-bolder'>File Name</th>
            <th className='fw-bolder'>Comment/Description</th>
            <th className='fw-bolder'>Upload By</th>
            <th className='fw-bolder'>Upload Date</th>
            <th className='fw-bolder text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents?.map((e: any, index: any) => {
            const {guid, name, files} = e || {}
            const doc = optionDocument.find(({guid: id}: any) => id === guid)
            return (
              <Fragment key={index}>
                {files.length === 0 && (
                  <tr className='table-tr-border-none'>
                    {permissions?.includes('insurance_claim.document_upload') && (
                      <td className='text-center'>
                        <div
                          onClick={() => {
                            onAddDocument(guid)
                          }}
                          className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                          data-cy='addDocumentClaim'
                        >
                          <KTSVG
                            path='/media/icons/duotone/Files/File-Plus.svg'
                            className='svg-icon-2'
                          />
                        </div>
                      </td>
                    )}
                    <td>
                      <label
                        className={`${configClass?.label} ${
                          doc?.is_mandatory_document === 1 ? 'required' : ''
                        }`}
                      >
                        {name}
                      </label>
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                )}
                {files?.length > 0 &&
                  files?.map((e: any, index: any) => {
                    const {title, comments, uploaded_by, mime_type, uploaded_date} = e || {}
                    return (
                      <tr key={index} className='table-tr-border-none'>
                        {index === 0 && (
                          <>
                            <td rowSpan={files?.length} className='text-center'>
                              <div
                                onClick={() => {
                                  onAddDocument(guid)
                                }}
                                className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                                data-cy='addDocumentClaim'
                              >
                                <KTSVG
                                  path='/media/icons/duotone/Files/File-Plus.svg'
                                  className='svg-icon-2'
                                />
                              </div>
                            </td>
                            <td rowSpan={files?.length}>
                              <label
                                className={`${configClass?.label} ${
                                  doc?.is_mandatory_document === 1 ? 'required' : ''
                                }`}
                              >
                                {name}
                              </label>
                            </td>
                          </>
                        )}
                        <td>{title}</td>
                        <td>{comments || '-'}</td>
                        <td>{uploaded_by?.name || '-'}</td>
                        <td>
                          {uploaded_date !== null
                            ? validationViewDate(uploaded_date, pref_date)
                            : 'N/A'}
                        </td>
                        <td className='text-center text-nowrap'>
                          {comments !== null ? (
                            <div className='d-flex align-items-center'>
                              {permissions?.includes('insurance_claim.document_delete') && (
                                <Tooltip placement='top' title='Delete'>
                                  <div
                                    onClick={() => {
                                      onDeleteDocument(e, e?.guid, index)
                                    }}
                                    data-cy='deleteDocumentClaim'
                                    className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-danger border-danger'
                                  >
                                    <KTSVG path='/images/remove-icon.svg' className='svg-icon-2' />
                                  </div>
                                </Tooltip>
                              )}
                              {permissions?.includes('insurance_claim.document_edit') && (
                                <Tooltip placement='top' title='Edit' active={isCurrentPeril}>
                                  <div
                                    onClick={() => {
                                      if (isCurrentPeril) {
                                        setMode('edit')
                                        onEditDocument(e, guid)
                                      }
                                    }}
                                    data-cy='editDocumentClaim'
                                    className={`mx-1 align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 ${
                                      isCurrentPeril
                                        ? 'btn-light-warning border-warning'
                                        : 'bg-gray-100 border-secondary'
                                    }`}
                                    style={{cursor: isCurrentPeril ? 'pointer' : 'not-allowed'}}
                                  >
                                    <KTSVG path='/images/edit-icon.svg' className='svg-icon-2' />
                                  </div>
                                </Tooltip>
                              )}
                              {mime_type !== null && (
                                <Tooltip placement='top' title='View'>
                                  <div
                                    onClick={() => {
                                      setMode('view')
                                      setDetailDoc(e)
                                      setShowModalView(true)
                                    }}
                                    data-cy='viewDocument'
                                    className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-primary'
                                  >
                                    <KTSVG path='/images/view-icon2.svg' className='svg-icon-2' />
                                  </div>
                                </Tooltip>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    )
                  })}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

TableDocument = memo(
  TableDocument,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TableDocument
