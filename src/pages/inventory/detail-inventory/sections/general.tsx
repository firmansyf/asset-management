import {numberWithCommas, preferenceDate, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'

export const General: FC<any> = (props: any) => {
  const pref_date_time: any = preferenceDateTime()
  const pref_date: any = preferenceDate()
  const [data, setData] = useState<any>({})
  const [detailCustomFileds, setDetailCustomFileds] = useState<any>([])

  useEffect(() => {
    props?.data && setData(props?.data)
    setDetailCustomFileds(props?.data?.custom_fields)
  }, [props?.data])

  const configClass: any = {
    grid: 'col-md-6 my-3',
    body: 'bg-gray-100 p-2 rounded h-100',
  }

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row' data-cy='detail-container'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Default Location</div>
              <div className='text-dark'>{data?.location_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Total Quantity</div>
              <div className='text-dark'>{data?.total_quantity || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Inventory Identification Number</div>
              <div className='text-dark'>{data?.inventory_identification_number || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Supplier</div>
              <div className='text-dark'>{data?.supplier_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Product Model Number</div>
              <div className='text-dark'>{data?.product_model || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Low Stock Threshold</div>
              <div className='text-dark'>{data?.low_stock_threshold || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Category</div>
              <div className='text-dark'>{data?.category_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Remove Stock Price</div>
              <div className='text-dark'>
                {data?.currency_price_remove || ''}{' '}
                {numberWithCommas(data?.price_for_remove) || '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Add Stock Price</div>
              <div className='text-dark'>
                {data?.currency_price_add || ''} {numberWithCommas(data?.price_for_add) || '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Description</div>
              <div className='text-dark'>{data?.description || '-'}</div>
            </div>
          </div>

          {detailCustomFileds &&
            detailCustomFileds?.map((custom: any, index: any) => (
              <div className={configClass.grid} key={index}>
                <div className={configClass.body}>
                  <div className='fw-bolder text-dark mb-1'>{custom?.name}</div>
                  <div className='text-dark'>
                    {custom?.element_type === 'checkbox'
                      ? custom?.value
                        ? custom?.options
                            ?.filter((filter: any) => custom?.value?.includes(filter.key))
                            ?.map((m: any) => m.value)
                            ?.join(', ')
                        : '-'
                      : custom?.element_type === 'dropdown' || custom?.element_type === 'radio'
                      ? custom?.value
                        ? custom?.options.find((find: any) => find.key === custom?.value).value
                        : '-'
                      : custom?.element_type === 'currency'
                      ? custom?.value
                        ? `${custom?.value?.code} ${numberWithCommas(custom?.value?.amount)}`
                        : '-'
                      : custom?.element_type === 'gps'
                      ? custom?.value
                        ? `${custom?.value?.lat} ${custom?.value?.lng}`
                        : '-'
                      : custom?.element_type === 'date'
                      ? custom?.value
                        ? moment(custom?.value).format(pref_date)
                        : '-'
                      : custom?.element_type === 'datetime'
                      ? custom?.value
                        ? moment(custom?.value).format(pref_date_time)
                        : '-'
                      : custom?.value || '-'}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
