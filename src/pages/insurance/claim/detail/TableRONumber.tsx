/* eslint-disable react-hooks/exhaustive-deps */
import {DatatableLoader} from '@components/loader/table'
import {preferenceDate, validationViewDate} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'

let TableRONumber: FC<any> = ({data, loadingPage}) => {
  const ronumber: any = data?.ro_data_infos || []
  const {total_invoice, insurance_claim_peril, total_claimable}: any = data || {}
  const {deductible_amount}: any = insurance_claim_peril || {}
  const pref_date: any = preferenceDate()
  const [totalInvoice, setTotalInvoice] = useState<number>(0)
  const [deductibleAmount, setDeductibleAmount] = useState<number>(0)
  const [totalClaimable, setTotalClaimable] = useState<number>(0)

  useEffect(() => {
    const total: number = Number(total_invoice?.replace(',', ''))
    setTotalInvoice(total)
  }, [total_invoice])

  useEffect(() => {
    const total: number = Number(deductible_amount?.replace(',', ''))
    setDeductibleAmount(total)
  }, [deductible_amount])

  useEffect(() => {
    const total: number = Number(total_claimable?.replace(',', ''))
    setTotalClaimable(total)
  }, [total_claimable])

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
    <table className='table table-borderless table-striped table-hover'>
      <thead className='table-header-blue'>
        <tr className='table-tr-border-none'>
          <th className='fw-bolder text-center'>#</th>
          <th className='fw-bolder'>RO Number</th>
          <th className='fw-bolder'>RO Status</th>
          <th className='fw-bolder'>Vendor</th>
          <th className='fw-bolder'>Invoice Date</th>
          <th className='fw-bolder'>Invoice Number</th>
          <th className='fw-bolder' style={{width: '230px'}}>
            Invoice Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {ronumber &&
          ronumber?.length > 0 &&
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
                <td>{ro_number || ''}</td>
                <td>{ro_status?.name || ''}</td>
                <td>{vendor_name || ''}</td>
                <td>
                  {invoice_date !== null ? validationViewDate(invoice_date, pref_date) : 'N/A'}
                </td>
                <td>{invoice_number || ''}</td>
                <td>
                  {invoice_amount && invoice_amount > 0
                    ? parseFloat(invoice_amount)
                        ?.toFixed(2)
                        ?.toString()
                        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : 0}
                </td>
              </tr>
            )
          })}
        <tr className='table-tr-border-none'>
          <td colSpan={6} className='fw-bolder text-end p-3'>
            Total Invoice Amount
          </td>
          <td className='p-3'>
            {totalInvoice && totalInvoice > 0
              ? totalInvoice
                  ?.toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : 0}
          </td>
        </tr>
        <tr className='table-tr-border-none'>
          <td colSpan={6} className='fw-bolder text-end p-3'>
            Deductible Amount
          </td>
          <td className='p-3'>
            {deductibleAmount && deductibleAmount > 0
              ? deductibleAmount
                  ?.toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : 0}
          </td>
        </tr>
        <tr className='table-tr-border-none'>
          <td colSpan={6} className='fw-bolder text-end p-3'>
            Total Claimable Amount
          </td>
          <td className='p-3'>
            {totalClaimable && totalClaimable > 0
              ? totalClaimable
                  ?.toFixed(2)
                  ?.toString()
                  ?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : 0}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

TableRONumber = memo(
  TableRONumber,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default TableRONumber
