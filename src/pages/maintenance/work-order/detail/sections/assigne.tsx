import {FC, memo, useEffect, useState} from 'react'

let Assigne: FC<any> = ({detail, dateCustom, _dateTimeCustom, validationViewDate}) => {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    detail && setData(detail)
  }, [detail])

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>Repeating Schedule</div>
            <div className='text-dark'>{data?.frequency !== null ? 'YES' : 'NO'}</div>
          </div>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>Frequency</div>
            {`${data?.frequency || ''} - ${
              data?.frequency_value !== undefined && data?.frequency_value !== null
                ? data?.frequency_value.join(', ')
                : ''
            }`}
          </div>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>Location</div>
            <div className='text-dark'>{data?.location?.name || '-'}</div>
          </div>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>Worker</div>
            <div className='text-dark'>
              {data?.worker?.guid !== null ? data?.worker?.name : '-'}
            </div>
          </div>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>Additional Worker</div>
            <div className='text-dark'>
              {data?.additional_worker &&
                data?.additional_worker.map(({name}: any, index: number) => {
                  return (
                    <span key={index} className='p-1 px-2 m-1 rounded bg-secondary word-break'>
                      {name || '-'}
                    </span>
                  )
                })}
            </div>
          </div>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>Team</div>
            <div className='text-dark'>{data?.team?.name || '-'}</div>
          </div>
          <div className='col-md-6 my-3'>
            <div className='fw-bolder text-dark mb-1'>End Recurring date</div>
            <div>
              {data?.end_recurring_date !== null && data?.end_recurring_date !== undefined
                ? validationViewDate(data?.end_recurring_date || '', dateCustom)
                : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Assigne = memo(Assigne, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Assigne
