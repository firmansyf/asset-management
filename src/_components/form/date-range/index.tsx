import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './style.scss'

import {configClass} from '@helpers'
import moment from 'moment'
import {FC, ReactNode, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {DateRange} from 'react-date-range'
// import * as locales from 'react-date-range/dist/locale'

interface Props {
  children?: ReactNode
  className?: any
  btnClass?: any
  icon?: any
  onChange?: (e?: any) => void
  value: {
    startDate: any
    endDate: any
    description?: any
  }
  description?: boolean
  modal?: boolean
  minDate?: any
}

interface ElementProps {
  ranges: any
  minDate?: any
  description?: any
  btnReset?: boolean
  onChange: (e?: any) => void
  onChangeDescription?: (e?: any) => void
  onClickToday: () => void
  onCancel: () => void
  onReset: () => void
  onSave: () => void
}

export const DateRangeElement: FC<ElementProps> = ({
  ranges,
  minDate = new Date(),
  description = '',
  btnReset = true,
  onChange = () => '',
  onChangeDescription = () => '',
  onClickToday = () => '',
  onCancel = () => '',
  onReset = () => '',
  onSave = () => '',
}) => {
  return (
    <div className='position-relative'>
      <DateRange
        ranges={[ranges]}
        onChange={onChange}
        color='#050990'
        rangeColors={['#050990']}
        shownDate={new Date()}
        minDate={minDate}
        direction='vertical'
        months={1}
        dateDisplayFormat='d MMM yyyy'
        showMonthAndYearPickers={true}
        showDateDisplay={false}
      />
      {!!description && (
        <div className='py-2 px-5'>
          <label className='space-3 text-uppercase fw-bolder fs-8 mb-1 text-black-600'>
            Description
          </label>
          <textarea
            name='description'
            className={configClass?.form}
            placeholder='Enter Description'
            rows={2}
            value={ranges?.description}
            onChange={onChangeDescription}
          />
        </div>
      )}
      <hr className='border-2 my-2' />
      <div className='d-flex align-items-end py-2'>
        <button
          type='button'
          className='btn btn-sm bg-white tetx-dark me-auto'
          onClick={onClickToday}
        >
          Today
        </button>
        <button type='button' className='btn btn-sm btn-light py-2 px-3 me-2' onClick={onCancel}>
          Cancel
        </button>
        {btnReset && (
          <button
            type='button'
            className='btn btn-sm btn-light-danger py-2 px-3 me-2'
            onClick={onReset}
          >
            Reset
          </button>
        )}
        <button type='button' className='btn btn-sm btn-primary py-2 px-3' onClick={onSave}>
          Save
        </button>
      </div>
      <div className='position-absolute top-0 end-0 me-n5 mt-n2'>
        <div
          onClick={onCancel}
          className='btn btn-danger btn-icon btn-flex w-25px h-25px radius-50 shadow-sm'
        >
          <i className='las la-times' />
        </div>
      </div>
    </div>
  )
}

const Index: FC<Props> = ({
  children,
  minDate,
  className,
  btnClass,
  icon,
  onChange,
  value = {},
  description = false,
  modal = true,
}: any) => {
  const initDate: any = {
    startDate: new Date(),
    endDate: new Date(),
    description: '',
    key: 'selection',
  }
  const [dates, setDates] = useState<any>(initDate)
  const [showModal, setShowModal] = useState<any>(false)
  const [showCalendar, setShowCalendar] = useState<any>(false)

  useEffect(() => {
    if (value?.startDate && value?.endDate && (showModal || showCalendar)) {
      setDates({
        startDate: moment(value?.startDate).toDate(),
        endDate: moment(value?.endDate).toDate(),
        description: value?.description || '',
        key: 'selection',
      })
    }
  }, [value, showModal, showCalendar])

  const handleChange = (e: any) => {
    setDates({...(e?.selection || {})})
  }

  return (
    <>
      {modal ? (
        <>
          <div
            onClick={() => setShowModal(true)}
            className={
              !children
                ? `same-30 radius-50 center pointer text-9 ${btnClass}`
                : '' + (className || '')
            }
          >
            {children || <i className={`las ${icon || 'la-calendar-alt'}`} />}
          </div>
          <Modal
            dialogClassName='modal-sm modal-dialog-centered'
            show={showModal}
            onHide={() => {
              setShowModal(false)
              setDates(initDate)
            }}
          >
            <Modal.Body className='p-2'>
              <DateRangeElement
                ranges={dates}
                minDate={minDate}
                btnReset={false}
                description={description}
                onChange={handleChange}
                onChangeDescription={({target: {value: description}}: any) =>
                  setDates({...dates, description})
                }
                onClickToday={() => setDates(initDate)}
                onCancel={() => {
                  setShowModal(false)
                  setDates(initDate)
                }}
                onReset={() => {
                  setShowModal(false)
                  onChange &&
                    onChange({
                      startDate: undefined,
                      endDate: undefined,
                      description: '',
                      key: 'selection',
                    })
                  setDates(initDate)
                }}
                onSave={() => {
                  setShowModal(false)
                  onChange && onChange(dates)
                  setDates(initDate)
                }}
              />
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <div className='input-group input-group-solid d-flex align-items-center position-relative'>
          <i className='fas la-calendar-alt text-primary ms-4' />
          <div onClick={() => setShowCalendar(true)} className={`${configClass?.form} ms-0`}>
            {children || <i className={`las ${icon || 'la-calendar-alt'}`} />}
          </div>
          {showCalendar && (
            <div
              className='card position-absolute top-0 w-300px bg-white px-3 pb-2 shadow'
              style={{zIndex: 9}}
            >
              <DateRangeElement
                ranges={dates}
                minDate={minDate}
                onChange={handleChange}
                onClickToday={() => setDates(initDate)}
                onCancel={() => {
                  setShowCalendar(false)
                  setDates(initDate)
                }}
                onReset={() => {
                  setShowCalendar(false)
                  onChange &&
                    onChange({
                      startDate: undefined,
                      endDate: undefined,
                      description: '',
                      key: 'selection',
                    })
                  setDates(initDate)
                }}
                onSave={() => {
                  setShowCalendar(false)
                  onChange && onChange(dates)
                  setDates(initDate)
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default Index
