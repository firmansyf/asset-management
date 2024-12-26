import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, hasPermission, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {useQuery} from '@tanstack/react-query'
import qs from 'qs'
import {FC, useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import ModalBulkDelete from './_modal/BulkDelete'
import ModalDelete from './_modal/Delete'
import {exportPO, getColumnsPO, getOptionsColumns, getPO} from './Services'

const PurchaseOrder: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}

  const [page, setPage] = useState<number>(1)
  const [detail, setDetail] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [filterAll, setFilterAll] = useState<any>({})
  const [reload, setReload] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [keyword, setKeyword] = useState<string | undefined>('')
  const [orderCol, setOrderCol] = useState<string | undefined>('')
  const [showModalBulk, setShowModalBulk] = useState<boolean>(false)
  const [orderDir, setOrderDir] = useState<string | undefined>('asc')
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [pagePermission, setPagePermission] = useState<boolean>(true)

  const PermissionView: any = hasPermission('purchase-order.view') || false
  const PermissionEdit: any = hasPermission('purchase-order.edit') || false
  const PermissionDelete: any = hasPermission('purchase-order.delete') || false

  const onExport = (e: any) => {
    let filters: any = filterAll?.child || {}
    filters = qs.parse(filters)
    const fields: any = columns?.filter(({value}: any) => value)?.map(({value}: any) => value)
    const params: any = {
      type: e,
      keyword,
      orderDir,
      orderCol,
      columns: fields?.join(','),
      ...filters,
    }
    exportPO(params)
      .then(({data: {data, message}}: any) => {
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          const {url} = data || {}
          totalPage <= 500 && window.open(url, '_blank')
        }, 500)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err) || {})?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
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
    const {guid} = e || {}
    navigate(`/purchase-order/detail/${guid}`)
  }

  useEffect(() => {
    if (Object.keys(feature || {})?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'purchase_order')
        ?.map((feature: any) => setPagePermission(feature?.value === 0 ? false : true))
    }
  }, [feature])

  const columnsQuery: any = useQuery({
    queryKey: ['getColumnsPO'],
    queryFn: async () => {
      const res: any = await getColumnsPO()
      const {fields}: any = res?.data?.data || {}
      let dataResult: any = []
      const mapColumns = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header}: any) => {
          return {
            value,
            header,
            sort: true,
          }
        }
      )
      if (mapColumns?.length) {
        dataResult = [
          {header: 'checkbox', width: '20px'},
          {header: 'View', width: '20px'},
          ...mapColumns,
          {header: 'Edit', width: '20px'},
          {header: 'Delete', width: '20px'},
        ]
      }
      return dataResult
    },
  })
  const columns: any = columnsQuery?.data || []

  const filters: any = filterAll?.child || {}
  const params = {
    page,
    limit,
    keyword,
    orderDir,
    orderCol,
    ...filters,
  }
  const getPOQuery = useQuery({
    queryKey: ['getPO', {...params, reload, columns, filterAll}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res = await getPO(params)
        const {current_page, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setTotalPage(total)
        setPage(current_page)
        setLimit(thisLimit)
        return matchColumns(res?.data?.data, columns)
      } else {
        return []
      }
    },
    onError: (err: any) => {
      Object.values(errorValidation(err) || {})?.forEach((message: any) =>
        ToastMessage({type: 'error', message})
      )
    },
  })
  const dataPO = getPOQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.PO'})}</PageTitle>
      {!pagePermission ? (
        <Forbidden />
      ) : (
        <>
          <div className='card card-table'>
            <div className='card-table-header'>
              <div className='d-flex flex-wrap flex-stack'>
                <div className='d-flex align-items-center position-relative me-4 my-1'>
                  <KTSVG
                    path='/media/icons/duotone/General/Search.svg'
                    className='svg-icon-3 position-absolute ms-3'
                  />
                  <Search bg='solid' onChange={onSearch} />
                  <FilterAll columns={columns} filterAll={filterAll} onChange={setFilterAll} />
                </div>
                <div className='d-flex my-1'>
                  <div style={{marginRight: '5px'}}>
                    {dataChecked?.length > 0 && PermissionDelete && (
                      <button
                        type='button'
                        className='btn btn-sm btn-danger me-2'
                        onClick={() => setShowModalBulk(true)}
                      >
                        <span className='indicator-label'>Delete Selected</span>
                      </button>
                    )}
                    {hasPermission('purchase-order.add') && (
                      <div
                        className='btn btn-sm btn-primary'
                        onClick={() => navigate('/purchase-order/add')}
                      >
                        <i className='las la-plus' /> Add Purchase Order
                      </div>
                    )}
                  </div>
                  <div className='dropdown' style={{marginRight: '5px'}}>
                    <Dropdown>
                      <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                        Actions
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {hasPermission('purchase-order.export') && (
                          <ExportPdfExcel onExport={onExport} />
                        )}
                        {hasPermission('purchase-order.setup-column') && (
                          <Dropdown.Item
                            href='#'
                            onClick={() => {
                              navigate('/purchase-order/columns')
                            }}
                          >
                            Setup Column
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              {/* <FilterColumns
                data={dataFilter}
                filterAll={filterAll}
                onChange={setFilterAll}
                setPage={setPage}
              /> */}

              <FilterColumns
                api={getOptionsColumns}
                filterAll={filterAll}
                onChange={setFilterAll}
                setPage={setPage}
              />
            </div>
            <div className='card-body'>
              <DataTable
                loading={!getPOQuery?.isFetched || !columnsQuery?.isFetched}
                limit={limit}
                total={totalPage}
                data={dataPO}
                columns={columns}
                onChangePage={onPageChange}
                onChangeLimit={onChangeLimit}
                onDelete={(e: any) => {
                  setDetail(e)
                  setShowModalDelete(true)
                }}
                onDetail={onDetail}
                onEdit={({guid}: any) => navigate(`/purchase-order/edit/${guid}`)}
                onChecked={(e: any) =>
                  setDataChecked(e?.filter(({checked}: any) => checked)?.map(({guid}: any) => guid))
                }
                onSort={(e: any) => {
                  setOrderCol(e)
                  setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
                }}
                render={(val: any) => ({
                  status: () => {
                    switch (val?.toLowerCase()) {
                      case 'completed':
                        return <span className='badge badge-light-success'>{val}</span>
                      case 'rejected':
                        return <span className='badge badge-light-danger'>{val}</span>
                      case 'on delivery':
                      case 'delivery checked':
                        return <span className='badge badge-light-primary'>{val}</span>
                      default:
                        return <span className='badge badge-light-info'>{val}</span>
                    }
                  },
                })}
                view={PermissionView}
                edit={PermissionEdit}
                del={PermissionDelete}
                bulk={PermissionDelete}
              />
            </div>
          </div>
          <ModalDelete
            detail={detail}
            showModal={showModalDelete}
            setShowModal={setShowModalDelete}
            setReload={setReload}
            reload={reload}
          />
          <ModalBulkDelete
            showModal={showModalBulk}
            setShowModal={setShowModalBulk}
            setReload={setReload}
            reload={reload}
            dataChecked={dataChecked}
            setDataChecked={setDataChecked}
          />
        </>
      )}
    </>
  )
}

export default PurchaseOrder
