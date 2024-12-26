import {configClass, numberWithCommas, preferenceDate} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'

let General: FC<any> = ({data, database}) => {
  const pref_date: any = preferenceDate()
  const [dataDetail, setData] = useState<any>({})
  const {
    'asset.description': description,
    'asset.asemanufacturer_guid': manufacture,
    'asset.manufacturer_model_guid': model,
    'asset.manufacturer_brand_guid': brand,
    'asset.supplier_guid': supplier,
    'asset.serial_number': serialNumber,
    'asset.status_comment': statusComment,
    'asset.qr_code': qrCode,
    'asset.location_guid': location,
    'asset.location_sub_guid': subLocation,
    'asset.type_guid': type,
    'asset.owner_company_department_guid': department,
    'asset.assign_to': assignToEmployee,
  }: any = database || {}

  useEffect(() => {
    data && setData(data)
  }, [data])

  return (
    <div className='card card-custom mt-5'>
      <div className='card-body p-5'>
        <div className='row'>
          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Asset Name</div>
              <div className='text-dark'>{dataDetail?.name || '-'}</div>
            </div>
          </div>

          {description?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Asset Description</div>
                <div className='text-dark text-justify'>{dataDetail?.description || '-'}</div>
              </div>
            </div>
          )}

          {manufacture?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Manufacturer</div>
                <div className='text-dark'>{dataDetail?.manufacturer?.name || '-'}</div>
              </div>
            </div>
          )}

          {model?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Model</div>
                <div className='text-dark'>{dataDetail?.manufacturer_model?.name || '-'}</div>
              </div>
            </div>
          )}

          {brand?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Brand</div>
                <div className='text-dark'>{dataDetail?.manufacturer_brand?.name || '-'}</div>
              </div>
            </div>
          )}

          {supplier?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Supplier</div>
                <div className='text-dark'>{dataDetail?.supplier?.name || '-'}</div>
              </div>
            </div>
          )}

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Asset Status</div>
              <div className='text-dark'>{dataDetail?.status?.name || '-'}</div>
            </div>
          </div>

          {qrCode?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>QR Code</div>
                <div className='text-dark'>{dataDetail?.qr_code || '-'}</div>
              </div>
            </div>
          )}

          {serialNumber?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Serial Number</div>
                <div className='text-dark'>{dataDetail?.serial_number || '-'}</div>
              </div>
            </div>
          )}

          {statusComment?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Status Comment</div>
                <div className='text-dark'>{dataDetail?.status_comment || '-'}</div>
              </div>
            </div>
          )}

          {dataDetail?.status?.name === 'Disposed' && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Disposal Date</div>
                <div className='text-dark'>
                  {dataDetail?.disposal_date?.split(' ')?.[0] &&
                    moment(dataDetail?.disposal_date?.split(' ')?.[0]).format(pref_date)}
                </div>
              </div>
            </div>
          )}

          {/* assignee */}
          {location?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Location</div>

                <div className='text-dark'>{dataDetail?.location?.name || '-'}</div>
              </div>
            </div>
          )}

          {subLocation?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Sub Location</div>

                <div className='text-dark'>{dataDetail?.location_sub?.name || '-'}</div>
              </div>
            </div>
          )}

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Category</div>

              <div className='text-dark'>{dataDetail?.category?.name || '-'}</div>
            </div>
          </div>

          {type?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Type</div>
                <div className='text-dark'>{dataDetail?.type?.name || '-'}</div>
              </div>
            </div>
          )}

          <div className={configClass.grid}>
            <div className={configClass.body}>
              <div className='fw-bolder text-dark mb-1'>Company</div>

              <div className='text-dark'>{dataDetail?.owner_company?.name || '-'}</div>
            </div>
          </div>

          {department?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Department</div>

                <div className='text-dark'>{dataDetail?.owner_company_department?.name || '-'}</div>
              </div>
            </div>
          )}

          {assignToEmployee?.is_selected && (
            <div className={configClass.grid}>
              <div className={configClass.body}>
                <div className='fw-bolder text-dark mb-1'>Assigned User or Employee</div>

                <div className='text-dark'>{dataDetail?.assign_to?.name || '-'}</div>
              </div>
            </div>
          )}
          {/* assignee */}

          {dataDetail?.custom_fields?.length > 0 &&
            dataDetail?.custom_fields?.map((custom: any, index: any) => (
              <div className={configClass.grid} key={index}>
                <div className={configClass.body}>
                  <div className='fw-bolder text-dark mb-1'>{custom.name}</div>
                  <div
                    className='text-dark'
                    data-cy={`${custom?.name?.split(' ').join('-')}-value`}
                  >
                    {custom?.value ? (
                      <>
                        {![
                          'dropdown',
                          'radio',
                          'checkbox',
                          'currency',
                          'date',
                          'gps',
                          'numeric',
                        ].includes(custom?.element_type) && custom.value}
                        {/* { custom.element_type === 'date' &&  validationViewDate((custom?.value || ''), preference?.date_format) } */}
                        {custom.element_type === 'date' &&
                          (custom?.value ? moment(custom?.value).format(pref_date) : '-')}
                        {custom.element_type === 'currency' &&
                          (custom?.value?.code || '') +
                            ' ' +
                            numberWithCommas(custom?.value?.amount)}
                        {custom.element_type === 'numeric' &&
                          numberWithCommas(custom?.value, false)}
                        {custom?.element_type === 'checkbox' &&
                          custom?.options
                            ?.filter((filter: any) => custom?.value.includes(filter.key))
                            .map((m: any) => m?.value)
                            .join(', ')}
                        {['dropdown', 'radio'].includes(custom.element_type) &&
                          custom.options.find((find: any) => find.key === custom?.value)?.value}
                        {custom.element_type === 'gps' &&
                          `Long : ${custom?.value?.lat}, Lat : ${custom?.value?.lng}`}
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

General = memo(General, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default General
