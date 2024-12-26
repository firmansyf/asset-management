import 'react-datetime/css/react-datetime.css'

import {FC} from 'react'

import {CustomField} from './CustomField'

type Props = {
  defaultCustomField: any
  setFieldValue: any
  currency: any
  preference: any
  detail?: any
  values?: any
}

const CustomFieldLocation: FC<Props> = ({
  defaultCustomField,
  setFieldValue,
  currency,
  preference,
  detail,
  values,
}) => {
  return (
    <div className='row'>
      {Array.isArray(defaultCustomField) &&
        defaultCustomField?.map((item: any, keys: any) => {
          if (item.conditions === undefined) {
            return (
              <CustomField
                key={keys}
                item={item}
                setFieldValue={setFieldValue}
                currency={currency}
                preference={preference}
                values={values}
                detail={detail}
              />
            )
          } else {
            return null
          }
        })}
    </div>
  )
}

export {CustomFieldLocation}
