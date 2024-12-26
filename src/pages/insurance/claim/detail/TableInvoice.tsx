import {ButtonPill} from '@components/button'
import {DatatableLoader} from '@components/loader/table'
import {KTSVG, preferenceDate, validationViewDate} from '@helpers'
import {FC, memo, useState} from 'react'

import ShowFile from '../edit-claim/ShowFile'
import ModalUploadInvoice from './UploadFile'

let TableInvoice: FC<any> = ({
  data,
  setReload,
  reload,
  showModalUploadInvoice,
  setShowModalUploadInvoice,
  loadingPage,
}) => {
  const pref_date: any = preferenceDate()

  const [detailInvoice, setDetailInvoice] = useState<any>()
  const [showModalView, setShowModalView] = useState<boolean>(false)

  const {invoices = [], guid, ro_data_infos}: any = data || {}
  const canAdd: any = ![
    'Pending Documents Upload',
    'Pending GR Done',
    'Rejected and Closed',
    'Approved',
    'Approved (Not Claimable)',
  ]?.includes(data?.insurance_claim_status?.name)

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
      <ShowFile data={detailInvoice} showModal={showModalView} setShowModal={setShowModalView} />
      <ModalUploadInvoice
        id={guid}
        type='invoice'
        reload={reload}
        setReload={setReload}
        detail={detailInvoice}
        optionRO={ro_data_infos}
        showModal={showModalUploadInvoice}
        setShowModal={setShowModalUploadInvoice}
      />

      <div className='mb-3 pt-4 fw-bolder'>
        {canAdd ? (
          <ButtonPill
            title='Add Invoices'
            icon='plus'
            radius={5}
            onClick={() => {
              setDetailInvoice(undefined)
              setShowModalUploadInvoice(true)
            }}
          />
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
            <th className='p-3'>Upload Date</th>
            <th className='p-3'>Upload By</th>
            <th className='p-3'>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices &&
            invoices?.length > 0 &&
            invoices?.map((e: any, index: any) => {
              const {title, ro_number, comments, created_at, created_by}: any = e || {}
              const {name}: any = created_by || {}

              return (
                <tr key={index} className='table-tr-border-none'>
                  <td style={{padding: '0.75rem 0.75rem'}}>{title}</td>
                  <td>{ro_number || 'N/A'}</td>
                  <td>{comments || '-'}</td>
                  <td>{created_at !== null ? validationViewDate(created_at, pref_date) : 'N/A'}</td>
                  <td>{name || ''}</td>
                  <td>
                    <span
                      title='view'
                      onClick={() => {
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
