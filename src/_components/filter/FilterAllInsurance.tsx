import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, KTSVG} from '@helpers'
import uniqBy from 'lodash/uniqBy'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

const result: any = (e: any, parent: any) => {
  const res: any = {}
  Object.entries(e || {})?.map((m: any) => {
    if (m?.[1]?.length) {
      if (parent?.find(({value}: any) => value === m?.[0])?.filterInArray === false) {
        res[m[0]] = m?.[1]?.map(({value}: any) => value).join(';')
      } else {
        res[`filter[${m[0]}]`] = m?.[1].map(({value}: any) => value)?.join(';')
      }
    }
    return null
  })
  return res
}

let FilterAll: FC<any> = ({columns, filterAll, onChange}) => {
  const [filterBy, setFilterBy] = useState<any>([])

  const filterOptions = useMemo(() => {
    const optFilter = columns
      ?.filter(({value}: any) => value)
      ?.map(({value, header: label, filterOptions: opt, filterInArray}: any) => ({
        value,
        label,
        filterInArray,
        filterOptions: opt || false,
        checked: filterBy?.parent?.map((m: any) => m?.value)?.includes(value),
      }))
    return optFilter
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
            name='column'
            controlled
            onChange={(e: any) => {
              const parent = e?.map((m: any) => {
                m.checked = true
                return m
              })
              const child: any = {}
              e.map(({value}: any) => {
                if (filterAll?.child && filterAll?.child[`filter[${value}]`]) {
                  child[`filter[${value}]`] = filterAll?.child[`filter[${value}]`]
                }
                return value
              })
              onChange && onChange({parent, child})
              setFilterBy(e)
            }}
            options={filterOptions}
            className='m-0'
            labelClass='dropdown-item'
          />
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

let FilterColumns: FC<any> = ({
  onChange,
  filterAll = {},
  data,
  api,
  params,
  dataStatus,
  setPage,
  replaceOption,
}) => {
  const [filterValue, setFilterValue] = useState<any>({})
  const [apiData, setApiData] = useState<any>({})

  useEffect(() => {
    if (filterAll?.child) {
      setFilterValue((prev: any) => {
        const res: any = {}
        Object.keys(prev || {})?.map((m: any) => {
          const filterOpt: any = filterAll?.parent?.find(({value}: any) => value === m)
            ?.filterOptions
          if (
            Object.keys(filterAll?.child || {})
              ?.map((str: string) => str.slice(7, -1))
              ?.includes(m)
          ) {
            res[m] = prev[m]
          } else if (filterOpt) {
            res[m] = prev[m]
          } else {
            res[m] = []
          }
          return m
        })
        return {...res}
      })

      let filterChild = {}
      Object.keys(filterAll?.child || {})?.forEach((item: any) => {
        let keyItem = item?.replace('filter[', '')
        keyItem = keyItem?.replace(']', '')
        const selectedItem: any = replaceOption?.[keyItem]
          ?.filter(
            ({value}: any) =>
              filterAll?.child?.[item]
                ?.toString()
                ?.split(';')
                ?.includes(value?.toString())
          )
          ?.map(({label}: any) => label)
          ?.join(';')
        filterChild = {
          ...filterChild,
          [keyItem]: [
            {
              value: filterAll?.child?.[item],
              label: selectedItem || filterAll?.child?.[item]?.replace('%26', '&'),
              checked: true,
            },
          ],
        }
      })
      setFilterValue(filterChild)
    }
  }, [filterAll, replaceOption])

  useEffect(() => {
    if (api && !!filterAll?.parent) {
      filterAll?.parent?.map(({value: column}: any) => {
        const param: any = {column}
        if (params) {
          Object.entries(params || {}).map((e: any) => (param[`filter[${e[0]}]`] = e[1]))
        }

        api(param)
          .then(({data: {data}}: any) => {
            let dataFilter: any = data || {}
            if (!Array.isArray(data)) {
              dataFilter = Object.entries(dataFilter)?.map((arr: any) => ({
                name: arr?.[1],
              }))
            }
            setApiData((a: any) => ({
              ...a,
              [column]: dataFilter?.map((m: any) => ({value: m?.name, label: m?.name})),
              ...(replaceOption || {}),
            }))
          })
          .catch((err: any) => {
            Object.values(errorValidation(err))?.map((message: any) =>
              ToastMessage({type: 'error', message})
            )
          })
        return null
      })
    }
  }, [api, filterAll.parent, params, replaceOption])

  return (
    <div className='row align-items-center'>
      {filterAll?.parent?.length > 0 &&
        filterAll?.parent?.map(({value, label, filterOptions}: any, index: number) => (
          <div className='col-auto mt-3' key={index}>
            <div className='fs-8 fw-bolder ms-1 mb-1'>{label}</div>
            {filterOptions && Array.isArray(filterOptions) === false ? (
              <div className='d-flex align-items-center border border-gray-300 px-2 py-1 rounded'>
                <CheckBox
                  name={value}
                  onChange={(checked: any) => {
                    onChange &&
                      onChange({
                        parent: filterAll.parent,
                        child: result({...filterValue, [value]: checked}, filterAll.parent),
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
                <Dropdown.Toggle
                  variant='transparent'
                  className='fs-8 bg-white'
                  size='sm'
                  data-cy='filterChild'
                >
                  <span className='fw-bolder'>
                    {!!filterValue[value] && filterValue[value]?.length
                      ? filterValue[value]?.map((m: any) => (m ? m.label : '-'))?.join(', ')
                      : `Choose ${label}`}
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
                <Dropdown.Menu style={{overflowY: 'auto', maxHeight: 'calc( 70vh - 50px )'}}>
                  <CheckBox
                    name={value}
                    onChange={(checked: any) => {
                      onChange &&
                        onChange({
                          parent: filterAll.parent,
                          child: result({...filterValue, [value]: checked}, filterAll.parent),
                        })
                      setFilterValue({...filterValue, [value]: checked})
                      setPage(1)
                    }}
                    options={
                      filterOptions
                        ? filterOptions
                        : data
                        ? uniqBy(
                            value === 'status'
                              ? dataStatus
                              : data?.map((e: any) => {
                                  let res: any = {value: 'null', label: '-', checked: false}
                                  if (
                                    typeof e[value] === 'object' &&
                                    (e[value]?.value || e[value]?.label)
                                  ) {
                                    res = {
                                      value:
                                        typeof e[value]?.value === 'number'
                                          ? e[value]?.value
                                          : e[value]?.value || 'null',
                                      label:
                                        typeof e[value]?.label === 'number'
                                          ? e[value]?.label
                                          : e[value]?.label || '-',
                                      checked:
                                        filterValue[value]?.length > 0
                                          ? filterValue[value][0]?.checked
                                          : false,
                                    }
                                  } else if (
                                    !['object', 'function']?.includes(typeof e[value]) &&
                                    (e[value] ||
                                      e?.original[value] ||
                                      typeof e[value] === 'number') &&
                                    e[value] !== '-'
                                  ) {
                                    res = {
                                      value:
                                        e[value] ||
                                        e?.original[value] ||
                                        (typeof e[value] === 'number'
                                          ? e[value]
                                          : e[value] || 'null'),
                                      label:
                                        e[value] ||
                                        e?.original[value] ||
                                        (typeof e[value] === 'number'
                                          ? e[value]
                                          : e[value] || 'null'),
                                      checked:
                                        filterValue[value]?.length > 0
                                          ? filterValue[value][0]?.checked
                                          : false,
                                    }
                                  }
                                  return res
                                }),
                            'label'
                          )
                        : apiData[value] || []
                    }
                    className='m-0 width-250'
                    labelClass='dropdown-item'
                  />
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        ))}
    </div>
  )
}

FilterAll = memo(FilterAll, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
FilterColumns = memo(
  FilterColumns,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {FilterAll, FilterColumns}
