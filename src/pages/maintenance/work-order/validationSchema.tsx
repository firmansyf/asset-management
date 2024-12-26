import moment from 'moment'
import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  checkPriority: any
  checkCategory: any
  checkWorker: any
  checkAdditionalWorker: any
  setWorkOrderSchema: any
}

const ValidationWo: FC<Props> = ({
  checkPriority,
  checkCategory,
  checkWorker,
  checkAdditionalWorker,
  setWorkOrderSchema,
}) => {
  useEffect(() => {
    let validationShape: any = {
      title: Yup.string().required('Work Order Name is required').nullable(),
      duration: Yup.string().required('Estimate Duration ( Minutes ) is required'),
      description: Yup.string().required('Work Order Description is required'),
      manual_started_at: Yup.string().required('Start Date is required'),
      po_number: Yup.number().typeError('Purchase Order is must be a number').nullable(),
      location_guid: Yup.string().required('Location is required'),
      asset_guid: Yup.string().required('Asset by Location is required'),
      frequency: Yup.string()
        .test({
          name: 'frequency',
          test: function () {
            const {
              is_repeat_schedule,
              frequency,
              frequency_value,
              frequency_value_monthly,
              frequency_value_month,
              frequency_value_day,
            } = this.parent || {}
            let status = true
            if (frequency === 'daily' && frequency_value !== undefined) {
              status = false
            }
            if (frequency === 'weekly' && frequency_value !== undefined) {
              status = false
            }
            if (frequency === 'monthly' && frequency_value_monthly !== undefined) {
              status = false
            }
            if (
              frequency === 'yearly' &&
              frequency_value_month !== undefined &&
              frequency_value_day !== undefined
            ) {
              status = false
            }
            if (is_repeat_schedule && status) {
              return this.createError({
                message: `Frequency Required is a required field`,
              })
            }
            return true
          },
        })
        .nullable(),
      manual_ended_at: Yup.string().test({
        name: 'manual_ended_at',
        test: function () {
          const {manual_ended_at, manual_started_at} = this.parent || {}
          if (manual_ended_at === undefined) {
            return this.createError({
              message: `End Date is required`,
            })
          }
          if (manual_started_at !== undefined) {
            const currentDate = moment(manual_ended_at).format('YYYY-MM-DD')
            const IncidentDate = moment(manual_started_at).format('YYYY-MM-DD')
            if (moment(currentDate).isBefore(IncidentDate) && IncidentDate !== currentDate) {
              return this.createError({
                message: `End Date should be after Start Date`,
              })
            }
          }
          return true
        },
      }),
      duedate: Yup.string().test({
        name: 'duedate',
        test: function () {
          const {duedate, manual_ended_at, manual_started_at} = this.parent || {}
          if (duedate === undefined) {
            return this.createError({
              message: `Due Date is required`,
            })
          }
          if (manual_started_at !== undefined) {
            const currentDate = moment(duedate).format('YYYY-MM-DD')
            const IncidentDate = moment(manual_started_at).format('YYYY-MM-DD')
            if (moment(currentDate).isBefore(IncidentDate) && currentDate !== IncidentDate) {
              return this.createError({
                message: `Due Date should be after Start Date`,
              })
            }
          }
          if (manual_ended_at !== undefined) {
            const currentDate2 = moment(duedate).format('YYYY-MM-DD')
            const IncidentDate2 = moment(manual_ended_at).format('YYYY-MM-DD')
            if (moment(currentDate2).isBefore(IncidentDate2) && currentDate2 !== IncidentDate2) {
              return this.createError({
                message: `Due Date should be after End Date`,
              })
            }
          }
          return true
        },
      }),
    }
    if (checkPriority?.is_required) {
      validationShape = {
        ...validationShape,
        maintenance_priority_guid: Yup.string().required('Priority is required'),
      }
    }
    if (checkCategory?.is_required) {
      validationShape = {
        ...validationShape,
        maintenance_category_guid: Yup.string().required('Work Orders Category is required'),
      }
    }
    if (checkWorker?.is_required) {
      validationShape = {
        ...validationShape,
        // assigned_user_guid: Yup.string().required('Worker is required'),
        assigned_user_guid: Yup.mixed().test({
          name: 'assigned_user_guid',
          test: function () {
            const {assigned_user_guid} = this.parent || {}
            if (
              assigned_user_guid === undefined ||
              Object.keys(assigned_user_guid || {})?.length === 0 ||
              assigned_user_guid?.value === ''
            ) {
              return this.createError({
                message: `Worker is required`,
              })
            }
            return true
          },
        }),
      }
    }
    if (checkAdditionalWorker?.is_required) {
      validationShape = {
        ...validationShape,
        // assigned_additional_user: Yup.string().required('Additional Worker is required'),
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
    const WoSchema = Yup.object().shape(validationShape)
    setWorkOrderSchema(WoSchema)
  }, [setWorkOrderSchema, checkPriority, checkCategory, checkWorker, checkAdditionalWorker])
  return null
}
export default ValidationWo
