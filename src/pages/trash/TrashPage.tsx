import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {orderBy, uniq} from 'lodash'
import {createContext, FC, memo, useContext, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'

import {getFeature} from '../setup/settings/feature/Service'
import {getTrashModule} from './Services'

const TrashContext = createContext<any>({items: []})

import {useQuery} from '@tanstack/react-query'

import TrashTable from './TrashTable'

const Checkbox: FC<any> = ({filter, detail, onChange}: any) => {
  return (
    <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid'>
      <input
        type='checkbox'
        value={detail?.key}
        checked={filter?.includes(detail?.key)}
        id={detail?.key}
        onChange={onChange}
        className='form-check-input border border-gray-300'
      />
      <label htmlFor={detail?.key} className='ms-2 user-select-none'>
        <strong>{detail?.name}</strong>
      </label>
    </div>
  )
}

const Filter: FC<any> = ({onFilter, setPage}: any) => {
  const {items} = useContext(TrashContext)
  const [filter, setFilter] = useState<any>([])

  const onChange: any = (e: any) => {
    const {
      target: {checked, value},
    }: any = e || {}
    let result: any = []
    if (checked) {
      if (value === 'all') {
        result = items?.filter(({hasSub}: any) => !hasSub)?.map(({key}: any) => key)
      } else {
        result = uniq([...filter, value])
      }
    } else {
      if (value === 'all') {
        result = []
      } else {
        result = filter?.filter((f: any) => !['all', value].includes(f))
      }
    }
    onFilter && onFilter(result)
    setPage(1)
    setFilter(result)
  }

  return (
    <Dropdown autoClose={'outside'}>
      <Dropdown.Toggle data-cy='btnFilterTrash' variant='primary' size='sm'>
        <KTSVG path={'/media/icons/duotone/Text/Filter.svg'} className={'svg-icon-sm'} />
        Filter
      </Dropdown.Toggle>
      <Dropdown.Menu className='text-nowrap mt-n1' style={{minWidth: '150px'}}>
        {items
          ?.filter(({parent}: any) => !parent)
          ?.map((m: any, index: number) => (
            <div className='ps-3 pe-5 py-1' key={m?.key || index}>
              {m?.hasSub ? (
                <Dropdown autoClose={'outside'} drop='end'>
                  <Dropdown.Toggle
                    variant='block'
                    size='sm'
                    className='d-flex align-items-center w-100 text-start border-top border-bottom py-2 px-0'
                  >
                    <i className='las la-dot-circle mx-1 fs-3 text-primary' />
                    <div className='text-primary fw-bolder fs-7'>{m?.name}</div>
                    <i className='las la-arrow-right text-primary ms-auto' />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='text-nowrap mt-n1' style={{minWidth: '150px'}}>
                    {items
                      ?.filter(({parent}: any) => parent === m?.key)
                      ?.map((mm: any, indexSub: number) => (
                        <div className='px-2 py-1' key={mm?.key || indexSub}>
                          <Checkbox filter={filter} detail={mm} onChange={onChange} />
                        </div>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Checkbox filter={filter} detail={m} onChange={onChange} />
              )}
            </div>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

let TrashPage: FC<any> = () => {
  const intl = useIntl()

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const featuresQuery: any = useQuery({
    queryKey: ['getTrashFeature'],
    queryFn: async () => {
      const res: any = await getFeature({orderCol: 'name', orderDir: 'asc'})
      const dataResult: any = res?.data?.data || []
      return dataResult
    },
  })

  const features: any = featuresQuery?.data || []
  const featureInventory: any = features?.find(({unique_name}: any) => unique_name === 'inventory')
    ?.value

  const trashModuleQuery: any = useQuery({
    queryKey: ['getTrashModule', {featureInventory}],
    queryFn: async () => {
      const res: any = await getTrashModule()
      let dataResult: any = res?.data?.data || []
      if (featureInventory !== 1) {
        dataResult = dataResult?.filter(({key}: any) => key !== 'inventory')
      }
      return orderBy(dataResult, 'key')
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const items: any = trashModuleQuery?.data || []

  return (
    <TrashContext.Provider value={{items}}>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.TRASH'})}</PageTitle>
      <div className='card'>
        <div className='card-body'>
          <TrashTable
            modules={items
              ?.filter(({key, hasSub}: any) => key !== 'all' && !hasSub)
              ?.map(({key}: any) => key)}
            filter={Filter}
          />
        </div>
      </div>
    </TrashContext.Provider>
  )
}

TrashPage = memo(TrashPage, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))

export default TrashPage
