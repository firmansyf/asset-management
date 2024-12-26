/* eslint-disable react-hooks/exhaustive-deps */
import Prompt from '@components/alert/prompt'
import Fields from '@components/form/Fields'
import {CustomTitle as Section} from '@components/form/Title'
import {Toolbar} from '@components/layout/Toolbar'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation, hasPermission, useTimeOutMessage} from '@helpers'
import {useDeepEffect} from '@hooks'
import {PageTitle} from '@metronic/layout/core'
import {getOwnerSubscription} from '@pages/billing/Service'
import {getDetailItemCode} from '@pages/setup/settings/item-code/Service'
import {flatMap, groupBy, intersection, keyBy, mapValues, orderBy, uniqBy} from 'lodash'
import {FC, Fragment, memo, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

import {FieldAddProps, fieldhasAdd, selectField, SelectFieldType} from './forms'
import LimitAsset from './LimitAsset'
import {addEditAsset, getAssetDetail, getCustomForm} from './service'

const ToolBarElement: FC<any> = ({onSubmit, isValid, isSubmitting}) => {
  const customizeFormPermission: any = hasPermission('asset-management.customize_form') || false
  const navigate: any = useNavigate()
  const {search}: any = useLocation()

  return (
    <Toolbar dir='right'>
      {customizeFormPermission && (
        <div
          onClick={() => navigate({pathname: '/setup/custom-form/assets', search})}
          className='d-inline-flex align-items-center col-auto btn btn-sm btn-light-primary radius-50 p-1 border border-primary me-2'
        >
          <div className='btn btn-icon w-25px h-25px btn-primary rounded-circle'>
            <i className='las la-layer-group fs-2 text-white' />
          </div>
          <div className='px-2 fw-bold'>Manage Form</div>
        </div>
      )}

      <button
        disabled={!isValid} // || isSubmitting
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
        <div className='px-2 fw-bold'>{isSubmitting ? 'Please wait...' : 'Save'}</div>
      </button>
    </Toolbar>
  )
}

const intersector: any = (initial: any, current: any) => {
  const val: any = Object.entries(initial || {})?.map((arr: any) => {
    const arrKey: any = arr?.[0]?.split('.') || ''

    let value: any = arr?.[1] || null
    const group: any = arrKey?.[0] || ''
    let key: any = arrKey?.slice(-1)?.[0] || ''
    if (value && Object.hasOwn(value || {}, 'guid')) {
      key = `${key || ''}_guid`
      value = value?.guid || null
    }

    if (Object.hasOwn(current || {}, key)) {
      value = current?.[key] || ''
    }

    return {group, key, value}
  })

  return {
    hasNoValues: val
      ?.filter(({value}: any) => !value)
      ?.map(({group, key}: any) => `${group || ''}.${key || ''}`),
    toGroup: () =>
      mapValues(groupBy(val, 'group'), (group: any) => mapValues(keyBy(group, 'key'), 'value')),
  }
}

let Index: FC<any> = () => {
  const navigate: any = useNavigate()
  const {formatMessage}: any = useIntl()
  const {preference: preferenceStore, currentUser}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {guid: user_guid, first_name, last_name}: any = currentUser || {}
  const urlSearchParams: any = new URLSearchParams(window?.location?.search)
  const params: any = Object.fromEntries(urlSearchParams?.entries())
  const {preference}: any = preferenceStore || {}
  const {id}: any = params || {}

  const [errors, setErrors] = useState<any>()
  const [fields, setFields] = useState<any>([])
  const [values, setValues] = useState<any>({})
  const [resGuid, setResGuid] = useState<string>('')
  const [redirect, setRedirect] = useState<boolean>(false)
  const [inSubmit, setIsSubmit] = useState<boolean>(false)
  const [itemCodeData, setItemCodeData] = useState<any>({})
  const [initialValues, setInitialValues] = useState<any>({})
  const [valuesStat, setValuesStat] = useState<boolean>(false)
  const [dataSubscriber, setDataSubscriber] = useState<any>({})
  const [totalCostDetail, setTotalCostDetail] = useState<any>()
  const [loadingPage, setLoadingPage] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [modalElement, setModalElement] = useState<FieldAddProps>({})
  const [showLimitAsset, setShowLimitAsset] = useState<boolean>(false)
  const [selectItemCode, setSelectItemCode] = useState<boolean>(false)
  const [hideFiled, setHideFiled] = useState<any>(['asset.disposal_date'])
  const [reloadSelect, setReloadSelect] = useState<string | undefined>(undefined)

  const errorFiles: any = [
    ...(values?.photos || []),
    ...(values?.videos || []),
    ...(values?.others || []),
  ]?.filter(({errors}: any) => Array.isArray(errors) && errors?.length > 0)
  const isFileError: boolean = errorFiles?.length > 0

  const handleCheckItemCode = (e: any) => {
    setSelectItemCode(e)
    setInitialValues((prev: any) => {
      const formReset: any = {
        'asset.name': '',
        'asset.description': '',
        'asset.category': '',
        'asset.type': '',
        'asset.manufacturer': '',
        'asset.manufacturer_brand': '',
        'asset.manufacturer_model': '',
        'asset.category_guid': '',
        'asset.type_guid': '',
        'asset.manufacturer_guid': '',
        'asset.manufacturer_brand_guid': '',
        'asset.manufacturer_model_guid': '',
      }

      const result: any = {
        ...prev,
        'asset.item_code': '',
        ...(e ? formReset : {}),
      }

      setValues((prevVal: any) => {
        const result: any = {
          ...prevVal,
          'asset.item_code': '',
          ...(e ? formReset : {}),
        }
        return result
      })
      return result
    })
  }

  useDeepEffect(() => {
    useTimeOutMessage('clear', 4000)
  }, [])

  const handleChangeItemCode: any = (e: any) => {
    if (e) {
      getDetailItemCode(e).then(({data: {data}}: any) => {
        const itemCode: any = {
          guid: data?.guid,
          name: data?.name,
          description: data?.description,
          category: data?.category?.guid !== null ? data?.category : undefined,
          type: data?.type?.guid !== null ? data?.type : undefined,
          manufacturer: data?.manufacturer?.guid !== null ? data?.manufacturer : undefined,
          manufacturer_brand:
            data?.manufacturer_brand?.guid !== null ? data?.manufacturer_brand : undefined,
          manufacturer_model:
            data?.manufacturer_model?.guid !== null ? data?.manufacturer_model : undefined,
        }
        data && setItemCodeData(itemCode)

        setInitialValues((prev: any) => {
          return {
            ...prev,
            'asset.name': itemCode?.name,
            'asset.item_code': {
              guid: e,
              name: itemCode?.name || '',
            },
            'asset.description': itemCode?.description,
            'asset.category': itemCode?.category,
            'asset.type': itemCode?.type,
            'asset.manufacturer': itemCode?.manufacturer,
            'asset.manufacturer_brand': itemCode?.manufacturer_brand,
            'asset.manufacturer_model': itemCode?.manufacturer_model,
          }
        })
      })
    }
  }

  useDeepEffect(() => {
    setLoadingPage(true)
    getCustomForm().then(({data: {data}}: any) => {
      setLoadingPage(false)
      setFields(data?.filter(({forms}: any) => forms))
    })
  }, [])

  useDeepEffect(() => {
    setFields((prev: any) => {
      prev = prev?.map((m: any) => {
        const groupGuidHasFieldName: any = m?.forms?.find(
          ({name: fieldName}: any) => fieldName === 'asset.name'
        )?.parent_guid
        const groupGuidHasFieldItemCode: any = m?.forms?.find(
          ({name: fieldName}: any) => fieldName === 'asset.item_code'
        )?.parent_guid

        if (selectItemCode && m?.guid === groupGuidHasFieldName) {
          const assetItemCode: any = Object.assign(
            {},
            m?.forms?.find?.(({name}: any) => name === 'asset.name')
          )
          assetItemCode.name = 'asset.item_code'
          assetItemCode.label = 'Item Code'
          assetItemCode.type = 'dropdown'
          m.forms = m?.forms?.concat(assetItemCode)?.filter(({name}: any) => name !== 'asset.name')
        } else if (m?.guid === groupGuidHasFieldItemCode) {
          const assetName: any = Object.assign(
            {},
            m?.forms?.find?.(({name}: any) => name === 'asset.item_code')
          )
          assetName.name = 'asset.name'
          assetName.label = 'Asset Name'
          assetName.type = 'text'
          m.forms = m?.forms?.concat(assetName)?.filter(({name}: any) => name !== 'asset.item_code')
        }
        m.forms = orderBy(m?.forms, 'order')
        return m
      })
      return prev
    })
  }, [selectItemCode])

  useDeepEffect(() => {
    // const urlSearchParamss: any = new URLSearchParams(window.location.search)
    // const params = Object.fromEntries(urlSearchParamss?.entries())
    // const {id} = params || {}
    if (id) {
      getAssetDetail(id).then(({data: {data}}: any) => {
        setTotalCostDetail(data)
        const resVal: any = flatMap(fields, 'forms')?.map(({name}: any) => {
          name = name?.replace('_guid', '')
          if (name?.split('.')?.[0] === 'aaset') {
            name = `asset.${name?.split('.')?.[1]}`
          }

          const arrName: any = name?.split('.')
          let res: any = undefined
          let val: any = data?.[arrName?.[1]]
          if (arrName?.[0] === 'global_custom_fields') {
            val = data?.custom_fields
              ?.map(({guid, name, element_type}: any) => {
                if (['radio', 'dropdown']?.includes(element_type)) {
                  return {guid, val: data?.global_custom_fields?.[name]?.toString() || ''}
                } else {
                  return {guid, val: data?.global_custom_fields?.[name] || ''}
                }
              })
              ?.find(({guid}: any) => guid === arrName?.[1])?.val

            res = {name, val}
          } else if (Object.hasOwn(data || {}, arrName?.[1])) {
            res = {name, val}
          } else if (Object.hasOwn(data || {}, arrName?.[0])) {
            val = data?.[arrName?.[0]]?.[arrName?.[1]]
            res = {name, val}
          }
          return res
        })
        const res: any = mapValues(keyBy(resVal, 'name'), 'val')
        res['financial_info.guid'] = data?.financial_info?.guid || ''
        let finalResult: any = res

        if (data?.has_itemcode && data?.has_itemcode === 'Yes') {
          setSelectItemCode(true)
          setItemCodeData(data)
          finalResult = {
            ...res,
            'asset.name': '',
            'asset.item_code': {
              guid: data?.itemcode?.guid || '',
              name: data?.itemcode?.name || '',
            },
          }
        } else {
          finalResult = {
            ...res,
            'asset.name': data?.name,
            'asset.description': data?.description,
            'asset.item_code': '',
            'asset.qr_code': data?.qr_code,
            'asset.serial_number': data?.serial_number,
            'asset.status_comment': data?.status_comment,
          }
        }
        setInitialValues(finalResult)
      })
    } else {
      setLoadingPage(true)
      const flattenedData: any = flatMap(fields, 'forms')?.map(({name}: any) => {
        if (name?.includes('aaset')) {
          name = name?.replace('aaset', 'asset')
        }
        return {name}
      })
      const initial: any = mapValues(keyBy(flattenedData, 'name'), () => null)
      initial['asset.status'] = {
        guid: preference?.default_asset_status_guid || '',
        name: preference?.default_asset_status_name || '',
      }
      initial['asset.owner_company'] = {
        guid: preference?.default_company_guid || '',
        name: preference?.default_company_name || '',
      }
      initial['asset.assign_to'] = {
        guid: user_guid,
        name: `${first_name} ${last_name}`,
      }

      setInitialValues(initial)
      setTimeout(() => setLoadingPage(false), 800)
    }
  }, [fields, preference, id])

  useDeepEffect(() => {
    setValuesStat(false)
    Object.keys(values || {})?.forEach((items: any) => {
      const item: any = items?.replace('_guid', '')
      const initItem =
        initialValues?.['asset.' + item] ||
        initialValues?.['files.' + item] ||
        initialValues?.['financial_info.' + item] ||
        initialValues?.['global_custom_fields.' + item]

      let initData: any = ''
      if (initItem?.guid && initItem?.guid !== '') {
        initData = initItem?.guid || ''
      } else if (initItem?.value && initItem?.value !== '') {
        initData = initItem?.value || ''
      } else if (initItem?.guid === undefined && initItem?.value === undefined) {
        initData = initItem || ''
      } else {
        initData = ''
      }

      let valuesData: any = ''
      if (values?.[items || '']?.guid && values?.[items || '']?.guid !== '') {
        valuesData = values?.[items || '']?.guid || ''
      } else if (values?.[items || '']?.value && values?.[items || '']?.value !== '') {
        valuesData = values?.[items || '']?.value || ''
      } else if (
        values?.[items || '']?.guid === undefined &&
        values?.[items || '']?.value === undefined
      ) {
        valuesData = values?.[items || ''] || ''
      } else {
        valuesData = ''
      }

      if (item === 'invoices' || item === 'others' || item === 'photos' || item === 'videos') {
        if (
          values?.[items || ''] &&
          values?.[items || '']?.length !== initialValues?.['files.' + items]?.length
        ) {
          setValuesStat(true)
          return false
        }
      } else if (items === 'custom.fields') {
        return true
      } else if (values?.[items || ''] && valuesData !== '' && valuesData !== initData) {
        setValuesStat(true)
        return false
      }

      if (!selectItemCode) {
        valuesData = ''
      }
    })
  }, [values, initialValues, selectItemCode])

  const onSubmit = () => {
    setIsSubmit(true)
    setIsSubmitting(true)
    let params: any = intersector(initialValues, values)?.toGroup()
    params.files = mapValues(params?.files, (m: any) =>
      m && Array.isArray(m) ? m?.map(({data, title, guid}: any) => ({data, title, guid})) : []
    )

    if (
      Object.hasOwn(params?.asset || {}, 'assign_to') ||
      Object.hasOwn(params?.asset || {}, 'assign_to_guid')
    ) {
      params.asset.assign_to = values?.assign_to?.value
      params.asset.assign_to_type = values?.assign_to?.type
      delete params?.asset?.assign_to_guid
    }

    if (params?.financial_info?.unit_cost?.amount === null) {
      params.financial_info.unit_cost = {
        code: null,
        amount: null,
      }
    }

    params = mapValues(params, (childParam: any) => {
      childParam = mapValues(childParam, (m: any) => {
        if (m === undefined) {
          m = null
        }
        return m
      })
      return childParam
    })

    if (
      params?.financial_info?.unit_cost?.amount > 0 &&
      parseInt(params?.financial_info?.total_quantity || 0) > 0
    ) {
      params.financial_info.total_cost = {
        code: params?.financial_info?.unit_cost?.code,
        amount:
          params?.financial_info?.unit_cost?.amount *
          parseFloat(params?.financial_info?.total_quantity || 0),
      }
    }

    if (selectItemCode && itemCodeData?.length === 0) {
      ToastMessage({message: 'Item Code is required.', type: 'error', autoClose: false})
      setIsSubmitting(false)
      return false
    }

    params.asset.has_itemcode = selectItemCode
    if (selectItemCode) {
      params.asset.name = itemCodeData?.name || ''
      params.asset.itemcode_guid = itemCodeData?.guid || ''
      params.asset.description = itemCodeData?.description || ''
      params.asset.category_guid = itemCodeData?.category?.guid || ''
      params.asset.type_guid = itemCodeData?.type?.guid || ''
      params.asset.manufacturer_guid = itemCodeData?.manufacturer?.guid || ''
      params.asset.manufacturer_model_guid = itemCodeData?.manufacturer_model?.guid || ''
      params.asset.manufacturer_brand_guid = itemCodeData?.manufacturer_brand?.guid || ''
      params.asset.owner_company_department_guid =
        params?.asset?.owner_company_department_guid !== ''
          ? params?.asset?.owner_company_department_guid
          : totalCostDetail?.owner_company_department?.guid || ''
      params.asset.disposal_date =
        params?.asset?.disposal_date !== null
          ? params?.asset?.disposal_date
          : totalCostDetail?.disposal_date || ''
      params.asset.qr_code =
        params?.asset?.qr_code !== null ? params?.asset?.qr_code : totalCostDetail?.qr_code || ''
      params.asset.serial_number =
        params?.asset?.serial_number !== null
          ? params?.asset?.serial_number
          : totalCostDetail?.serial_number || ''
      params.asset.status_comment =
        params?.asset?.status_comment !== null
          ? params?.asset?.status_comment
          : totalCostDetail?.status_comment || ''
    }

    if (params?.asset?.assign_to === null) {
      params.asset.assign_to = user_guid || ''
      params.asset.assign_to_type = 'user'
    }

    let globalCF: any = {}
    const valGlobalCF: any = params?.global_custom_fields || {}

    Object.keys(valGlobalCF)?.forEach((item: any) => {
      if (
        valGlobalCF?.[item] !== null &&
        !initialValues?.['hidden.custom.fields']?.includes(item)
      ) {
        globalCF = {
          ...globalCF,
          [item]: valGlobalCF?.[item || ''] || '',
        }
      }
    })
    params.global_custom_fields = globalCF || {}

    Object.prototype.hasOwnProperty.call(params, 'hidden') && delete params['hidden']

    addEditAsset(params, id)
      .then(
        ({
          data: {
            message,
            data: {guid},
          },
        }: any) => {
          setIsSubmit(false)
          setValuesStat(false)
          if (id) {
            Swal.fire({
              imageUrl: '/images/alert.png',
              imageWidth: 65,
              imageHeight: 65,
              imageAlt: 'Custom image',
              text: `Asset updates will be affected after the ${totalCostDetail?.team_name} approves this update.`,
              allowOutsideClick: false,
              showConfirmButton: true,
              confirmButtonColor: '#050990',
              confirmButtonText: 'Ok',
            }).then(() => {
              useTimeOutMessage('success', 0, message)
              setResGuid(guid)
              setTimeout(() => setRedirect(true), 3000)
            })
          } else {
            useTimeOutMessage('success', 0, message)
            setResGuid(guid)
            setTimeout(() => setRedirect(true), 3000)
          }
        }
      )
      .catch((err: any) => {
        const {data} = err?.response?.data || {}
        const {message, fields} = data || {}

        if (message === 'error.err_limit_asset' || message === 'Asset limit reached') {
          setShowLimitAsset(true)
        }

        if (Object.keys(fields || {})?.length > 0) {
          const uniqKey: string = 'field is required'
          uniqBy(
            Object.values(errorValidation(err) || {}),
            (msg: any) => msg?.includes(uniqKey)
          )?.map((message: any) => {
            message?.includes(uniqKey) && (message = formatMessage({id: 'MANDATORY_FORM_MESSAGE'}))
            ToastMessage({message, type: 'error', autoClose: false})
            return message
          })
        }

        setIsSubmit(true)
      })
      .finally(() => setIsSubmitting(false))
  }

  useDeepEffect(() => {
    redirect && navigate(`/asset-management/detail/${resGuid}`)
  }, [redirect])

  useDeepEffect(() => {
    getOwnerSubscription()
      .then(({data: {data: row}}: any) => {
        const {subscription} = row || {}
        subscription && setDataSubscriber(subscription)
      })
      .catch(() => setDataSubscriber({}))
  }, [])

  const ModalAdd: any = modalElement?.modal

  useDeepEffect(() => {
    let errorses: any = intersection(
      flatMap(fields, 'forms')
        ?.filter(({is_required, name}: any) => {
          const itemCodeFields: any = [
            'asset.name',
            'asset.description',
            'asset.manufacturer_guid',
            'asset.manufacturer_model_guid',
            'asset.manufacturer_brand_guid',
            'asset.category_guid',
            'asset.type_guid',
          ]
          return !selectItemCode ? is_required : is_required && !itemCodeFields?.includes(name)
        })
        ?.map(({name}: any) => {
          name = name?.replace('aaset', 'asset')
          return name
        }),
      intersector(initialValues, values)?.hasNoValues
    )

    fields
      ?.filter(({forms}: any) => forms?.length > 0)
      ?.forEach(({label, forms}: any) => {
        if (label === 'Custom Fields') {
          const GuidParams: any = []
          const categoryGuid: any = values?.category_guid !== undefined ? values?.category_guid : ''

          forms?.forEach((item: any) => {
            const condition: any = item?.conditions !== undefined ? item?.conditions : []
            const checkCondition: any = condition?.filter(
              ({model_value}: any) => model_value === categoryGuid
            )

            if (categoryGuid !== '' && checkCondition?.length > 0) {
              return false
            } else {
              GuidParams?.push(item?.custom_field_guid)
              const error: any = errorses?.filter(
                (arr: any) => arr !== 'global_custom_fields.' + item?.custom_field_guid
              )
              errorses = error
            }
          })
        }
      })

    setErrors(errorses)
  }, [fields, initialValues, values, selectItemCode])

  return (
    <>
      <PageTitle>
        {formatMessage({id: `PAGETITLE.${id ? 'EDIT' : 'ADD'}_ASSET`}) +
          (id ? (totalCostDetail ? ' | ' + totalCostDetail?.unique_id || '' : '') : '')}
      </PageTitle>

      <ToolBarElement
        onSubmit={onSubmit}
        isValid={!errors?.length && !isFileError}
        isSubmitting={isSubmitting}
      />

      {loadingPage ? (
        <div className='row'>
          <PageLoader />
        </div>
      ) : (
        <div className='row'>
          <Prompt
            when={valuesStat}
            message='This page contains unsaved changes. Do you still wish to leave the page ?'
            onLocationChange={() => ''}
          />
          <div className='row form-check form-check-sm form-check-custom form-check-solid mb-2 pb-2'>
            <div className='d-flex justify-content-end'>
              <input
                value='false'
                type='checkbox'
                name='use-item-code'
                id='ckechboxItemCode'
                checked={selectItemCode}
                className='form-check-input border border-gray-300'
                onChange={(e: any) => handleCheckItemCode(e?.target?.checked)}
              />

              <label htmlFor='ckechboxAll' className='ms-2 user-select-none'>
                <strong> Use Item Code </strong>
              </label>
            </div>
          </div>

          {fields
            ?.filter(({forms}: any) => forms?.length > 0)
            ?.map(({label, forms, guid}: any) => {
              if (label === 'Custom Fields') {
                let formCF: any = []
                let GuidParams: any = []
                const categoryGuid: any =
                  values?.category_guid !== undefined ? values?.category_guid : ''

                forms?.forEach((item: any) => {
                  const condition: any = item?.conditions !== undefined ? item?.conditions : []
                  const checkCondition: any = condition?.filter(
                    ({model_value}: any) => model_value === categoryGuid
                  )

                  if (categoryGuid !== '' && checkCondition?.length > 0) {
                    formCF?.push(item)
                    const GuidParam: any = GuidParams?.filter(
                      (arr: any) => arr !== item?.custom_field_guid
                    )
                    GuidParams = GuidParam
                  } else if (item?.all_category) {
                    formCF?.push(item)
                  } else {
                    GuidParams?.push(item?.custom_field_guid)
                  }
                })

                if (categoryGuid !== '' && GuidParams?.length === 0) {
                  const formCFS: any = formCF?.filter(
                    ({name}: any) => name !== 'hidden.custom.fields'
                  )
                  formCF = formCFS
                } else {
                  formCF?.push({
                    guid: '',
                    parent_guid: '',
                    label: 'Hidden Custom Fields',
                    name: 'hidden.custom.fields',
                    type: 'hidden',
                    order: 0,
                    is_required: false,
                    is_selected: false,
                    option: [],
                    all_category: false,
                    custom_field_guid: '',
                    value: GuidParams,
                  })
                }

                forms = formCF as never[]
              }
              return (
                <Fragment key={`forms-${guid}`}>
                  {forms?.[0]?.type !== 'hidden' && (
                    <div className='col-12 mb-3'>
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
                                  value,
                                }: any) => {
                                  let readOnlys: boolean = false
                                  const clearOption: boolean = false
                                  let fileAccept: any = ''
                                  if (
                                    formName === 'aaset.disposal_date' &&
                                    initialValues?.['asset.status']?.name?.toLowerCase() !==
                                      'disposed'
                                  ) {
                                    return ''
                                  }

                                  formName = formName?.replace('_guid', '')
                                  if (formName?.split('.')?.[0] === 'aaset') {
                                    formName = `asset.${formName?.split('.')?.[1]}`
                                  }

                                  let defaultValue: any = initialValues?.[formName] || ''

                                  let thisName: any = originalName?.split('.')?.slice(1)?.join('.')

                                  if (selectItemCode) {
                                    thisName = thisName === 'name' ? 'item_code' : thisName
                                  }

                                  const thisSelect: any = selectField?.find(
                                    ({name}: SelectFieldType) => name === thisName
                                  )

                                  const thisField: any = fieldhasAdd?.find(
                                    ({name}: FieldAddProps) => name === thisName
                                  )

                                  const parentSelectItemCode: any = [
                                    'asset.manufacturer',
                                    'asset.manufacturer_model',
                                    'asset.manufacturer_brand',
                                    'asset.category',
                                    'asset.type',
                                  ]

                                  const selectParam: any = thisSelect?.parent
                                    ? {
                                        filter: {
                                          [thisSelect?.param_parent || thisSelect?.parent]:
                                            values?.[thisSelect?.parent] || '**',
                                        },
                                        orderCol: 'name',
                                        orderDir: 'asc',
                                      }
                                    : {
                                        limit: 10,
                                        page: 1,
                                        orderCol:
                                          originalName === 'asset.assign_to' ? 'full_name' : 'name',
                                        orderDir: 'asc',
                                      }

                                  let selectParams: any = {}
                                  if (!selectItemCode) {
                                    selectParams = selectParam
                                  } else {
                                    if (!parentSelectItemCode?.includes(formName)) {
                                      selectParams = selectParam
                                    }
                                  }

                                  if (selectItemCode) {
                                    if (
                                      [
                                        'asset.description',
                                        'asset.category',
                                        'asset.type',
                                        'asset.manufacturer',
                                        'asset.manufacturer_model',
                                        'asset.manufacturer_brand',
                                      ]?.includes(formName)
                                    ) {
                                      readOnlys = true
                                    }
                                    if (formName === 'asset.item_code') {
                                      defaultValue = initialValues?.['asset.item_code']
                                    }
                                  } else {
                                    if (formName === 'asset.name') {
                                      defaultValue = initialValues?.['asset.name']
                                    }
                                    if (formName === 'asset.description') {
                                      defaultValue = initialValues?.['asset.description'] || ''
                                    }
                                    if (formName === 'asset.category') {
                                      defaultValue = initialValues?.['asset.category'] || {}
                                    }
                                    if (formName === 'asset.type') {
                                      defaultValue = initialValues?.['asset.type'] || {}
                                    }
                                    if (formName === 'asset.manufacturer') {
                                      defaultValue = initialValues?.['asset.manufacturer'] || {}
                                    }
                                    if (formName === 'asset.manufacturer_model') {
                                      defaultValue =
                                        initialValues?.['asset.manufacturer_model'] || {}
                                    }
                                    if (formName === 'asset.manufacturer_brand') {
                                      defaultValue =
                                        initialValues?.['asset.manufacturer_brand'] || {}
                                    }
                                  }

                                  if (formName === 'financial_info.total_quantity') {
                                    formType = 'numeric'
                                  }

                                  if (formName === 'financial_info.total_cost') {
                                    let totalUnitCost: any = 0
                                    if (
                                      values?.unit_cost !== undefined &&
                                      values?.unit_cost !== null &&
                                      values?.total_quantity !== undefined &&
                                      values?.total_quantity !== null
                                    ) {
                                      totalUnitCost =
                                        values?.unit_cost?.amount * values?.total_quantity
                                    } else {
                                      if (
                                        values?.unit_cost !== undefined &&
                                        values?.unit_cost?.amount !== null
                                      ) {
                                        totalUnitCost =
                                          values?.unit_cost?.amount *
                                          totalCostDetail?.financial_info?.total_quantity
                                      } else if (
                                        values?.total_quantity !== undefined &&
                                        values?.total_quantity !== null
                                      ) {
                                        totalUnitCost =
                                          totalCostDetail?.financial_info?.unit_cost?.amount *
                                          values?.total_quantity
                                      } else {
                                        if (totalCostDetail !== undefined) {
                                          totalUnitCost =
                                            totalCostDetail?.financial_info?.unit_cost?.amount *
                                            totalCostDetail?.financial_info?.total_quantity
                                        }
                                      }
                                      readOnlys = true
                                    }
                                    defaultValue = {
                                      code:
                                        values?.unit_cost?.code ||
                                        totalCostDetail?.financial_info?.unit_cost?.code,
                                      amount: totalUnitCost ? totalUnitCost : 0,
                                    }
                                    readOnlys = true
                                  }

                                  if (formName === 'financial_info.unit_cost') {
                                    if (
                                      totalCostDetail?.financial_info?.unit_cost?.amount === null ||
                                      values?.unit_cost?.amount === null
                                    ) {
                                      defaultValue = {
                                        code: totalCostDetail?.financial_info?.total_cost?.code,
                                        amount: values?.unit_cost?.amount,
                                      }
                                    } else {
                                      defaultValue = {
                                        code:
                                          totalCostDetail?.financial_info?.unit_cost?.code ||
                                          values?.unit_cost?.code,
                                        amount:
                                          values?.unit_cost?.amount ||
                                          totalCostDetail?.financial_info?.unit_cost?.amount,
                                      }
                                    }
                                  }

                                  if (formLabel === 'Status Comment') {
                                    formLabel = 'Comment'
                                  }

                                  if (formName === 'financial_info.delivery_actual_date_received') {
                                    defaultValue =
                                      totalCostDetail?.financial_info?.actual_date_received || ''
                                  }

                                  let limitNumeric = 0
                                  if (formName === 'asset.serial_number') {
                                    limitNumeric = 45
                                  }

                                  if (formName === 'files.videos') {
                                    fileAccept = 'video/*'
                                  } else if (formName === 'files.photos') {
                                    fileAccept = 'image/*'
                                  } else {
                                    fileAccept = ''
                                  }
                                  return (
                                    <Fragment key={`${formGuid}-${formName}`}>
                                      {!hideFiled?.includes(formName) && (
                                        <div className='col-md-6 col-lg-4 my-2'>
                                          {!['hidden.custom.fields']?.includes(formName) && (
                                            <label
                                              className={`${configClass?.label} ${
                                                is_required ? 'required' : ''
                                              }`}
                                            >
                                              {formLabel || ''}
                                            </label>
                                          )}

                                          <Fields
                                            // Global
                                            type={formType}
                                            label={formLabel}
                                            required={is_required}
                                            defaultValue={defaultValue}
                                            // If Field is Select
                                            api={thisSelect?.api}
                                            limit={limitNumeric}
                                            option={option}
                                            selectParams={selectParams}
                                            selectTrigger={reloadSelect === thisName}
                                            selectParser={thisSelect?.parser}
                                            addBtn={fieldhasAdd
                                              ?.map(({name}: any) => name)
                                              ?.includes(thisName)}
                                            // If Field is Readonly
                                            readOnly={readOnlys}
                                            // setHidden={['hidden.custom.fields']?.includes(formName)}
                                            setHidden={false}
                                            clearOption={clearOption}
                                            fileAccept={fileAccept}
                                            onClickAddBtn={() => {
                                              setModalElement(thisField)
                                            }}
                                            onChange={async (e: any, selectedValue: any) => {
                                              if (formName === 'asset.status') {
                                                const assetStatusIsDisposed: any =
                                                  selectedValue?.match(/Disposed/i)

                                                if (!assetStatusIsDisposed) {
                                                  setHideFiled(
                                                    (prev: any) =>
                                                      prev?.concat('asset.disposal_date')
                                                  )
                                                } else {
                                                  setHideFiled(
                                                    (prev: any) =>
                                                      prev?.filter(
                                                        (stat: any) =>
                                                          stat !== 'asset.disposal_date'
                                                      )
                                                  )
                                                }
                                              }

                                              if (formName === 'hidden.custom.fields') {
                                                setInitialValues((prev: any) => {
                                                  return {...prev, ['hidden.custom.fields']: value}
                                                })
                                              }

                                              if (selectItemCode) {
                                                if (itemCodeData?.length !== 0) {
                                                  switch (formName) {
                                                    case 'asset.category':
                                                      setValues((prev: any) => {
                                                        return {
                                                          ...prev,
                                                          [thisName]:
                                                            itemCodeData?.category?.guid || '',
                                                        }
                                                      })
                                                      break
                                                    case 'asset.type':
                                                      setValues((prev: any) => {
                                                        return {
                                                          ...prev,
                                                          [thisName]:
                                                            itemCodeData?.type?.guid !== null
                                                              ? itemCodeData?.type?.guid
                                                              : '',
                                                        }
                                                      })
                                                      break
                                                    default:
                                                      setValues((prev: any) => {
                                                        return {
                                                          ...prev,
                                                          [thisName]: e,
                                                        }
                                                      })
                                                  }
                                                }
                                              } else {
                                                if (formName === 'asset.name') {
                                                  setValues((prev: any) => {
                                                    return {
                                                      ...prev,
                                                      [thisName]: e || '',
                                                    }
                                                  })
                                                } else {
                                                  setValues((prev: any) => {
                                                    return {
                                                      ...prev,
                                                      [thisName]: e,
                                                    }
                                                  })
                                                }
                                              }

                                              if (formName === 'asset.item_code') {
                                                handleChangeItemCode(e)
                                              }
                                            }}
                                          />
                                          {errors?.includes(originalName) && inSubmit && (
                                            <div className='text-danger fs-8 mt-1'>
                                              {formLabel + ' is required'}
                                              {/* {formName?.split('.')?.join(' ')} is required */}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Fragment>
                                  )
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Fragment>
              )
            })}
        </div>
      )}

      {modalElement?.modal && (
        <ModalAdd
          showModal={true}
          setShowModal={() => setModalElement({})}
          setShowModalLocation={() => setModalElement({})}
          setShowModalManufacturer={() => {
            const thisField: any = fieldhasAdd?.find(({name}: any) => name?.match(/manufacturer/i))
            setModalElement(thisField)
          }}
          modalType='asset'
          SetAddDataModal={(e: any) => {
            let setVal: any = true

            if (e?.modules === 'asset.manufacturer_model') {
              setVal = values?.manufacturer_guid === e?.guid ? true : false
            } else if (e?.modules === 'asset.manufacturer_brand') {
              setVal = values?.manufacturer_model_guid === e?.guid ? true : false
            } else if (e?.modules === 'asset.location_sub') {
              setVal = values?.location_guid === e?.guid ? true : false
            } else if (e?.modules === 'asset.type') {
              setVal = values?.category_guid === e?.guid ? true : false
            } else if (e?.modules === 'asset.owner_company_department') {
              setVal = values?.owner_company_guid === e?.guid ? true : false
            } else if (e?.modules === 'asset.item_code') {
              setVal = values?.item_code === e?.guid ? true : false
            } else {
              setVal = true
            }

            if (setVal) {
              setInitialValues((prev: any) => {
                return {...prev, [e?.modules]: {guid: e?.value, name: e?.label}}
              })
            }
          }}
          setReloadManufacturer={() => setReloadSelect(modalElement?.name)}
          setReloadModel={() => setReloadSelect(modalElement?.name)}
          setReloadBrand={() => setReloadSelect(modalElement?.name)}
          setReloadSupplier={() => setReloadSelect(modalElement?.name)}
          setReloadAssetStatus={() => setReloadSelect(modalElement?.name)}
          setReloadLocation={() => setReloadSelect(modalElement?.name)}
          setReloadSubLocation={() => setReloadSelect(modalElement?.name)}
          setReloadCategory={() => setReloadSelect(modalElement?.name)}
          setReloadType={() => setReloadSelect(modalElement?.name)}
          setReloadCompany={() => setReloadSelect(modalElement?.name)}
          setReloadDepartment={() => setReloadSelect(modalElement?.name)}
          setReloadItemCode={() => setReloadSelect(modalElement?.name)}
        />
      )}

      <LimitAsset
        setShowModal={setShowLimitAsset}
        showModal={showLimitAsset}
        loading={isSubmitting}
        dataSubscriber={dataSubscriber}
      />
    </>
  )
}

Index = memo(Index, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Index
