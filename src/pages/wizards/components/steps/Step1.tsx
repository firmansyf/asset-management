import {SelectCountry} from '@components/form/SelectCountry'
import {SelectCurrency} from '@components/form/SelectCurrency'
import {SelectDateFormat} from '@components/form/SelectDateFormat'
import {SelectTimeFormat} from '@components/form/SelectTimeFormat'
import {SelectTimezone} from '@components/form/SelectTimezone'
import {PageLoader} from '@components/loader/cloud'
import {customStyles} from '@components/select/config'
import {configClass, KTSVG, staticMonth, toAbsoluteUrl} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {ErrorMessage, Field} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import ImageUploading, {ImageListType} from 'react-images-uploading'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import Select from 'react-select'

type CompanyProps = {
  values: any
  setFieldValue: any
  initialValues: any
  errors: any
  companyPhoto: any
  setCompanyCountry: any
}

let Step1: FC<CompanyProps> = ({
  setFieldValue,
  initialValues,
  errors,
  companyPhoto,
  values,
  setCompanyCountry,
}) => {
  const maxNumber: any = 1
  const intl: any = useIntl()
  const month = staticMonth()
  const {token, currentUser}: any = useSelector(
    ({token, currentUser}: any) => ({token, currentUser}),
    shallowEqual
  )
  const {registration_wizard_status}: any = currentUser || {}

  const [images, setImages] = useState<any>([])
  const [isNumber, setIsNumber] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [imageProfile, setImageProfile] = useState<any>()

  const onChange = (imageList: ImageListType) => {
    imageList?.[0] &&
      setFieldValue('photo', {
        data: imageList?.[0]?.dataURL || '',
        title: imageList?.[0]?.file?.name || '',
      })
    setImages(imageList as never[])
  }

  const toDataURL = (url: any, callback: any) => {
    const xhr: any = new XMLHttpRequest()
    xhr.onload = function () {
      const reader: any = new FileReader()
      reader.onloadend = function () {
        callback(reader?.result)
      }
      reader.readAsDataURL(xhr?.response)
    }
    xhr.open('GET', `${url}?token=${token}`)
    xhr.responseType = 'blob'
    xhr.send()
  }

  useEffect(() => {
    companyPhoto?.url
      ? toDataURL(companyPhoto?.url, (dataUrl: any) => {
          setImageProfile({
            title: companyPhoto?.title,
            data: dataUrl,
          })
        })
      : setImageProfile({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyPhoto])

  useEffect(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
    const obj: any[] = Array(31)
      ?.fill('')
      ?.map((_arr: any, i: number) => ({value: i + 1, label: i + 1}))
    setIsNumber(obj as never[])
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>Setup Wizard</PageTitle>

      {loading ? (
        <PageLoader />
      ) : (
        <div className='w-100'>
          <div className='form-row'>
            <div className='pb-lg-12'>
              <div className='row'>
                <h3 data-cy='titleHeaderWizardStep1' className='fw-bolder text-dark'>
                  <KTSVG
                    path='/media/icons/duotone/Clothes/Briefcase.svg'
                    className='svg-icon-2x me-5 text-dark'
                  />
                  {intl.formatMessage({id: 'COMPANY_DETAILS'})}
                </h3>
              </div>

              <div className='text-black-300 fs-6 ms-14'>
                {intl.formatMessage({id: 'PROVIDE_THE_NAME_AND_ADDRESS_OF_THE_MAIN_OFFICE'})}
              </div>
            </div>

            <div className='w-auto ms-15'>
              {/* col-xl-8 */}
              <div className='row'>
                <div className={configClass?.grid}>
                  <label data-cy='labelCompany' className={`${configClass?.label} required`}>
                    Company
                  </label>
                  <Field
                    type='text'
                    name='company'
                    data-cy='company'
                    placeholder='Enter Company'
                    readOnly={registration_wizard_status === 0 ? true : false}
                    className={configClass?.form}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='company' />
                  </div>
                </div>

                <div className={configClass?.grid}>
                  <label data-cy='labelAddress' className={`${configClass?.label} required`}>
                    Address 1
                  </label>
                  <Field
                    data-cy='address'
                    name='address_one'
                    autoComplete='off'
                    placeholder='Enter Address 1'
                    className={configClass?.form}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='address_one' />
                  </div>
                </div>

                <div className={configClass?.grid}>
                  <label
                    data-cy='labelExtendedAddress'
                    className={`${configClass?.label} required`}
                  >
                    Address 2
                  </label>
                  <Field
                    name='address_two'
                    data-cy='extended_address'
                    autoComplete='off'
                    placeholder='Enter Address 2'
                    className={configClass?.form}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='address_two' />
                  </div>
                </div>

                <div className={configClass?.grid}>
                  <label data-cy='labelCity' className={`${configClass?.label} required`}>
                    City
                  </label>
                  <Field
                    name='city'
                    data-cy='city_company'
                    placeholder='Enter City'
                    autoComplete='off'
                    className={configClass?.form}
                  />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='city' />
                  </div>
                </div>

                <div className={configClass?.grid}>
                  <div className='row'>
                    <div className='col-md-6'>
                      <label data-cy='labelZip' className={`${configClass?.label} required`}>
                        ZIP/Postal Code
                      </label>
                      <Field
                        type='text'
                        maxLength='10'
                        name='postal_code'
                        autoComplete='off'
                        placeholder='Enter Zip/Postal Code'
                        className={configClass?.form}
                        onChange={({target: {value}}: any) =>
                          setFieldValue('postal_code', value || '')
                        }
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='postal_code' />
                      </div>
                    </div>

                    <div className='col-md-6'>
                      <label data-cy='labelState' className={`${configClass?.label} required`}>
                        State/Province
                      </label>
                      <Field
                        name='state'
                        data-cy='state'
                        autoComplete='off'
                        placeholder='Enter State/Province'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='state' />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={configClass?.grid}>
                  {/* <label data-cy='labelCountry' className={`${configClass?.label} required`}>
                    Country
                  </label> */}
                  <SelectCountry
                    vertical
                    label={true}
                    isClearable={false}
                    setFieldValue={setFieldValue}
                    defaultValue={initialValues?.country}
                    setCompanyCountry={setCompanyCountry}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='form-row border-top'>
            <div className='py-5 pb-lg-12'>
              <h3 data-cy='headerSectionTimezone' className='fw-bolder text-dark'>
                <KTSVG path='/media/icons/duotone/Home/Timer.svg' className='svg-icon-2x me-5' />
                {intl.formatMessage({id: 'TIMEZONE_CURRENCY'})}
              </h3>

              <div className='text-black-400 fs-6 ms-14' data-cy='descSectionTimezone'>
                {intl.formatMessage({
                  id: 'ADJUST_THE_SETTINGS_TO_FIT_YOUR_LOCAL_TIMEZONE_AND_CURRENCY_TO_KEEP_EVERYTHING_ORGANISED',
                })}
              </div>
            </div>

            <div className='col-auto ms-15'>
              <div className='row mb-5'>
                <div className={`col-md-7 mb-5`}>
                  <label className={`${configClass?.label} required`}>Timezone</label>
                  <SelectTimezone
                    vertical
                    label={false}
                    isClearable={false}
                    setFieldValue={setFieldValue}
                    initialValues={initialValues}
                  />
                </div>

                <div className={`col-md-5 mb-5`}>
                  <label className={`${configClass?.label} required`}>Currency</label>
                  <SelectCurrency
                    vertical
                    label={false}
                    isClearable={false}
                    setFieldValue={setFieldValue}
                    initialValues={initialValues}
                  />
                </div>

                <div className={`col-md-7 row m-0`}>
                  <div className={`col-md-6 p-0 pe-1 mobilePadding`}>
                    <label className={`${configClass?.label} required`}>Date format</label>
                    <SelectDateFormat vertical label={false} />
                  </div>

                  <div className={`col-md-6 p-0 ps-1 mobilePadding`}>
                    <label className={`${configClass?.label} required`}>Time format</label>
                    <SelectTimeFormat vertical label={false} />
                  </div>
                </div>

                <div className={`col-md-5 row m-0`}>
                  <div className={`col-md-12 p-0`}>
                    <label className={`${configClass?.label} required`}>
                      Financial Year begins on
                    </label>
                    <div className='row'>
                      <div className='col pe-0'>
                        <Select
                          options={isNumber}
                          className='col-auto p-0'
                          placeholder='Choose Date'
                          styles={customStyles(true, {})}
                          onChange={({value}: any) => setFieldValue('financial_day', value || '')}
                          value={isNumber?.find(({value}: any) => value === values?.financial_day)}
                        />
                      </div>

                      <div className='col'>
                        <Select
                          options={month}
                          className='col-auto p-0'
                          placeholder='Choose Month'
                          styles={customStyles(true, {})}
                          value={month?.find(({id}: any) => id === values?.financial_month)}
                          onChange={({id}: any) => setFieldValue('financial_month', id || '')}
                        />
                      </div>
                    </div>

                    {errors?.financial_year_begin !== undefined && (
                      <div className='fv-plugins-message-container invalid-feedback'>
                        {errors?.financial_year_begin?.[0] || ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='form-row border-top'>
            <div className='py-5'>
              <h3 className='fw-bolder text-dark'>
                <KTSVG
                  className='svg-icon-2x me-5'
                  path='/media/icons/duotone/Interface/Image.svg'
                />
                Company Logo
              </h3>

              <div className='text-black-400 fs-6 ms-14'>
                {intl.formatMessage({
                  id: 'UPLOAD_YOUR_ORGANIZATION_S_LOGO_TO_MAKE_THIS_SPACE_YOUR_OWN',
                })}
                {/* // Upload your organization’s logo to make this space your own. */}
              </div>
            </div>

            <div>
              <div className='column d-flex'>
                <div className='col-sm-12 col-md-5 col-lg-5 ms-13 text-center'>
                  <ImageUploading
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    acceptType={['jpg', 'png']}
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageUpdate,
                      onImageRemove,
                      // isDragging,
                      dragProps,
                      errors,
                    }) => {
                      let data_photo: any = `url(${toAbsoluteUrl('/images/no-image-profile.jpeg')})`
                      if (imageProfile) {
                        data_photo = imageProfile?.data
                      }

                      return (
                        // write your building UI
                        <div className='upload__image-wrapper'>
                          <div className='my-2'>
                            {errors?.acceptType && (
                              <span className='text-danger'>
                                {intl.formatMessage({id: 'YOUR_SELECTED_FILE_TYPE_IS_NOT_ALLOW'})}
                              </span>
                            )}
                          </div>

                          {imageList &&
                            imageList?.length > 0 &&
                            imageList?.map((image: any, index: any) => (
                              <div
                                key={index || 0}
                                className='image-item my-3'
                                style={{position: 'relative'}}
                              >
                                <img src={image?.dataURL || ''} alt='' width='180' />
                                <div className='image-item__btn-wrapper text-center w-100 mt-2'>
                                  <button
                                    title='Edit'
                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    onClick={(e: any) => {
                                      e?.preventDefault()
                                      onImageUpdate(index || 0)
                                    }}
                                  >
                                    <KTSVG
                                      className='svg-icon-3'
                                      path='/media/icons/duotone/Code/Plus.svg'
                                    />
                                  </button>

                                  <button
                                    title='Delete'
                                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
                                    onClick={(e: any) => {
                                      e?.preventDefault()
                                      onImageRemove(index || 0)
                                    }}
                                  >
                                    <KTSVG
                                      className='svg-icon-3'
                                      path='/media/icons/duotone/Code/Error-circle.svg'
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}

                          {imageProfile?.title !== undefined &&
                            imageList &&
                            imageList?.length === 0 && (
                              <div className='image-item my-3' style={{position: 'relative'}}>
                                <img src={data_photo || ''} alt='' width='180' />
                                <div className='image-item__btn-wrapper text-center w-100 mt-2'>
                                  <button
                                    title='Edit'
                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                                    onClick={(e: any) => {
                                      e?.preventDefault()
                                      onImageUpload()
                                    }}
                                  >
                                    <KTSVG
                                      className='svg-icon-3'
                                      path='/media/icons/duotone/Code/Plus.svg'
                                    />
                                  </button>

                                  <button
                                    title='Delete'
                                    className='btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1'
                                    onClick={(e: any) => {
                                      e?.preventDefault()

                                      setImages([])
                                      setImageProfile(null)
                                      setFieldValue('photo', null)
                                    }}
                                  >
                                    <KTSVG
                                      path='/media/icons/duotone/Code/Error-circle.svg'
                                      className='svg-icon-3'
                                    />
                                  </button>
                                </div>
                              </div>
                            )}

                          {imageProfile?.title === undefined && imageList?.length === 0 && (
                            <div
                              className='d-flex align-items-center mx-auto image-input-wrapper h-100px btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary'
                              {...dragProps}
                              onClick={(e: any) => {
                                e?.preventDefault()
                                onImageUpload()
                              }}
                            >
                              <div className='w-100'>
                                <KTSVG
                                  className='svg-icon-3x'
                                  path='/media/icons/duotone/Files/Pictures1.svg'
                                />
                                <small className='text-gray-800 d-block pt-0'>
                                  Drag and drop your logo here <br />
                                  or <u className='fw-bolder text-primary'>Click Here</u> to browse
                                </small>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    }}
                  </ImageUploading>
                  <div className='form-text text-dark mb-8 mt-3'>
                    Only <span style={{color: 'black', fontWeight: 600}}>(JPG, PNG)</span> are
                    allowed
                  </div>
                  {errors?.photo?.title?.length > 0 && (
                    <div className='fv-plugins-message-container invalid-feedback mb-10'>
                      {errors?.photo?.title?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media screen and (max-width: 767px) {
          .mobilePadding {
            padding: 0px !important;
            margin-bottom: 20px !important;
          }
        }
      `}</style>
    </>
  )
}

Step1 = memo(Step1, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Step1}
