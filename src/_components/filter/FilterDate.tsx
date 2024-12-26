import {getListFilterDate} from '@api/Service'
import {configClass, preferenceDate} from '@helpers'
import {Field, Form, Formik} from 'formik'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import Datetime from 'react-datetime'
import * as Yup from 'yup'

interface Props {
  onChange?: any
  filterAll?: any
  result?: any
  filterValue?: any
  setFilterValue?: any
}

const FilterDate: FC<Props> = ({onChange, filterAll, result, filterValue, setFilterValue}) => {
  const [dataWithinList, setDataWithinList] = useState([])
  const [dataMoreThanList, setDataMoreThanList] = useState([])
  const pref_date = preferenceDate()

  const validationSchema: any = Yup.object().shape({
    // TEXT
  })

  const handleSubmit = (values: any) => {
    let filter_date: any = {}
    if (values?.filter_date_type === 'whithin_the_last') {
      filter_date = {
        filter_date_type: [{value: values?.filter_date_type, label: values?.filter_date_type}],
        filter_date: [{value: values?.filter_whithin, label: values?.filter_whithin}],
        filter_date_value: [{value: values?.number_whithin, label: values?.number_whithin}],
      }
    } else if (values?.filter_date_type === 'more_than') {
      filter_date = {
        filter_date_type: [{value: values?.filter_date_type, label: values?.filter_date_type}],
        filter_date: [{value: values?.filter_more_than, label: values?.filter_more_than}],
        filter_date_value: [{value: values?.number_more_than, label: values?.number_more_than}],
      }
    } else {
      filter_date = {
        filter_date_type: [{value: values?.filter_date_type, label: values?.filter_date_type}],
        filter_start_date: [{value: values?.filter_start_date, label: values?.filter_start_date}],
        filter_end_date: [{value: values?.filter_end_date, label: values?.filter_end_date}],
      }
    }
    const date_filter: object = Object.assign(filterValue, filter_date)

    onChange({
      parent: filterAll.parent,
      child: result(date_filter, filterAll.parent),
    })
    setFilterValue({...filterValue, date_filter})
  }

  useEffect(() => {
    getListFilterDate()
      .then(({data: {data: res}}) => {
        const data_within = res[0]?.list.map(({key, name}: any) => {
          return {
            value: key,
            label: name,
          }
        })
        setDataWithinList(data_within)
        const data_more = res[1]?.list.map(({key, name}: any) => {
          return {
            value: key,
            label: name,
          }
        })
        setDataMoreThanList(data_more)
      })
      .catch(() => undefined)
  }, [])

  return (
    <Dropdown.Menu style={{width: '400px'}}>
      <Formik
        initialValues={{
          filter_start_date: moment(new Date()).format('YYYY-MM-DD'),
          filter_end_date: moment(new Date()).format('YYYY-MM-DD'),
          filter_date_type: '',
          number_whithin: '',
          number_more_than: '',
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({setFieldValue, values}) => {
          return (
            <Form className='justify-content-center' noValidate>
              <div className='col-md-12 my-1'>
                <div className='row m-1'>
                  <div className='col-5'>
                    <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                      <input
                        type='radio'
                        className='form-check-input border border-gray-400'
                        name='filter_date_type'
                        onChange={({target: {checked}}: any) => {
                          if (checked) {
                            setFieldValue('filter_date_type', 'whithin_the_last')
                            setFieldValue('filter_more_than', '')
                            setFieldValue('number_more_than', '')
                            setFieldValue('filter_start_date', moment(new Date()).format(pref_date))
                            setFieldValue('filter_end_date', moment(new Date()).format(pref_date))
                          }
                        }}
                      />
                      <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>
                        Within the last
                      </span>
                    </label>
                  </div>
                  <div className='col-3'>
                    <Field
                      name='number_whithin'
                      type='number'
                      min='1'
                      style={{
                        height: '33px',
                        width: '94px',
                        borderRadius: '0.475rem',
                        backgroundColor: '#f5f8fa',
                        borderColor: '#f5f8fa',
                      }}
                    />
                  </div>
                  <div className='col-4'>
                    <Field
                      as='select'
                      className={configClass?.select}
                      name='filter_whithin'
                      type='text'
                    >
                      <option value=''>Choose</option>
                      {dataWithinList?.map((item: any, index: number) => {
                        return (
                          <option key={index} value={item.value}>
                            {item.label}
                          </option>
                        )
                      })}
                    </Field>
                  </div>
                </div>
              </div>

              <div className='col-md-12 my-1'>
                <div className='row m-1'>
                  <div className='col-5'>
                    <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                      <input
                        type='radio'
                        className='form-check-input border border-gray-400'
                        name='filter_date_type'
                        onChange={({target: {checked}}: any) => {
                          if (checked) {
                            setFieldValue('filter_date_type', 'more_than')
                            setFieldValue('number_whithin', '')
                            setFieldValue('filter_whithin', '')
                            setFieldValue('filter_start_date', moment(new Date()).format(pref_date))
                            setFieldValue('filter_end_date', moment(new Date()).format(pref_date))
                          }
                        }}
                      />
                      <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>More than</span>
                    </label>
                  </div>
                  <div className='col-3'>
                    <Field
                      name='number_more_than'
                      type='number'
                      min='1'
                      style={{
                        height: '33px',
                        width: '94px',
                        borderRadius: '0.475rem',
                        backgroundColor: '#f5f8fa',
                        borderColor: '#f5f8fa',
                      }}
                    />
                  </div>
                  <div className='col-4'>
                    <Field
                      as='select'
                      className={configClass?.select}
                      name='filter_more_than'
                      type='text'
                    >
                      <option value=''>Choose</option>
                      {dataMoreThanList?.map((item: any, index: number) => {
                        return (
                          <option key={index} value={item.value}>
                            {item.label}
                          </option>
                        )
                      })}
                    </Field>
                  </div>
                </div>
              </div>

              <div className='col-md-12 my-1'>
                <div className='row m-1'>
                  <div className='col-5'>
                    <label className='form-check form-check-custom form-check-sm form-check-solid bg-f7 rounded px-2'>
                      <input
                        type='radio'
                        className='form-check-input border border-gray-400'
                        name='filter_date_type'
                        onChange={({target: {checked}}: any) => {
                          if (checked) {
                            setFieldValue('filter_date_type', 'between')
                            setFieldValue('number_whithin', '')
                            setFieldValue('filter_whithin', '')
                            setFieldValue('filter_more_than', '')
                            setFieldValue('number_more_than', '')
                          }
                        }}
                      />
                      <span className='m-2 cursor-pointer fw-bold text-dark fs-7'>Between</span>
                    </label>
                  </div>
                  <div className='col-3'>
                    <Datetime
                      closeOnSelect
                      inputProps={{
                        autoComplete: 'off',
                        className: `${configClass?.form} rdt-filter-date`,
                        name: 'filter_start_date',
                        placeholder: 'Filter Start Date ',
                        // readOnly: true,
                      }}
                      initialValue={moment(new Date()).format(pref_date)}
                      onChange={(e: any) => {
                        const m = moment(e).format('YYYY-MM-DD')
                        setFieldValue('filter_start_date', m)
                      }}
                      value={values?.filter_start_date}
                      dateFormat={pref_date}
                      timeFormat={false}
                    />
                  </div>
                  <div className='col-4'>
                    <Datetime
                      closeOnSelect
                      inputProps={{
                        autoComplete: 'off',
                        className: configClass?.form,
                        name: 'filter_end_date',
                        placeholder: 'Filter End Date ',
                        // readOnly: true,
                      }}
                      initialValue={moment(new Date()).format(pref_date)}
                      onChange={(e: any) => {
                        const m = moment(e).format('YYYY-MM-DD')
                        setFieldValue('filter_end_date', m)
                      }}
                      isValidDate={(currentDate: any) =>
                        currentDate.isSameOrAfter(values?.filter_start_date)
                      }
                      value={values?.filter_end_date}
                      dateFormat={pref_date}
                      timeFormat={false}
                    />
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-end mt-3 border-top'>
                <Button className='btn-sm mt-3 mb-1 me-5' type='submit' variant='primary'>
                  <span className='indicator-label'>Update</span>
                </Button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Dropdown.Menu>
  )
}

export {FilterDate}
