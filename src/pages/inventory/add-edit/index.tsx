/* eslint-disable react-hooks/exhaustive-deps */
import Prompt from '@components/alert/prompt'
import Fields from '@components/form/Fields'
import {CustomTitle as Section} from '@components/form/Title'
import {Toolbar} from '@components/layout/Toolbar'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {flatMap, groupBy, intersection, keyBy, mapValues} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'

import {FieldAddProps, fieldhasAdd, selectField, SelectFieldType} from './forms'
import {addEditInventory, getCustomForm, getInventoryDetail} from './service'

const ToolBarElement: FC<any> = ({isValid = false, onSubmit, isSubmitting}) => {
  const navigate: any = useNavigate()
  const {search, pathname}: any = useLocation()
  const isClone: boolean = pathname?.includes('/add-clone')

  let buttonContent

  if (isSubmitting) {
    buttonContent = 'Please wait...'
  } else if (isClone) {
    buttonContent = 'Clone Inventory'
  } else {
    buttonContent = 'Save'
  }

  return (
    <Toolbar dir='right'>
      {!isClone && (
        <div
          onClick={() => navigate({pathname: '/setup/custom-form/inventory', search})}
          className='d-inline-flex align-items-center col-auto btn btn-sm btn-light-primary radius-50 p-1 border border-primary me-2'
        >
          <div className='btn btn-icon w-25px h-25px btn-primary rounded-circle'>
            <i className='las la-layer-group fs-2 text-white' />
          </div>
          <div className='px-2 fw-bold'>Manage Form</div>
        </div>
      )}

      {isClone && (
        <button
          onClick={() => navigate(-1)}
          className='me-2 d-inline-flex align-items-center col-auto btn btn-sm btn-secondary radius-50 py-1 ps-1 pe-3 border border-secondary border-2'
        >
          <div
            className='btn btn-icon w-25px h-25px rounded-circle'
            style={{backgroundColor: '#c9c9c9'}}
          >
            {isSubmitting ? (
              <span className='indicator-progress d-block'>
                <span className='spinner-border spinner-border-sm w-20px h-20px align-middle'></span>
              </span>
            ) : (
              <i className='las la-arrow-left fs-4 text-dark' />
            )}
          </div>
          <div className='px-2 fw-bold'>{isSubmitting ? 'Please wait...' : 'Cancel'}</div>
        </button>
      )}

      <button
        disabled={!isValid || isSubmitting}
        onClick={onSubmit}
        className='d-inline-flex align-items-center col-auto btn btn-sm btn-primary radius-50 py-1 ps-1 pe-3 border border-primary'
      >
        <div
          className='btn btn-icon w-25px h-25px btn-primary rounded-circle'
          style={{background: 'rgba(255,255,255,0.35)'}}
        >
          {isSubmitting ? (
            <span className='indicator-progress d-block'>
              <span className='spinner-border spinner-border-sm w-20px h-20px align-middle'></span>
            </span>
          ) : (
            <i className='las la-check fs-4 text-white' />
          )}
        </div>
        <div className='px-2 fw-bold'>{buttonContent}</div>
      </button>
    </Toolbar>
  )
}

const intersector: any = (initial: any, current: any) => {
  const val: any = Object.entries(initial)?.map((arr: any) => {
    const arrKey: any = arr?.[0]?.split('.') || ''
    const group: any = arrKey?.length > 1 ? arrKey?.[0] : undefined
    let key: any = arrKey?.slice(-1)?.[0] || ''
    let value: any = arr?.[1] || null

    if (value && Object.hasOwn(value, 'guid')) {
      key = `${key}_guid`
      value = value?.guid || null
    }

    if (Object.hasOwn(current, key)) {
      value = current?.[key]
    }
    return {group, key, value}
  })

  const hasGroup: any = mapValues(
    groupBy(val?.filter(({group}: any) => group), 'group'),
    (group: any) => mapValues(keyBy(group, 'key'), 'value')
  )

  const hasNoGroup: any = mapValues(keyBy(val?.filter(({group}: any) => !group), 'key'), 'value')

  return {
    hasNoValues: val
      ?.filter(({value}: any) => !value)
      ?.map(({group, key}: any) => (group ? `${group}.${key}` : key)),
    toGroup: () => ({...hasGroup, ...hasNoGroup}),
  }
}

