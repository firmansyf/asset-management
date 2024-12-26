import {configClass, KTSVG} from '@helpers'
import {FC} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

const Index: FC<any> = ({data}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference} = preferenceStore || {}

  switch (data?.type) {
    case 'text':
    case 'macaddress':
    case 'url':
    case 'email':
    case 'numeric':
    case 'ipaddress':
      return (
        <input
          disabled
          placeholder={`Enter ${data?.label || ''}`}
          type='text'
          className={`${configClass?.form} cursor-move`}
        />
      )
    case 'dropdown':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <select
            disabled
            defaultValue={1}
            className={`${configClass?.select} cursor-move text-gray-500`}
          >
            <option value={1} disabled>
              Choose {data?.label}
            </option>
          </select>
          <button
            className='border border-dashed border-primary h-25px w-25px btn btn-icon btn-light-primary rounded-circle ms-n1 me-3'
            type='button'
            disabled
          >
            <i className='fas fa-plus' />
          </button>
        </div>
      )
    case 'date':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <i className='fas la-calendar-alt text-primary ms-3' />
          <input
            placeholder={`Enter ${data?.label || ''}`}
            type='text'
            className={`${configClass?.form} cursor-move`}
          />
        </div>
      )
    case 'currency':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <div className='col-auto'>
            <select
              defaultValue={1}
              disabled
              className={`${configClass?.select} cursor-move text-gray-500`}
            >
              <option value={1} disabled>
                {preference?.currency || 'USD'}
              </option>
            </select>
          </div>
          <input
            placeholder={`Enter ${data?.label || ''}`}
            type='text'
            className={`${configClass?.form} cursor-move`}
          />
        </div>
      )
    case 'file':
      return (
        <div className='btn btn-outline bg-light border-dashed border-primary px-4 py-3 text-start w-100 opacity-75'>
          <KTSVG className='svg-icon-2x ms-n1' path='/media/icons/duotone/Files/Pictures1.svg' />
          <div className='fs-7 text-gray-800 mt-2'>Drag a file here</div>
        </div>
      )
    case 'checkbox':
    case 'radio':
      return (
        <div className='row flex-nowrap'>
          {[1, 2]?.map((m: number) => (
            <div className='col-auto mt-1' key={m}>
              <label
                className={`form-check form-check-custom form-check-sm form-check-solid bg-light px-2 ${
                  data?.type === 'radio' ? 'radius-50' : 'rounded'
                }`}
              >
                <input
                  type={data?.type}
                  className='form-check-input border border-gray-400'
                  name={data?.type}
                  defaultChecked={m === 1}
                />
                <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>Option {m}</span>
              </label>
            </div>
          ))}
        </div>
      )
    case 'gps':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <input
            placeholder='Lat'
            type='text'
            className={`${configClass?.form} cursor-move border-end border-right-3`}
          />
          <input
            placeholder='Long'
            type='text'
            className={`${configClass?.form} cursor-move border-start border-left-3`}
          />
        </div>
      )
    default:
      return (
        <input
          disabled
          placeholder={`Enter ${data?.label || ''}`}
          type='text'
          className={`${configClass?.form} cursor-move`}
        />
      )
  }
}

export default Index
