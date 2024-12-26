/* eslint-disable react-hooks/exhaustive-deps */
import {configClass, KTSVG} from '@helpers'
import {debounce} from 'lodash'
import {FC, useEffect, useRef, useState} from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

const Search: FC<any> = ({
  bg = 'white',
  value = '',
  width = '100%',
  delay = 2000,
  onChange = () => '',
  resetKeyword,
  setResetKeyword,
}) => {
  const ref = useRef<HTMLInputElement>(null)
  const [alert, setAlert] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const onClear = () => {
    if (ref.current !== null) {
      ref.current.value = ''
    }
  }

  useEffect(() => {
    if (resetKeyword) {
      onClear()
      setResetKeyword(false)
    }
  }, [resetKeyword])

  return (
    <>
      <KTSVG
        path='/media/icons/duotone/General/Search.svg'
        className='svg-icon-3 position-absolute ms-3'
      />
      <OverlayTrigger
        placement='bottom-start'
        show={alert}
        overlay={
          <Tooltip id='tooltip1' className='css-alert-cus'>
            <div className='row'>
              <div className='col-md-2'>
                <i
                  className='fas fa-exclamation-circle'
                  style={{fontSize: '27px', paddingTop: '10px'}}
                ></i>
              </div>
              <div className='col-md-10'>
                Please enter at least 3 characters for optimal search.
              </div>
            </div>
          </Tooltip>
        }
      >
        <input
          type='text'
          id='kt_filter_search'
          ref={ref}
          className={`${configClass?.search} form-control-${bg} ps-9`}
          style={{width}}
          placeholder='Search'
          defaultValue={value?.trim()?.replaceAll('*', '') || ''}
          onChange={debounce(({target: {value: val}}: any) => {
            setLoading(true)
            if (val?.toString()?.length >= 3 || val?.toString()?.length === 0) {
              onChange(val?.trim() || '')
              setAlert(false)
            } else if (val?.toString()?.length > 0 && val?.toString()?.length < 3) {
              setAlert(true)
            }

            setTimeout(() => {
              setLoading(false)
            }, delay)
          }, delay)}
        />
      </OverlayTrigger>
      {loading && (
        <div className='position-absolute end-0 pe-3'>
          <span className='spinner-border spinner-border-sm text-muted align-middle'></span>
        </div>
      )}
    </>
  )
}

export {Search}
