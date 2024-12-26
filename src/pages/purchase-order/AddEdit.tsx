import {getCurrency} from '@api/preference'
import {getLocationV1} from '@api/Service'
import {getUserV1} from '@api/UserCRUD'
import {AddInputBtn} from '@components/button/Add'
import DateInput from '@components/form/DateInput'
import {Toolbar} from '@components/layout/Toolbar'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import AddLocation from '@pages/location/AddLocation'
import {AddSupplier} from '@pages/setup/settings/supplier/AddSupplier'
import {getSupplier} from '@pages/setup/settings/supplier/Service'
import AddUser from '@pages/user-management/user/AddUser'
import {Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {mixed as YupMixed, object as YupObject, string as YupString} from 'yup'

import ModalAttachAsset from './_modal/AttachAsset'
import {addEditPO, getDetailPO} from './Services'

const validationSchema: any = YupObject().shape({
  name: YupString().required('Name is required'),
  supplier_guid: YupMixed()
    .test('supplier_guid', 'Supplier is required', (e: any) => e?.value || typeof e === 'string')
    .nullable(),
  approver_guid: YupMixed()
    .test('approver_guid', 'Approver is required', (e: any) => e?.value || typeof e === 'string')
    .nullable(),
})

const AddEdit: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference, feature}: any = preferenceStore || {}
  const {guid: id}: any = useParams() || {}

  const [detail, setDetail] = useState<any>({})
  const [attachedAsset, setAttachedAsset] = useState<any>([])
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)
  const [reloadSupplier, setReloadSupplier] = useState<boolean>(false)
  const [showModalAttach, setShowModalAttach] = useState<boolean>(false)
  const [showModalSupplier, setShowModalSupplier] = useState<boolean>(false)
  const [showModalLocation, setShowModalLocation] = useState<boolean>(false)
  const [locationDetail, setLocationDetail] = useState<any>()
  const [reloadLocation, setReloadLocation] = useState<number>(1)
  const [userDetail, setUserDetail] = useState<any>()
  const [showModalUser, setShowModalUser] = useState<boolean>(false)
  const [reloadUser, setReloadUser] = useState<number>(1)
  const [files, setFiles] = useState<any>([])
  const [pagePermission, setPagePermission] = useState<boolean>(true)
  const [preference, setPreference] = useState<any>({})
  const [errForm, setErrForm] = useState<any>(true)
  const [secondErrSubmit, setSecondErrSubmit] = useState<boolean>(false)

  useEffect(() => {
    if (Object.keys(feature || {})?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'purchase_order')
        ?.map((feature: any) => setPagePermission(feature?.value === 0 ? false : true))
    }
  }, [feature])

  useEffect(() => {
    if (dataPreference) {
      const {date_format, time_format, timezone, default_company_guid}: any = dataPreference || {}
      setPreference({
        date_format: date_format,
        time_format: time_format,
        timezone: timezone,
        default_company_guid: default_company_guid,
      })
    }
  }, [dataPreference])

  useEffect(() => {
    if (id) {
      getDetailPO(id)
        .then(({data: {data: res}}: any) => {
          setAttachedAsset(res?.asset as never[])
          setDetail(res)
        })
        .catch(() => '')
    }
  }, [id])

  const initialValues: any = {
    name: detail?.name || '',
    location_guid: detail?.location?.guid || '',
    due_date: detail?.due_date || '',
    supplier_guid: detail?.supplier?.guid || '',
    approver_guid: detail?.approver?.guid || '',
    currency: detail?.currency || '',
    price: detail?.price || '',
    description: detail?.description || '',
    assets: [],
  }

  const handleSubmit = (values: any) => {
    setLoadingBtn(true)
    const params: any = Object.assign({}, values)
    params.assets = attachedAsset?.map(({guid}: any) => guid)

    addEditPO(params, id)
      .then(
        ({
          data: {
            message,
            data: {guid},
          },
        }: any) => {
          setTimeout(() => ToastMessage({type: 'clear'}), 200)
          setTimeout(() => ToastMessage({type: 'success', message}), 220)
          navigate(`/purchase-order/detail/${guid}`)
        }
      )
      .catch((err: any) => {
        Object.values(errorValidation(err || {}))?.forEach((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
      .finally(() => setLoadingBtn(false))
  }

  const onBack: any = () => {
    setTimeout(() => ToastMessage({type: 'clear'}), 200)
    navigate(-1)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.PO'})}</PageTitle>
      {!pagePermission ? (
        <Forbidden />
      ) : (
        <>
          <div className='row'>
            <div className='col-12 text-center mb-5'>
              Please select either to add new asset or choose from existing asset.
            </div>
            <div className='col-12 text-center'>
              <div
                onClick={() => navigate('/asset-management/add')}
                className='d-inline-flex align-items-center col-auto btn btn-sm btn-light-primary radius-5 p-1 border border-primary me-2'
              >
                <div className='btn btn-icon w-25px h-25px btn-primary radius-5'>
                  <i className='las la-plus fs-2 text-white' />
                </div>
                <div className='px-2 fw-bold'>Add New Asset</div>
              </div>
              <div
                className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-5 py-1 ps-1 pe-3 border border-primary'
                onClick={() => setShowModalAttach(true)}
              >
                <div
                  className='btn btn-icon w-25px h-25px btn-primary radius-5'
                  style={{background: 'rgba(255,255,255,0.35)'}}
                >
                  <i className='las la-layer-group fs-4 text-white' />
                </div>
                <div className='px-2 fw-bold'>Attach Existing Asset</div>
              </div>
            </div>
            <div className='col-12 mt-8'>
              {attachedAsset?.length > 0 ? (
                <table className='table w-auto table-row-middle table-sm table-striped table-hover m-0 gx-3 border rounded overflow-hidden mx-auto'>
                  <thead>
                    <tr>
                      <th className='fw-bolder bg-primary text-white text-uppercase fs-7'>
                        Asset ID
                      </th>
                      <th className='fw-bolder bg-primary text-white text-uppercase fs-7'>Name</th>
                      <th
                        className='fw-bolder bg-primary text-white text-uppercase fs-7'
                        colSpan={2}
                      >
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attachedAsset?.map(({guid, asset_id, unique_id, name, category}: any) => (
                      <tr key={guid}>
                        <td className='fs-8 fw-bolder w-125px'>{asset_id || unique_id || '-'}</td>
                        <td className='fw-bold w-300px text-truncate'>{name || '-'}</td>
                        <td className='fw-bold w-200px text-truncate text-primary fs-7'>
                          {category?.name || category?.toString() || '-'}
                        </td>
                        <td className='text-end'>
                          <div
                            className='btn btn-sm btn-icon btn-danger w-20px h-20px radius-50'
                            onClick={() => {
                              setAttachedAsset(
                                (prev: any) => prev?.filter(({guid: uuid}: any) => uuid !== guid)
                              )
                            }}
                          >
                            <i className='las la-times' />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='row'>
                  <div className='col-md-6 mx-auto text-center'>
                    <div className='opacity-50'>
                      <img
                        src='/media/svg/others/no-data.png'
                        alt='No Data'
                        className='w-auto h-50px'
                      />
                      <div className='mt-2'>
                        No asset has attached. To attach assets. <br />
                        Click
                        <span className='fw-bolder mx-2'>&ldquo;Attach Existing Asset&rdquo;</span>
                        button to add asset.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FORMS */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({isSubmitting, setFieldValue, values, errors, touched, isValidating}: any) => {
              if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
                ToastMessage({
                  message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),

                  type: 'error',
                })

                setErrForm(false)

                setTimeout(() => {
                  setSecondErrSubmit(true)
                }, 2000)

                ScrollTopComponent.goTop()
              }

              if (
                isSubmitting &&
                isValidating &&
                !errForm &&
                Object.keys(errors)?.length > 0 &&
                secondErrSubmit
              ) {
                ToastMessage({
                  message: intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'}),

                  type: 'error',
                })

                ScrollTopComponent.goTop()
              }
              return (
                <Form className='mt-10' noValidate>
                  <div className='row'>
                    <div className={configClass?.grid}>
                      <label className={`${configClass?.label} required`}>Name</label>
                      <Field
                        type='text'
                        name='name'
                        placeholder='Enter Name'
                        className={configClass?.form}
                      />
                      {touched?.name && errors?.name && (
                        <div className='text-danger fs-8 mt-1'>{errors?.name}</div>
                      )}
                    </div>
                    <div className={configClass?.grid}>
                      <label className={configClass?.label}>Location</label>
                      <div className='d-flex align-items-center input-group input-group-solid'>
                        <Select
                          sm={true}
                          name='location'
                          className='col p-0'
                          api={getLocationV1}
                          params={{orderCol: 'name', orderDir: 'asc'}}
                          reload={reloadLocation}
                          placeholder='Choose Location'
                          defaultValue={{
                            value: detail?.location?.guid,
                            label: detail?.location?.name,
                          }}
                          onChange={(e: any) => {
                            setFieldValue('location_guid', e?.value || '')
                          }}
                          parse={({guid: value, name: label}: any) => ({value, label})}
                        />
                        <AddInputBtn
                          size={configClass?.size}
                          onClick={() => {
                            setLocationDetail(undefined)
                            setShowModalLocation(true)
                          }}
                        />
                        <AddLocation
                          showModal={showModalLocation}
                          setShowModalLocation={setShowModalLocation}
                          setReloadLocation={setReloadLocation}
                          reloadLocation={reloadLocation}
                          locationDetail={locationDetail}
                        />
                      </div>
                    </div>
                    <div className={configClass?.grid}>
                      <label className={configClass?.label}>Due Date</label>
                      <DateInput
                        sm
                        nullable
                        required
                        name='due_date'
                        controlled
                        defaultValue={values?.due_date || detail?.due_date}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                    <div className={configClass?.grid}>
                      <label className={`${configClass?.label} required`}>Supplier</label>
                      <div className='d-flex align-items-center input-group input-group-solid input-group-sm'>
                        <Select
                          sm={true}
                          name='supplier'
                          className='col p-0'
                          api={getSupplier}
                          params={{}}
                          isClearable={false}
                          reload={reloadSupplier}
                          placeholder='Choose Supplier'
                          defaultValue={{
                            value: detail?.supplier?.guid,
                            label: detail?.supplier?.name,
                          }}
                          onChange={(e: any) => {
                            setFieldValue('supplier_guid', e?.value || '')
                          }}
                          parse={({guid: value, name: label}: any) => ({value, label})}
                        />
                        <AddInputBtn
                          size={configClass?.size}
                          onClick={() => setShowModalSupplier(true)}
                        />
                        <AddSupplier
                          showModal={showModalSupplier}
                          setShowModal={setShowModalSupplier}
                          setReloadSupplier={() => setReloadSupplier(!reloadSupplier)}
                        />
                      </div>
                      {touched?.supplier_guid && errors?.supplier_guid && (
                        <div className='text-danger fs-8 mt-1'>{errors?.supplier_guid}</div>
                      )}
                    </div>
                    <div className={configClass?.grid}>
                      <label className={`${configClass?.label} required`}>Approver</label>
                      <div className='d-flex align-items-center input-group input-group-solid input-group-sm'>
                        <Select
                          sm={true}
                          name='approver'
                          className='col p-0'
                          api={getUserV1}
                          params={{orderCol: 'fullname', orderDir: 'asc'}}
                          isClearable={false}
                          reload={reloadUser}
                          placeholder='Choose Approver'
                          defaultValue={{
                            value: detail?.approver?.guid,
                            label: `${detail?.approver?.first_name} ${detail?.approver?.last_name}`,
                          }}
                          onChange={(e: any) => {
                            setFieldValue('approver_guid', e?.value || '')
                          }}
                          parse={({guid, first_name, last_name}: any) => ({
                            value: guid,
                            label: `${first_name} ${last_name}`,
                          })}
                        />
                        <AddInputBtn
                          size={configClass?.size}
                          onClick={() => {
                            setFiles([])
                            setUserDetail(undefined)
                            setShowModalUser(true)
                          }}
                        />
                        <AddUser
                          showModal={showModalUser}
                          userDetail={userDetail}
                          setShowModalUser={setShowModalUser}
                          setReloadUser={setReloadUser}
                          reloadUser={reloadUser}
                          files={files}
                          setFiles={setFiles}
                          defaultRole={''}
                          preference={preference}
                        />
                      </div>
                      {touched?.approver_guid && errors?.approver_guid && (
                        <div className='text-danger fs-8 mt-1'>{errors?.approver_guid}</div>
                      )}
                    </div>
                    <div className={configClass?.grid}>
                      <label className={configClass?.label}>Price</label>
                      <div className='input-group input-group-solid input-group-sm'>
                        <Select
                          sm={true}
                          name='currency'
                          className='w-100px p-0'
                          api={getCurrency}
                          params={{}}
                          isClearable={false}
                          reload={false}
                          placeholder='Currency'
                          defaultValue={{
                            value: detail?.currency || dataPreference?.currency || '',
                            label: detail?.currency || dataPreference?.currency || '',
                          }}
                          onChange={(e: any) => {
                            setFieldValue('currency', e?.value || '')
                          }}
                          parse={({key: value, key: label}: any) => ({value, label})}
                        />
                        <Field
                          type='number'
                          name='price'
                          placeholder='Enter Price'
                          className={configClass?.form}
                        />
                      </div>
                    </div>
                    <div className='col-12'>
                      <label className={configClass?.label}>Description</label>
                      <Field
                        type='text'
                        as='textarea'
                        name='description'
                        placeholder='Enter Description'
                        className={configClass?.form}
                      />
                    </div>
                  </div>
                  <Toolbar dir='right'>
                    <>
                      <Button
                        className='d-inline-flex align-items-center col-auto btn btn-sm btn-secondary radius-50 py-1 ps-1 pe-3 border border-light me-2'
                        onClick={onBack}
                      >
                        <div
                          className='btn btn-icon w-25px h-25px btn-secondary rounded-circle'
                          style={{background: 'rgba(255,255,255,0.35)'}}
                        >
                          <i className='la la-angle-left icon-lg fs-4 text-gray'></i>
                        </div>
                        <div className='px-2 fw-bold'>Back</div>
                      </Button>
                      <Button
                        type='submit'
                        disabled={loadingBtn}
                        className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 py-1 ps-1 pe-3 border border-primary me-2'
                      >
                        {loadingBtn ? (
                          <>
                            <div
                              className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <span className='spinner-border spinner-border-sm align-middle'></span>
                            </div>
                            <div className='px-2 fw-bold'>Waiting...</div>
                          </>
                        ) : (
                          <>
                            <div
                              className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
                              style={{background: 'rgba(255,255,255,0.35)'}}
                            >
                              <i className='las la-check fs-4 text-white' />
                            </div>
                            <div className='px-2 fw-bold'>Save</div>
                          </>
                        )}
                      </Button>
                    </>
                  </Toolbar>
                </Form>
              )
            }}
          </Formik>

          <ModalAttachAsset
            detail={detail}
            showModal={showModalAttach}
            attachedAsset={attachedAsset}
            setShowModal={setShowModalAttach}
            onAttach={(e: any) => setAttachedAsset((prev: any) => [...prev, ...e])}
          />
        </>
      )}
    </>
  )
}

export default AddEdit
