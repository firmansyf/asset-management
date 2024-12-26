import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setRequestSchema: any
  database: any
}

const ValidationSchema: FC<Props> = ({setRequestSchema, database}) => {
  useEffect(() => {
    let validationShape: any = {
      description: Yup.string().required('Request Description is required').nullable(),
      title: Yup.string().required('Request Title is required').nullable(),
      location_guid: Yup.mixed()
        .test(
          'location_guid',
          'Location is required',
          (e: any) => e?.value || typeof e === 'string'
        )
        .nullable(),
      asset_guid: Yup.mixed()
        .test(
          'asset_guid',
          'Asset by Location is required',
          (e: any) => e?.value || typeof e === 'string'
        )
        .nullable(),
      // location_guid: Yup.string().required('Location is required'),
      // asset_guid: Yup.string().required('Asset by Location is required'),
    }

    // if (database?.due_date?.is_required) {
    //   validationShape = {
    //     ...validationShape,
    //     due_date: Yup.string().required('Due Date is required').nullable(),
    //   }
    // }

    if (database?.maintenance_category_guid?.is_required) {
      validationShape = {
        ...validationShape,
        maintenance_category_guid: Yup.string()
          .required('Maintenance Category is required')
          .nullable(),
      }
    }

    if (database?.maintenance_priority_guid?.is_required) {
      validationShape = {
        ...validationShape,
        maintenance_priority_guid: Yup.string().required('Priority is required').nullable(),
      }
    }

    if (database?.worker_guid?.is_required) {
      validationShape = {
        ...validationShape,
        assigned_user_guid: Yup.mixed()
          .test(
            'assigned_user_guid',
            'Worker is required',
            (e: any) => e?.value || typeof e === 'string'
          )
          .nullable(),
      }
    }

    if (database?.due_date?.is_required) {
      validationShape = {
        ...validationShape,
        due_date: Yup.string().required('Due Date is required').nullable(),
      }
    }

    if (database?.duration?.is_required) {
      validationShape = {
        ...validationShape,
        duration: Yup.string().required('Estimation Duration ( Minutes ) is required').nullable(),
      }
    }

    if (database?.additional_worker?.is_required) {
      validationShape = {
        ...validationShape,
        assigned_additional_user: Yup.mixed().test({
          name: 'assigned_additional_user',
          test: function () {
            const {assigned_additional_user} = this.parent || {}
            if (assigned_additional_user && assigned_additional_user?.length === 0) {
              return this.createError({
                message: `Additional Worker is required`,
              })
            }

            return true
          },
        }),
      }
    }

    const RequestSchema = Yup.object().shape(validationShape)
    setRequestSchema(RequestSchema)
  }, [setRequestSchema, database])
  return null
}

export default ValidationSchema
