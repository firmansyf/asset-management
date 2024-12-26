import {getLocationV1} from '@api/Service'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, IMG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {omit} from 'lodash'
import {FC, useRef, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import scannerComponent from 'react-qr-barcode-scanner'
import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'

import {addStockDetail} from '../redux/InventoryCRUD'

const ScannerComponent: any = scannerComponent
const Scanner: FC<any> = ({showModal, setShowModal, setFieldValue}) => {
  return (
    <Modal
      dialogClassName='modal-md modal-dialog-centered position-relative'
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <ScannerComponent
        width='100%'
        height='auto'
        delay={300}
        onUpdate={(_err: any, res: any) => {
          if (res) {
            setFieldValue('barcode', res?.text)
            setShowModal(false)
          }
        }}
      />
      <div className='position-absolute w-100 h-100 text-center' style={{zIndex: 9, opacity: 0.25}}>
        <IMG path={'/images/scanner.png'} className={'h-100'} />
      </div>
    </Modal>
  )
}
const FormStock: FC<any> = ({onAdd, data}) => {
  const navigate: any = useNavigate()
  const locationRef: any = useRef()
  const [showModal, setShowModal] = useState<any>(false)
  const validationSchema: any = Yup.object().shape({
    barcode: Yup.string()
      .test(
        'barcode',
        'barcode must be uniq',
        (val: any) => !data?.find(({barcode}: any) => barcode === val)
      )
      .nullable(),
    serial_number: Yup.string()
      .test(
        'serial_number',
        'serial number must be uniq',
        (val: any) => !data?.find(({serial_number}: any) => serial_number === val)
      )
      .nullable(),
    unique_id: Yup.string()
      .test(
        'unique_id',
        'unique id must be uniq',
        (val: any) => !data?.find(({unique_id}: any) => unique_id === val)
      )
      .nullable(),
    location: Yup.mixed()
      .test('location', 'This location is required', (e: any) => e?.value)
      .nullable(),
  })
  const initialValues: any = {
    barcode: '',
    serial_number: '',
    unique_id: '',
    location: '',
  }
  return (
    <div className='row'>
      <div className='col-12'>
        <div onClick={() => navigate(-1)} className='btn btn-sm btn-light-primary radius-50 p-2'>
          <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
            <i className='las la-arrow-left text-white' />
          </span>
          <span className='px-2'>Back to Inventory</span>
        </div>
      </div>
      <div className='col-12 mt-5'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange
          onSubmit={onAdd}
        >
          {({values, setFieldValue, isValid, resetForm, errors}) => {
            return (
              <Form>
                <div className='p-3 shadow-lg mt-5 rounded'>
                  <div className='row align-items-center'>
                    <div className='col-auto'>
                      <div
                        onClick={() => setShowModal(true)}
                        className='btn btn-sm btn-light rounded p-2 position-relative'
                      >
                        {values?.barcode && (
                          <div className='position-absolute top-0 end-0 m-n1' style={{zIndex: 1}}>
                            {errors?.barcode ? (
                              <span className='btn btn-icon w-15px h-15px bg-danger rounded-circle'>
                                <i className='fas fa-times fs-9 text-white' />
                              </span>
                            ) : (
                              <span className='btn btn-icon w-15px h-15px bg-success rounded-circle'>
                                <i className='fas fa-check fs-9 text-white' />
                              </span>
                            )}
                          </div>
                        )}
                        <span className='btn btn-icon w-25px h-25px bg-dark rounded-circle'>
                          <i className='las la-qrcode fs-3 text-white' />
                        </span>
                        <span className='px-2 fw-bolder text-dark'>Add Barcode</span>
                      </div>
                      <Scanner
                        showModal={showModal}
                        setShowModal={setShowModal}
                        setFieldValue={setFieldValue}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='barcode' />
                      </div>
                    </div>
                    <div className='col'>
                      <div className='input-group input-group-solid mt-2 align-items-center ps-3'>
                        <i className='las la-barcode fs-1 text-gray-700' />
                        <Field
                          type='text'
                          name='serial_number'
                          className={configClass?.form}
                          placeholder='Enter Serial Number'
                        />
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='serial_number' />
                      </div>
                    </div>
                    <div className='col'>
                      <div className='input-group input-group-solid mt-2 align-items-center ps-3'>
                        <i className='las la-id-card fs-1 text-dark' />
                        <Field
                          type='text'
                          name='unique_id'
                          className={configClass?.form}
                          placeholder='Enter Unique ID'
                        />
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='unique_id' />
                      </div>
                    </div>
                    <div className='col'>
                      <div className='input-group input-group-solid mt-2 align-items-center ps-3'>
                        <i className='las la-map-marker fs-1 text-dark' />
                        <Select
                          ref={locationRef}
                          sm={true}
                          className='col p-0'
                          api={getLocationV1}
                          params={false}
                          reload={false}
                          placeholder='Choose Location'
                          defaultValue={undefined}
                          onChange={(e: any) => {
                            setFieldValue('location', e || null)
                          }}
                          parse={({guid, name}: any) => ({value: guid, label: name})}
                        />
                      </div>
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='location' />
                      </div>
                    </div>
                    <div className='col-auto border-start border-2'>
                      <button
                        type='submit'
                        className='btn btn-icon btn-primary w-35px h-35px rounded-circle'
                        onClick={() => {
                          if (isValid) {
                            setTimeout(() => {
                              locationRef?.current?.clearValue()
                              resetForm()
                            }, 300)
                          }
                        }}
                      >
                        <i className='las la-plus fs-3 text-white' />
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}
const TableStock: FC<any> = ({data, onRemove, errors}) => {
  if (data?.length === 0) {
    return (
      <div className='row mt-10'>
        <div className='col-12 text-center'>
          <IMG path={'/media/svg/others/nodata.svg'} className='h-200px' style={{opacity: 0.25}} />
          <p className='m-0'>
            There&apos;s no stock. Fill the form and click plus (+) buttton to add stock
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className='row mt-10'>
      <div className='col-12'>
        <div className='p-3'>
          <table className='table table-sms table-striped'>
            <thead>
              <tr className='border-bottom-3 border-gray-200'>
                <th className='text-primary fw-bolder text-center'>No.</th>
                <th className='text-primary fw-bolder'>Barcode</th>
                <th className='text-primary fw-bolder'>Serial Number</th>
                <th className='text-primary fw-bolder'>Unique ID</th>
                <th className='text-primary fw-bolder'>Location</th>
                <th className='text-primary fw-bolder text-gray-300 text-center'>#</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(({barcode, serial_number, unique_id, location}: any, index: number) => (
                <tr key={index}>
                  <td className='fw-bolder text-center'>{index + 1}</td>
                  <td className='fw-bolder'>{barcode}</td>
                  <td className='fw-bolder'>
                    <div>{serial_number}</div>
                    {errors[`datas.${index}.serial_number`] && (
                      <div className='text-danger fs-9'>
                        {errors[`datas.${index}.serial_number`]?.replace(
                          /(.*)(datas\.\d\.)/gi, // /(.*)(datas\.[0-9]\.)/gi,
                          'this '
                        )}
                      </div>
                    )}
                  </td>
                  <td className='fw-bolder'>
                    <div>{unique_id}</div>
                    {errors[`datas.${index}.unique_id`] && (
                      <div className='text-danger fs-9'>
                        {errors[`datas.${index}.unique_id`]?.replace(
                          /(.*)(datas\.\d\.)/gi, // /(.*)(datas\.[0-9]\.)/gi,
                          'this '
                        )}
                      </div>
                    )}
                  </td>
                  <td className='fw-bolder'>
                    <div>{location?.label || '-'}</div>
                    {errors[`datas.${index}.location_guid`] && (
                      <div className='text-danger fs-9'>
                        {errors[`datas.${index}.location_guid`]?.replace(
                          /(.*)(datas\.\d\.)/gi, // /(.*)(datas\.[0-9]\.)/gi,
                          'this '
                        )}
                      </div>
                    )}
                  </td>
                  <td className='text-center'>
                    <span className='bg-light-danger p-2 radius-10' onClick={() => onRemove(index)}>
                      <span className='btn btn-icon w-20px h-20px bg-danger rounded-circle'>
                        <i className='las la-times fs-5 text-white' />
                      </span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
const InventoryAddStockDetail: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const params: any = useParams()
  const {guid}: any = params || {}
  const [data, setData] = useState<any>([])
  const [errors, setErrors] = useState<any>([])
  const onAdd: any = (values: any) => {
    if (values?.barcode !== '' || values?.serial_number !== '' || values?.unique_id !== '') {
      setData((prev: any) => [...prev, values])
      setErrors([])
    } else {
      ToastMessage({type: 'error', message: 'Please fill Barcode, Serial Number or Unique ID'})
    }
  }
  const onRemove: any = (index: any) => {
    const removedData: any = data
    removedData.splice(index, 1)
    setData([...removedData])
    setErrors([])
  }
  const submitData: any = () => {
    const datas: any = data?.map((m: any) => {
      m.location_guid = m?.location?.value
      return omit(m, ['location'])
    })
    addStockDetail({datas}, guid)
      .then(({data: {message}}: any) => {
        ToastMessage({type: 'success', message})
        navigate({
          pathname: `/inventory/detail/${guid}`,
          hash: 'stock-detail',
        })
      })
      .catch((err: any) => {
        setErrors(errorValidation(err))
        Object.values(errorValidation(err))?.map(
          (message: any) =>
            ToastMessage({
              type: 'error',
              message: message?.replace(/(.*)(datas\.\d\.)/gi, ''),
            })
          // /(.*)(datas\.[0-9]\.)/gi
        )
      })
  }
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.INVENTORY.ADD.STOCK.DETAIL'})}
      </PageTitle>
      <FormStock onAdd={onAdd} data={data} />
      <TableStock data={data} onRemove={onRemove} errors={errors} />
      <div className='row mt-5'>
        <div className='col text-center'>
          <div
            onClick={() => navigate(-1)}
            className='btn btn-sm btn-light-primary w-125px radius-50 p-2 me-2'
          >
            <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle float-start'>
              <i className='las la-arrow-left text-white' />
            </span>
            <span className='pe-3'>Back</span>
          </div>
          <div onClick={submitData} className='btn btn-sm btn-primary radius-50 p-2'>
            <span className='px-2'>Save {data?.length} data</span>
            <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
              <i className='las la-arrow-right text-white' />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
export default InventoryAddStockDetail
