/* eslint-disable @typescript-eslint/no-empty-function */
import {CheckBox} from '@components/form/checkbox'
import {RadioFilter} from '@components/form/radio'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, KTSVG, preferenceDate} from '@helpers'
import {uniqBy} from 'lodash'
import moment from 'moment'
import {FC, Fragment, memo, useEffect, useMemo, useState} from 'react'
import {Button} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'

import {FilterDate} from './FilterDate'

type propFilters = {
  onChange?: any
  filterAll?: any
  data?: any
  api?: any
  params?: any
  setPage?: any
}

const result: any = (e: any, parent: any) => {
  const res: any = {}
  Object.entries(e || {})?.map((m: any) => {
    if (m?.[1]?.length) {
      if (parent?.find(({value}: any) => value === m?.[0])?.filterInArray === false) {
        res[m?.[0]] = m?.[1]?.map(({value}: any) => value)?.join(';')
      } else {
        if (
          m?.[0] === 'filter_date' ||
          m?.[0] === 'filter_date_type' ||
          m?.[0] === 'filter_date_value' ||
          m?.[0] === 'filter_start_date' ||
          m?.[0] === 'filter_end_date'
        ) {
          res[m?.[0]] = m?.[1]?.map(({value}: any) => value)?.join(';')
        } else {
          res[`filter[${m?.[0]}]`] = m?.[1]?.map(({value}: any) => value)?.join(';')
        }
      }
    }
    return null
  })
  return res
}

