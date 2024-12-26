import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setProfileSchema: any
  updatePassword: any
}

const fullUri = window.location.host
const subdomain = fullUri?.split('.')?.[0]
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/
const specialLowerCaseRegex = /[a-z]/
const specialUpperCaseRegex = /[A-Z]/
const specialNumberRegex = /[0-9]/
const minCharRegex =
  subdomain === 'petronas'
    ? /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{14,}/
    : /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}/

const ProfileValidationSchema: FC<Props> = ({setProfileSchema, updatePassword}) => {
  useEffect(() => {
    let validationShape: any = {
      first_name: Yup.string()
        .max(45, ({max}) => `Maximum length is ${max} characters`)
        .required('First name is required'),
      last_name: Yup.string()
        .max(45, ({max}) => `Maximum length is ${max} characters`)
        .required('Last name is required'),
      phone_number: Yup.string()
        .nullable()
        .max(16, ({max}) => `Maximum length is ${max} characters of number format`)
        .matches(/^[0-9]+$/, {
          message: 'Phone number is not valid',
          excludeEmptyString: true,
        }),
      employee_number: Yup.string()
        .max(45, ({max}) => `Maximum length is ${max} characters`)
        .matches(/^[a-zA-Z0-9]+$/, {
          message: 'Employee ID should contain number and alphabets only',
          excludeEmptyString: true,
        })
        .nullable(),
      company_guid: Yup.mixed()
        .test('company_guid', 'Company is required', (e: any) => e?.value || e !== undefined)
        .nullable(),
      preference: Yup.object().shape({
        timezone: Yup.mixed()
          .test(
            'preference.timezone',
            'Timezone is required',
            (e: any) => e?.value || e !== undefined
          )
          .nullable(),
      }),
    }
    if (updatePassword) {
      validationShape = {
        ...validationShape,
        password: Yup.object().shape({
          old_password: Yup.string().required('Current password is required'),
          new_password: Yup.string()
            .matches(minCharRegex, '')
            .matches(specialCharRegex, '')
            .matches(specialNumberRegex, '')
            .matches(specialUpperCaseRegex, '')
            .matches(specialLowerCaseRegex, '')
            .required('New password is required.'),
          new_password_confirm: Yup.string()
            .oneOf([Yup.ref('new_password'), null as any], 'Repeat new password does not match.')
            .required('Those passwords didn’t match. Try again.'),
        }),
      }
    }

    const ProfileSch = Yup.object().shape(validationShape)
    setProfileSchema(ProfileSch)
  }, [updatePassword, setProfileSchema])
  return null
}

export default ProfileValidationSchema
