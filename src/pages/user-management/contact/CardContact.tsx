/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG, setColumn} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {contactExport, getContact, getContactColumn, getOptionsColumns} from '../redux/ContactCRUD'
import AddContact from './AddContact'
import {BulkDeleteContact} from './BulkDeleteContact'
import {DeleteContact} from './DeleteContact'
import {DetailContact} from './DetailContact'

const label: any = 'Contact'

type Props = {
  onDelete: any
  setShowModalContact: any
  setShowModalDetailContact: any
  setContactDetail: any
  reloadContact: any
  setShowModalConfirmBulk: any
  dataChecked: any
  setDataChecked: any
  page: any
  setPage: any
  setPageFrom: any
  totalPage: any
  setTotalPage: any
  resetKeyword: any
  setResetKeyword: any
}

const CardContact: FC<Props> = ({
  onDelete,
  setShowModalContact,
  setShowModalDetailContact,
  setContactDetail,
  reloadContact,
  setShowModalConfirmBulk,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
}) => {
  const navigate: any = useNavigate()

  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')

  const PermissionAdd: any = hasPermission('help-desk.contact.add') || false
  const PermissionView: any = hasPermission('help-desk.contact.view') || false
  const PermissionEdit: any = hasPermission('help-desk.contact.edit') || false
  const PermissionDelete: any = hasPermission('help-desk.contact.delete') || false
  const PermissionExport: any = hasPermission('help-desk.contact.export') || false
  const setupColumnRole: any = hasPermission('help-desk.contact.setup-column') || false

  const onExport = (e: any) => {
    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    contactExport({type: e, keyword, columns: fields})
      .then(
        ({
          data: {
            message,
            data: {url},
          },
        }: any) => {
          window.open(url, '_blank')
          ToastMessage({message, type: 'success'})
        }
      )
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setLimit(e)
    setDataChecked([])
  }

  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setContactDetail(e)
    setShowModalDetailContact(true)
  }

  const onEdit = (e: any) => {
    setContactDetail(e)
    setShowModalContact(true)
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

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onRender = (val: any) => ({
    phonenumber: val?.length > 0 ? <span>{`+${val || ''}`}</span> : '-',
  })

  const columnsQuery: any = useQuery({
    queryKey: ['getContactColumn'],
    queryFn: async () => {
      const res: any = await getContactColumn()
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header, is_filter, is_sortable}: any) => {
          let head: any = header
          const change: string = 'Checkbox '
          header === 'Checkbox' && (head = change)
          return {
            value,
            header: head,
            sort: is_sortable === 1 ? true : false,
            is_filter,
          }
        }
      )
      // eslint-disable-next-line sonar/no-reference-error
      const dataResult: any = setColumn(mapColumns)
      const columnsFilter: any = dataResult?.filter(({is_filter}: any) => is_filter === 1)
      return {columns: dataResult, columnsFilter}
    },
  })
  const {columns}: any = columnsQuery?.data || []

  const contactQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getContact',
      {
        columns,
        page,
        orderDir,
        orderCol,
        limit,
        keyword,
        reloadContact,
        filterAll,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const res: any = await getContact({
          page,
          orderDir,
          orderCol,
          limit,
          keyword,
          ...filters,
        })

        const {current_page, per_page, total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)

        const resData: any = res?.data?.data as never[]
        return matchColumns(resData, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataContact: any = contactQuery?.data || []

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }, [])

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
              path='/media/icons/duotone/General/Search.svg'
              className='svg-icon-3 position-absolute ms-3'
            />

            <Search
              bg='solid'
              onChange={onSearch}
              resetKeyword={resetKeyword}
              setResetKeyword={setResetKeyword}
            />

            <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
          </div>

          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              {dataChecked !== undefined && dataChecked?.length > 0 && (
                <button
                  type='button'
                  className='btn btn-sm btn-primary me-2'
                  onClick={() => setShowModalConfirmBulk(true)}
                >
                  <span className='indicator-label'>Delete Selected</span>
                </button>
              )}

              {PermissionAdd && (
                <button
                  type='button'
                  className='btn btn-sm btn-primary'
                  onClick={() => {
                    setShowModalContact(true)
                    setContactDetail(undefined)
                  }}
                >
                  + Add New {label || ''}
                </button>
              )}
            </div>

            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                  {setupColumnRole && (
                    <Dropdown.Item
                      href='#'
                      onClick={() => navigate('/user-management/contact-columns')}
                    >
                      Setup Columns
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <FilterColumns
          setPage={setPage}
          filterAll={filterAll}
          api={getOptionsColumns}
          onChange={setFilterAll}
        />
      </div>

      <div className='card-body'>
        <DataTable
          page={page}
          limit={limit}
          onEdit={onEdit}
          onSort={onSort}
          render={onRender}
          columns={columns}
          total={totalPage}
          data={dataContact}
          onDelete={onDelete}
          onDetail={onDetail}
          onChecked={onChecked}
          view={PermissionView}
          edit={PermissionEdit}
          del={PermissionDelete}
          bulk={PermissionDelete}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
          loading={!contactQuery?.isFetched || !columnsQuery?.isFetched}
        />
      </div>
    </div>
  )
}

let ContactPage: FC = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadTags, setReloadTags] = useState<number>(0)
  const [contactDetail, setContactDetail] = useState<any>()
  const [contactName, setContactName] = useState<string>('')
  const [contactGuid, setContactGuid] = useState<string>('')
  const [reloadContact, setReloadContact] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalContact, setShowModalContact] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalDetailContact, setShowModalDetailContact] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}

    setContactName(name || '')
    setContactGuid(guid || '')
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.CONTACT'})}
      </PageTitle>
      <CardContact
        page={page}
        setPage={setPage}
        onDelete={onDelete}
        totalPage={totalPage}
        dataChecked={dataChecked}
        setPageFrom={setPageFrom}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        reloadContact={reloadContact}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setContactDetail={setContactDetail}
        setShowModalContact={setShowModalContact}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        setShowModalDetailContact={setShowModalDetailContact}
      />

      <AddContact
        reloadTags={reloadTags}
        showModal={showModalContact}
        setReloadTags={setReloadTags}
        reloadContact={reloadContact}
        contactDetail={contactDetail}
        setShowModal={setShowModalContact}
        setReloadContact={setReloadContact}
      />

      <DeleteContact
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        showModal={showModal}
        totalPage={totalPage}
        contactName={contactName}
        contactGuid={contactGuid}
        reloadContact={reloadContact}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setShowModal={setShowModalConfirm}
        setReloadContact={setReloadContact}
      />

      <BulkDeleteContact
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        showModal={showModalBulk}
        dataChecked={dataChecked}
        reloadContact={reloadContact}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setReloadContact={setReloadContact}
        setShowModal={setShowModalConfirmBulk}
      />

      <DetailContact
        reloadContact={reloadContact}
        contactDetail={contactDetail}
        showModal={showModalDetailContact}
        setReloadContact={setReloadContact}
        setShowModal={setShowModalDetailContact}
      />
    </>
  )
}

ContactPage = memo(
  ContactPage,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default ContactPage
