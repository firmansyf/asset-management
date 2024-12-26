import {configClass as classes} from '@helpers'
import {FC, useEffect, useState} from 'react'

type Props = {
  // onChangeLimit: any,
  limit: any
  total: any
  page?: any
  onChangeLimit?: any
  onChangePage?: any
  isPagination?: any
}

const Generate: any = (n: any, f: any) => {
  return Array(n)
    ?.fill('')
    ?.map((_v: any, i: any) => (f || 1) + i)
}

const PaginationDatatable: FC<Props> = ({
  total,
  page,
  limit,
  onChangePage,
  onChangeLimit,
  isPagination,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1)

  useEffect(() => {
    setCurrentPage(Number(page))
  }, [page])

  const end: any = currentPage * (limit || 1)
  const start: any = currentPage === 1 ? 1 : end + 1 - (limit || 1)
  const lastPage: any = Math.ceil(total / (limit || 1))

  const pageChange: any = (key: any) => {
    onChangePage(key)
    setCurrentPage(key)
  }

  const configClass: any = {
    btn: 'btn btn-icon d-flex align-items-center justify-content-center overflow-hidden radius-50 fs-7 fw-boldest w-30px h-30px',
    active: 'btn-primary',
    inActive: 'btn-light',
    select: `${classes?.select} bg-white border border-gray-200`,
  }

  return (
    <div className='row align-items-center border-top border-2'>
      {isPagination && (
        <>
          <div className='fs-6 fw-bold text-gray-700 col-auto pt-5'>
            <select
              className={configClass?.select}
              name='number_of_page'
              data-cy-='numberOfPage'
              style={{width: '80px', marginRight: '10px'}}
              onChange={({target: {value}}) => {
                onChangeLimit(parseInt(value))
                setCurrentPage(1)
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
              <option value='250'>250</option>
            </select>
          </div>
          <div className={`col pt-5 ${lastPage === 1 ? 'd-none' : 'd-block'}`}>
            <div className='row flex-nowrap m-0 justify-content-end'>
              {((lastPage > 10 && currentPage >= 7) || (lastPage === 11 && currentPage === 6)) && (
                <>
                  <div className='col-auto px-1'>
                    <button
                      type='button'
                      onClick={() => pageChange(1)}
                      className={`${configClass?.btn} ${
                        currentPage === 1 ? configClass?.active : configClass?.inActive
                      }`}
                    >
                      1
                    </button>
                  </div>
                  <div className='col-auto px-1'>
                    <button
                      type='button'
                      onClick={() => pageChange(2)}
                      className={`${configClass?.btn} ${
                        currentPage === 2 ? configClass?.active : configClass?.inActive
                      }`}
                    >
                      2
                    </button>
                  </div>
                  <div className='col-auto px-0'>
                    <span className={`${configClass?.btn} overflow-hidden fs-7 fw-bolder`}>
                      ...
                    </span>
                  </div>
                </>
              )}
              {lastPage > 10 && currentPage >= 7 && currentPage < lastPage - 5
                ? Generate(7, currentPage - 3)?.map((key: any) => (
                    <div className='col-auto px-1' key={key}>
                      <button
                        type='button'
                        onClick={() => pageChange(key)}
                        className={`${configClass?.btn} ${
                          currentPage === key ? configClass?.active : configClass?.inActive
                        }`}
                      >
                        {key}
                      </button>
                    </div>
                  ))
                : lastPage > 10 && currentPage >= lastPage - 5
                ? Generate(5, lastPage - 6)?.map((key: any) => (
                    <div className='col-auto px-1' key={key}>
                      <button
                        type='button'
                        onClick={() => pageChange(key)}
                        className={`${configClass?.btn} ${
                          currentPage === key ? configClass?.active : configClass?.inActive
                        }`}
                      >
                        {key}
                      </button>
                    </div>
                  ))
                : Generate(lastPage > 10 ? 7 : lastPage)?.map((key: any) => (
                    <div className='col-auto px-1' key={key}>
                      <button
                        type='button'
                        onClick={() => pageChange(key)}
                        className={`${configClass?.btn} ${
                          currentPage === key ? configClass?.active : configClass?.inActive
                        }`}
                      >
                        {key}
                      </button>
                    </div>
                  ))}
              {lastPage > 10 && (
                <>
                  {currentPage < lastPage - 5 && (
                    <div className='col-auto px-0'>
                      <span className={`${configClass?.btn} overflow-hidden fs-7 fw-bolder`}>
                        ...
                      </span>
                    </div>
                  )}
                  <div className='col-auto px-1'>
                    <button
                      type='button'
                      onClick={() => pageChange(lastPage - 1)}
                      className={`${configClass?.btn} ${
                        currentPage === lastPage - 1 ? configClass?.active : configClass?.inActive
                      }`}
                    >
                      {lastPage - 1}
                    </button>
                  </div>
                  <div className='col-auto px-1'>
                    <button
                      type='button'
                      onClick={() => pageChange(lastPage)}
                      className={`${configClass?.btn} ${
                        currentPage === lastPage ? configClass?.active : configClass?.inActive
                      }`}
                    >
                      {lastPage}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <div className='col-12'>
        <span className='text-gray-700' style={{position: 'relative', top: '5px'}}>
          Showing <span className='fw-bolder text-dark'>{start}</span> to{' '}
          <span className='fw-bolder text-dark'>{total < end ? total?.toString() : end}</span> of{' '}
          <span className='fw-bolder text-dark'>{total?.toString() || 0}</span> entries
        </span>
      </div>
    </div>
  )
}

export {PaginationDatatable}
