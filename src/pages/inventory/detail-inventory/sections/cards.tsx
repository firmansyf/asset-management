import 'react-loading-skeleton/dist/skeleton.css'

import {FC, useEffect, useState} from 'react'

export const Cards: FC<any> = (props: any) => {
  const [data, setData] = useState<any>({})
  useEffect(() => {
    props?.data && setData(props?.data)
  }, [props?.data])
  return (
    <div className='row mt-2'>
      <div className='col-sm-6 col-md-3 col-xl-2 mb-5'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-4 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>INVENTORY ID</p>
            <span className='text-dark fw-bolder'>{data?.inventory_idno || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
