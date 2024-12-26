import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
  first_name: Yup.string()
    .min(3, ({min}) => `Minimum length is ${min} characters`)
    .max(45, ({max}) => `Maximum length is ${max} characters`)
    .required('First Name is required'),
  last_name: Yup.string()
    .min(3, ({min}) => `Minimum length is ${min} characters`)
    .max(45, ({max}) => `Maximum length is ${max} characters`)
    .required('Last Name is required'),
  email: Yup.string()
    .email('This is not a valid email address.')
    .required('Email is required')
    .max(45, ({max}) => `Maximum length is ${max} characters`),
  job_title: Yup.string()
    .max(45, ({max}) => `Maximum length is ${max} characters`)
    .nullable(),
  // company_guid: Yup.string().required('Company is required'),
  company_guid: Yup.mixed()
    .test('company_guid', 'Company is required', (e: any) => e?.value || typeof e === 'string')
    .nullable(),
})
