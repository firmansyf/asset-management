import {FC, memo, useEffect, useState} from 'react'
let Assignee: FC<any> = (props: any) => {
  const [data, setData] = useState<any>({})
  useEffect(() => {
    props?.data && setData(props?.data)
  }, [props?.data])
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
              <div className='fw-bolder text-dark mb-1'>Location</div>
              <div className='text-dark'>{data?.location?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Sub Location</div>
              <div className='text-dark'>{data?.location_sub?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Category</div>
              <div className='text-dark'>{data?.category?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Type</div>
              <div className='text-dark'>{data?.type?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Company</div>
              <div className='text-dark'>{data?.owner_company?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Department</div>
              <div className='text-dark'>{data?.owner_company_department?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Assigned User or Employee</div>
              <div className='text-dark'>{data?.assign_to?.name || '-'}</div>
            </div>
          </div>
          {/* <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Assigned Employee</div>
              <div className='text-dark'>{data?.assigned_employee?.name || '-'}</div>
            </div>
          </div>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Assigned User</div>
              <div className='text-dark'>{data?.assigned_user?.name || '-'}</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

Assignee = memo(Assignee, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Assignee
