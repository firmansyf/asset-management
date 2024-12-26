import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setEmployeeSchema: any
  checkFullName?: any
  checkEmployeeId?: any
  checkJobTitle?: any
  checkEmail?: any
  checkLocation?: any
  checkCompany?: any
  checkDepartment?: any
}

const ValidationSchema: FC<Props> = ({
  setEmployeeSchema,
  checkFullName,
  checkEmployeeId,
  checkJobTitle,
  checkEmail,
  checkLocation,
  checkCompany,
  checkDepartment,
}) => {
  useEffect(() => {
    let validationShape: any = {
      full_name: Yup.string().max(100, 'Name may not be greater that 100 character'),
      employee_id: Yup.string().max(45, 'Employee ID may not be greater that 45 character'),
      job_title: Yup.string().max(45, 'Job title ID may not be greater that 45 character'),
      email: Yup.string()
        .max(45, 'Email may not be greater that 45 character')
        .email('This is not a valid email address.'),
    }
    if (checkFullName?.is_required) {
      validationShape = {
        ...validationShape,
        full_name: Yup.string()
          .required('Name is required')
          .max(100, 'Name may not be greater that 100 character'),
      }
    }
    if (checkEmployeeId?.is_required) {
      validationShape = {
        ...validationShape,
        employee_id: Yup.string()
          .required('Employee ID is required')
          .max(45, 'Employee ID may not be greater that 45 character'),
      }
    }
    if (checkJobTitle?.is_required) {
      validationShape = {
        ...validationShape,
        job_title: Yup.string()
          .required('Job title is required')
          .max(45, 'Job title ID may not be greater that 45 character'),
      }
    }
    if (checkEmail?.is_required) {
      validationShape = {
        ...validationShape,
        email: Yup.string()
          .required('Email is required')
          .max(45, 'Email may not be greater that 45 character')
          .email('This is not a valid email address.'),
      }
    }
    if (checkLocation?.is_required) {
      validationShape = {
        ...validationShape,
        location: Yup.string().required('Location is required'),
      }
    }
    if (checkCompany?.is_required) {
      validationShape = {
        ...validationShape,
        company: Yup.string().required('Company is required'),
      }
    }
    if (checkDepartment?.is_required) {
      validationShape = {
        ...validationShape,
        department: Yup.string().required('Department is required'),
      }
    }
    const EmployeeSchema = Yup.object().shape(validationShape)
    setEmployeeSchema(EmployeeSchema)
  }, [
    setEmployeeSchema,
    checkFullName.is_required,
    checkEmployeeId.is_required,
    checkJobTitle.is_required,
    checkEmail.is_required,
    checkLocation.is_required,
    checkCompany.is_required,
    checkDepartment.is_required,
  ])
  return null
}

export default ValidationSchema
