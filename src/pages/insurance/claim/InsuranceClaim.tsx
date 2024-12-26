import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {FilterAll, FilterColumns} from '@components/filter/FilterAllInsurance'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {
  errorValidation,
  preferenceDate,
  preferenceDateTime,
  toCapitalize,
  validationViewDate,
} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {debounce, mapKeys, unionBy, uniq} from 'lodash'
import qs from 'qs'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {renderToString} from 'react-dom/server'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useLocation, useNavigate} from 'react-router-dom'

import {
  deleteInsuranceClaim,
  downloadFormInsuranceClaim,
  exportInsuranceClaim,
  getClaimFilter,
  getInsuranceClaim,
  getListStatusInsurance,
  setColumnInsuranceClaim,
  viewByCase,
} from './Service'

const StatusBadge: FC<any> = ({val}: any) => {
  switch (val?.toLowerCase()) {
    case 'pending documents upload':
      return <span className='badge badge-light-primary'>{val || ''}</span>
    case 'pending gr done':
      return <span className='badge badge-light-primary'>{val || ''}</span>
    case 'pending invoice upload':
      return <span className='badge badge-light-primary'>{val || ''}</span>
    case 'ready for review 1':
      return <span className='badge badge-light-primary'>{val || ''}</span>
    case 'ready for review 2':
      return <span className='badge badge-light-primary'>{val || ''}</span>
    case 'reverted for revision':
      return <span className='badge badge-light-warning'>{val || ''}</span>
    case 'rejected':
      return <span className='badge badge-light-danger'>{val || ''}</span>
    case 'rejected and closed':
      return <span className='badge badge-light-danger'>{val || ''}</span>
    case 'approved':
      return <span className='badge badge-light-success'>{val || ''}</span>
    case 'approved (not claimable)':
      return <span className='badge badge-light-success'>{val || ''}</span>
    case 'proposed to reject and close':
      return <span className='badge badge-light-warning'>{val || ''}</span>
    case 'ready for approval':
      return <span className='badge badge-light-blue'>{val || ''}</span>
    default:
      return <span className='badge rounded-pill badge-light text-dark'>{val || ''}</span>
  }
}

