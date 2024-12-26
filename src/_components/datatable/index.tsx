import './style.scss'

import Tooltip from '@components/alert/tooltip'
import {PageLoader} from '@components/loader/cloud'
import {KTSVG, truncateChar} from '@helpers'
import cx from 'classnames'
import {FC, Fragment, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

import {PaginationDatatable} from './pagination'

type Props = {
  columns: any
  data: any
  limit: any
  total: any
  onDownload?: any
  onFeedback?: any
  onDetail?: any
  hrefDetail?: any
  hrefEdit?: any
  onEdit?: any
  onDelete?: any
  onRestore?: any
  onChangePage?: any
  page?: any
  onChangeLimit?: any
  onChecked?: any
  onCheckedRadio?: any
  onSort?: any
  onSortDir?: any
  hoverRow?: any
  view?: boolean
  edit?: boolean
  del?: boolean
  isPagination?: boolean
  bulk?: boolean
  render?: any
  loading: any
  className?: any
  editRequestPermission?: any
  deleteRequestPermission?: any
  feedbackPermission?: any
  customEmptyTable?: string | any
  height?: any
  orderCol?: any
  orderDir?: any
  title?: any
}

const DataTable: FC<Props> = ({
  columns,
  data,
  limit,
  total,
  onDownload,
  onFeedback,
  onDelete,
  onRestore,
  onEdit,
  hrefEdit = false,
  onDetail,
  page = 1,
  hrefDetail = false,
  onChangePage,
  onChangeLimit,
  onChecked,
  onCheckedRadio,
  onSort,
  onSortDir,
  hoverRow,
  view = true,
  edit = true,
  del = true,
  bulk = true,
  render = false,
  loading = true,
  isPagination = true,
  className = '',
  editRequestPermission = true,
  deleteRequestPermission = true,
  feedbackPermission = true,
  customEmptyTable,
  height = 'auto',
  orderCol = '',
  orderDir = '',
  title = 'Data',
}) => {
  const [asc, setAsc] = useState<boolean>(true)
  const [dataTable, setDataTable] = useState<any>(data || [])
  const [indexActiveSort, setIndexActiveSort] = useState<any>()
  const [checkedAll, setCheckedAll] = useState<boolean>(false)
  const [checkedRadio, setCheckedRadio] = useState<string>('')

  const totalPage: any = total || 0
  const themeHeader: any = 'text-dark fs-7 py-5'
  const fontSize: any = 12

  const handleSort = (value: string, index: number, sort: any) => {
    if (value) {
      setIndexActiveSort(index)
      setAsc(!asc || !sort)
      onSort && onSort(value)
      onSortDir && onSortDir(!asc)
    }
  }

  const getvalsearch: any = document.getElementById('kt_filter_search') || ''

  const headerGroup: any = {
    left: [
      {name: 'checkbox', rules: del && editRequestPermission},
      {name: 'radio', rules: true},
      {name: 'view', rules: view},
    ],
    right: [
      {
        name: 'edit',
        rules: edit && editRequestPermission,
        title: 'Edit',
        icon: 'pen-nib',
        theme: 'warning',
        action: onEdit,
      },
      {
        name: 'delete',
        rules: del && deleteRequestPermission,
        title: 'Delete',
        icon: 'trash-alt',
        theme: 'danger',
        action: onDelete,
      },
      {
        name: 'download',
        rules: true,
        title: 'Download',
        icon: 'download',
        theme: 'primary',
        action: onDownload,
      },
      {
        name: 'feedback',
        rules: feedbackPermission,
        title: 'Feedback',
        icon: 'star',
        theme: 'success',
        action: onFeedback,
      },
      {
        name: 'restore',
        rules: true,
        title: 'Restore',
        icon: 'sync',
        theme: 'success',
        action: onRestore,
      },
    ],
  }

  useEffect(() => {
    setCheckedAll(false)
    setDataTable(data)
  }, [data])

  return (
    <>
      {dataTable?.length || loading ? (
        <div className='table-responsive table-custom--' style={{height}}>
          <table
            className={`table table-sm ${
              dataTable?.length > 1 && !loading ? 'table-striped' : ''
            } table-row-dashed table-row-gray-300 gx-3 gy-1 mb-1 rounded ${className}`}
            data-cy='table'
          >
            {columns?.length > 0 && !loading ? (
              <thead className='sticky-cus' style={{top: 0}}>
                <tr className='fw-bolder fs-6 text-gray-800'>
                  {columns
                    ?.filter(
                      ({header}: any) =>
                        !headerGroup?.right
                          ?.map(({name}: any) => name)
                          ?.includes(header?.toLowerCase())
                    )
                    ?.map((e: any, index: any) => {
                      const {width, header, value, sort, show}: any = e || {}
                      const headerName: any = header?.toLowerCase()
                      const cekCheckbox: any = columns
                        ?.filter((f: any) => f && f?.header)
                        ?.find(({header}: any) => header?.toLowerCase() === 'checkbox')
                      const cekRadio: any = columns
                        ?.filter((f: any) => f && f?.header)
                        ?.find(({header}: any) => header?.toLowerCase() === 'radio')

                      if (show === false) {
                        return null
                      }

                      return (
                        <Fragment key={index}>
                          {[
                            ...headerGroup?.left?.map(({name}: any) => name),
                            ...headerGroup?.right?.map(({name}: any) => name),
                          ]?.includes(headerName) ? (
                            <>
                              {headerName === 'checkbox' &&
                                del &&
                                bulk &&
                                editRequestPermission && (
                                  <th
                                    style={{width, left: 0}}
                                    className={cx('sticky-cus', themeHeader)}
                                  >
                                    {/*form-check form-check-custom form-check-solid mx-5*/}
                                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                      <input
                                        type='checkbox'
                                        className={cx(
                                          'form-check-input',
                                          !checkedAll && 'border border-gray-300'
                                        )}
                                        checked={checkedAll}
                                        data-cy='checkbokBulkAll'
                                        onChange={({target: {checked}}: any) => {
                                          setCheckedAll(checked)
                                          const tmp: any = dataTable?.map((x: any) => {
                                            return {
                                              ...x,
                                              checked: checked,
                                            }
                                          })
                                          setDataTable(tmp)
                                          onChecked(tmp)
                                        }}
                                      />
                                    </div>
                                  </th>
                                )}
                              {headerName === 'radio' && (
                                <th
                                  style={{width, left: 0}}
                                  className={cx('sticky-cus', themeHeader)}
                                >
                                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                    &nbsp;
                                  </div>
                                </th>
                              )}
                              {headerName === 'view' && view && (
                                <th
                                  style={{
                                    width,
                                    cursor: 'pointer',
                                    left: cekCheckbox || cekRadio === undefined ? 0 : 33,
                                  }}
                                  className='sticky-cus text-center py-3'
                                >
                                  <i className='las la-eye fs-1 text-gray-300' />
                                </th>
                              )}
                            </>
                          ) : (
                            <th
                              data-cy='sort'
                              onClick={() => {
                                if (sort) {
                                  handleSort(value, index, indexActiveSort === index)
                                }
                              }}
                              className={themeHeader}
                              style={{width, cursor: 'pointer'}}
                            >
                              <div className='d-flex align-items-center text-nowrap'>
                                <span
                                  className={`me-1 fw-bolder py-1 my-n1 fs-13px ${
                                    orderDir && e?.value === orderCol
                                      ? 'text-primary bg-light-primary px-2 radius-5 ms-n2'
                                      : sort && indexActiveSort === index
                                      ? 'text-primary bg-light-primary px-2 radius-5 ms-n2'
                                      : !sort
                                      ? 'text-dark cursor-na'
                                      : 'text-dark'
                                  }`}
                                >
                                  {header}
                                </span>
                                {sort &&
                                  (orderDir !== '' ? (
                                    e?.value === orderCol ? (
                                      <KTSVG
                                        path={`/media/icons/duotone/Navigation/Arrow-${
                                          orderDir !== ''
                                            ? orderDir === 'asc'
                                              ? 'up'
                                              : 'down'
                                            : asc
                                            ? 'up'
                                            : 'down'
                                        }.svg`}
                                        className='svg-icon-primary'
                                      />
                                    ) : (
                                      <KTSVG
                                        path={'/media/icons/duotone/Navigation/Arrow-down.svg'}
                                      />
                                    )
                                  ) : sort ? (
                                    indexActiveSort === index ? (
                                      <KTSVG
                                        path={`/media/icons/duotone/Navigation/Arrow-${
                                          orderDir !== ''
                                            ? orderDir === 'asc'
                                              ? 'up'
                                              : 'down'
                                            : asc
                                            ? 'up'
                                            : 'down'
                                        }.svg`}
                                        className='svg-icon-primary'
                                      />
                                    ) : (
                                      <KTSVG
                                        path={'/media/icons/duotone/Navigation/Arrow-down.svg'}
                                      />
                                    )
                                  ) : (
                                    ''
                                  ))}
                              </div>
                            </th>
                          )}
                        </Fragment>
                      )
                    })}
                  <th
                    className='sticky-cus text-center px-2 end-0'
                    style={{verticalAlign: 'middle'}}
                  >
                    <div
                      className='d-flex align-items-center'
                      style={{justifyContent: 'space-evenly'}}
                    >
                      {columns
                        ?.filter(
                          ({header}: any) =>
                            headerGroup?.right
                              ?.map(({name}: any) => name)
                              ?.includes(header?.toLowerCase())
                        )
                        ?.map(({header}: any, headerIdx: number) => {
                          const headers: any = headerGroup?.right?.find(
                            ({name, rules}: any) => name === header?.toLowerCase() && rules
                          )
                          return headers ? (
                            <i
                              key={headerIdx}
                              className={`las la-${headers?.icon} fs-1 text-gray-300`}
                            />
                          ) : (
                            ''
                          )
                        })}
                    </div>
                  </th>
                </tr>
              </thead>
            ) : null}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns?.length}>
                    <PageLoader height={250} />
                  </td>
                </tr>
              ) : !columns?.length ? (
                <div className='text-center w-100'>
                  <div className='mb-2 mt-20'>
                    <img
                      src={'/media/svg/others/list.svg'}
                      alt='no-data'
                      style={{opacity: 0.5}}
                      className='w-auto h-50px'
                    />
                  </div>
                  <p
                    className='text-gray-400 fw-bold m-0 mb-20 text-capitalize'
                    data-cy='table-empty-message'
                  >
                    Columns not found
                  </p>
                </div>
              ) : (
                dataTable?.map((data: any, tableIdx: number) => {
                  const cekCheckbox = Object.keys(data || {})?.find(
                    (item: any) => item?.toLowerCase() === 'checkbox'
                  )
                  const cekRadio = Object.keys(data || {})?.find(
                    (item: any) => item?.toLowerCase() === 'radio'
                  )
                  const customEl: any = render ? render('', data) : {}
                  const hiddenItems: any = columns
                    ?.filter(({show}: any) => show === false)
                    ?.map(({value}: any) => value)

                  return (
                    <tr
                      key={tableIdx}
                      className={cx('align-middle', {'cursor-pointer data-hover': hoverRow})}
                    >
                      {Object.keys(data || {})?.map((item: any, itemIdx: number) => {
                        const cols: any = columns?.find(({value}: any) => value === item) || {}
                        const {tdClass: className}: any = cols || {}
                        let linkDetail: any = '#'

                        if (hrefDetail) {
                          linkDetail = onDetail(data?.original)
                        }

                        if (customEl?.[item]) {
                          const El: any = render(data?.[item] || '', data)
                          return (
                            <td className={`fs-${fontSize}px`} key={itemIdx}>
                              {typeof El?.[item] === 'function' ? El?.[item]?.() : El?.[item]}
                            </td>
                          )
                        }

                        if (item?.toLowerCase() === 'checkbox') {
                          if (del && bulk && editRequestPermission) {
                            return (
                              <td
                                key={itemIdx}
                                style={{left: 0, zIndex: 'auto'}} //, position: 'static'
                                className='sticky-cus'
                              >
                                <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                  <input
                                    type='checkbox'
                                    className={cx(
                                      'form-check-input',
                                      !data?.checked
                                        ? 'border border-gray-300'
                                        : 'border border-primary-300'
                                    )}
                                    data-cy='checkbokBulk'
                                    checked={data?.checked || false}
                                    onChange={({target: {checked}}: any) => {
                                      const id: any = data?.original?.guid || ''
                                      const tmp: any = dataTable?.map((x: any) => {
                                        const {original} = x || {}
                                        const {guid} = original || {}
                                        if (guid === id) {
                                          return {
                                            ...x,
                                            checked: checked,
                                          }
                                        }
                                        return x
                                      })
                                      setDataTable(tmp)
                                      onChecked(tmp)

                                      let check_all: any = true
                                      tmp?.forEach((ck: any) => {
                                        const {checked} = ck || {}
                                        if (!checked) {
                                          check_all = false
                                        }
                                      })
                                      setCheckedAll(check_all)
                                    }}
                                  />
                                </div>
                              </td>
                            )
                          } else {
                            return null
                          }
                        }

                        if (item?.toLowerCase() === 'radio') {
                          return (
                            <td key={itemIdx} style={{left: 0}} className='sticky-cus'>
                              <div className='form-check form-check-sm form-check-custom form-check-solid'>
                                <input
                                  type='radio'
                                  name='radio'
                                  value={data?.guid}
                                  className='form-check-input border border-gray-300'
                                  checked={data?.guid === checkedRadio ? true : false}
                                  onChange={(ck: any) => {
                                    onCheckedRadio(ck?.target?.value)
                                    setCheckedRadio(ck?.target?.value)
                                  }}
                                />
                              </div>
                            </td>
                          )
                        }

                        if (item?.toLowerCase() === 'view' && view) {
                          return (
                            <td
                              key={itemIdx}
                              style={{
                                left: cekCheckbox || cekRadio === undefined ? 0 : 33,
                                zIndex: 'auto',
                              }} //position: 'static',
                              className='sticky-cus'
                            >
                              {hrefDetail ? (
                                <Tooltip placement='top' title='View'>
                                  <Link
                                    to={linkDetail}
                                    className={`btn btn-icon border border-secondary table-icon btn-color-gray-600 btn-light-primary`}
                                  >
                                    <i className='las la-eye fs-3' />
                                  </Link>
                                </Tooltip>
                              ) : (
                                <Tooltip placement='top' title='View'>
                                  <a
                                    data-cy='viewTable'
                                    className={`btn btn-icon border border-secondary table-icon btn-color-gray-600 btn-light-primary`}
                                    onClick={() => {
                                      onDetail?.(data?.original)
                                    }}
                                  >
                                    <i className='las la-eye fs-3' />
                                  </a>
                                </Tooltip>
                              )}
                            </td>
                          )
                        }

                        if (item === 'photos') {
                          return <td key={itemIdx}>{item}</td>
                        }

                        if (['guid', 'original', 'preference']?.includes(item)) {
                          return null
                        }
                        if (hiddenItems?.includes(item)) {
                          return null
                        }
                        if (
                          headerGroup?.right
                            ?.map(({name}: any) => name)
                            ?.includes(item?.toLowerCase())
                        ) {
                          return null
                        }

                        if (item === 'is_active_approver') {
                          return (
                            <td key={itemIdx}>
                              <KTSVG
                                path={`/media/icons/duotone/Navigation/${
                                  data?.[item] ? 'Check' : 'Close'
                                }.svg`}
                                className={`svg-icon-${
                                  data?.[item] ? 'primary' : 'danger'
                                } svg-icon-5 ms-0 me-0`}
                              />
                            </td>
                          )
                        }

                        if ([null, undefined]?.includes(data?.[item])) {
                          return (
                            <td className={`fs-${fontSize}px`} key={itemIdx}>
                              -
                            </td>
                          )
                        } else if (['object', 'function']?.includes(typeof data?.[item])) {
                          return <td key={itemIdx}>[{typeof data?.[item]}]</td>
                        }

                        if (item === 'radio') {
                          return (
                            <td key={itemIdx}>
                              <div className='form-check form-check-inline'>
                                <input
                                  type='radio'
                                  name='role'
                                  className='form-check-input'
                                  value={data?.guid}
                                  checked={data?.checked || false}
                                  onChange={({target: {value, checked}}: any) => {
                                    const checked_id: any = value || ''
                                    const tmp: any = dataTable?.map((x: any) => {
                                      const {original} = x || {}
                                      const {id} = original || {}
                                      if (checked_id === id) {
                                        return {
                                          ...x,
                                          checked: checked,
                                        }
                                      } else {
                                        return {
                                          ...x,
                                          checked: false,
                                        }
                                      }
                                    })
                                    setDataTable(tmp)
                                    onChecked(tmp)
                                  }}
                                />
                              </div>
                            </td>
                          )
                        }

                        if (
                          !headerGroup?.right
                            ?.map(({name}: any) => name)
                            ?.includes(item?.toLowerCase()) &&
                          typeof data?.[item] !== 'boolean'
                        ) {
                          if (hoverRow && parseInt(data?.[item], 10) > 0 && item !== 'date') {
                            return (
                              <td
                                key={itemIdx}
                                className={`${
                                  className || ''
                                } text-nowrap text-truncate fs-${fontSize}px`}
                                style={{fontWeight: 'bold'}}
                                data-cy='table-content'
                              >
                                {data?.[item] || ''}
                              </td>
                            )
                          }
                          return (
                            <td
                              key={itemIdx}
                              className={`${
                                className || ''
                              } text-nowrap text-truncate fs-${fontSize}px`}
                              data-cy='table-content'
                            >
                              {data?.[item]?.toString()?.length > 45 && cols?.truncate !== false ? (
                                <Tooltip placement='auto' title={data?.[item] || ''}>
                                  <span>{truncateChar(data?.[item], 45)}</span>
                                </Tooltip>
                              ) : (
                                data?.[item] || ''
                              )}
                            </td>
                          )
                        } else {
                          return null
                        }
                      })}
                      <td
                        className='sticky-cus text-center px-2 end-0'
                        style={{position: 'sticky', zIndex: 'auto'}}
                      >
                        <div className='d-flex my-1'>
                          {Object.keys(data || {})?.map((item: any, headerRightIdx: number) => {
                            const header: any = headerGroup?.right?.find(
                              ({name, rules}: any) => name === item?.toLowerCase() && rules
                            )
                            if (header) {
                              if (item === 'Edit' && hrefEdit) {
                                const linkEdit: any = onEdit(data?.original)
                                return (
                                  <Fragment key={headerRightIdx}>
                                    <Tooltip placement='left' title={header?.title}>
                                      <Link
                                        to={data?.[item] !== false ? linkEdit || '#' : '#'}
                                        className={cx(
                                          `btn btn-icon border border-dashed table-icon mx-1`,
                                          data?.[item] !== false
                                            ? `btn-light-${header?.theme} border-${header?.theme}`
                                            : 'bg-gray-100 border-secondary'
                                        )}
                                        style={{
                                          cursor:
                                            data?.[item] !== false ? 'pointer' : 'not-allowed',
                                        }}
                                      >
                                        <i className={`las la-${header?.icon} fs-3`} />
                                      </Link>
                                    </Tooltip>
                                  </Fragment>
                                )
                              } else {
                                return (
                                  <Fragment key={headerRightIdx}>
                                    <Tooltip placement='left' title={header?.title}>
                                      <div
                                        data-cy={`${header?.name}Table`}
                                        className={cx(
                                          `btn btn-icon border border-dashed table-icon mx-1`,
                                          data?.[item] !== false
                                            ? data?.[item] === 'loading'
                                              ? `bg-light-${header?.theme} border-${header?.theme} opacity-50`
                                              : `btn-light-${header?.theme} border-${header?.theme}`
                                            : 'bg-gray-100 border-secondary'
                                        )}
                                        onClick={() =>
                                          data?.[item] !== false &&
                                          data?.[item] !== 'loading' &&
                                          header?.action?.(data?.original)
                                        }
                                        style={{
                                          cursor:
                                            data?.[item] !== false && data?.[item] !== 'loading'
                                              ? 'pointer'
                                              : 'not-allowed',
                                        }}
                                      >
                                        {data?.[item] === 'loading' ? (
                                          <span className='indicator-progress d-block'>
                                            <span
                                              className={`spinner-border spinner-border-sm align-middle text-${header?.theme}`}
                                            ></span>
                                          </span>
                                        ) : (
                                          <i className={`las la-${header?.icon} fs-3`} />
                                        )}
                                      </div>
                                    </Tooltip>
                                  </Fragment>
                                )
                              }
                            } else {
                              return ''
                            }
                          })}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-center w-100'>
          <div className='mb-2 mt-20'>
            <img
              src={'/media/svg/others/no-data.png'}
              style={{opacity: 0.5}}
              className='w-auto h-100px'
              alt='no-data'
            />
          </div>
          <p
            className='text-gray-400 fw-bold m-0 mb-20 text-capitalize'
            data-cy='table-empty-message'
          >
            {getvalsearch?.value ? (
              'No result found'
            ) : (
              <>{customEmptyTable === undefined ? `No ${title} added` : customEmptyTable}</>
            )}
          </p>
        </div>
      )}
      {Array.isArray(data) && data?.length > 0 && (
        <PaginationDatatable
          limit={limit}
          page={page}
          total={totalPage}
          onChangeLimit={onChangeLimit}
          onChangePage={onChangePage}
          isPagination={isPagination}
        />
      )}
    </>
  )
}

export {DataTable}
