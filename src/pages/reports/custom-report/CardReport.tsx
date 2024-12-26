import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, KTSVG} from '@helpers'
import {exportAsset, getAsset} from '@pages/asset-management/redux/AssetRedux'
import {initTableColumns as initColumns} from '@pages/reports/custom-report/constant'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import ModalAutomatedReport from '../automated-report/ModalAddEdit'

let CardReport: FC<any> = ({
  detailReport,
  columns: columnsChange,
  setShowModalSaveAs,
  setShowModalDelete,
  setShowModalSetupColumns,
  setSaveType,
}) => {
  const navigate: any = useNavigate()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [columns, setColumns] = useState<any>(initColumns)
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [showModalAutomatedReport, setShowModalAutomatedReport] = useState<boolean>(false)

  const PermissionView: any = hasPermission('reports.automation_report.view') || false
  const PermissionColumn: any = hasPermission('setup-column.setup_column_custom_report') || false

  const onExport = (e: any) => {
    const strColumns: any = columns?.map((m: any) => m?.value)?.join(',')
    const filters: any = filterAll?.child || {}

    exportAsset({
      type: e,
      orderDir,
      orderCol,
      columns: strColumns,
      report_name: detailReport?.name,
      ...filters,
    })
      .then(
        ({
          data: {
            data: {url},
            message,
          },
        }: any) => {
          ToastMessage({message, type: 'success'})
          setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
        }
      )
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `${e}` : '')
  }

  const columnsExist = useMemo(() => {
    const cols: any = []
    if (columnsChange?.length) {
      columnsChange?.forEach((map: any) => {
        if (initColumns?.find((f: any) => f?.value === map) !== undefined) {
          cols?.push(initColumns?.find((f: any) => f?.value === map))
        }
      })
    } else if (detailReport?.columns) {
      detailReport?.columns?.forEach((map: any) => {
        if (initColumns?.find((f: any) => f?.value === map) !== undefined) {
          cols?.push(initColumns?.find((f: any) => f?.value === map))
        }
      })
    }
    setColumns(cols as never[])
    return cols
  }, [columnsChange, detailReport])

  const dataCustomReportFilterParams: any = {limit, orderCol, orderDir, page}
  const dataCustomReportFilterQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAssetCustomReport', {...dataCustomReportFilterParams, columnsExist}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAsset(dataCustomReportParam)
        const dataResult: any = res?.data?.data as never[]
        return matchColumns(dataResult, columnsExist)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataFilter: any = dataCustomReportFilterQuery?.data || []

  const filtersChild: any = filterAll?.child || {}
  const dataCustomReportParam: any = {page, limit, keyword, orderDir, orderCol, ...filtersChild}
  const dataCustomReportQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getAssetCustomReport', {...dataCustomReportParam, columnsExist}],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAsset(dataCustomReportParam)
        const {current_page, total}: any = res?.data?.meta || {}
        const thisLimit: any = limit
        setTotalPage(total)
        setLimit(thisLimit)
        setPage(current_page)

        const dataResult: any = res?.data?.data as never[]
        return matchColumns(dataResult, columnsExist)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataCustomReport: any = dataCustomReportQuery?.data || []

  return (
    <>
      <div className='card card-custom card-table'>
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
              {detailReport?.guid && (
                <div className='dropdown' style={{marginRight: '5px'}}>
                  <Dropdown>
                    <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href='#' onClick={() => setShowModalAutomatedReport(true)}>
                        Automated Report
                      </Dropdown.Item>
                      <Dropdown.Item href='#' onClick={() => setShowModalDelete(true)}>
                        Delete Report
                      </Dropdown.Item>
                      <Dropdown.Item
                        href='#'
                        onClick={() => {
                          setSaveType('update')
                          setShowModalSaveAs(true)
                        }}
                      >
                        Edit Report
                      </Dropdown.Item>
                      <ExportPdfExcel onExport={onExport} />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}

              {PermissionColumn && (
                <div
                  onClick={() => setShowModalSetupColumns(true)}
                  className='btn btn-sm btn-light-primary'
                >
                  Setup Column
                </div>
              )}

              <div className='dropdown' style={{marginLeft: '5px'}}>
                <Dropdown>
                  <Dropdown.Toggle variant='primary' size='sm' id='dropdown-basic'>
                    Save Report
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {detailReport?.guid && (
                      <Dropdown.Item
                        href='#'
                        onClick={() => {
                          setSaveType('save')
                          setShowModalSaveAs(true)
                        }}
                      >
                        Save
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item
                      href='#'
                      onClick={() => {
                        setSaveType('saveAs')
                        setShowModalSaveAs(true)
                      }}
                    >
                      Save As
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          <FilterColumns data={dataFilter} filterAll={filterAll} onChange={setFilterAll} />
        </div>

        <div className='card-body table-responsive'>
          {columns?.length > 0 ? (
            <DataTable
              page={page}
              limit={limit}
              onSort={onSort}
              total={totalPage}
              columns={columns}
              onChangePage={setPage}
              data={dataCustomReport}
              onChangeLimit={onChangeLimit}
              loading={!dataCustomReportQuery?.isFetched}
            />
          ) : (
            <div
              className='d-flex align-items-center image-input-wrapper h-100px btn btn-outline btn-bg-light btn-color-gray-600 border-dashed border-primary'
              onClick={() => setShowModalSetupColumns(true)}
            >
              <div className='mx-auto'>
                <small className='text-primary fw-normal d-block pt-0'>
                  Select and order the columns to show report as you want
                </small>
              </div>
            </div>
          )}
        </div>
      </div>

      {PermissionView && (
        <ModalAutomatedReport
          type={'add'}
          columns={columns}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          detail={{name: 'Custom Report', type: 'asset'}}
          onSubmit={() => {
            setShowModalAutomatedReport(false)
            navigate('/reports/automated-report')
          }}
        />
      )}
    </>
  )
}

CardReport = memo(
  CardReport,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardReport
