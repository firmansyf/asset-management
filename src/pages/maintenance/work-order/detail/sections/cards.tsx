import {FC, memo, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

let Cards: FC<any> = ({detail}) => {
  const [data, setData] = useState<any>({})
  useEffect(() => {
    detail && setData(detail)
  }, [detail])
  return (
    <div className='row'>
      <div className='col-sm-6 col-md-3 col-xl-2 mb-5'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-4 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>WORK ORDER ID</p>
            <span className='text-dark fw-bolder'>{data?.wo_id}</span>
          </div>
        </div>
      </div>
      <div className='col-sm-6 col-md-3 col-xl-2 mb-5'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-4 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>ASSET</p>
            <span className='text-dark'>
              <Link target={'_blank'} to={`/asset-management/detail/${data?.asset?.guid}`}>
                {data?.asset?.name}
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div className='col-sm-6 col-md-3 col-xl-2 mb-5'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-4 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>TOTAL TIME</p>
            <span className='text-dark fw-bolder'>{data?.time_log?.duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Cards = memo(Cards, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Cards
