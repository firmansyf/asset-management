import {numberWithCommas, preferenceDate, preferenceDateTime, validationViewDate} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'

const GeneralCode: FC<any> = ({detail}) => {
  const [data, setData] = useState<any>({})
  const pref_date = preferenceDate()
  const pref_date_time = preferenceDateTime()

  useEffect(() => {
    detail && setData(detail)
  }, [detail])

  const estimation = (duration: any) => {
    const {day, hour, minute} = duration || {}
    let res = 0
    if (duration) {
      res = res + day * 144
      res = res + hour * 60
      res = res + minute
    }
    return duration?.minute !== undefined ? res : duration || '-'
  }

  const configClass: any = {
    grid: 'col-md-6 my-3',
    body: 'bg-gray-100 p-2 rounded h-100',
  }

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Work Order Name</div>
              <div className='text-dark'>{data?.wo_title || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Work Order Description</div>
              <div className='text-dark'>{data?.description || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Priority</div>
              <div className='text-dark'>{data?.maintenance_priority?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Start Date</div>
              <div>
                {data?.manual_started_at !== null && data?.manual_started_at !== undefined
                  ? validationViewDate(data?.manual_started_at, pref_date)
                  : data?.start_date !== null && data?.start_date !== undefined
                  ? validationViewDate(data?.start_date, pref_date)
                  : '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>End Date</div>
              <div>
                {data?.manual_ended_at !== null && data?.manual_ended_at !== undefined
                  ? validationViewDate(data?.manual_ended_at, pref_date)
                  : data?.end_date !== null && data?.end_date !== undefined
                  ? validationViewDate(data?.end_date, pref_date)
                  : '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Due Date</div>
              <div>
                {data?.duedate !== null && data?.duedate !== undefined
                  ? validationViewDate(data?.duedate || '', pref_date)
                  : '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Estimate Duration (Minutes)</div>
              <div className='text-dark'>{estimation(data?.duration)}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'> Work Orders Category</div>
              <div className='text-dark'>{data?.maintenance_type?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Purchase Order</div>
              <div className='text-dark'>{data?.po_number || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Status</div>
              <div className='text-dark'>{data?.status?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Created By</div>
              <div className='text-dark'>{data?.created_by?.name || '-'}</div>
            </div>
          </div>
          {/* assignee */}
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Repeating Schedule</div>
              <div className='text-dark'>{data?.frequency !== null ? 'YES' : 'NO'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Frequency</div>
              <div className='text-dark'>
                {`${data?.frequency || ''} - ${
                  data?.frequency_value !== undefined && data?.frequency_value !== null
                    ? data?.frequency_value.join(', ')
                    : ''
                }`}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Location</div>
              <div className='text-dark'>{data?.location?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Worker</div>
              <div className='text-dark'>
                {data?.worker?.guid !== null ? data?.worker?.name : '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Additional Worker</div>
              <div className='text-dark'>
                {data?.additional_worker && data?.additional_worker.length > 0
                  ? data?.additional_worker.map(({name}: any) => name).join(', ')
                  : '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>End Recurring date</div>
              <div className='text-dark'>{data?.end_recurring_date || '-'}</div>
            </div>
          </div>
          {data?.custom_fields?.length > 0 &&
            data?.custom_fields?.map((custom: any, index: any) => (
              <div className={configClass.grid} key={index}>
                <div className={configClass.body}>
                  <div className='fw-bolder text-dark mb-1'>{custom.name}</div>
                  <div
                    className='text-dark'
                    data-cy={`${custom?.name?.split(' ').join('-')}-value`}
                  >
                    {custom?.value ? (
                      <>
                        {![
                          'dropdown',
                          'radio',
                          'checkbox',
                          'currency',
                          'date',
                          'datetime',
                          'gps',
                          'numeric',
                        ].includes(custom?.element_type) && custom.value}
                        {/* { custom.element_type === 'date' &&  validationViewDate((custom?.value || ''), preference?.date_format) } */}
                        {custom.element_type === 'date' &&
                          (custom?.value ? moment(custom?.value).format(pref_date) : '-')}
                        {custom?.element_type === 'datetime' &&
                          (custom?.value ? moment(custom?.value).format(pref_date_time) : '-')}
                        {custom?.element_type === 'currency' &&
                          (custom?.value?.code || '') +
                            ' ' +
                            numberWithCommas(custom?.value?.amount)}
                        {custom.element_type === 'numeric' &&
                          numberWithCommas(custom?.value, false)}
                        {custom?.element_type === 'checkbox' &&
                          custom?.options
                            ?.filter((filter: any) => custom?.value.includes(filter.key))
                            .map((m: any) => m?.value)
                            .join(', ')}
                        {['dropdown', 'radio'].includes(custom.element_type) &&
                          custom.options.find((find: any) => find.key === custom?.value)?.value}
                        {custom.element_type === 'gps' &&
                          `Long : ${custom?.value?.lat}, Lat : ${custom?.value?.lng}`}
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

const General = memo(
  GeneralCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default General
