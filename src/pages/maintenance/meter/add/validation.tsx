import {FC, useEffect} from 'react'
import * as Yup from 'yup'

type Props = {
  setMeterSchema: any
}

const ValidationSchema: FC<Props> = ({setMeterSchema}) => {
  useEffect(() => {
    const permission: any = true
    const validationShape: any = {
      name: Yup.string().required('Meter Name is required'),
      unit_of_measurement: Yup.string().required('Unit of Measurement is required'),
      location_guid: Yup.mixed()
        .test('location_guid', 'Location is required', (e: any) =>
          permission ? e?.value || typeof e === 'string' : true
        )
        .nullable(),
      asset_guid: Yup.mixed()
        .test('asset_guid', 'Asset by Location is required', (e: any) =>
          permission ? e?.value || typeof e === 'string' : true
        )
        .nullable(),
      workers: Yup.mixed()
        .test({
          name: 'workers',
          test: function () {
            const {workers} = this.parent || {}
            if (workers?.length === 0) {
              return this.createError({
                message: `Worker is required`,
              })
            }
            return true
          },
        })
        .nullable(),
    }
    const MeterSchema = Yup.object().shape(validationShape)
    setMeterSchema(MeterSchema)
  }, [setMeterSchema])
  return null
}

export default ValidationSchema
