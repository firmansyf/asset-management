/* eslint-disable react-hooks/exhaustive-deps */
import {PageLoader} from '@components/loader/cloud'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {addInventoryWO, editInventoryWO, getInvenWo} from '@pages/maintenance/Service'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import Select from 'react-select'
import * as Yup from 'yup'

const schema = Yup.object().shape({
  inventory_guid: Yup.string().required('Inventory is required').nullable(),
  location_guid: Yup.string().required('Location Inventory is required').nullable(),
  quantity: Yup.string().required('Quantity is required').nullable(),
})
type Props = {
  showModal: any
  setShowModal: any
  detail: any
  loading: any
  setDetail: any
  reload: any
  setReload: any
  setLoading: any
  guid: any
  guidInven: any
}
const AddTableInventory: FC<Props> = ({
  showModal,
  setShowModal,
  detail,
  loading,
  reload,
  setReload,
  setLoading,
  guid,
  guidInven,
}) => {
  const intl: any = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const [inventoryData, setInventoryData] = useState<any>([])
  const [locationData, setLocationData] = useState<any>([])
  const [modules, setModules] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }, [])

  const handleOnSubmit = (value: any) => {
    const params = {
      maintenance_guid: guid,
      inventory_guid: value?.inventory_guid,
      location_guid: value?.location_guid,
      quantity: value?.quantity,
    }
    if (guidInven) {
      editInventoryWO(guidInven, {quantity: value?.quantity})
        .then((res: any) => {
          setLoading(false)
          setShowModal(false)
          ToastMessage({message: res?.data?.message, type: 'success'})
          setReload(reload + 1)
        })
        .catch((err: any) => {
          setLoading(false)
          if (err.response) {
            const {data, message} = err?.response?.data || {}
            const {fields} = data || {}
            if (fields) {
              Object.keys(fields || {})?.forEach((item: any) => {
                ToastMessage({message: fields?.[item]?.[0], type: 'error'})
              })
            } else {
              ToastMessage({type: 'error', message: message})
            }
            // if (fields) {
            //   const {location_guid, inventory_guid, quantity} = fields
            //   actions.setFieldError('quantity', quantity?.[0])
            //   actions.setFieldError('location_guid', location_guid?.[0])
            //   actions.setFieldError('inventory_guid', inventory_guid?.[0])
            // }
          }
        })
    } else {
      addInventoryWO(params)
        .then((res: any) => {
          setLoading(false)
          setShowModal(false)
          ToastMessage({message: res?.data?.message, type: 'success'})
          setReload(reload + 1)
        })
        .catch((err: any) => {
          setLoading(false)
          if (err.response) {
            const {data, message} = err?.response?.data || {}
            const {fields} = data || {}
            if (fields) {
              Object.keys(fields || {})?.forEach((item: any) => {
                ToastMessage({message: fields?.[item]?.[0], type: 'error'})
              })
            } else {
              ToastMessage({type: 'error', message: message})
            }
          }
        })
    }
  }
  useEffect(() => {
    getInvenWo()
      .then(({data: {data}}: any) => {
        const res = data?.map(({guid, inventory_name}: any) => {
          return {
            value: guid,
            label: inventory_name,
          }
        })
        setInventoryData(res)
        setModules(data)
      })
      .catch(() => '')
  }, [])

  useEffect(() => {
    const module = modules?.find(({guid}: any) => guid === detail?.inventory_guid)
    if (module !== undefined) {
      const {quantity_by_location}: any = module || {}
      const res = quantity_by_location?.map(({location_guid, location_name}: any) => {
        return {
          value: location_guid,
          label: location_name,
        }
      })
      setLocationData(res)
    }
  }, [modules, detail?.inventory_guid])

  const onClose = () => {
    setShowModal(false)
    setLocationData([])
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => onClose()}>
      <Formik
        initialValues={{
          inventory_guid: detail?.inventory_guid,
          location_guid: detail?.location_guid,
          quantity: detail?.quantity,
        }}
        enableReinitialize
        validationSchema={schema}
        onSubmit={handleOnSubmit}
      >
        {({values, setFieldValue, setSubmitting, isSubmitting, errors}: any) => {
          if (
            isSubmitting &&
            Object.keys(errors || {})?.length > 0 &&
            errors?.quantity?.length < 21
          ) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setSubmitting(false)
          }
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{detail ? 'Edit' : 'Add'} Inventory</Modal.Title>
              </Modal.Header>
              {isLoading ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label htmlFor='inventory_name' className={`${configClass?.label} required`}>
                        Inventory
                      </label>
                      <Select
                        options={inventoryData}
                        inputId='inventory_guid'
                        name='inventory_guid'
                        styles={customStyles(true, {})}
                        components={{ClearIndicator, DropdownIndicator}}
                        value={inventoryData?.find(
                          ({value}: any) => value === values?.inventory_guid
                        )}
                        placeholder='Select Inventory'
                        onChange={({value}: any) => {
                          const module = modules?.find(({guid}) => guid === value)
                          setFieldValue('inventory_guid', value)
                          setFieldValue('location_guid', '')
                          const {quantity_by_location}: any = module || {}
                          setLocationData(
                            quantity_by_location?.map(({location_guid, location_name}: any) => {
                              return {
                                value: location_guid,
                                label: location_name,
                              }
                            })
                          )
                        }}
                      />
                    </div>
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='inventory_guid' />
                    </div>
                  </div>
                  <div className='row mt-3'>
                    <div className='col-md-12'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Location Inventory
                      </label>
                      <div className='d-flex align-items-center input-group input-group-solid'>
                        <Select
                          className='col p-0'
                          styles={customStyles(true, {})}
                          components={{ClearIndicator, DropdownIndicator}}
                          options={locationData}
                          inputId='location_guid'
                          name='location_guid'
                          placeholder='Select Location Name'
                          value={locationData?.find(
                            ({value}: any) => value === values?.location_guid
                          )}
                          onChange={({value}: any) => {
                            setFieldValue('location_guid', value)
                          }}
                        />
                      </div>
                    </div>
                    <div className='fv-plugins-message-container invalid-feedback'>
                      <ErrorMessage name='location_guid' />
                    </div>
                  </div>
                  <div className='row mt-3'>
                    <div className='col-md-12'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Quantity
                      </label>
                      <Field
                        name='quantity'
                        type='number'
                        placeholder='Enter Quantity'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='quantity' />
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && <span className='indicator-label'>{detail ? 'Save' : 'Add'}</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}
export {AddTableInventory}
