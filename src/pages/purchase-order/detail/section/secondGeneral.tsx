/* eslint-disable react-hooks/exhaustive-deps */
import {Accordion} from '@components/Accordion'
import {Title} from '@components/form/Title'
import {configClass} from '@helpers'
import {FC, Fragment, useEffect, useState} from 'react'

import {Files} from './filesPO'

const SecondGeneral: FC<any> = ({data}) => {
  const {delivery} = data || {}
  const [deliveryChecklis1, setDeliveryChecklis1] = useState<boolean>(false)
  const [deliveryChecklis2, setDeliveryChecklis2] = useState<boolean>(false)
  const [deliveryChecklis3, setDeliveryChecklis3] = useState<boolean>(false)
  const [deliveryChecklis4, setDeliveryChecklis4] = useState<boolean>(false)

  useEffect(() => {
    delivery?.[0]?.item_check?.map((value: any) => {
      switch (value) {
        case '1':
          return setDeliveryChecklis1(true)
        case '2':
          return setDeliveryChecklis2(true)
        case '3':
          return setDeliveryChecklis3(true)
        case '4':
          return setDeliveryChecklis4(true)
        default:
          return false
      }
    })
  }, [delivery])

  return (
    <Accordion id='accordion' flat fit style={{zIndex: 0, position: 'relative'}}>
      <div
        className='row'
        data-label={<Title title='Delivery and Payment' sticky={false} className='my-5' />}
      >
        <div className='row'>
          <div className='col-5'>
            {delivery?.map((item: any) => {
              return (
                <Fragment key={item?.delivery_date}>
                  <div className='mb-4'>
                    <div className={configClass?.body}>
                      <div className='fw-bolder text-dark mb-1'>Delivery Date</div>
                      <div className='text-dark'>{item?.delivery_date || '-'}</div>
                    </div>
                  </div>
                </Fragment>
              )
            })}
          </div>
        </div>

        <div className='d-flex w-75 align-items-center justify-content-between'>
          <span className='fs-4 mt-4 mb-3'>Does the goods receipt match the purchase order ?</span>

          <div className='radio-btn d-flex justify-content-between' style={{width: '9rem'}}>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='radio'
                name='flexRadioDefault'
                id='flexRadioDefault1'
                checked={delivery?.[0]?.is_match === 1 ? true : false}
              />
              <label className='form-check-label' htmlFor='flexRadioDefault1'>
                Yes
              </label>
            </div>

            <div className='form-check'>
              <input
                className='form-check-input'
                type='radio'
                name='flexRadioDefault'
                id='flexRadioDefault2'
                checked={delivery?.[0]?.is_match === 0 ? true : false}
              />
              <label className='form-check-label' htmlFor='flexRadioDefault2'>
                No
              </label>
            </div>
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-7 pt-4'>
            <div className=''>
              <div className='d-flex flex-row-reverse form-check form-check-sm form-check-custom form-check-solid justify-content-between my-2'>
                <input
                  className='form-check-input border border-gray-300'
                  type='checkbox'
                  checked={deliveryChecklis1}
                  readOnly={true}
                />
                <label className='form-check-label' htmlFor=''>
                  {`1. The quantity of assets that arrived is correct`}
                </label>
              </div>

              <div className='d-flex flex-row-reverse form-check form-check-sm form-check-custom form-check-solid justify-content-between my-2'>
                <input
                  className='form-check-input border border-gray-300'
                  type='checkbox'
                  checked={deliveryChecklis2}
                  readOnly={true}
                />
                <label className='form-check-label' htmlFor=''>
                  {`2. Goods are suitable for use`}
                </label>
              </div>

              <div className='d-flex flex-row-reverse form-check form-check-sm form-check-custom form-check-solid justify-content-between my-2'>
                <input
                  className='form-check-input border border-gray-300'
                  type='checkbox'
                  checked={deliveryChecklis3}
                  readOnly={true}
                />
                <label className='form-check-label' htmlFor=''>
                  {`3. The price match with terms of purchase order`}
                </label>
              </div>

              <div className='d-flex flex-row-reverse form-check form-check-sm form-check-custom form-check-solid justify-content-between my-2'>
                <input
                  className='form-check-input border border-gray-300'
                  type='checkbox'
                  checked={deliveryChecklis4}
                  readOnly={true}
                />
                <label className='form-check-label' htmlFor=''>
                  {`4. All asset meet the ordered specifications`}
                </label>
              </div>
            </div>
          </div>
          <div className='col '>
            <div className='w-auto'>
              <Files data={data} />
            </div>
          </div>
        </div>
      </div>
    </Accordion>
  )
}
export {SecondGeneral}
