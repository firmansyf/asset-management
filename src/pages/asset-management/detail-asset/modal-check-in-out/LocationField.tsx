import {getLocationV1} from '@api/Service'
import {Select} from '@components/select/ajax'
import {configClass} from '@helpers'
import {getSubLocation} from '@pages/location/sub-location/redux/SubLocationCRUD'
import {ErrorMessage} from 'formik'
import {FC, memo, useEffect, useState} from 'react'

const CheckInOutLocation: FC<any> = ({setFieldValue, checkout, values, destination}) => {
  const [defaultLocation, setDefaultLocation] = useState<any>({})
  const [defaultSubLocation, setDefaultSubLocation] = useState<any>({})

  useEffect(() => {
    if (destination === 'location') {
      if (checkout?.location?.guid !== undefined) {
        getLocationV1({filter: {guid: checkout?.location?.guid}})
          .then(({data: {data}}: any) => {
            if (data.length === 1) {
              setDefaultLocation({value: data?.[0]?.guid, label: data?.[0]?.name})
              setFieldValue('location_guid', data?.[0]?.guid)
            } else {
              setDefaultLocation({})
              setFieldValue('location_guid', '')
            }
          })
          .catch(() => '')
      } else {
        setDefaultLocation({})
        setFieldValue('location_guid', '')
      }

      if (checkout?.location_sub?.guid !== undefined) {
        getSubLocation({filter: {guid: checkout?.location_sub?.guid}})
          .then(({data: {data}}: any) => {
            if (data.length === 1) {
              setDefaultSubLocation({value: data?.[0]?.guid, label: data?.[0]?.name})
              setFieldValue('location_sub_guid', data?.[0]?.guid)
            } else {
              setDefaultSubLocation({})
              setFieldValue('location_sub_guid', '')
            }
          })
          .catch(() => '')
      } else {
        setDefaultSubLocation({})
        setFieldValue('location_sub_guid', '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination])
  return (
    <div className='col-md-12 mt-4'>
      <div className='row'>
        <div className='col-lg-6 mt-3'>
          <label htmlFor='location_guid' className={`${configClass?.label} required`}>
            Location
          </label>
          <Select
            sm={true}
            id='select-location'
            name='location_guid'
            className='col p-0'
            api={getLocationV1}
            params={{orderCol: 'name', orderDir: 'asc'}}
            reload={false}
            placeholder='Choose Location'
            defaultValue={defaultLocation}
            onChange={(e: any) => {
              setFieldValue('location_guid', e?.value || '')
              setFieldValue('sub_location', '')
            }}
            parse={(e: any) => {
              return {
                value: e?.guid,
                label: e?.name,
              }
            }}
          />
          <div className='fv-plugins-message-container invalid-feedback'>
            <ErrorMessage name='location_guid' />
          </div>
        </div>
        <div className='col-lg-6 mt-3'>
          <label htmlFor='location_sub_guid' className={`${configClass?.label}`}>
            Sub Location
          </label>
          <Select
            sm={true}
            id='select-sub_location'
            name='location_sub_guid'
            className='col p-0'
            api={getSubLocation}
            params={{
              orderCol: 'name',
              orderDir: 'asc',
              'filter[location_guid]': values?.location_guid || '-',
            }}
            reload={false}
            placeholder='Choose Sub Location'
            defaultValue={
              {value: checkout?.location_sub?.guid, label: checkout?.location_sub?.name} ||
              defaultSubLocation
            }
            onChange={(e: any) => setFieldValue('location_sub_guid', e?.value || '')}
            parse={({guid, name}: any) => ({value: guid, label: name})}
          />
        </div>
      </div>
    </div>
  )
}

const LocationField = memo(
  CheckInOutLocation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default LocationField
