import {numberWithCommas, preferenceDate, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC} from 'react'

interface LocationGeneralProps {
  detailLocation: any
  customLocation: any
  insuranceClaim: number
  // isCustomField?: any
}
const LocationGeneral: FC<LocationGeneralProps> = ({
  detailLocation,
  customLocation,
  insuranceClaim,
  // isCustomField = 0,
}) => {
  const pref_date = preferenceDate()
  const pref_date_time = preferenceDateTime()

  const configClass: any = {
    grid: 'col-md-6 my-3',
    body: 'bg-gray-100 p-2 rounded h-100',
  }

  return (
    <div className='card card-custom'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Location</div>
              <div className='text-dark'>{detailLocation?.name || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Location Status</div>
              <div className='text-dark'>{detailLocation?.availability?.name || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Location Desription</div>
              <div className='text-dark'>{detailLocation?.description || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Address 1</div>
              <div className='text-dark'>{detailLocation?.address || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Address 2</div>
              <div className='text-dark'>{detailLocation?.street || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>City</div>
              <div className='text-dark'>{detailLocation?.city || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>State/Province</div>
              <div className='text-dark'>{detailLocation?.state || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Zip/Postal Code</div>
              <div className='text-dark'>{detailLocation?.postcode || '-'}</div>
            </div>
          </div>

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Country</div>
              <div className='text-dark'>{detailLocation?.country_name || '-'}</div>
            </div>
          </div>

          {insuranceClaim === 1 && (
            <>
              <div className={configClass.grid}>
                <div className={configClass.body}>
                  <div className='fw-bolder text-dark mb-1'>Region</div>
                  <div className='text-dark'>{detailLocation?.region || '-'}</div>
                </div>
              </div>

              <div className={configClass.grid}>
                <div className={configClass.body}>
                  <div className='fw-bolder text-dark mb-1'>Site ID</div>
                  <div className='text-dark'>{detailLocation?.site_id || '-'}</div>
                </div>
              </div>
            </>
          )}

          {customLocation?.length > 0 &&
            customLocation?.map((custom: any, index: number) => (
              <div className={configClass.grid} key={index}>
                <div className={configClass.body}>
                  <div className='fw-bolder text-dark mb-1'>{custom?.name}</div>
                  <div className='text-dark'>
                    {custom?.element_type === 'checkbox'
                      ? custom?.value
                        ? custom?.options
                            ?.filter((filter: any) => custom?.value?.includes(filter.key))
                            ?.map((m: any) => m?.value)
                            ?.join(', ')
                        : '-'
                      : custom?.element_type === 'dropdown' || custom?.element_type === 'radio'
                      ? custom?.value
                        ? custom?.options.find((find: any) => find.key === custom?.value)?.value
                        : '-'
                      : custom?.element_type === 'currency'
                      ? custom?.value
                        ? `${custom?.value?.code || ''}
                          ${
                            custom?.value?.amount && custom?.value?.amount !== null
                              ? numberWithCommas(custom?.value?.amount)
                              : ''
                          }`
                        : '-'
                      : custom?.element_type === 'date'
                      ? custom?.value
                        ? moment(custom?.value).format(pref_date)
                        : '-'
                      : custom?.element_type === 'datetime'
                      ? custom?.value
                        ? moment(custom?.value).format(pref_date_time)
                        : '-'
                      : custom?.element_type === 'numeric'
                      ? custom?.value
                        ? numberWithCommas(custom?.value, false)
                        : '-'
                      : custom?.element_type === 'gps'
                      ? custom?.value
                        ? `${custom?.value?.lat},  ${custom?.value?.lng}`
                        : '-'
                      : custom?.value || '-'}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default LocationGeneral