const InsuranceCard: FC<any> = ({reloadDelete, onDelete, permissions, loadingDeleteOnFilter}) => {
  const navigate: any = useNavigate()
  const {search}: any = useLocation()
  const pref_date: any = preferenceDate()
  const queryClient: any = useQueryClient()
  const pref_date_time: any = preferenceDateTime()
  const urlParams: any = new URLSearchParams(window?.location?.search)
  const paramsSearch: any = Object.fromEntries(urlParams?.entries())

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [lengthPDF, setLengthPDF] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [_guidDownload, setGuidDownload] = useState<any>('')
  const [orderCol, setOrderCol] = useState<string>('case_id')
  const [countDataEmpty, setCountDataEmpty] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  // const [meta, setMeta] = useState<any>({})
  // const [totalPerPage, setTotalPerPage] = useState<number>(0)

  const edit: any = permissions?.includes('insurance_claim.edit') || false
  const del: any = permissions?.includes('insurance_claim.delete') || false
  const exportPermission: any = permissions?.includes('insurance_claim.export') || false
  const PermissionImport: any = permissions?.includes('import-export.import_insurance') || false
  const setupColumPermission: any =
    permissions?.includes('setup-column.setup_column_insurance_claim') || false
  const downloadFormPermission: any =
    permissions?.includes('insurance_claim.download_form') || false

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }, [])

  useEffect(() => {
    if (Object.keys(paramsSearch || {})?.length > 0) {
      Object.entries(paramsSearch || {})?.forEach((key: any) => {
        let filterParams: any = ''
        Object.entries(paramsSearch || {})?.forEach((m: any) => {
          if (m?.[1] !== '') {
            filterParams = filterParams + `${filterParams === '' ? '?' : '&'}${m?.[0]}=${m?.[1]}`
          }
        })

        if (key?.length > 0 && key?.[0] === 'keyword') {
          if (key?.[1] !== '') {
            setKeyword(key?.[1])
          } else {
            setPage(1)
            setKeyword('')
            if (/filter/.test(window.location.href)) {
              navigate(`/insurance-claims/all${filterParams}`)
            } else {
              navigate(`/insurance-claims/all`)
            }
          }
        }

        if (
          key?.length > 0 &&
          key?.[0] === 'page' &&
          Number(key?.[1]) !== page &&
          key?.[1] !== ''
        ) {
          setPage(key?.[1])
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSearch])

  const columnsQuery: any = useQuery({
    queryKey: ['getInsuranceClaimColumn'],
    queryFn: async () => {
      const res: any = await setColumnInsuranceClaim({})
      const {fields}: any = res?.data?.data || {}
      const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
        ({value, label: header, is_sortable}: any) => {
          let mapHeader: any = header
          value === 'asset_type' && (value = 'type_name')
          value === 'case_age' && (mapHeader = 'Status Age')
          return {
            value,
            header: mapHeader,
            sort: is_sortable === 1 ? true : false,
          }
        }
      )
      const mapFilterColumns: any = toColumns(fields, {checked: true, order: true})
        ?.filter(({is_filter}: any) => is_filter === 1)
        ?.map(({value, label: header}: any) => {
          let mapHeader: any = header
          value === 'asset_type' && (value = 'type_name')
          value === 'case_age' && (mapHeader = 'Status Age')
          return {
            value,
            header: mapHeader,
            sort: true,
          }
        })
      const dataResult: any = {
        columns: mapColumns?.length
          ? [
              {header: 'View', width: '20px'},
              ...mapColumns,
              {header: 'Edit', width: '20px'},
              {header: 'Delete', width: '20px'},
              {header: 'Download', width: '20px'},
            ]
          : [],
        filterColumns: mapFilterColumns?.length
          ? [
              {header: 'View', width: '20px'},
              ...mapFilterColumns,
              {header: 'Edit', width: '20px'},
              {header: 'Delete', width: '20px'},
              {header: 'Download', width: '20px'},
            ]
          : [],
      }
      return dataResult
    },
  })
  const {columns, filterColumns}: any = columnsQuery?.data || {}

  const dataInsuranceClaimKey: any = [
    'getInsuranceClaim',
    {
      page,
      limit,
      search,
      columns,
      keyword,
      orderCol,
      orderDir,
      reloadDelete,
      filterColumns,
      ...filterAll?.child,
      downloadFormPermission,
      loadingDeleteOnFilter,
      countDataEmpty,
    },
  ]

  const dataInsuranceClaimQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: dataInsuranceClaimKey,
    queryFn: async () => {
      if (columns?.length > 0) {
        const filters: any = filterAll?.child || {}
        const searchParams: any = qs.parse(search, {ignoreQueryPrefix: true})

        let dataFilterCheck: any = {}
        let dataSearchCheck: any = {}
        if (filters !== undefined) {
          Object.entries(filters || {})?.forEach((m: any) => {
            if (m?.[1] !== '' && m?.[0] !== 'page' && m?.[0] !== 'keyword') {
              const childKey: any = m?.[0]
              const valueParamss: any = m?.[1]?.replace('&', '%26')
              dataFilterCheck = {
                ...dataFilterCheck,
                [childKey]: valueParamss,
              }
            }
          })
        } else {
          dataFilterCheck = {}
        }

        if (Object.entries(searchParams || {})?.length > 0) {
          Object.entries(searchParams || {})?.forEach((m: any) => {
            if (m?.[0] !== 'page' && m?.[0] !== 'keyword') {
              if (Object.keys(m?.[1] || {})?.length > 0) {
                dataSearchCheck = mapKeys(m?.[1], (_val: any, keyParam: any) =>
                  m?.[0] === 'filter' ? `${m?.[0]}[${keyParam}]` : keyParam
                )
              } else if (m?.[1] !== '') {
                const childKey: any = Object.keys(m?.[1] || {})
                if (childKey?.length > 0) {
                  const childKeys: any = childKey?.[0]
                  const valueParamss: any = childKey?.[1]?.replace('&', '%26')
                  dataSearchCheck = {
                    ...dataSearchCheck,
                    [childKeys]: valueParamss,
                  }
                }
              }
            }
          })
        } else {
          dataSearchCheck = {}
        }

        if (countDataEmpty < 4) {
          const insuranceClaimAPI: any = await getInsuranceClaim({
            page,
            limit,
            keyword: keyword || '',
            orderCol,
            orderDir,
            ...dataFilterCheck,
            ...dataSearchCheck,
          })
          const statusClaim: any = [
            'Pending Documents Upload',
            'Pending GR Done',
            'Pending Invoice Upload',
            'Ready for Review 1',
          ]
          const {total, current_page}: any = insuranceClaimAPI?.data?.meta || {}
          setTotalPage(total)
          const data: any = insuranceClaimAPI?.data?.data?.map((claim: any) => {
            const {type_of_peril, invoice_total, status} = claim || {}
            const claimble: any = statusClaim?.find((keys: any) => keys === status)

            claim.invoice_total = invoice_total || 0
            claim.is_digital = claim?.is_digital === 1 ? 'Yes' : 'NO'
            claim.suspicions = claim?.suspicions === 1 ? 'Yes' : 'NO'
            claim.type_of_peril = type_of_peril?.name || type_of_peril || ''
            claim.is_claimable = claimble ? 'N/A' : claim?.is_claimable === 1 ? 'Yes' : 'NO'

            claim?.incident_timestamp === 'N/A' && (claim.incident_timestamp = '-')
            claim?.invoice_date === 'N/A' && (claim.invoice_date = '-')
            claim?.police_report_date === 'N/A' && (claim.police_report_date = '-')

            const editable = ![
              'Rejected and Closed',
              'Approved',
              'Approved (Claimable)',
              'Approved (Not Claimable)',
            ]?.includes(status)

            claim['Edit'] = editable ? 'Edit' : false
            claim['Download'] =
              status === 'Approved' && downloadFormPermission ? 'Download Claim Form' : false

            return claim
          })
          // setTotalPerPage(data?.length || 0)
          // setCountDataEmpty(data?.length < 1 ? countDataEmpty + 1 : 0)

          if (data?.length === 0) {
            const pagesetting: any = current_page > 1 ? current_page - 1 : 1
            if (Object.keys(insuranceClaimAPI?.data?.meta || {})?.length > 0) {
              setPage(pagesetting || 1)
            }
            // setFilterAll({})
            // setResetKeyword(true)
            // setKeyword('')

            // const urlParams = new URLSearchParams(window?.location?.search)
            // urlParams?.set('page', pagesetting?.toString())
            // const newUrl = `${window.location.pathname}?${urlParams?.toString()}`
            const newUrl = `${window.location.pathname}?page=${pagesetting?.toString()}`
            navigate(newUrl)
          }
          return matchColumns(data, columns)
        }

        if (countDataEmpty === 4) {
          navigate(`/insurance-claims/all?page=1`)
          setTimeout(() => setCountDataEmpty(0), 800)
        }

        return []
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataInsuranceClaim: any = dataInsuranceClaimQuery?.data || []

  const dataStatusQuery: any = useQuery({
    queryKey: ['getListStatusInsurance', {filterAll}],
    queryFn: async () => {
      const filterStatusIsSelected: any = filterAll?.parent?.find(
        ({value}: any) => value === 'status'
      )
      if (filterStatusIsSelected) {
        const res: any = await getListStatusInsurance()
        const dataResult = res?.data?.data?.map(({name}: any) => {
          return {
            value: name || '',
            label: name || '',
          }
        })
        return dataResult
      } else {
        return []
      }
    },
  })
  const dataStatus: any = dataStatusQuery?.data || []

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onExport = (e: any) => {
    const exportColumn: any = []
    columns?.forEach(({value}: any) => {
      value && exportColumn?.push(value || '')
    })

    const filterParams2: any = {}
    const filters: any = filterAll?.child || {}
    const params: any = new URLSearchParams(window.location.search)
    filterColumns?.forEach(({value}: any) => {
      if (value !== undefined && params.get(`filter[${value}]`) !== null) {
        filterParams2[`filter[${value}]`] = params.get(`filter[${value}]`)
      }
    })

    const paramsValue: any = {
      type: e,
      keyword,
      orderDir: 'asc',
      orderCol: 'case_id',
      columns: exportColumn?.join(),
      ...filters,
      ...filterParams2,
    }

    exportInsuranceClaim(paramsValue)
      .then(({data: res}: any) => {
        const {data, message} = res || {}
        const {url} = data || {}
        ToastMessage({message, type: 'success'})
        setTimeout(() => totalPage <= 500 && window.open(url, '_blank'), 1000)
      })
      .catch(({response}) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onPageChange = (e: any) => {
    setPage(e)

    let filterParams: any = ''
    Object.entries(paramsSearch || {})?.forEach((m: any) => {
      if (m?.[1] !== '' && m?.[0] !== 'page') {
        filterParams = filterParams + `${filterParams === '' ? '?' : '&'}${m?.[0]}=${m?.[1]}`
      }
    })
    if (filterParams !== '') {
      navigate(`/insurance-claims/all${filterParams}&page=${e}`)
    } else {
      navigate(`/insurance-claims/all?page=${e}`)
    }
  }

  const onSearch = debounce((e: any) => {
    const encodedKeyword: any = encodeURIComponent(e || '')
    setKeyword(e)

    let filterParams: any = ''
    Object.entries(paramsSearch || {})?.forEach((m: any) => {
      if (m?.[1] !== '' && m?.[0] !== 'page' && m?.[0] !== 'keyword') {
        filterParams = filterParams + `${filterParams === '' ? '?' : '&'}${m?.[0]}=${m?.[1]}`
      }
    })

    if (!resetKeyword) {
      setPage(1)
      if (filterParams !== '') {
        navigate(`/insurance-claims/all${filterParams}&keyword=${encodedKeyword}&page=1`)
      } else {
        navigate(`/insurance-claims/all?keyword=${encodedKeyword}&page=1`)
      }
    }
  }, 1000)

  const onDetail = (item: any) => {
    const {guid} = item || {}
    return `/insurance-claims/${guid}/detail`
  }

  const onEdit = (item: any) => {
    const {guid} = item || {}
    return `/insurance-claims/${guid}/edit`
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onDownload = (e: any) => {
    const {guid} = e || {}
    setGuidDownload(guid)
    queryClient.setQueryData(dataInsuranceClaimKey, (prev: any) => {
      return prev?.map((m: any) => {
        if (guid === m?.guid) {
          m['Download'] = 'loading'
        }
        return m
      })
    })
    downloadFormInsuranceClaim(guid)
      .then(({data: res}: any) => {
        const {message, url} = res || {}
        setTimeout(() => {
          window.open(url, '_blank')
          ToastMessage({message, type: 'success'})
        }, 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
      .finally(() => {
        setTimeout(() => {
          setGuidDownload(undefined)
          queryClient.invalidateQueries({queryKey: dataInsuranceClaimKey})
        }, 1000)
      })
  }

  const onRender = (val: any, {original}: any) => {
    return {
      status: <StatusBadge val={val || ''} />,
      case_age: original?.case_age?.toString(),
      import_date_and_time:
        val && val !== '-' ? validationViewDate(val || '', pref_date_time) : '-',
      incident_timestamp: val && val !== '-' ? validationViewDate(val || '', pref_date_time) : '-',
      claim_time: val && val !== '-' ? validationViewDate(val || '', pref_date_time) : '-',
      invoice_date: val && val !== '-' ? validationViewDate(val || '', pref_date) : '-',
      police_report_date: val && val !== '-' ? validationViewDate(val || '', pref_date) : '-',
      approval_date: val && val !== '-' ? validationViewDate(val || '', pref_date_time) : '-',
      last_updated_at: val && val !== '-' ? validationViewDate(val || '', pref_date_time) : '-',
      submission_date: val && val !== '-' ? validationViewDate(val || '', pref_date) : '-',
      receive_date: val && val !== '-' ? validationViewDate(val || '', pref_date) : '-',
      confirmation_date: val && val !== '-' ? validationViewDate(val || '', pref_date) : '-',
      linked_case: () => {
        return (
          <>
            {val && val?.split(', ')?.length > 0 ? (
              <>
                {uniq(val?.split(', '))?.map((case_id: any, number: any) => {
                  const separator: any = number + 1 !== uniq(val?.split(', '))?.length ? ', ' : ''
                  const content: any = `${case_id || ''} ${separator}`
                  const LoaderCaseID: any = () => (
                    <div
                      className='custom-loader-10'
                      style={{
                        transform: 'scale(0.35)',
                        marginLeft: '5px',
                        marginTop: '3px',
                        marginBottom: '3px',
                      }}
                    />
                  )
                  return (
                    <Link
                      key={number}
                      to={window?.location?.href}
                      onClick={(e: any) => {
                        e?.preventDefault()
                        if (case_id && e?.target?.innerHTML) {
                          e.target.innerHTML = `${renderToString(<LoaderCaseID />)}`
                          viewByCase(case_id)
                            .then(({data: {data}}: any) => {
                              if (data?.guid) {
                                const url: any = `/insurance-claims/${data?.guid}/detail`
                                window.open(url, '_blank', 'noopener')
                              }
                            })
                            .catch((err: any) => {
                              Object.values(errorValidation(err || {}))?.map((message: any) =>
                                ToastMessage({type: 'error', message})
                              )
                            })
                            .finally(() => {
                              e.target.innerHTML = content
                            })
                        }
                      }}
                      onContextMenu={(e: any) => e?.preventDefault()}
                      className='fw-bold text-decoration-underline'
                    >
                      {content}
                    </Link>
                  )
                })}
              </>
            ) : (
              '-'
            )}
          </>
        )
      },
      post_approval_status:
        val && val !== '-' ? (
          <div className='fw-bold fs-8 d-flex align-items-center'>
            <i className='fas fa-check-circle text-success me-1' />
            {val || ''}
          </div>
        ) : (
          '-'
        ),
    }
  }

  useEffect(() => {
    let lengthAll: any = Number(columns?.length) - 4
    if (columns?.find(({value}: any) => value === 'ro_number') !== undefined) {
      lengthAll = lengthAll + 6
    }
    if (columns?.find(({value}: any) => value === 'invoice_amount') !== undefined) {
      lengthAll = lengthAll + 9
    }

    setLengthPDF(lengthAll)
  }, [columns])

  useEffect(() => {
    let filterParams2: any = ''
    const params: any = new URLSearchParams(window.location.search)
    const searchParams: any = qs.parse(search, {ignoreQueryPrefix: true})
    const searchParamsFilter: any = searchParams?.filter || {}
    const columnsFromURL: any = Object.entries(searchParamsFilter || {})?.map((m: any) => ({
      value: m?.[0],
      header: toCapitalize(m?.[0]?.split('_')?.join(' ')),
      sort: false,
    }))

    if (filterAll?.child === undefined) {
      let filterColumnsChild: any = {}
      const filterColumnsParent: any = []
      const mergedColumn: any = unionBy(columns, columnsFromURL, 'value')
      mergedColumn?.forEach(({value, header}: any) => {
        if (value !== undefined && params.get(`filter[${value}]`) !== null) {
          const childKey: any = `filter[${value}]`
          const valueParamss: any = params.get(`filter[${value}]`)?.replace('&', '%26')

          filterColumnsChild = {
            ...filterColumnsChild,
            [childKey]: valueParamss,
          }

          filterColumnsParent?.push({
            value: value,
            label: header,
            filterOptions: false,
            checked: true,
          })

          const valueParams: any = params.get(`filter[${value}]`)?.replace('&', '%26')
          filterParams2 =
            filterParams2 + `${filterParams2 === '' ? '?' : '&'}filter[${value}]=${valueParams}`
        }
      })

      if (Object.keys(filterColumnsChild || {})?.length > 0 && filterColumnsParent?.length > 0) {
        setFilterAll({
          parent: filterColumnsParent,
          child: filterColumnsChild,
        })
      }
    }

    if (filterAll?.child !== undefined) {
      Object.entries(filterAll?.child || {})?.forEach((m: any) => {
        if (m?.[1] !== '') {
          const valueParams: any = m?.[1]?.replace('&', '%26')
          filterParams2 =
            filterParams2 + `${filterParams2 === '' ? '?' : '&'}${m?.[0]}=${valueParams}`
        }
      })
    }

    if (paramsSearch['page'] !== undefined) {
      filterParams2 =
        filterParams2 + `${filterParams2 === '' ? '?' : '&'}page=${paramsSearch['page']}`
    }

    const encodedKeyword: any = encodeURIComponent(keyword)
    if (filterAll?.child !== undefined && Object.keys(filterAll?.child || {})?.length === 0) {
      if (keyword === '') {
        setPage(1)
        navigate(`/insurance-claims/all`, {replace: true})
      } else {
        navigate(`/insurance-claims/all?keyword=${encodedKeyword?.replaceAll('*', '')}`, {
          replace: true,
        })
      }
    } else if (filterParams2 !== '') {
      if (keyword === '') {
        setPage(1)
        navigate(`/insurance-claims/all${filterParams2}`, {replace: true})
      } else {
        navigate(
          `/insurance-claims/all${filterParams2}&keyword=${encodedKeyword?.replaceAll('*', '')}`,
          {replace: true}
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterAll?.child, columns, keyword])

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword, onSearch])

  // useEffect(() => {
  //   if (totalPerPage === 0) {
  //     const pagesetting: any = meta?.current_page > 1 ? meta?.current_page - 1 : 1
  //     Object.keys(meta || {})?.length > 0 && setPage(pagesetting || 1)
  //     setFilterAll({})
  //     setResetKeyword(true)

  //     // const urlParams = new URLSearchParams(window?.location?.search)
  //     // urlParams?.set('page', pagesetting?.toString())
  //     // const newUrl = `${window.location.pathname}?${urlParams?.toString()}`
  //     const newUrl = `${window.location.pathname}?page=${pagesetting?.toString()}`
  //     navigate(newUrl)
  //   }
  // }, [totalPerPage, meta, loadingDeleteOnFilter, navigate])

  return (
    <div className='card card-custom card-table'>
      <div className='card-table-header'>
        <div className='d-flex flex-wrap flex-stack'>
          <div className='d-flex align-items-center position-relative me-4 my-1'>
            <Search
              bg='solid'
              delay={750}
              value={keyword}
              onChange={onSearch}
              resetKeyword={resetKeyword}
              setResetKeyword={setResetKeyword}
            />

            <FilterAll columns={filterColumns} filterAll={filterAll} onChange={setFilterAll} />
          </div>

          <div className='d-flex my-1'>
            <div style={{marginRight: '5px'}}>
              {PermissionImport && (
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  onClick={() => navigate('/tools/import?type=insurance')}
                >
                  New Import
                </button>
              )}
            </div>

            <div className='dropdown' style={{marginRight: '5px'}}>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {exportPermission && <ExportPdfExcel onExport={onExport} length={lengthPDF} />}
                  {setupColumPermission && (
                    <Dropdown.Item href='#' onClick={() => navigate('/insurance-claims/columns')}>
                      Setup Column
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>

        <FilterColumns
          setPage={setPage}
          api={getClaimFilter}
          filterAll={filterAll}
          onChange={setFilterAll}
          dataStatus={dataStatus}
          replaceOption={{
            is_digital: [
              {value: 0, label: 'No'},
              {value: 1, label: 'Yes'},
            ],
          }}
        />
      </div>

      <div className='card-body table-responsive'>
        {Array.isArray(columns) && (
          <DataTable
            del={del}
            edit={edit}
            page={page}
            limit={limit}
            hrefEdit={true}
            onEdit={onEdit}
            onSort={onSort}
            render={onRender}
            hrefDetail={true}
            total={totalPage}
            columns={columns}
            orderCol={orderCol}
            orderDir={orderDir}
            onDelete={onDelete}
            onDetail={onDetail}
            onDownload={onDownload}
            data={dataInsuranceClaim}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!dataInsuranceClaimQuery?.isFetched || !columnsQuery?.isFetched}
          />
        )}
      </div>
    </div>
  )
}

let InsuranceClaim: FC = () => {
  const intl: any = useIntl()
  const currentUser: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const permissions: any = currentUser?.permissions?.map(({name}: any) => name)

  const [name, setName] = useState<string>('')
  const [guid, setGuid] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [loadingDeleteOnFilter, setLoadingDeleteOnFilter] = useState<number>(0)

  const onDelete = (e: any) => {
    const {guid, case_id} = e || {}
    setGuid(guid || '')
    setName(case_id || '')
    setShowModalConfirm(true)
  }

  const confirmDeleteLocation = useCallback(() => {
    setLoading(true)
    deleteInsuranceClaim(guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          ToastMessage({type: 'error', message})
          setLoadingDeleteOnFilter(loadingDeleteOnFilter + 1)
        }, 1000)
      })
      .catch(() => setLoading(false))
  }, [guid, reloadDelete, loadingDeleteOnFilter])

  const msg_alert: any = [
    'Are you sure you want to delete this claim ',
    <strong key='name'>{name || ''}</strong>,
    '?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.INSURANCE.CLAIM'})}</PageTitle>
      <InsuranceCard
        onDelete={onDelete}
        permissions={permissions}
        reloadDelete={reloadDelete}
        loadingDeleteOnFilter={loadingDeleteOnFilter}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Insurance'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteLocation()}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

InsuranceClaim = memo(
  InsuranceClaim,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default InsuranceClaim
