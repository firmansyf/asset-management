import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {components} from 'react-select'
import * as Yup from 'yup'

import {sendRemoveStock} from '../redux/InventoryCRUD'

let RemoveStock: FC<any> = ({
  showModal,
  setShowModal,
  reloadRemoveStock,
  setReloadRemoveStock,
  detailInventory,
}) => {
  const [location, setLocation] = useState<any>([])
  const [totalCost, setTotalCost] = useState<number>(0)
  const [limitData, setLimitData] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [locationAll, setLocationAll] = useState<any>([])
  const [locationTotal, setLocationTotal] = useState<number>(0)
  const [reservation, setReservation] = useState<boolean>(false)

  const validationSchema: any = Yup.object().shape({
    location_guid: Yup.mixed()
      .test('location_guid', 'Location is required', (e: any) => e?.value || typeof e === 'string')
      .nullable(),
  })

  const initValues: any = {
    notes: '',
    team_guid: '',
    location_guid: '',
    other_recipient: '',
    include_file: false,
  }

  const LoadLimitData = useCallback(
    (old: any, next: any) => {
      const limitedArray: any = detailInventory?.quantity_by_location?.slice(old, next)
      setLocation((prev: any) => {
        const result: any = []
        prev?.forEach((item: any) => {
          result.push(item || {})
        })

        limitedArray?.forEach((item: any) => {
          result.push(item || {})
        })
        return result as never[]
      })
    },
    [detailInventory]
  )

  const OptionWithButton = ({children, ...props}: any) => (
    <components.Option {...props}>{children}</components.Option>
  )

  const MenuListWithButton = ({children, ...props}: any) => {
    return (
      <components.MenuList {...props}>
        {children}
        {limitData <= locationAll?.length && (
          <div className='py-2 text-center'>
            <button
              className='btn btn-sm btn-primary py-2'
              onClick={() => {
                setLimitData(limitData + 5)
                LoadLimitData(limitData, limitData + 5)
              }}
            >
              Read More
            </button>
          </div>
        )}
      </components.MenuList>
    )
  }

  const handleSubmit = (value: any) => {
    setLoading(true)
    const {guid} = detailInventory || {}
    const params: any = {
      quantity: value?.quantity || '',
      description: value?.description || '',
      location_guid: value?.location_guid || '',
      is_remove_reservation: reservation ? 1 : 0,
    }

    sendRemoveStock(params, guid)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        ToastMessage({message, type: 'success'})
        setReloadRemoveStock(reloadRemoveStock + 1)
      })
      .catch((err: any) => {
        setLoading(false)
        errorExpiredToken(err)
        const {response} = err || {}

        if (response) {
          const {message} = response?.data || {}
          ToastMessage({message: message, type: 'error'})
        }
      })
  }

  useEffect(() => {
    if (limitData < 1) {
      setLimitData(5)
      const limitedArray: any = detailInventory?.quantity_by_location?.slice(0, 5)
      setLocation(limitedArray)
    }
    setLocationAll(detailInventory?.quantity_by_location)
  }, [detailInventory, limitData])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={initValues}
        validationSchema={validationSchema}
      >
        {({setFieldValue}: any) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>{detailInventory?.inventory_name} - Remove Stock</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-2'>
                <label htmlFor='location_guid' className={`${configClass?.label} required`}>
                  Location
                </label>
                <Select
                  isClearable={false}
                  className='col p-0'
                  name='location_guid'
                  placeholder='Enter Location'
                  defaultValue={{value: '', label: ''}}
                  components={{Option: OptionWithButton, MenuList: MenuListWithButton}}
                  data={location?.map(({location_name, location_guid}: any) => ({
                    value: location_guid || '',
                    label: location_name || '',
                  }))}
                  onChange={({value}: any) => {
                    const select: any = location?.find(
                      ({location_guid}: any) => location_guid === value
                    )
                    setLocationTotal(select?.quantity || 0)
                    setFieldValue('location_guid', value || '')
                  }}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='location_guid' />
                </div>
              </div>

              <div className=''>
                <div className='row'>
                  <div className='col-6'>
                    <label htmlFor='quantity' className={`${configClass?.label} pt-6`}>
                      Quantity
                    </label>
                  </div>
                  <div className='col-6'>
                    <label htmlFor='' className={configClass?.label} style={{float: 'right'}}>
                      Location Total : {locationTotal}
                    </label>
                  </div>
                </div>
                <Field
                  type='text'
                  name='quantity'
                  placeholder='Enter Quantity'
                  className={configClass?.form}
                  onChange={({target: {value}}: any) => {
                    value = value?.replace(/\D/g, '')
                    const calculate: any =
                      Number(value || 0) * Number(detailInventory?.price_for_remove || 0)

                    setTotalCost(calculate)
                    setFieldValue('quantity', value || '')
                  }}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='costUnit' className={`${configClass?.label}`}>
                  Cost per Unit
                </label>
                <Field
                  readOnly
                  type='text'
                  name='costUnit'
                  placeholder='Cost per Unit'
                  value={detailInventory?.price_for_remove || ''}
                  className={configClass?.form}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='totalCost' className={`${configClass?.label}`}>
                  Total Cost
                </label>
                <Field
                  readOnly
                  type='text'
                  name='totalCost'
                  value={totalCost}
                  placeholder='Total Cost'
                  className={configClass?.form}
                />
              </div>

              <div className='mt-4'>
                <label htmlFor='description' className={`${configClass?.label}`}>
                  Description
                </label>
                <Field
                  type='text'
                  as='textarea'
                  name='description'
                  placeholder='Enter Description'
                  className={configClass?.form}
                />
              </div>

              <div className='mt-5 pt-2'>
                <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid mb-1 mt-1'>
                  <input
                    type='checkbox'
                    id='include_file'
                    name='include_file'
                    checked={reservation}
                    onChange={() => setReservation(!reservation)}
                    className='form-check-input border border-gray-300'
                  />
                  <label
                    htmlFor='include_file'
                    className={`${configClass?.label} ps-2 pt-1 cursor-pointer`}
                  >
                    Remove for Reservation
                  </label>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

RemoveStock = memo(
  RemoveStock,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {RemoveStock}
