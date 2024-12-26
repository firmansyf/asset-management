import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddBackupApprover} from './AddBackupApprover'
import {DetailBackupApprover} from './DetailBackupApprover'
import {deleteApprover, getApprover} from './Service'

type Props = {
  onDelete: any
  deleteReload: any
  reloadApprover: any
  setApproverDetail: any
  setShowModalApprover: any
  setShowModalApproverDetail: any
}

const CardDocument: FC<Props> = ({
  onDelete,
  deleteReload,
  reloadApprover,
  setApproverDetail,
  setShowModalApprover,
  setShowModalApproverDetail,
}) => {
  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [keyword, setKeyword] = useState<any>()
  const [limit, setLimit] = useState<number>(10)
  const [, setOrderCol] = useState<string>('name')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const columns: any = [
    {header: 'View', width: '20px'},
    {header: 'Is Active', value: 'name'},
    {header: 'Assigned Date', value: 'description'},
    {header: 'Username', value: 'description'},
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

  const onDetail = (e: any) => {
    setApproverDetail(e)
    setShowModalApproverDetail(true)
  }

  const onEdit = (e: any) => {
    setApproverDetail(e)
    setShowModalApprover(true)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const approverQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getApprover', {page, limit, keyword, reloadApprover, deleteReload}],
    queryFn: async () => {
      const res: any = await getApprover({page, limit, keyword})
      const {total}: any = res?.data?.meta || {}
      setMeta(res?.data?.meta || {})
      setTotalPage(total)
      const dataResult: any = res?.data?.data?.map((res: any) => {
        const {guid, assigned_end_date, approver, is_active}: any = res || {}
        const {name: approverName}: any = approver || {}

        return {
          original: res,
          view: 'view',
          is_active_approver: is_active,
          guid: guid,
          assigned_end_date: assigned_end_date || '-',
          approver: approverName || '-',
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
  const data: any = approverQuery?.data || []
  const loading: any = !approverQuery?.isFetched

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
                data-cy='addBackup'
                className='btn btn-sm btn-primary'
                onClick={() => {
                  setShowModalApprover(true)
                  setApproverDetail(undefined)
                }}
              >
                + Add New Backup Approver
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
          total={totalPage}
          loading={loading}
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

const BackupApprover: FC = () => {
  const intl: any = useIntl()

  const [name, setName] = useState<string>('')
  const [guid, setGuid] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [approverDetail, setApproverDetail] = useState<any>()
  const [deleteReload, setReloadDelete] = useState<number>(0)
  const [reloadApprover, setreloadApprover] = useState<number>(0)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBackupApprover, setShowModalApprover] = useState<boolean>(false)
  const [showModalBackupApproverDetail, setShowModalApproverDetail] = useState<boolean>(false)

  const msg_alert: any = [
    'Are you sure you want to delete this backup approver ',
    <strong key='peril_name'>{name || '-'}</strong>,
    '?',
  ]

  const confirmDelete = useCallback(() => {
    setLoading(true)
    deleteApprover(guid).then(({data: {message}}: any) => {
      setTimeout(() => {
        setLoading(false)
        setShowModalConfirm(false)
        setReloadDelete(deleteReload + 1)
        ToastMessage({message, type: 'error'})
      }, 1000)
    })
  }, [guid, deleteReload])

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setName(name || '')
    setGuid(guid || '')
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.INSURANCE.APRROVER'})}
      </PageTitle>
      <CardDocument
        onDelete={onDelete}
        deleteReload={deleteReload}
        reloadApprover={reloadApprover}
        setApproverDetail={setApproverDetail}
        setShowModalApprover={setShowModalApprover}
        setShowModalApproverDetail={setShowModalApproverDetail}
      />

      <AddBackupApprover
        detail={approverDetail}
        reload={reloadApprover}
        setReload={setreloadApprover}
        showModal={showModalBackupApprover}
        setShowModal={setShowModalApprover}
      />

      <DetailBackupApprover
        detail={approverDetail}
        showModal={showModalBackupApproverDetail}
        setShowModal={setShowModalApproverDetail}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Backup Approver'}
        onConfirm={() => confirmDelete()}
        setShowModal={setShowModalConfirm}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

export default BackupApprover
