import {FC} from 'react'

const DetailInsurance: FC<any> = ({detail}) => {
  const {
    tm,
    tm_super1,
    tm_super2,
    re,
    re_super1,
    re_super2,
    re_digital,
    digital_super1,
    digital_super2,
  }: any = detail || {}
  const configClass: any = {
    grid: 'col-md-6 my-3',
    body: 'bg-gray-100 p-2 rounded',
  }

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`Territory Manager`}</div>
              <div className='text-dark'>{tm?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`Regional Engineer`}</div>
              <div className='text-dark'>{re?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`TM’s Superior 1`}</div>
              <div className='text-dark'>{tm_super1?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`RE’s Superior 1`}</div>
              <div className='text-dark'>{re_super1?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`TM’s Superior 2`}</div>
              <div className='text-dark'>{tm_super2?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`RE’s Superior 2`}</div>
              <div className='text-dark'>{re_super2?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`RE Digital`}</div>
              <div className='text-dark'>{re_digital?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`Digital Superior 1`}</div>
              <div className='text-dark'>{digital_super1?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>{`Digital Superior 2`}</div>
              <div className='text-dark'>{digital_super2?.name || '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {DetailInsurance}
