import {configClass, numberWithCommas, preferenceDate} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'

let Financial: FC<any> = ({data, database}) => {
  const pref_date: any = preferenceDate()
  const [dataDetail, setData] = useState<any>({})
  const {
    'financial_info.cheque_number': chequeNumber,
    'financial_info.cheque_date': chequeDate,
    'financial_info.delivery_actual_date_received': deliveryActualDateReceived,
    'financial_info.delivery_order_number': deliveryOrderNumber,
    'financial_info.delivery_order_date': deliveryOrderDate,
    'financial_info.invoice_date': invoiceDate,
    'financial_info.invoice_number': invoiceNumber,
    'financial_info.order_date': orderDate,
    'financial_info.order_number': orderNumber,
    'financial_info.total_cost': totalCost,
    'financial_info.total_quantity': totalQuantity,
    'financial_info.unit_cost': unitCost,
    'financial_info.voucher_date': voucherDate,
    'financial_info.voucher_number': voucherNumber,
  }: any = database || {}

  useEffect(() => {
    data && setData(data)
  }, [data])

  const result =
    dataDetail?.financial_info?.unit_cost?.amount * dataDetail?.financial_info?.total_quantity

  return (
    <div className='card card-custom mt-5'>
      <div className='card-body p-5'>
        <div className='row'>
          {orderNumber?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle1'>
                  Purchase Order Number
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.purchase_order_number || '-'}
                </div>
              </div>
            </div>
          )}

          {orderDate?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle2'>
                  Purchase Date
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.purchase_date
                    ? moment(dataDetail?.financial_info?.purchase_date).format(pref_date)
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {unitCost?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle3'>
                  Cost Per Unit
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info !== null &&
                  dataDetail?.financial_info?.unit_cost !== 0 &&
                  dataDetail?.financial_info?.unit_cost !== null &&
                  dataDetail?.financial_info?.unit_cost?.code !== undefined
                    ? dataDetail?.financial_info?.unit_cost?.code === null
                      ? '-'
                      : `${dataDetail?.financial_info?.unit_cost?.code} ${numberWithCommas(
                          dataDetail?.financial_info?.unit_cost?.amount
                        )} `
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {totalQuantity?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle4'>
                  Total Quantity
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info !== null &&
                  dataDetail?.financial_info?.total_quantity !== 0 &&
                  dataDetail?.financial_info?.total_quantity !== null
                    ? dataDetail?.financial_info?.total_quantity || '-'
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {totalCost?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle5'>
                  Total Cost
                </div>
                <div className='text-dark'>
                  <span>{dataDetail?.financial_info?.unit_cost?.code || '-'}</span>
                  <span className='mx-1'>{numberWithCommas(result)}</span>
                </div>
              </div>
            </div>
          )}

          {deliveryOrderNumber?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle6'>
                  Delivery Order Number
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.delivery_order_number || '-'}
                </div>
              </div>
            </div>
          )}

          {invoiceNumber?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle7'>
                  Invoice Number
                </div>
                <div className='text-dark'>{dataDetail?.financial_info?.invoice_number || '-'}</div>
              </div>
            </div>
          )}

          {deliveryOrderDate?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle8'>
                  Delivery Order Date
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.delivery_order_date
                    ? moment(dataDetail?.financial_info?.delivery_order_date).format(pref_date)
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {invoiceDate?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle9'>
                  Invoice Date
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.invoice_date
                    ? moment(dataDetail?.financial_info?.invoice_date).format(pref_date)
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {deliveryActualDateReceived?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle10'>
                  Actual Date Received
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.actual_date_received
                    ? moment(dataDetail?.financial_info?.actual_date_received).format(pref_date)
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {chequeNumber?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle11'>
                  Cheque / Payment Reference Number
                </div>
                <div className='text-dark'>{dataDetail?.financial_info?.cheque_number || '-'}</div>
              </div>
            </div>
          )}

          {chequeDate?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle12'>
                  Cheque / Payment Reference Date
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.cheque_date
                    ? moment(dataDetail?.financial_info?.cheque_date).format(pref_date)
                    : '-'}
                </div>
              </div>
            </div>
          )}

          {voucherNumber?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle13'>
                  Voucher Number
                </div>
                <div className='text-dark'>{dataDetail?.financial_info?.voucher_number || '-'}</div>
              </div>
            </div>
          )}

          {voucherDate?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1' data-cy='financialTitle14'>
                  Voucher Date
                </div>
                <div className='text-dark'>
                  {dataDetail?.financial_info?.voucher_date
                    ? moment(dataDetail?.financial_info?.voucher_date).format(pref_date)
                    : '-'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

Financial = memo(Financial, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Financial
