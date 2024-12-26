/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {
  errorValidation,
  guidBulkChecked,
  hasPermission,
  KTSVG,
  preferenceDate,
  preferenceDateTime,
  replaceHTMLEntity,
  setColumn,
} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getTags} from '@pages/help-desk/tags/core/service'
import {
  deleteTicket,
  getDatabaseTicket,
  getListFilter,
  getOptionsColumns,
  getTicketColumn,
  getTicketDetail,
  getTickets,
  ticketExport,
} from '@pages/help-desk/ticket/Service'
import AddTicketType from '@pages/help-desk/ticket-type/AddEditTicketType'
import AddContact from '@pages/user-management/contact/AddContact'
import {keyBy, mapValues} from 'lodash'
import moment from 'moment'
import {FC, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import AddEditTicket from './form/AddEditTicket'
import TicketBulkDelete from './TicketBulkDelete'
import ValidationSchema from './ValidationSchema'

const Tickets: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDate()
  const pref_date_time: any = preferenceDateTime()
  const params: any = new URLSearchParams(location?.search)
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)

  const {feature}: any = preferenceStore || {}
  const typeParam: any = params.get('type_name') || ''
  const quickParam: any = params.get('quick_filter') || ''

  const [data, setData] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [columns, setColumns] = useState<any>([])
  const [dataTags, setDataTag] = useState<any>([])
  const [keyword, setKeyword] = useState<string>('')
  const [typeDetail, setTypeDetail] = useState<any>()
  const [ticketName, setTicketName] = useState<any>()
  const [filterAll, setFilterAll] = useState<any>({})
  const [checkType, setCheckType] = useState<any>([])
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [sticketGuid, setTicketGuid] = useState<any>()
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [reloadTags, setReloadTags] = useState<number>(0)
  const [reloadType, setReloadType] = useState<number>(0)
  const [detailTicket, setDetailTicket] = useState<any>()
  const [ticketSchema, setTicketSchema] = useState<any>([])
  const [contactDetail, setContactDetail] = useState<any>()
  const [checkPriority, setCheckPriority] = useState<any>([])
  const [reloadTicket, setReloadTicket] = useState<number>(0)
  const [orderCol, setOrderCol] = useState<string>('ticket_id')
  const [reloadContact, setReloadContact] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [quickFilterData, setQuickFilterData] = useState<any>(null)
  const [showModalType, setShowModalType] = useState<boolean>(false)
  const [quickFilterColumn, setQuickFilterColumn] = useState<any>([])
  const [pagePermission, setPagePermission] = useState<boolean>(true)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [showModalContact, setShowModalContact] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [otherReportChanel, setOtherReportChanel] = useState<boolean>(false)

  const PermissionAdd: any = hasPermission('help-desk.ticket.add') || false
  const PermissionView: any = hasPermission('help-desk.ticket.view') || false
  const PermissionEdit: any = hasPermission('help-desk.ticket.edit') || false
  const PermissionDelete: any = hasPermission('help-desk.ticket.delete') || false
  const PermissionExport: any = hasPermission('help-desk.ticket.export') || false
  const PermissionSetup: any = hasPermission('help-desk.ticket.setup-column') || false

  const dataFilterParams: any = useMemo(() => {
    const filterParams2: any = {}
    return filterParams2
  }, [])

  const onExport = (e: any) => {
    let filters: any = filterAll?.child || {}
    if (quickFilterData !== null) {
      filters = {...filters, quick_filter: quickFilterData || ''}
    } else {
      filters = {...filters, 'filter[is_spam]': 0, 'filter[is_archive]': 0}
    }

    const fields: any = columns
      ?.filter(({value}: any) => value)
      ?.map(({value}: any) => value)
      ?.join()

    ticketExport({type: e, keyword, columns: fields, ...filters})
      .then(({data: {message, data}}: any) => {
        const {url}: any = data || {}
        window.open(url, '_blank')
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onDetail = (e: any) => {
    const {guid}: any = e || {}
    navigate(`/help-desk/ticket/detail/${guid || ''}`)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e || ''}*` : '')
  }

  const onDelete = (e: any) => {
    const {guid, name}: any = e || {}
    setTicketGuid(guid || '')
    setTicketName(name || '')
    setShowModalDelete(true)
  }

  const confirmDeleteTicket = () => {
    setLoading(true)
    deleteTicket(sticketGuid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalDelete(false)
          const total_data_page: number = totalPage - pageFrom
          const thisPage: any = page
          if (total_data_page - 1 <= 0) {
            if (thisPage > 1) {
              setPage(thisPage - 1)
            } else {
              setPage(thisPage)
              setResetKeyword(true)
            }
          } else {
            setPage(thisPage)
          }

          setDataChecked([])
          setReloadTicket(reloadTicket + 1)
          ToastMessage({type: 'success', message})
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response || {}
        ToastMessage({type: 'error', message})
      })
  }

  const onEdit = (e: any) => {
    const {guid}: any = e || {}
    guid &&
      getTicketDetail(guid).then(({data: {data: res}}: any) => {
        setShowModalAdd(true)
        setDetailTicket(res || {})
      })
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const changeQuickFilter = (name: any) => {
    setQuickFilterData(name)
    let filterParams3: any = ''
    if (filterAll?.child !== undefined && Object.keys(filterAll?.child || {})?.length !== 0) {
      Object.entries(filterAll?.child || {})?.forEach((m: any) => {
        if (m?.[1] !== '') {
          filterParams3 = `${filterParams3 === '' ? '?' : '&'}${m?.[0]}=${m?.[1]}`
        }
      })
    }

    if (name !== null) {
      filterParams3 =
        filterParams3 + `${filterParams3 === '' ? '?' : '&'}filter[quick_filter]=${name || ''}`
    }

    navigate(`/help-desk/ticket/${filterParams3}`)
  }

  const onCangePage = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const statusNameValue: any = (val: any) => {
    switch (val) {
      case 'To Do':
        return <span className='badge badge-light-primary'>{val || ''}</span>
      case 'Pending Approval':
        return <span className='badge badge-light-warning'>{val || ''}</span>
      case 'in Progress':
        return <span className='badge badge-light-info'>{val || ''}</span>
      case 'Done':
        return <span className='badge badge-light-success'>{val || ''}</span>
      case 'Reject':
        return <span className='badge badge-light-danger'>{val} || ''</span>
      case 'reject':
        return <span className='badge badge-light-danger'>{val || ''}</span>
      default:
        return <span className='badge badge-light-primary'>{val || ''}</span>
    }
  }

  const priorityNameValue: any = (val: any) => {
    switch (val?.toLowerCase()) {
      case 'highest':
        return <span className='badge badge-light-danger'>{val || '-'}</span>
      case 'high':
        return <span className='badge badge-light-warning'>{val || '-'}</span>
      case 'medium':
        return <span className='badge badge-light-info'>{val || '-'}</span>
      case 'low':
        return <span className='badge badge-light-success'>{val || '-'}</span>
      default:
        return <span className=''>{val || '-'}</span>
    }
  }

  const onRender = (val: any) => {
    return {
      resolved_date: val ? moment(val || '')?.format(pref_date) : '-',
      approval_date: val ? moment(val || '')?.format(pref_date) : '-',
      due_time: val !== '-' ? moment(val || '')?.format(pref_date_time) : '-',
      created_at: val !== '-' ? moment(val || '')?.format(pref_date) : '-',
      status_name: statusNameValue(val),
      priority_name: priorityNameValue(val),
    }
  }

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      const features: any = mapValues(resObj, 'value')
      if (features?.help_desk === 0) {
        navigate(`/error/403`)
        setPagePermission(false)
      }
    }
  }, [feature])

  useEffect(() => {
    if (pagePermission) {
      getTicketColumn().then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
            ({value, label: header}: any) => {
              return {
                value,
                header,
                sort: true,
              }
            }
          )
          setColumns(setColumn(mapColumns))
        }
      )

      getListFilter()
        .then(({data: {data: res}}: any) => {
          res && setQuickFilterColumn(res as never[])
        })
        .catch(() => setQuickFilterColumn([]))

      getDatabaseTicket({}).then(({data: {data: result}}: any) => {
        if (result) {
          result
            ?.filter((set_database: {field: any}) => set_database?.field === 'type_guid')
            ?.map((database: any) => setCheckType(database))
          result
            ?.filter((set_database: {field: any}) => set_database?.field === 'priority_guid')
            ?.map((database: any) => setCheckPriority(database))
        }
      })
    }
  }, [pagePermission])

  useEffect(() => {
    if (pagePermission) {
      setLoading(true)
      let filters: any = filterAll?.child || {}
      if (quickFilterData !== null) {
        filters = {...filters, quick_filter: quickFilterData}
      } else {
        filters = {...filters, 'filter[is_spam]': 0, 'filter[is_archive]': 0}
      }

      const filterParams2: any = {}
      typeParam && (filters[`filter[type_name]`] = typeParam)
      quickParam && (filters[`quick_filter`] = quickParam)
      typeParam && (filters[`filter[type_name]`] = typeParam)

      getTickets({
        page,
        orderDir,
        orderCol,
        limit,
        keyword,
        ...filters,
        ...filterParams2,
        ...dataFilterParams,
      })
        .then(({data: {data: res, meta}}: any) => {
          const {current_page, per_page, total, from}: any = meta || {}
          setPageFrom(from)
          setLimit(per_page)
          setTotalPage(total)
          setPage(current_page)

          if (res) {
            const resData: any = res?.map((m: any) => ({
              ...m,
              tags: m?.tag_name || '-',
              description: m?.description ? replaceHTMLEntity(m?.description) : '-',
              created_at:
                m?.created_at !== '-' &&
                moment(new Date(m?.created_at || ''))
                  ?.format(pref_date)
                  ?.toString()
                  ?.toLocaleLowerCase() !== 'invalid date' &&
                moment(new Date(m?.created_at || ''))
                  ?.format('YYYY-MM-DD')
                  ?.toString()
                  ?.toLocaleLowerCase() !== '1970-01-01'
                  ? moment(new Date(m?.created_at || ''))?.format('YYYY-MM-DD HH:mm:ss')
                  : '-',
              due_time:
                m?.due_time !== '-' &&
                moment(new Date(m?.due_time || ''))
                  ?.format(pref_date)
                  ?.toString()
                  ?.toLocaleLowerCase() !== 'invalid date' &&
                moment(new Date(m?.due_time || ''))
                  ?.format('YYYY-MM-DD')
                  ?.toString()
                  ?.toLocaleLowerCase() !== '1970-01-01'
                  ? moment(new Date(m?.due_time || ''))?.format('YYYY-MM-DD HH:mm:ss')
                  : '-',
            }))
            setData(matchColumns(resData, columns))
          }
          setTimeout(() => setLoading(false), 800)
        })
        .catch((err: any) => {
          setTimeout(() => setLoading(false), 800)
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
        })
    }
  }, [
    page,
    limit,
    keyword,
    columns,
    orderDir,
    orderCol,
    filterAll,
    typeParam,
    reloadTicket,
    pagePermission,
    quickFilterData,
    dataFilterParams,
  ])

  useEffect(() => {
    getTags({orderCol: 'name', orderDir: 'asc'}).then(({data: {data: res}}: any) => {
      const data_tag: any = res?.map(({guid, name}: any) => ({
        value: guid || '',
        label: name || '',
      }))
      setDataTag(data_tag as never[])
    })
  }, [reloadTags])

  useEffect(() => {
    const params: any = new URLSearchParams(window?.location?.search)
    setQuickFilterData(
      params.get(`filter[quick_filter]`) !== null ? params.get(`filter[quick_filter]`) : null
    )
  }, [])

  useEffect(() => {
    let filterParams2: any = ''
    if (filterAll?.child === undefined) {
      let filterColumnsChild: any = {}
      const filterColumnsParent: any = []
      const params: any = new URLSearchParams(window.location.search)

      columns?.forEach(({value, header}: any) => {
        if (value !== undefined && params.get(`filter[${value}]`) !== null) {
          const childKey: any = `filter[${value}]`
          filterColumnsChild = {
            ...filterColumnsChild,
            [childKey]: params.get(`filter[${value}]`),
          }

          filterColumnsParent.push({
            value: value,
            label: header,
            filterOptions: false,
            checked: true,
          })

          filterParams2 =
            filterParams2 +
            `${filterParams2 === '' ? '?' : '&'}filter[${value}]=${params.get(`filter[${value}]`)}`
        }
      })

      if (Object.keys(filterColumnsChild || {})?.length > 0 && filterColumnsParent?.length > 0) {
        setFilterAll({
          parent: filterColumnsParent,
          child: filterColumnsChild,
        })
      }
    }

    if (filterAll?.child !== undefined && Object.keys(filterAll?.child || {})?.length !== 0) {
      Object.entries(filterAll?.child || {})?.forEach((m: any) => {
        if (m?.[1] !== '') {
          filterParams2 = filterParams2 + `${filterParams2 === '' ? '?' : '&'}${m?.[0]}=${m?.[1]}`
        }
      })
    }

    if (Object.entries(dataFilterParams || {})?.length > 0) {
      Object.entries(dataFilterParams || {})?.forEach((arr: any) => {
        if (!filterParams2.includes(arr?.[0])) {
          filterParams2 =
            filterParams2 + `${filterParams2 === '' ? '?' : '&'}${arr?.[0]}=${arr?.[1]}`
        }
      })
    }

    if (quickFilterData !== null) {
      filterParams2 =
        filterParams2 +
        `${filterParams2 === '' ? '?' : '&'}filter[quick_filter]=${quickFilterData || ''}`
    }

    if (filterAll?.child !== undefined && Object.keys(filterAll?.child || {})?.length === 0) {
      if (keyword === '') {
        navigate(`/help-desk/ticket`)
      } else {
        navigate(`/help-desk/ticket/?keyword=${keyword}`)
      }
    } else if (filterParams2 !== '') {
      if (keyword === '') {
        navigate(`/help-desk/ticket/${filterParams2}`)
      } else {
        navigate(`/help-desk/ticket/${filterParams2}&keyword=${keyword}`)
      }
    }
  }, [filterAll?.child, columns, dataFilterParams, keyword, quickFilterData])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 3500)
  }, [])

  useEffect(() => {
    if (showModalAdd || showModalContact || showModalType) {
      setTimeout(() => ToastMessage({type: 'clear'}), 3500)
    }
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.TICKET.LIST'})}</PageTitle>

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

              <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />

              <div className='dropdown'>
                <Dropdown>
                  <Dropdown.Toggle variant='light-light' size='sm' data-cy='quickFilter'>
                    <i className='las la-ellipsis-v' style={{fontSize: '28px', color: '#050990'}} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      href='#'
                      data-cy='quick-allticket'
                      onClick={() => changeQuickFilter(null)}
                      style={
                        quickFilterData === null
                          ? {padding: '10px', background: '#050990', color: '#fff'}
                          : {padding: '10px'}
                      }
                    >
                      All Tickets
                    </Dropdown.Item>

                    {quickFilterColumn?.map((item: any, index: any) => {
                      return (
                        <Dropdown.Item
                          href='#'
                          key={index}
                          data-cy={`quick-${index || ''}`}
                          onClick={() => changeQuickFilter(item?.name || '')}
                          style={
                            quickFilterData === item?.name
                              ? {padding: '10px', background: '#050990', color: '#fff'}
                              : {padding: '10px'}
                          }
                        >
                          {item?.label || '-'}
                        </Dropdown.Item>
                      )
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {PermissionDelete && dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='bulkDelete'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => setShowModalConfirmBulk(true)}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                {PermissionAdd && (
                  <button
                    type='button'
                    data-cy='addTicket'
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setShowModalAdd(true)
                      setDetailTicket(undefined)
                    }}
                  >
                    + Add New Ticket
                  </button>
                )}
              </div>

              {(PermissionExport || PermissionSetup) && (
                <div className='dropdown' style={{marginRight: '5px'}}>
                  <Dropdown>
                    <Dropdown.Toggle
                      size='sm'
                      data-cy='actions'
                      id='dropdown-basic'
                      variant='light-primary'
                    >
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {PermissionExport && <ExportPdfExcel onExport={onExport} />}
                      {PermissionSetup && (
                        <Dropdown.Item
                          href='#'
                          onClick={() => navigate('/help-desk/ticket/columns')}
                        >
                          Setup Column
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>

          <FilterColumns
            api={getOptionsColumns}
            filterAll={filterAll}
            onChange={setFilterAll}
            setPage={setPage}
          />
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            data={data}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            columns={columns}
            total={totalPage}
            render={onRender}
            loading={loading}
            onDelete={onDelete}
            onDetail={onDetail}
            onChecked={onChecked}
            view={PermissionView}
            edit={PermissionEdit}
            del={PermissionDelete}
            bulk={PermissionDelete}
            onChangePage={onCangePage}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </div>

      <ValidationSchema
        checkPriority={checkPriority}
        setTicketSchema={setTicketSchema}
        otherReportChanel={otherReportChanel}
      />

      <AddEditTicket
        dataTags={dataTags}
        checkType={checkType}
        reloadTags={reloadTags}
        showModal={showModalAdd}
        reloadTicket={reloadTicket}
        ticketDetail={detailTicket}
        ticketSchema={ticketSchema}
        setTypeDetail={setTypeDetail}
        reloadContact={reloadContact}
        setReloadTags={setReloadTags}
        checkPriority={checkPriority}
        setShowModal={setShowModalAdd}
        setReloadTicket={setReloadTicket}
        setShowModalType={setShowModalType}
        setContactDetail={setContactDetail}
        otherReportChanel={otherReportChanel}
        setShowModalContact={setShowModalContact}
        setOtherReportChanel={setOtherReportChanel}
      />

      <AddContact
        reloadTags={reloadTags}
        showModal={showModalContact}
        contactDetail={contactDetail}
        reloadContact={reloadContact}
        setReloadTags={setReloadTags}
        setShowModal={setShowModalContact}
        setReloadContact={setReloadContact}
      />

      <AddTicketType
        reload={reloadType}
        typeDetail={typeDetail}
        setReload={setReloadType}
        showModal={showModalType}
        setShowModal={setShowModalType}
      />

      <Alert
        type={'delete'}
        loading={loading}
        title={'Delete Ticket'}
        confirmLabel={'Delete'}
        showModal={showModalDelete}
        onConfirm={confirmDeleteTicket}
        setShowModal={setShowModalDelete}
        onCancel={() => setShowModalDelete(false)}
        body={
          <p className='m-0'>
            Are you sure you want to delete <strong>{ticketName || '-'}</strong> ?
          </p>
        }
      />

      <TicketBulkDelete
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        showModal={showModalBulk}
        dataChecked={dataChecked}
        reloadTicket={reloadTicket}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setReloadTicket={setReloadTicket}
        setShowModal={setShowModalConfirmBulk}
      />
    </>
  )
}

export default Tickets
