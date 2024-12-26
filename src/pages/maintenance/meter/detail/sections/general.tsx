import {ToastMessage} from '@components/toast-message'
import {PostReadingMeter} from '@pages/maintenance/Service'
import {FC, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'

let General: FC<any> = ({detail, reload, setReload}) => {
  const [data, setData] = useState<any>({})
  const [meter, setMeter] = useState<any>({})
  const [loadingMeter, setLoadingMeter] = useState<boolean>(false)

  useEffect(() => {
    detail && setData(detail)
  }, [detail])

  const configClass: any = {
    grid: 'col-md-6 my-3',
    body: 'bg-gray-100 p-2 rounded h-100',
  }

  const handleMeter = () => {
    if (data?.guid !== undefined) {
      setLoadingMeter(true)
      PostReadingMeter(data?.guid, {value: meter || 0})
        .then(() => {
          ToastMessage({type: 'success', message: `Meter reading ${detail?.name} added`})
          setLoadingMeter(false)
          setReload(reload + 1)
        })
        .catch(({response: {data}}: any) => {
          ToastMessage({type: 'error', message: data?.data?.fields?.value?.[0]})
          setLoadingMeter(false)
        })
    }
  }

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row mb-5'>
          <div className='col-md-7'>
            <div className='fw-bolder text-dark mb-1'>Meter Reading</div>
            <input
              type='number'
              className={configClass?.form}
              placeholder='Enter Meter Reading'
              onChange={({target}: any) => {
                const {value} = target || {}
                setMeter(value || 0)
              }}
            />
          </div>
          <div className='col-md-3'>
            <div className='fw-bolder text-dark mb-1'>&nbsp;</div>
            <Button
              className='btn-sm mt-1'
              type='button'
              form-id=''
              variant='primary'
              onClick={handleMeter}
            >
              {!loadingMeter && <span className='indicator-label'>Add</span>}
              {loadingMeter && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </Button>
          </div>
        </div>
        <div className='row'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Meter Name</div>
              <div className='text-dark'>{data?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Unit Measurement</div>
              <div className='text-dark'>{data?.unit_of_measurement || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Asset</div>
              <div className='text-dark'>{data?.asset?.name || '-'}</div>
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
                {data?.workers && data?.workers.length > 0
                  ? data?.workers.map(({name}: any) => name).join(', ')
                  : '-'}
              </div>
            </div>
          </div>
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
        </div>
      </div>
    </div>
  )
}

General = memo(General, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default General
