import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setInsuranceSchema: any
  optDatabase?: any
}

const ValidationSchema: FC<Props> = ({setInsuranceSchema, optDatabase}) => {
  useEffect(() => {
    let validationShape: any = {
      name: Yup.string().required('Insurance Policy Name is required'),
      description: Yup.string().required('Description is required'),
      limit: Yup.number()
        .required('Limit is required')
        .max(99999999999, 'You have exceeded the maximum character limit'),
      deductible: Yup.number()
        .required('Deductible is required')
        .max(99999999999, 'You have exceeded the maximum character limit'),
      premium: Yup.number()
        .required('Premium is required')
        .max(99999999999, 'You have exceeded the maximum character limit'),
      start_date: Yup.string().required('Date is required'),
      end_date: Yup.string().required('End Date is required'),
      phone_number: Yup.string()
        .nullable(false as any)
        // .min(8, ({min}) => `Minimum length is ${min} characters of number format`)
        .max(16, ({max}) => `Maximum length is ${max} characters of number format`)
        .matches(/^[0-9]+$/, {
          message: 'Phone number is not valid',
          excludeEmptyString: false,
        }),
    }

    optDatabase?.map((database: any) => {
      switch (database?.field?.toLowerCase()) {
        case 'email':
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              email: Yup.string()
                .email('Wrong email format')
                .max(50, 'Maximum 50 character')
                .required('Email is required'),
            }
          }
          break
        case 'insurer':
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              insurer: Yup.string().required('Insurer is required'),
            }
          }
          break
        case 'policy_no':
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              policy_no: Yup.string().required('Policy No is required'),
            }
          }
          break
        case 'contact_person':
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              contact_person: Yup.string().required('Contact Person is required'),
            }
          }
          break
        case 'coverage':
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              coverage: Yup.string().required('Coverage is required'),
            }
          }
          break
        case 'phone_number':
          if (database?.is_required) {
            validationShape = {
              ...validationShape,
              phone_number: Yup.string()
                .nullable(false as any)
                .min(8, ({min}) => `Minimum length is ${min} characters of number format`)
                .max(16, ({max}) => `Maximum length is ${max} characters of number format`)
                .matches(/^[0-9]+$/, {
                  message: 'Phone number is not valid',
                  excludeEmptyString: false,
                })
                .required('Phone number is required'),
            }
          }
          break
        default:
          return validationShape
      }
      return validationShape
    })

    const InsuranceSchema = Yup.object().shape(validationShape)
    setInsuranceSchema(InsuranceSchema)
  }, [setInsuranceSchema, optDatabase])
  return null
}

export default ValidationSchema
