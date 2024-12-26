import {configClass} from '@helpers'
import clsx from 'clsx'
import {FC, useState} from 'react'

type Props = {
  // onChangeLimit: any,
  limit: any
  total: any
  onChangeLimit?: any
  onChangePage?: any
}

const PaginationDatatable: FC<Props> = ({total, limit, onChangePage, onChangeLimit}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const end = currentPage * limit
  const start = currentPage === 1 ? 1 : end + 1 - limit
  const ar_length = Math.ceil(total / limit)
  const nextPage = ar_length
  const arrayPage = Array.from({length: ar_length}, (_x: any, i: any) => i + 1)
  let arrayPageShow: any = []
  if (ar_length > 3) {
    if (ar_length === 4) {
      if (currentPage === 2 || currentPage === 3) {
        arrayPageShow = [currentPage - 1, currentPage, currentPage + 1]
      }
      if (currentPage === 4) {
        arrayPageShow = [currentPage - 2, currentPage - 1, currentPage]
      }
      if (currentPage === 1) {
        arrayPageShow = [currentPage, currentPage + 1, currentPage + 2]
      }
    } else {
      if (ar_length - currentPage === 0) {
        arrayPageShow = [currentPage - 2, currentPage - 1, currentPage]
      } else {
        if (currentPage === 1) {
          arrayPageShow = [currentPage, currentPage + 1, currentPage + 2]
        } else {
          arrayPageShow = [currentPage - 1, currentPage, currentPage + 1]
        }
      }
    }
  } else {
    arrayPageShow = arrayPage
  }

  return (
    <div className='d-flex flex-stack flex-wrap pt-10'>
      <div className='fs-6 fw-bold text-gray-700 d-flex'>
        <select
          className={configClass?.select}
          name='country'
          style={{width: '80px', marginRight: '10px'}}
          onChange={({target: {value}}) => {
            onChangeLimit(parseInt(value))
          }}
        >
          <option value='10'>10</option>
          <option value='25'>25</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
          <option value='250'>250</option>
        </select>
        <span style={{position: 'relative', top: '5px'}}>
          Showing {start} to {total < end ? total.toString() : end} of {total.toString()} entries
        </span>
      </div>
      <ul className='pagination'>
        <li className='page-item previous'>
          <a
            href='#'
            // hidden={currentPage <= 1}
            onClick={(ev: any) => {
              ev.preventDefault()
              onChangePage(1)
              setCurrentPage(1)
            }}
            className='page-link'
          >
            <i className='previous'></i>
          </a>
        </li>
        {arrayPageShow.map((e: any, index: number) => {
          return (
            <li key={index} className={clsx('page-item', {active: currentPage === e})}>
              <a
                href='#'
                onClick={(ev: any) => {
                  ev.preventDefault()
                  onChangePage(e)
                  setCurrentPage(e)
                }}
                className='page-link'
              >
                {e}
              </a>
            </li>
          )
        })}
        <li className='page-item next'>
          <a
            href='#'
            // hidden={ar_length - currentPage <= 1}
            onClick={(ev: any) => {
              ev.preventDefault()
              onChangePage(nextPage)
              setCurrentPage(nextPage)
            }}
            className='page-link'
          >
            <i className='next'></i>
          </a>
        </li>
      </ul>
    </div>
  )
}

export {PaginationDatatable}
