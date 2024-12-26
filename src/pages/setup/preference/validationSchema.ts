import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  asset_id_prefix: Yup.string().required('Asset ID Prefix is required'),
  inventory_id_prefix: Yup.string().required('Inventory ID Prefix is required'),
  country_code: Yup.string().required('Country is required'),
  timezone: Yup.string().required('Timezone is required'),
  date_format: Yup.string().required('Date Format is required'),
  time_format: Yup.string().required('Time Format is required'),
  currency: Yup.string().required('Currency is required'),
})
