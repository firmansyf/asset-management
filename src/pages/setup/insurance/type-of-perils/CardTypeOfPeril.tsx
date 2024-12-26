import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'

import {getPeril} from './Service'

type Props = {
  onDelete: any
  deleteReload: any
  dataChecked: any
  setDataChecked: any
  reloadPeril: any
  setPerilDetail: any
  setShowModalPeril: any
  setShowModalDetail: any
}

const CardTypeOfPeril: FC<Props> = ({
  onDelete,
  deleteReload,
  setDataChecked,
  reloadPeril,
  setPerilDetail,
  setShowModalPeril,
  setShowModalDetail,
}) => {
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [meta, setMeta] = useState<any>({})

  const columns: any = [
    {header: 'View', width: '20px'},
    {header: 'Type Of Peril', value: 'name', sort: true},
    {header: 'Deductible Amount', value: 'deductible_amount', sort: true},
    {header: 'Description', value: 'description', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setPerilDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setPerilDetail(e)
    setShowModalPeril(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original} = ticked || {}
        const {guid} = original || {}
        ar_guid.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const perilsQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getPeril', {page, limit, keyword, orderDir, orderCol, reloadPeril, deleteReload}],
    queryFn: async () => {
      const res: any = await getPeril({page, limit, keyword, orderDir, orderCol})
      const {total}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total)
      const dataResult: any = res?.data?.data?.map((peril: any) => {
        const {guid, name, deductible_amount, description}: any = peril || {}
        return {
          original: peril,
          view: 'view',
          guid: guid,
          name,
          deductible_amount: deductible_amount || 0,
          description: description || '-',
          edit: 'Edit',
          delete: 'Delete',
        }
      })
      setTotalPerPage(dataResult?.length || 0)
      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const data: any = perilsQuery?.data || []
  const loading: any = !perilsQuery?.isFetched

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setResetKeyword(true)
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])
  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  return (
    <div className='card card-custom card-table'>
      <div className='card-table-header'>
        <div className='d-flex flex-wrap flex-stack'>
          <div className='d-flex align-items-center position-relative me-4 my-1'>
            <KTSVG
              className='svg-icon-3 position-absolute ms-3'
              path='/media/icons/duotone/General/Search.svg'
            />

            <Search
              bg='solid'
              onChange={onSearch}
              resetKeyword={resetKeyword}
              setResetKeyword={setResetKeyword}
            />
          </div>

          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              <button
                type='button'
                data-cy='addPerils'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setShowModalPeril(true)
                  setPerilDetail(undefined)
                }}
              >
                + Add New Peril
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='card-body'>
        <DataTable
          page={page}
          data={data}
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          loading={loading}
          total={totalPage}
          columns={columns}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
        />
      </div>
    </div>
  )
}

export {CardTypeOfPeril}