const Index: FC = () => {
  const navigate: any = useNavigate()
  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {pathname}: any = useLocation()
  const {formatMessage}: any = useIntl()
  const urlSearchParams: any = new URLSearchParams(window.location.search)
  const params: any = Object.fromEntries(urlSearchParams?.entries())
  const isClone: boolean = pathname?.includes('/add-clone')
  const id: any = params?.id || params?.guid

  const [values, setValues] = useState<any>({})
  const [fields, setFields] = useState<any>([])
  const [inSubmit, setIsSubmit] = useState<boolean>(false)
  const [_isPriceDetail, setIsPriceDetail] = useState<any>()
  const [initialValues, setInitialValues] = useState<any>({})
  const [valuesStat, setValuesStat] = useState<boolean>(false)
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [modalElement, setModalElement] = useState<FieldAddProps>({})
  const [reloadSelect, setReloadSelect] = useState<string | undefined>(undefined)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [resGuid, setResGuid] = useState<string>('')

  const errorFiles: any = [
    ...(values?.photos || []),
    ...(values?.videos || []),
    ...(values?.others || []),
  ]?.filter(({errors}: any) => Array.isArray(errors) && errors?.length > 0)
  const isFileError: boolean = errorFiles?.length > 0

  useEffect(() => {
    setLoadingPage(true)
    ToastMessage({type: 'clear'})
    getCustomForm()
      .then(({data: {data}}: any) => {
        setFields(data ?? [])
        setLoadingPage(false)
      })
      .catch(() => '')
  }, [])

  useEffect(() => {
    if (id && fields?.length > 0) {
      getInventoryDetail(id).then(({data: {data}}: any) => {
        setIsPriceDetail(data)
        if (['string', 'number']?.includes(typeof data?.price_for_add)) {
          data.price_for_add = {
            code: data?.currency_price_add || preference?.currency,
            amount: data?.price_for_add || 0,
          }
        } else {
          //  handle error
        }

        if (['string', 'number']?.includes(typeof data?.price_for_remove)) {
          data.price_for_remove = {
            code: data?.currency_price_remove || preference?.currency,
            amount: data?.price_for_remove || 0,
          }
        } else {
          //  handle error
        }

        const resVal: any = flatMap(fields, 'forms')
          ?.map(({name}: any) => {
            let res: any = undefined
            const arrName: any = name?.split('.') || ''
            let val: any = data?.[arrName?.[1]] || ''

            if (arrName?.[0] === 'global_custom_fields') {
              val = data?.custom_fields
                ?.map(({guid, value}: any) => {
                  return {guid, val: value}
                })
                ?.find(({guid}: any) => guid === arrName?.[1])?.val
              res = {name, val}
            } else if (name?.includes('_guid')) {
              name = name?.replace('_guid', '') || ''
              res = {
                name,
                val: {
                  guid: data?.[`${name}_guid`],
                  name: data?.[`${name}_name`],
                },
              }
            } else if (Object.hasOwn(data, arrName?.[1])) {
              res = {name, val}
            } else if (Object.hasOwn(data, arrName?.[0])) {
              if (arrName?.length > 1) {
                val = data?.[arrName?.[0]]?.[arrName?.[1]] || ''
              } else {
                val = data?.[arrName?.[0]] || ''
              }
              res = {name, val}
            } else {
              return res || {}
            }
            return res || {}
          })
          ?.filter(({name}: any) => name)

        const res: any = mapValues(keyBy(resVal, 'name'), 'val')
        res['initial_stock_qty'] = data?.total_quantity || 0
        if (isClone) {
          res['inventory_identification_number'] = null
        }
        setInitialValues(res)
      })
    } else {
      const flattenedData: any = flatMap(fields, 'forms')?.map(({name}: any) => ({name}))
      const initial: any = mapValues(keyBy(flattenedData, 'name'), () => null)
      setInitialValues(initial)
    }
  }, [fields, id, preference, isClone])

  useEffect(() => {
    setValuesStat(false)
    Object.keys(values || {})?.forEach((items: any) => {
      const item: any = items?.replace('_guid', '')
      const initData: any = initialValues?.[item]?.guid || initialValues?.[item] || ''
      if (item === 'invoices' || item === 'others' || item === 'photos') {
        if (
          values?.[items] &&
          values?.[items]?.length !== initialValues?.['files.' + items]?.length
        ) {
          setValuesStat(true)
          return false
        }
      } else if (values?.[items] && values?.[items] !== initData) {
        setValuesStat(true)
        return false
      } else {
        //* *//
      }
    })
  }, [values, initialValues])

  const errors: any = intersection(
    flatMap(fields, 'forms')
      ?.filter(({is_required}: any) => is_required)
      ?.map(({name}: any) => name),
    intersector(initialValues, values)?.hasNoValues
  )

  useEffect(() => {
    if (redirect) {
      navigate(isClone ? '/inventory' : `/inventory/detail/${id || resGuid}`)
    }
  }, [redirect])

  const onSubmit = () => {
    setIsSubmit(true)
    setIsSubmitting(true)
    const params: any = intersector(initialValues, values)?.toGroup()
    params.files = mapValues(params?.files, (m: any) =>
      m && Array.isArray(m) ? m?.map(({data, title}: any) => ({data, title})) : []
    )

    if (
      params?.price_for_add?.amount === '' ||
      params?.price_for_add?.amount === null ||
      params?.price_for_add?.amount === 0
    ) {
      params.price_for_add = {
        code: null,
        amount: null,
      }
    }
    if (
      params?.price_for_remove?.amount === '' ||
      params?.price_for_remove?.amount === null ||
      params?.price_for_remove?.amount === 0
    ) {
      params.price_for_remove = {
        code: null,
        amount: null,
      }
    }
    if (params?.inventory_identification_number === '-') {
      params.inventory_identification_number = ''
    }
    addEditInventory(params, id, isClone)
      .then(
        ({
          data: {
            message,
            data: {guid},
          },
        }: any) => {
          setIsSubmit(false)
          setValuesStat(false)
          ToastMessage({type: 'success', message})
          setResGuid(guid)
          setTimeout(() => setRedirect(true), 3000)
        }
      )
      .catch((err: any) => {
        setIsSubmit(true)
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
      .finally(() => setIsSubmitting(false))
  }

  const ModalAdd: any = modalElement?.modal

  const labelPage: any = id ? 'EDIT' : 'ADD'

  return (
    <>
      {loadingPage ? (
        <div className='row'>
          <PageLoader />
        </div>
      ) : (
        <>
          <PageTitle>
            {formatMessage({id: `PAGETITLE.${isClone ? 'CLONE' : labelPage}_INVENTORY`})}
          </PageTitle>
          <ToolBarElement
            onSubmit={onSubmit}
            isValid={!errors?.length && !isFileError}
            isSubmitting={isSubmitting}
          />
          <div className='row'>
            <Prompt
              when={valuesStat}
              message='This page contains unsaved changes. Do you still wish to leave the page ?'
              onLocationChange={() => ''}
            />
            {fields
              ?.filter(({forms}: any) => forms?.length > 0)
              ?.map(({label, forms}: any) => (
                <div key={label} className='col-12 mb-3'>
                  <div className='card'>
                    <div className='card-body px-2 py-3 border border-2 border-f5 rounded'>
                      <Section title={label} />
                      <hr className='mx-n2 my-3 border-bottom border-bottom-2 border-cc' />
                      <div className='px-2'>
                        <div className='row'>
                          {forms?.map(
                            ({
                              label: formLabel,
                              name: formName,
                              name: originalName,
                              guid: formGuid,
                              type: formType,
                              is_required,
                              option,
                            }: any) => {
                              formName = formName?.replace('_guid', '')
                              let thisName: any = originalName?.split('.')
                              let fileAccept: any = ''

                              if (thisName?.length > 1) {
                                thisName = thisName?.slice(1)?.join('.')
                              } else {
                                thisName = originalName
                              }

                              const thisSelect: any = selectField?.find(
                                ({name}: SelectFieldType) => name === thisName
                              )

                              const thisField: any = fieldhasAdd?.find(
                                ({name}: FieldAddProps) => name === thisName
                              )

                              const selectParams: any = thisSelect?.parent
                                ? {
                                    filter: {
                                      [thisSelect?.param_parent || thisSelect?.parent]:
                                        values?.[thisSelect?.parent] || '-',
                                    },
                                    ...(thisSelect?.params || {}),
                                  }
                                : thisSelect?.params || {limit: 10, page: 1}

                              const defaultValue: any =
                                initialValues?.[formName] !== '-' ? initialValues?.[formName] : ''

                              if (
                                formName === 'initial_stock_qty' ||
                                formName === 'low_stock_threshold'
                              ) {
                                formType = 'numeric'
                              }

                              if (formName === 'files.invoices') {
                                fileAccept =
                                  'application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf'
                              } else if (formName === 'files.photos') {
                                fileAccept = 'image/*'
                              } else {
                                fileAccept = ''
                              }

                              return (
                                <div key={formGuid} className='col-md-6 col-lg-4 my-2'>
                                  <label
                                    className={`text-uppercase fw-bolder fs-8 mb-1 ${
                                      is_required ? 'required' : ''
                                    }`}
                                  >
                                    {formLabel}
                                  </label>
                                  <Fields
                                    // Global
                                    type={formType}
                                    label={formLabel}
                                    required={is_required}
                                    defaultValue={defaultValue}
                                    // If Field is Select
                                    api={thisSelect?.api}
                                    option={option}
                                    selectParams={selectParams}
                                    selectTrigger={reloadSelect === thisName}
                                    selectParser={thisSelect?.parser}
                                    fileAccept={fileAccept}
                                    addBtn={fieldhasAdd
                                      ?.map(({name}: any) => name)
                                      ?.includes(thisName)}
                                    onClickAddBtn={() => {
                                      setModalElement(thisField)
                                    }}
                                    onChange={(e: any) => {
                                      setValues((prev: any) => {
                                        return {...prev, [thisName]: e}
                                      })
                                    }}
                                  />
                                  {errors?.includes(formName) && inSubmit && (
                                    <div className='text-danger fs-8 mt-1'>
                                      {formName?.split('.')?.join(' ')} is required
                                    </div>
                                  )}
                                </div>
                              )
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {modalElement?.modal && (
            <ModalAdd
              showModal={true}
              setShowModal={() => setModalElement({})}
              setShowModalLocation={() => setModalElement({})}
              setReloadSupplier={() => setReloadSelect(modalElement?.name)}
              setReloadLocation={() => setReloadSelect(modalElement?.name)}
              setReloadCategory={() => setReloadSelect(modalElement?.name)}
            />
          )}
        </>
      )}
    </>
  )
}

export default Index
