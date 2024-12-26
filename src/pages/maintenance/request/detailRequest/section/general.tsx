import {preferenceDate, validationViewDate} from '@helpers'
import {FC, useEffect, useState} from 'react'

const General: FC<any> = (props: any) => {
  const pref_date: any = preferenceDate()

  const [data, setData] = useState<any>({})

  const {additional_worker}: any = data || {}

  useEffect(() => {
    props?.data && setData(props?.data)
  }, [props?.data])

  const configClass: any = {
    grid: 'col-md-6 my-3',
    body: 'bg-gray-100 p-2 mb-1 rounded h-100',
  }

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row' data-cy='detail-container'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Request Description</div>
              <div className='text-dark'>{data?.description || ' - '}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Request Title</div>
              <div className='text-dark'>{data?.title || ' - '}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'> Worker </div>
              <div className='text-dark'>{data?.worker_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Additional Worker</div>
              <div className='fw-bolder mt-2'>
                {additional_worker && additional_worker?.length > 0
                  ? additional_worker?.map(({worker_name}: any, index: number) => {
                      return (
                        <span className='p-1 px-2 m-1 rounded bg-secondary word-break' key={index}>
                          {worker_name || '-'}
                        </span>
                      )
                    })
                  : '-'}
              </div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Due Date</div>
              <div className='text-dark'>
                {data?.due_date !== null ? validationViewDate(data?.due_date, pref_date) : '-'}
              </div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Duration (Minute)</div>
              <div className='text-dark'>
                {data?.duration !== null ? `${data?.duration} Minute` : '-'}
              </div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Asset by Location</div>
              <div className='text-dark'>{data?.asset_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Work Orders Category</div>
              <div className='text-dark'>{data?.category_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Location</div>
              <div className='text-dark'>{data?.location_name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Priority</div>
              <div className='text-dark'>{data?.priority_name || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {General}
