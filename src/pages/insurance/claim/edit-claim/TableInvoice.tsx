import {Alert} from '@components/alert'
import {ButtonPill} from '@components/button'
import {DatatableLoader} from '@components/loader/table'
import {ToastMessage} from '@components/toast-message'
import {KTSVG, preferenceDate, validationViewDate} from '@helpers'
import {includes} from 'lodash'
import {FC, memo, useState} from 'react'

import ModalUploadInvoice from '../detail/UploadFile'
import {deleteInvoice} from '../Service'
import ShowFile from './ShowFile'

let TableInvoice: FC<any> = ({
  data,
  setReload,
  reload,
  permissions,
  formChange,
  setShowModalConfimSave,
  detailInvoice,
  setDetailInvoice,
  showAddInvoice,
  setShowAddInvoice,
  showModalDelete,
  setShowModalDelete,
  mode,
  setMode,
  setConfirmAction,
  loadingPage,
}) => {
  const pref_date = preferenceDate()
  const {invoices = [], guid, ro_data_infos} = data || {}
  const [loading, setLoadingDelete] = useState<boolean>(false)
  const [showModalView, setShowModalView] = useState<boolean>(false)

  const canAdd: any =
    ![
      'Pending Documents Upload',
      'Pending GR Done',
      'Rejected and Closed',
      'Approved',
      'Approved (Not Claimable)',
    ].includes(data?.insurance_claim_status?.name) &&
    permissions?.includes('insurance_claim.invoice_upload')

  const confirmDelete = () => {
    const {guid: id} = detailInvoice
    deleteInvoice(guid, id)
      .then((e: any) => {
        ToastMessage({message: e?.data?.message, type: 'success'})
        setLoadingDelete(false)
        setShowModalDelete(false)
        setReload(reload + 1)
      })
      .catch(() => {
        // errorExpiredToken(e);
        setLoadingDelete(false)
      })
  }

  const onAddInvoice = () => {
    setMode('edit')
    if (includes(formChange, true)) {
      setConfirmAction('add-invoice')
      setShowModalConfimSave(true)
    } else {
      setDetailInvoice(undefined)
      setShowAddInvoice(true)
    }
  }

  const onEditInvoice = (item: any) => {
    setMode('edit')
    if (includes(formChange, true)) {
      setConfirmAction('edit-invoice')
      setDetailInvoice(item)
      setShowModalConfimSave(true)
    } else {
      setDetailInvoice(item)
      setShowAddInvoice(true)
    }
  }

  const onDeleteInvoice = (item: any) => {
    if (includes(formChange, true)) {
      setConfirmAction('remove-invoice')
      setDetailInvoice(item)
      setShowModalConfimSave(true)
    } else {
      setMode('edit')
      setDetailInvoice(item)
      setShowModalDelete(true)
    }
  }

  const msg_alert = [
    'Are you sure you want to delete this invoice: ',
    <strong key='doc_name'>{detailInvoice?.title || ''}</strong>,
    ' ?',
  ]

  if (loadingPage) {
    return (
      <>
        <div className='mb-3'>
          {canAdd ? (
            <ButtonPill title='Add Invoices' icon='plus' radius={5} />
          ) : (
            <span className='fw-bolder'>Invoices :</span>
          )}
        </div>
        <table className='table table-borderless table-striped table-hover'>
          <thead className='table-header-blue'>
            <tr className='table-tr-border-none'>
              <th className='p-3'>File Name</th>
              <th className='p-3'>RO Number</th>
              <th className='p-3'>Comment/Description</th>
              <th className='p-3'>Uploaded By</th>
              <th className='p-3'>Upload Date</th>
              <th className='p-3 w-150px text-center'>Action</th>
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
        title={'Delete Insurance Claim Invoice'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDelete()
        }}
        onCancel={() => {
          setShowModalDelete(false)
        }}
      />
      <ShowFile data={detailInvoice} showModal={showModalView} setShowModal={setShowModalView} />
      <ModalUploadInvoice
        id={guid}
        detail={detailInvoice}
        type='invoice'
        setReload={setReload}
        reload={reload}
        mode={mode}
        showModal={showAddInvoice}
        setShowModal={setShowAddInvoice}
        optionRO={ro_data_infos}
      />
      <div className='mb-3 pt-4 fw-bolder'>
        {![
          'Pending Documents Upload',
          'Pending GR Done',
          'Rejected and Closed',
          'Approved',
          'Approved (Not Claimable)',
        ].includes(data?.insurance_claim_status?.name) &&
        permissions?.includes('insurance_claim.invoice_upload') ? (
          <ButtonPill title='Add Invoices' icon='plus' radius={5} onClick={onAddInvoice} />
        ) : (
          <span className='fw-bolder'>Invoices :</span>
        )}
      </div>
      <table className='table table-borderless table-striped table-hover'>
        <thead className='table-header-blue'>
          <tr className='table-tr-border-none'>
            <th className='p-3'>File Name</th>
            <th className='p-3'>RO Number</th>
            <th className='p-3'>Comment/Description</th>
            <th className='p-3'>Uploaded By</th>
            <th className='p-3'>Upload Date</th>
            <th className='p-3 w-150px text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices &&
            invoices?.map((e: any, index: any) => {
              const {title, ro_number, comments, created_at, created_by} = e || {}
              const {name} = created_by || {}
              return (
                <tr className='table-tr-border-none' key={index}>
                  <td style={{padding: '0.75rem 0.75rem'}}>{title}</td>
                  <td>{ro_number || 'N/A'}</td>
                  <td>{comments || '-'}</td>
                  <td>{name}</td>
                  <td>{created_at !== null ? validationViewDate(created_at, pref_date) : 'N/A'}</td>
                  <td className='w-150px text-center'>
                    {permissions?.includes('insurance_claim.invoice_delete') && (
                      <span
                        title='delete'
                        onClick={() => onDeleteInvoice(e)}
                        className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-danger border-danger'
                      >
                        <KTSVG path='/images/remove-icon.svg' className='svg-icon-2' />
                      </span>
                    )}
                    {permissions?.includes('insurance_claim.invoice_delete') && (
                      <span
                        title='edit'
                        onClick={() => onEditInvoice(e)}
                        className='mx-1 align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-warning border-warning'
                      >
                        <KTSVG path='/images/edit-icon.svg' className='svg-icon-2' />
                      </span>
                    )}
                    <span
                      title='view'
                      onClick={() => {
                        setMode('view')
                        setDetailInvoice(e)
                        setShowModalView(true)
                      }}
                      className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-primary'
                    >
                      <KTSVG path='/images/view-icon2.svg' className='svg-icon-2' />
                    </span>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </>
  )
}

TableInvoice = memo(
  TableInvoice,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TableInvoice
