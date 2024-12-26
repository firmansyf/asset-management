import {Title as CardTitle} from '@components/form/Title'
import GoogleMaps from '@components/maps'
import {FC, memo} from 'react'

let LocationGps: FC<any> = ({detailLocation}) => {
  return (
    <div className='card border border-gray-300 mt-6'>
      <div className='card-header align-items-center px-4'>
        <CardTitle title='GPS Coordinates' sticky={false} />
      </div>
      <div className='card-body align-items-center px-4 py-3'>
        {detailLocation?.lat !== null && detailLocation?.long !== null ? (
          <>
            <p className='mt-3'>{detailLocation?.lat + ', ' + detailLocation?.long}</p>
            <div className='col-12'>
              <GoogleMaps
                readOnly
                latitude={detailLocation?.lat}
                longitude={detailLocation?.long}
                height='250px'
              />
            </div>
          </>
        ) : (
          <p className='mt-3 text-center'>No coordinates added to this location</p>
        )}
      </div>
    </div>
  )
}

LocationGps = memo(
  LocationGps,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default LocationGps
