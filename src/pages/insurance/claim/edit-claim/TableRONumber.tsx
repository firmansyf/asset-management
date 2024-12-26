import {Alert as DeleteRONumber} from '@components/alert'
import {DatatableLoader} from '@components/loader/table'
import {KTSVG, preferenceDate, validationViewDate} from '@helpers'
import {FC, memo, useEffect, useMemo, useState} from 'react'

import AddRONumber from './AddRONumber'
const toCurrency = (amount: any) => amount?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

let TableRONumber: FC<any> = ({
  data,
  id,
  setFieldValue,
  setIncidentTimestamp,
  incidentTimestamp,
  currentPeril,
  loadingPage,
  onChange = () => [],
}) => {
  const pref_date = preferenceDate()

  const [ronumber, setRONumber] = useState([])
  const [showAddRONumber, setShowAddRONumber] = useState(false)
  const [showDeleteRONumber, setShowDeleteRONumber] = useState(false)
  const [detailRO, setDetail] = useState<any>({})
  const total_invoice = useMemo(() => {
    let total = 0
    if (ronumber && ronumber?.length) {
      total = ronumber
        .map((m: any) => {
          let inv: any = 0
          if (m?.invoice_amount?.toString()?.split(' ')?.length > 1) {
            inv = m?.invoice_amount?.toString()?.split(' ')[1]
          } else if (m?.invoice_amount) {
            inv = m?.invoice_amount
          }
          return parseFloat(inv)
        })
        .reduce((a, b) => a + b)
    }
    return total.toFixed(2)
  }, [ronumber])

  useEffect(() => {
    setRONumber(data?.ro_data_infos || [])
  }, [data?.ro_data_infos])

  const actions = (e: any, type: string) => {
    setDetail(e)
    type === 'edit' ? setShowAddRONumber(true) : setShowDeleteRONumber(true)
    setIncidentTimestamp(incidentTimestamp)
  }

  const setData = (e: any, type: string) => {
    let RO: any
    if (type === 'edit') {
      RO = ronumber?.map((m: any) => {
        m === detailRO && (m = e)
        return m
      })
    } else {
      RO = ronumber?.filter((f: any) => f !== detailRO)
      setShowDeleteRONumber(false)
    }
    setRONumber(RO)
    onChange && onChange(RO)
    setFieldValue('ro_data_infos', RO)
  }

  const deductibleAmount = currentPeril?.guid !== undefined ? currentPeril?.deductible_amount : 0
  const totalAmount: any =
    parseFloat(total_invoice) -
    (deductibleAmount ? parseFloat(deductibleAmount.replace(/,/g, '')) : 0)

  if (loadingPage) {
    return (
      <>
        <table className='table table-borderless table-striped table-hover'>
          <thead className='table-header-blue'>
            <tr className='table-tr-border-none'>
              <th className='fw-bolder text-center'>#</th>
              <th className='fw-bolder'>RO Number</th>
              <th className='fw-bolder'>RO Status</th>
              <th className='fw-bolder'>Vendor</th>
              <th className='fw-bolder'>Invoice Date</th>
              <th className='fw-bolder'>Invoice Number</th>
              <th className='fw-bolder'>Invoice Amount</th>
              <th className='fw-bolder'>Action</th>
            </tr>
          </thead>
        </table>
        <DatatableLoader className='my-5' count={2} />
      </>
    )
  }
  return (
    <>
      <table className='table table-borderless table-striped table-hover'>
        <thead className='table-header-blue'>
          <tr className='table-tr-border-none'>
            <th className='fw-bolder text-center'>#</th>
            <th className='fw-bolder'>RO Number</th>
            <th className='fw-bolder'>RO Status</th>
            <th className='fw-bolder'>Vendor</th>
            <th className='fw-bolder'>Invoice Date</th>
            <th className='fw-bolder'>Invoice Number</th>
            <th className='fw-bolder'>Invoice Amount</th>
            <th className='fw-bolder w-100px'>Action</th>
          </tr>
        </thead>
        <tbody>
          {ronumber &&
            ronumber?.map((e: any, index: any) => {
              const {
                invoice_amount,
                invoice_date,
                invoice_number,
                vendor_name,
                ro_number,
                ro_status,
              } = e || {}

              return (
                <tr key={index} className='table-tr-border-none'>
                  <td style={{padding: '0.75rem 0.75rem'}}>{index + 1}</td>
                  <td>{ro_number}</td>
                  <td>{ro_status?.label || ro_status?.name || '-'}</td>
                  <td>{vendor_name}</td>
                  <td>
                    {invoice_date !== null ? validationViewDate(invoice_date, pref_date) : 'N/A'}
                  </td>
                  <td>{invoice_number}</td>
                  <td>
                    {invoice_amount
                      ? invoice_amount?.toString()?.split(' ')?.length > 1
                        ? toCurrency(
                            parseFloat(invoice_amount?.toString()?.split(' ')[1])?.toFixed(2)
                          )
                        : toCurrency(parseFloat(invoice_amount)?.toFixed(2))
                      : 0}
                  </td>
                  <td className='text-nowrap px-2'>
                    <span
                      title='edit'
                      onClick={() => actions(e, 'edit')}
                      className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-warning border-warning'
                    >
                      <KTSVG path='/images/edit-icon.svg' className='svg-icon-2' />
                    </span>
                    <span
                      title='delete'
                      onClick={() => actions(e, 'delete')}
                      className='mx-1 align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-danger border-danger'
                    >
                      <KTSVG path='/images/remove-icon.svg' className='svg-icon-2' />
                    </span>
                  </td>
                </tr>
              )
            })}
          <tr className='table-tr-border-none'>
            <td colSpan={6} className='fw-bolder text-end'>
              Total Invoice Amount :
            </td>
            <td colSpan={6} className='p-3'>
              {total_invoice
                ? parseFloat(total_invoice)
                    ?.toFixed(2)
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '0.00'}
            </td>
          </tr>
          <tr className='table-tr-border-none'>
            <td colSpan={6} className='fw-bolder text-end'>
              Deductible Amount :
            </td>
            <td colSpan={6}>
              {deductibleAmount && deductibleAmount > 0
                ? parseFloat(deductibleAmount)
                    ?.toFixed(2)
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '0.00'}
            </td>
          </tr>
          <tr className='table-tr-border-none'>
            <td colSpan={6} className='fw-bolder text-end'>
              Total Claimable Amount :
            </td>
            <td colSpan={6} className='fw-bold'>
              {totalAmount && totalAmount > 0
                ? parseFloat(totalAmount)
                    ?.toFixed(2)
                    ?.toString()
                    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '0.00'}
            </td>
          </tr>
        </tbody>
      </table>

      <AddRONumber
        id={id}
        setShowModal={setShowAddRONumber}
        showModal={showAddRONumber}
        incidentTimestamp={incidentTimestamp}
        setShowData={(e: any) => setData(e, 'edit')}
        data={detailRO}
      />

      <DeleteRONumber
        setShowModal={setShowDeleteRONumber}
        showModal={showDeleteRONumber}
        loading={false}
        body={
          <span>
            Are you sure want to delete <strong>{detailRO?.ro_number || 'RO Number'}</strong> ?
          </span>
        }
        type={'delete'}
        title={'Delete RO Number'}
        confirmLabel={'Delete'}
        onConfirm={(e: any) => setData(e, 'delete')}
        onCancel={() => {
          setShowDeleteRONumber(false)
        }}
      />
    </>
  )
}

TableRONumber = memo(
  TableRONumber,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TableRONumber
