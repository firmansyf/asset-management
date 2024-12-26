import {numberWithCommas, preferenceDate, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, memo, SetStateAction, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

interface SelectValTypes {
  value: string | undefined
  label: string | undefined
}
export interface SelectOptionType {
  [key: string]: any
}

interface FieldTypes {
  type: string
  formLabel: string
  defaultValue?: SelectValTypes | undefined | SetStateAction<any>
  option?: Array<SelectOptionType> | undefined
}

const Index: FC<FieldTypes> = ({type, defaultValue, option}) => {
  const pref_date: any = preferenceDate()
  const pref_date_time: any = preferenceDateTime()

  const [val, setVal] = useState<any>('')

  useEffect(() => {
    let value = ''
    if (defaultValue?.guid) {
      value = defaultValue?.name
    } else {
      value = defaultValue
    }
    setVal(value)
  }, [defaultValue])

  switch (type) {
    case 'text':
    case 'macaddress':
    case 'url':
    case 'email':
    case 'ipaddress':
      return <div className='text-dark'>{val || '-'}</div>
    case 'dropdown':
      return (
        <div className='text-dark'>
          {option?.find(({key}: any) => key === defaultValue?.toString())?.value ||
            (defaultValue?.name
              ? defaultValue?.name
              : typeof defaultValue !== 'object'
              ? defaultValue || '-'
              : '-')}
        </div>
      )
    case 'numeric':
      return <div className='text-dark'>{numberWithCommas(val, false) || '-'}</div>
    case 'currency':
      return (
        <div className='text-dark'>
          {defaultValue?.code} {numberWithCommas(defaultValue?.amount) || '-'}
        </div>
      )
    case 'date':
      return (
        <div className='text-dark'>
          {val !== null && val !== undefined ? moment(val || '')?.format(pref_date) : '-'}
        </div>
      )
    case 'datetime':
      return (
        <div className='text-dark'>
          {val !== null && val !== undefined ? moment(val || '')?.format(pref_date_time) : '-'}
        </div>
      )
    // case 'file':
    //   return <div className='text-dark'>{val}</div>
    case 'checkbox':
      return (
        <div className='text-dark'>
          {option
            ?.filter((filter: any) => defaultValue?.includes(filter.key))
            ?.map((m: any) => m?.value)
            ?.join(', ') || '-'}
        </div>
      )
    case 'radio':
      return (
        <div className='text-dark'>
          {option?.find((find: any) => find.key === defaultValue?.toString())?.value || '-'}
        </div>
      )
    case 'gps':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <div className='text-dark'>
            Lat : {val?.lat || '-'} {', '} Long : {val?.lng || '-'}
          </div>
        </div>
      )
    case 'link':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <div className='text-dark'>
            {val?.text !== undefined ? (
              <Link to={val?.url} target='_blank'>
                {val?.text}
              </Link>
            ) : (
              <>-</>
            )}
          </div>
        </div>
      )
    default:
      return <div className='text-dark'>-</div>
  }
}

const detailFileds = memo(
  Index,
  (prev: FieldTypes, next: FieldTypes) => JSON.stringify(prev) === JSON.stringify(next)
)
export default detailFileds
