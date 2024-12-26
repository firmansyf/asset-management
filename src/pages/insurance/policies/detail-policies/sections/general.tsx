import {numberWithCommas, preferenceDate, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'

let General: FC<any> = (props: any) => {
  const pref_date = preferenceDate()
  const pref_date_time = preferenceDateTime()
  const [data, setData] = useState<any>({})
  const [customField, setCustomField] = useState<any>([])

  useEffect(() => {
    props?.data && setData(props?.data)
    props?.data?.custom_fields && setCustomField(props?.data?.custom_fields)
  }, [props?.data, props?.data?.custom_fields])

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
              <div className='fw-bolder text-dark mb-1'>Insurance Policy Name</div>
              <div className='text-dark'>{data?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Description</div>
              <div className='text-dark'>{data?.description || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Insurer</div>
              <div className='text-dark'>{data?.email || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Contact Person</div>
              <div className='text-dark'>{data?.contact_person || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Email</div>
              <div className='text-dark'>{data?.email || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Phone Number</div>
              <div className='text-dark'>{data?.phone_number || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Policy No</div>
              <div className='text-dark'>{data?.policy_no || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Coverage</div>
              <div className='text-dark'>{data?.coverage || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Start Date</div>
              <div className='text-dark'>{moment(data?.start_date).format(pref_date) || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>End Date</div>
              <div className='text-dark'>{moment(data?.end_date).format(pref_date) || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Limit</div>
              <div className='text-dark'>
                {data?.currency_limit?.currency} {numberWithCommas(data?.limit) || '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Premium</div>
              <div className='text-dark'>
                {data?.currency_premium?.currency} {numberWithCommas(data?.premium) || '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Deductible</div>
              <div className='text-dark'>
                {data?.currency_deductible?.currency} {numberWithCommas(data?.deductible) || '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Status</div>
              <div className='text-dark'>
                {(data?.is_active === 0 || data?.is_active === null
                  ? 'Inactive'
                  : data?.is_active_value) || '-'}
              </div>
            </div>
          </div>
        </div>

        <div className='row'>
          {customField?.map((item: any, index: any) => {
            if (item?.element_type === 'checkbox' && item?.value) {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {item?.value?.map((arr: any, index: any) => {
                        if (item?.options?.filter(({key}: any) => key === arr) !== undefined) {
                          return (
                            item?.options?.filter(({key}: any) => key === arr)?.[0]?.value +
                            (item?.value?.length !== index + 1 ? ', ' : '')
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                </div>
              )
            } else if (['dropdown', 'radio'].includes(item?.element_type)) {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {item?.options?.filter(({key}: any) => key === item?.value) !== undefined &&
                      item?.options?.filter(({key}: any) => key === item?.value)?.length > 0
                        ? item?.options?.filter(({key}: any) => key === item?.value)?.[0]?.value
                        : '-'}
                    </div>
                  </div>
                </div>
              )
            } else if (item?.element_type === 'currency') {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {(item?.value?.code || '') + //preference?.currency
                        ' ' +
                        (item?.value === null ? '-' : numberWithCommas(item?.value?.amount) || '')}
                    </div>
                  </div>
                </div>
              )
            } else if (item?.element_type === 'gps') {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {((item?.value?.lat !== undefined ? item?.value?.lat : '-') || '-') +
                        ((item?.value?.lng !== undefined ? ', ' + item?.value?.lng : '') || '')}
                    </div>
                  </div>
                </div>
              )
            } else if (item?.element_type === 'date') {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {item?.value ? moment(item?.value).format(pref_date) : '-'}
                    </div>
                  </div>
                </div>
              )
            } else if (item?.element_type === 'datetime') {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {item?.value ? moment(item?.value).format(pref_date_time) : '-'}
                    </div>
                  </div>
                </div>
              )
            } else if (item?.element_type === 'numeric') {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>
                      {item?.value !== null ? numberWithCommas(item?.value, false) : '-'}
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                <div className={configClass.grid} key={index}>
                  <div className={configClass.body}>
                    <div className='fw-bolder text-dark mb-1'>{item?.name || '-'}</div>
                    <div className='text-dark'>{item?.value || '-'}</div>
                  </div>
                </div>
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

General = memo(General)
export {General}
