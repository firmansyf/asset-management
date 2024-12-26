import * as Yup from 'yup'
export const checkInOutSchema = Yup.object().shape({
  type: Yup.string().required('Check-out-to is required'),
  assignee_guid: Yup.string().when('type', {
    is: (type: any) => type === 'assignee',
    then: () => Yup.string().required('Assigned User or Employee is required'),
  } as any),
  location_guid: Yup.string().when('type', {
    is: (type: any) => type === 'location',
    then: () => Yup.string().required('Location is required').nullable(),
  } as any),
  company_guid: Yup.string().when('type', {
    is: (type: any) => type === 'department',
    then: () => Yup.string().required('Company is required').nullable(),
  } as any),
  company_department_guid: Yup.string().when('type', {
    is: (type: any) => type === 'department',
    then: () => Yup.string().required('Department is required').nullable(),
  } as any),
})
