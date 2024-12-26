import * as Yup from 'yup'

const intialValue = [
  {
    company_guid: '',
    company: '',
    country: '',
    address_one: '',
    address_two: '',
    state: '',
    suite: '',
    city: '',
    postal_code: '',
    registration_number: '',
    // -------- preference -------- //
    timezone: '',
    currency: '',
    date_format: '',
    time_format: '',
    financial_year: '',
    financial_month: 0,
    financial_day: 0,
    // -------- photo -------- //
    photo: {data: '', title: ''},
  },
  {},
  {},
]

const createAccountSchemas = [
  Yup.object({
    company: Yup.string().required('Company Name is required'),
    country: Yup.string().required('Country is required'),
    address_one: Yup.string().required('Address 1 is required'),
    address_two: Yup.string().required('Address 2 is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State/Province is required'),
    postal_code: Yup.string().required('Postal Code is required'),
    timezone: Yup.string().required('Time Zone is required'),
    currency: Yup.string().required('Currency is required'),
    date_format: Yup.string().required('Date Format is required'),
    time_format: Yup.string().required('Time Format is required'),
  }),
]

export {createAccountSchemas, intialValue}
