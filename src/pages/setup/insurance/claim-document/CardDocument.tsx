import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'

import {getDocument} from './Service'

type Props = {
  onDelete: any
  deleteReload: any
  reloadDocument: any
  setDocumentDetail: any
  setShowModalDocument: any
  setShowModalDetail: any
}

const CardDocument: FC<Props> = ({
  onDelete,
  deleteReload,
  reloadDocument,
  setDocumentDetail,
  setShowModalDocument,
  setShowModalDetail,
}) => {
  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const columns: any = [
    {header: 'View', width: '20px'},
    {header: 'Type Of Peril', value: 'peril_name', sort: true},
    {header: 'Document Name', value: 'name', sort: true},
    {header: 'Mandatory', value: 'is_mandatory_document', sort: true},
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
    setDocumentDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setDocumentDetail(e)
    setShowModalDocument(true)
  }

  const perilsQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getDocumentClaim',
      {page, limit, keyword, orderDir, orderCol, reloadDocument, deleteReload},
    ],
    queryFn: async () => {
      const res: any = await getDocument({page, limit, keyword, orderDir, orderCol})
      const {total}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total)
      const dataResult: any = res?.data?.data?.map((doc: any) => {
        const {guid, name, peril, is_mandatory_document}: any = doc || {}
        const {name: namePeril}: any = peril || {}

        return {
          original: doc,
          view: 'view',
          guid: guid,
          peril: namePeril,
          name,
          mandatory: is_mandatory_document ? 'Yes' : 'No',
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
                data-cy='addDocument'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setDocumentDetail(undefined)
                  setShowModalDocument(true)
                }}
              >
                + Add Document
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
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
        />
      </div>
    </div>
  )
}

export {CardDocument}