let FilterAll: FC<any> = ({columns, filterAll, onChange}) => {
  const [filterBy, setFilterBy] = useState<any>([])

  const filterOptions: any = useMemo(() => {
    const optFilter: any = columns
      ?.filter(({value}: any) => value)
      ?.sort((a: any, b: any) => (a?.header?.toLowerCase() > b?.header?.toLowerCase() ? 1 : -1))
      ?.map(({value, header: label, filterOptions: opt, filterInArray}: any) => ({
        value,
        label,
        filterInArray,
        filterOptions: opt || false,
        checked: filterBy?.parent?.map((m: any) => m?.value)?.includes(value) as never[],
      }))
    return optFilter as never[]
  }, [filterBy, columns])

  useEffect(() => {
    setFilterBy(filterAll)
  }, [filterAll])

  return (
    <div className='dropdown mx-2' style={{marginRight: '5px'}} data-cy='filter'>
      <Dropdown>
        <Dropdown.Toggle variant='primary' size='sm' data-cy='filterAll'>
          <KTSVG path={'/media/icons/duotone/Text/Filter.svg'} className={'svg-icon-sm'} /> Filter
        </Dropdown.Toggle>
        <Dropdown.Menu style={{overflowY: 'auto', maxHeight: 'calc( 70vh - 50px )'}}>
          <CheckBox
            col='12'
            name='column'
            controlled
            onChange={(e: any) => {
              const parent: any = e?.map((m: any) => {
                m.checked = true
                return m
              })

              const child: any = {}
              e?.map(({value}: any) => {
                if (filterAll?.child && filterAll?.child?.[`filter[${value}]`]) {
                  child[`filter[${value}]`] = filterAll?.child?.[`filter[${value}]`]
                }
                return value
              })
              onChange && onChange({parent, child})
              setFilterBy(e)
            }}
            options={filterOptions}
            className='m-0 d-flex flex-wrap flex-column'
            labelClass='dropdown-item'
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

let FilterColumns: FC<propFilters> = ({
  onChange,
  filterAll = {},
  data,
  api,
  params,
  setPage = function () {},
}) => {
  const pref_date: any = preferenceDate()

  const [apiData, setApiData] = useState<any>({})
  const [filterValue, setFilterValue] = useState<any>({})

  useEffect(() => {
    if (filterAll?.child) {
      setFilterValue((prev: any) => {
        const res: any = {}
        Object.keys(prev || {})?.map((m: any) => {
          const filterOpt: any = filterAll?.parent?.find(({value}: any) => value === m)
            ?.filterOptions

          if (
            Object.keys(filterAll?.child || {})
              ?.map((str: string) => str?.slice(7, -1))
              ?.includes(m)
          ) {
            res[m] = prev?.[m]
          } else if (filterOpt) {
            res[m] = prev?.[m]
          } else {
            if (
              m === 'filter_date' ||
              m === 'filter_date_type' ||
              m === 'filter_date_value' ||
              m === 'filter_start_date' ||
              m === 'filter_end_date'
            ) {
              res[m] = prev?.[m]
            } else {
              res[m] = []
            }
          }
          return m
        })
        return {...res}
      })

      let filterChild = {}
      Object.keys(filterAll?.child || {})?.forEach((item: any) => {
        let keyItem: any = item?.replace('filter[', '')
        keyItem = keyItem?.replace(']', '')
        filterChild = {
          ...filterChild,
          [keyItem]: [
            {
              value: filterAll?.child?.[item],
              label: filterAll?.child?.[item],
              checked: true,
            },
          ],
        }
      })
      setFilterValue(filterChild || {})
    }
  }, [filterAll])

  useEffect(() => {
    if (api && !!filterAll?.parent) {
      filterAll?.parent?.map(({value: column}: any) => {
        const param: any = {column}
        if (params) {
          Object.entries(params || {})?.map((e: any) => (param[`filter[${e?.[0]}]`] = e?.[1]))
        }

        if (param?.column !== 'filter_stock_status') {
          api(param)
            .then(({data: {data}}: any) => {
              setApiData((prev: any) => ({
                ...prev,
                [column]: data
                  ?.filter((f: any) => f)
                  ?.sort((a: any, b: any) => (a > b ? 1 : -1))
                  // ?.sort((a: any, b: any) => (a?.toLowerCase() > b?.toLowerCase() ? 1 : -1))
                  ?.map((m: any) => ({value: m, label: m})),
              }))
            })
            .catch((err: any) => {
              Object.values(errorValidation(err))?.map((message: any) =>
                ToastMessage({type: 'error', message})
              )
            })
        }
        return null
      })
    }
  }, [api, filterAll?.parent, params])

  return (
    <div className='row align-items-center'>
      {filterAll?.parent?.length > 0 &&
        filterAll?.parent
          ?.sort((a: any, b: any) => (a?.label?.toLowerCase() > b?.label?.toLowerCase() ? 1 : -1))
          ?.map(({value, label, filterOptions}: any, index: number) => {
            if (value === 'created_at' || value === 'created_on') {
              return (
                <div className='col-auto mt-3' key={index} data-cy={`filterButton${index}`}>
                  <div className='fs-8 fw-bolder ms-1 mb-1'>{label || ''}</div>
                  {filterOptions && Array.isArray(filterOptions) === false ? (
                    <div className='d-flex align-items-center border border-gray-300 px-2 py-1 rounded'>
                      <CheckBox
                        col='12'
                        name={value}
                        onChange={(checked: any) => {
                          onChange &&
                            onChange({
                              parent: filterAll?.parent,
                              child: result({...filterValue, [value]: checked}, filterAll?.parent),
                            })
                          setFilterValue({...filterValue, [value]: checked})
                        }}
                        options={[filterOptions]}
                        className='m-0'
                        labelClass='cursor-pointer p-0 text-primary'
                      />

                      <div
                        onClick={() => {
                          onChange &&
                            onChange({
                              parent: filterAll?.parent?.filter((f: any) => f?.value !== value),
                              child: result({...filterValue, [value]: []}),
                            })
                          setFilterValue({...filterValue, [value]: []})
                        }}
                        className='bg-light-danger ms-5 cursor-pointer px-2 d-inline-flex align-items-center justify-content-center rounded-circle h-25px w-25px '
                      >
                        <i className='fa fa-times text-danger' />
                      </div>
                    </div>
                  ) : (
                    <Dropdown className='bg-white rounded border border-secondary'>
                      <Dropdown.Toggle variant='transparent' className='fs-8 bg-white' size='sm'>
                        <span className='fw-bolder'>
                          {!!filterValue?.['filter_date_type'] &&
                          filterValue?.['filter_date_type']?.length
                            ? filterValue?.['filter_date_type']?.map((m: any, index: number) => {
                                if (m?.value === 'between') {
                                  return (
                                    <Fragment key={index}>
                                      Between {' ('}
                                      {moment(
                                        new Date(filterValue?.filter_start_date?.[0]?.label)
                                      )?.format(pref_date)}
                                      {' to '}
                                      {moment(
                                        new Date(filterValue?.filter_end_date?.[0]?.label)
                                      )?.format(pref_date)}
                                      {')'}
                                    </Fragment>
                                  )
                                } else if (m?.value === 'whithin_the_last') {
                                  return (
                                    <Fragment key={index}>
                                      Whitin the last {filterValue?.filter_date_value?.[0]?.label}{' '}
                                      {filterValue?.filter_date?.[0]?.label}
                                    </Fragment>
                                  )
                                } else {
                                  return (
                                    <Fragment key={index}>
                                      More than {filterValue?.filter_date_value?.[0]?.label}{' '}
                                      {filterValue?.filter_date?.[0]?.label}
                                    </Fragment>
                                  )
                                }
                              })
                            : `Choose ${label || ''}`}
                        </span>
                      </Dropdown.Toggle>

                      <div
                        onClick={() => {
                          delete filterValue?.filter_date_type
                          delete filterValue?.filter_date
                          delete filterValue?.filter_date_value
                          delete filterValue?.filter_start_date
                          delete filterValue?.filter_end_date
                          onChange &&
                            onChange({
                              parent: filterAll?.parent?.filter((f: any) => f?.value !== value),
                              child: result({
                                ...filterValue,
                                [value]: [],
                              }),
                            })
                          setFilterValue({...filterValue, [value]: []})
                        }}
                        className='bg-light-danger mx-1 cursor-pointer px-2 d-inline-flex align-items-center justify-content-center rounded-circle h-25px w-25px '
                      >
                        <i className='fa fa-times text-danger' />
                      </div>

                      <FilterDate
                        result={result}
                        onChange={onChange}
                        filterAll={filterAll}
                        filterValue={filterValue}
                        setFilterValue={setFilterValue}
                      />
                    </Dropdown>
                  )}
                </div>
              )
            } else {
              return (
                <Fragment key={index}>
                  <div className='col-auto mt-3' key={index} data-cy={`filterButton${index}`}>
                    <div className='fs-8 fw-bolder ms-1 mb-1'>{label || ''}</div>
                    {filterOptions && Array.isArray(filterOptions) === false ? (
                      <div className='d-flex align-items-center border border-gray-300 px-2 py-1 rounded'>
                        <CheckBox
                          col='12'
                          name={value}
                          onChange={(checked: any) => {
                            onChange &&
                              onChange({
                                parent: filterAll?.parent,
                                child: result(
                                  {...filterValue, [value]: checked},
                                  filterAll?.parent
                                ),
                              })
                            setFilterValue({...filterValue, [value]: checked})
                          }}
                          options={[filterOptions]}
                          className='m-0'
                          labelClass='cursor-pointer p-0 text-primary'
                        />

                        <div
                          onClick={() => {
                            onChange &&
                              onChange({
                                parent: filterAll?.parent?.filter((f: any) => f?.value !== value),
                                child: result({...filterValue, [value]: []}),
                              })
                            setFilterValue({...filterValue, [value]: []})
                          }}
                          className='bg-light-danger ms-5 cursor-pointer px-2 d-inline-flex align-items-center justify-content-center rounded-circle h-25px w-25px '
                        >
                          <i className='fa fa-times text-danger' />
                        </div>
                      </div>
                    ) : (
                      <Dropdown className='bg-white rounded border border-secondary'>
                        <Dropdown.Toggle variant='transparent' className='fs-8 bg-white' size='sm'>
                          <span className='fw-bolder'>
                            {!!filterValue?.[value] && filterValue?.[value]?.length
                              ? filterValue?.[value]
                                  ?.map((m: any) => (m ? m?.label : '-'))
                                  ?.join(', ')
                              : `Choose ${label || ''}`}
                          </span>
                        </Dropdown.Toggle>

                        <div
                          onClick={() => {
                            onChange &&
                              onChange({
                                parent: filterAll?.parent?.filter((f: any) => f?.value !== value),
                                child: result({...filterValue, [value]: []}),
                              })
                            setFilterValue({...filterValue, [value]: []})
                          }}
                          className='bg-light-danger mx-1 cursor-pointer px-2 d-inline-flex align-items-center justify-content-center rounded-circle h-25px w-25px '
                        >
                          <i className='fa fa-times text-danger' />
                        </div>
                        <Dropdown.Menu
                          style={{overflowY: 'auto', maxHeight: 'calc( 70vh - 50px )'}}
                          id='section-checkbox'
                        >
                          <CheckBox
                            col='12'
                            name={value}
                            defaultValue={filterAll?.child}
                            onChange={(checked: any) => {
                              onChange &&
                                onChange({
                                  parent: filterAll?.parent,
                                  child: result(
                                    {...filterValue, [value]: checked},
                                    filterAll?.parent
                                  ),
                                })
                              setFilterValue({...filterValue, [value]: checked})
                              setPage(1)
                            }}
                            options={
                              filterOptions
                                ? filterOptions
                                : data
                                ? uniqBy(
                                    data
                                      ?.sort((a: any, b: any) =>
                                        a?.name?.toLowerCase() > b?.name?.toLowerCase() ? 1 : -1
                                      )
                                      ?.map((e: any) => {
                                        let res: any = {value: 'null', label: '-'}
                                        if (
                                          typeof e?.[value] === 'object' &&
                                          (e?.[value]?.value || e?.[value]?.label)
                                        ) {
                                          res = {
                                            value:
                                              typeof e?.[value]?.value === 'number'
                                                ? e?.[value]?.value
                                                : e?.[value]?.value || 'null',
                                            label:
                                              typeof e?.[value]?.label === 'number'
                                                ? e?.[value]?.label
                                                : e?.[value]?.label || '-',
                                          }
                                        } else if (
                                          !['object', 'function']?.includes(typeof e?.[value]) &&
                                          (e?.[value] ||
                                            e?.original?.[value] ||
                                            typeof e?.[value] === 'number') &&
                                          e?.[value] !== '-'
                                        ) {
                                          res = {
                                            value:
                                              e?.[value] ||
                                              e?.original?.[value] ||
                                              (typeof e?.[value] === 'number'
                                                ? e?.[value]
                                                : e?.[value] || 'null'),
                                            label:
                                              e?.[value] ||
                                              e?.original?.[value] ||
                                              (typeof e?.[value] === 'number'
                                                ? e?.[value]
                                                : e?.[value] || 'null'),
                                          }
                                        }
                                        return res
                                      }),
                                    'label'
                                  )
                                : (apiData?.[value] as never[])
                            }
                            className='m-0'
                            labelClass='dropdown-item'
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                  <style>
                    {`
                      #section-checkbox::-webkit-scrollbar-thumb {
                        background-color: #7E807F
                      }
                    `}
                  </style>
                </Fragment>
              )
            }
          })}
    </div>
  )
}

let FilterRadio: FC<any> = ({columns, filterAll, setFilterAll, onChange, name}) => {
  const [filterBy, setFilterBy] = useState<any>([])
  const [clearButton, setClearButton] = useState<boolean>(true)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [checkedRadio, setCheckedRadio] = useState<any>({isChecked: ''})

  const filterOptions = useMemo(() => {
    const optFilter: any = columns
      ?.filter(({value}: any) => value)
      ?.sort((a: any, b: any) => (a?.header?.toLowerCase() > b?.header?.toLowerCase() ? 1 : -1))
      ?.map(({value, header: label, filterOptions: opt, filterInArray}: any) => ({
        value,
        label,
        filterInArray,
        filterOptions: opt || false,
        checked: filterBy?.parent?.map((m: any) => m?.value)?.includes(value),
      }))
    return optFilter as never[]
  }, [filterBy, columns])

  useEffect(() => {
    setFilterBy(filterAll)
  }, [filterAll])

  const setDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  useEffect(() => {
    checkedRadio?.isChecked !== '' && setClearButton(false)
  }, [checkedRadio])

  const onClear = () => {
    setClearButton(true)
    setFilterAll(undefined)
    setShowDropdown(!showDropdown)
    setCheckedRadio({isChecked: ''})
  }

  return (
    <div className='dropdown mx-2' style={{marginRight: '5px'}}>
      <Dropdown show={showDropdown} onToggle={setDropdown}>
        <Dropdown.Toggle variant='primary' size='sm'>
          <KTSVG path={'/media/icons/duotone/Text/Filter.svg'} className={'svg-icon-sm'} /> Filter
        </Dropdown.Toggle>
        <Dropdown.Menu style={{overflowY: 'auto', maxHeight: 'calc( 70vh - 50px )'}}>
          <RadioFilter
            name={name}
            controlled
            onChange={(e: any) => {
              const child: any = {}
              const parent: any = [
                {
                  checked: true,
                  filterInArray: undefined,
                  filterOptions: e?.filterOptions || '',
                  label: e?.label || '',
                  value: e?.value || '',
                },
              ]

              setFilterBy(e)
              onChange && onChange({parent, child})
            }}
            className='m-0'
            options={filterOptions}
            labelClass='dropdown-item'
            checkedRadio={checkedRadio}
            setCheckedRadio={setCheckedRadio}
          />
          <div className='bg-light' style={{float: 'right'}}>
            <Button
              variant='primary'
              onClick={onClear}
              disabled={clearButton}
              className='btn-sm mt-3 mb-1 me-5'
            >
              <span className='indicator-label'>Clear</span>
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

FilterAll = memo(FilterAll, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
FilterColumns = memo(
  FilterColumns,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
FilterRadio = memo(
  FilterRadio,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {FilterAll, FilterColumns, FilterRadio}
