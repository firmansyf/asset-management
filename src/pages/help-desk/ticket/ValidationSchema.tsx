import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setTicketSchema: any
  checkPriority?: any
  otherReportChanel?: any
}

const ValidationSchema: FC<Props> = ({setTicketSchema, checkPriority, otherReportChanel}) => {
  useEffect(() => {
    const validationShape: any = {
      name: Yup.string()
        .required('Ticket Name is required')
        .nullable()
        .min(5, 'The Ticket Name must be at least 5 characters'),
      type_guid: Yup.string().required('Type Ticket is required'),
      reporter_guid: Yup.string().required('Reporter is required'),
      report_channel_other: Yup.string().when({
        is: () => otherReportChanel,
        then: () => Yup.string().required('Other Report Channel is required'),
      } as any),
      priority_guid: Yup.string().when({
        is: () => checkPriority?.is_required,
        then: () => Yup.string().required('Priority is required').nullable(),
      } as any),
      description: Yup.mixed()
        .test({
          name: 'description',
          test: function () {
            const {description} = this.parent || {}
            if (description === '<p><br></p>' || description === '<div><br></div>') {
              return this.createError({
                message: `Description is required`,
              })
            }
            return true
          },
        })
        .nullable(),
    }
    const TicketSchema = Yup.object().shape(validationShape)
    setTicketSchema(TicketSchema)
  }, [setTicketSchema, checkPriority?.is_required, otherReportChanel])
  return null
}

export default ValidationSchema
