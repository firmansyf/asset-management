import {exportCompany} from '@api/company'
import {exportDepartment} from '@api/department'
import {exportLocation} from '@api/Service'
import {exportUser} from '@api/UserCRUD'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {exportAsset, exportMyAsset} from '@pages/asset-management/redux/AssetRedux'
import {exportInsuranceClaim} from '@pages/insurance/claim/Service'
import {exportInsurancePolicies} from '@pages/insurance/policies/Service'
import {exportSubLocation} from '@pages/location/sub-location/redux/SubLocationCRUD'
import {assetStatusExport} from '@pages/setup/settings/asset-status/Service'
import {exportBrand} from '@pages/setup/settings/brand/Service'
import {exportCategory} from '@pages/setup/settings/categories/redux/CategoryCRUD'
import {exportManufacturer} from '@pages/setup/settings/manufacture/Service'
import {exportModel} from '@pages/setup/settings/model/Service'
import {exportSupplier} from '@pages/setup/settings/supplier/Service'
import {exportType} from '@pages/setup/settings/type/Service'
import {ExportData} from '@pages/tools/export/ExportData'
import {exportEmployee} from '@pages/user-management/redux/EmployeeCRUD'
import {exportWarranty} from '@pages/warranty/redux/WarrantyCRUD'
import {keyBy, mapValues} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

const ExportCard: FC = () => {
  const {preference: preferenceStore, currentUser: user}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {guid}: any = user || {}
  const {feature}: any = preferenceStore || {}

  const [features, setFeatures] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [type, setType] = useState<any>('unset')
  const [fileFormat, setFileFormat] = useState<any>(undefined)
  const [disableDownload, setDisableDownload] = useState<boolean>(false)

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const params: any = Object.fromEntries(urlSearchParams.entries())
    const {type}: any = params || {}
    setType(type || 'unset')
  }, [])

  const exportSuccessResponse = (res: any) => {
    ToastMessage({type: 'success', message: res?.message})
    setTimeout(() => {
      const {data}: any = res || {}
      const {url}: any = data || {}
      window.open(url, '_blank')
      setLoading(false)
    }, 3000)
  }

  const exportErrorResponse = (error: any) => {
    ToastMessage({type: 'error', message: error?.response?.data?.message})
    setLoading(false)
  }

  const onDownloadTemplate = (type: any, format: any) => {
    setLoading(true)
    if (type === 'unset' || type === null) {
      setLoading(false)
      ToastMessage({type: 'error', message: 'Please choose export table'})
    } else {
      let columns: any = ''
      let orderDir: any = ''
      let orderCol: any = ''
      switch (type) {
        case 'asset':
          columns =
            'asset_id,asset_name,asset_description,category_name,assigned_user_name,location_name'
          orderDir = 'asc'
          orderCol = 'asset_id'
          exportAsset({type: format, orderDir, orderCol, columns})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'asset-status':
          assetStatusExport({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'brand':
          exportBrand({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'category':
          exportCategory({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'company':
          exportCompany({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'department':
          exportDepartment({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'employee':
          exportEmployee({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'insurance':
          exportInsuranceClaim({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'insurance-policy':
          columns = `is_active,description,start_date,end_date,insurer,premium,name,phone_number,coverage,policy_no,email,limit,deductible,contact_person`
          orderDir = 'asc'
          orderCol = 'name'
          exportInsurancePolicies({type: format, orderDir, orderCol, columns})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'location':
          columns =
            'name,availability,description,address,address_alternate,city,state,country_name,postcode'
          orderDir = 'asc'
          orderCol = 'name'
          exportLocation({type: format, orderDir, orderCol, columns})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'manufacturer':
          exportManufacturer({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'model':
          exportModel({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'my-asset': {
          columns =
            'asset_id,asset_name,asset_description,category_name,assigned_user_name,location_name'
          orderDir = 'asc'
          orderCol = 'asset_id'
          const params_filter: any = {
            assigned_user_guid: guid,
          }
          exportMyAsset({type: format, orderDir, orderCol, columns, filter: params_filter})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        }
        case 'sub-location':
          exportSubLocation({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'supplier':
          exportSupplier({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'type':
          exportType({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'user':
          columns = 'first_name,role_name,email,phone_number'
          orderDir = 'asc'
          orderCol = 'first_name'
          exportUser({type: format, orderDir, orderCol, columns})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        case 'warranty':
          exportWarranty({type: format})
            .then(({data: res}) => {
              exportSuccessResponse(res)
            })
            .catch((error: any) => {
              exportErrorResponse(error)
            })
          break
        default:
        //
      }
    }
  }

  return (
    <div className='card card-custom'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>1. Export File</span>
        </h3>
      </div>
      <div className='card-body'>
        <ExportData
          feature={features}
          onDownloadTemplate={onDownloadTemplate}
          setType={setType}
          fileFormat={fileFormat}
          setFileFormat={setFileFormat}
          type={type}
          loading={loading}
          setLoading={setLoading}
          disableDownload={disableDownload}
          setDisableDownload={setDisableDownload}
        />
      </div>
    </div>
  )
}

const Export: FC = () => {
  const intl = useIntl()
  // const [loading, setLoading] = useState<boolean>(true)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(false)
  //   }, 400)
  // }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.EXPORT'})}</PageTitle>
      {/* {loading ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={500} />
          </div>
        </div>
      ) : ( */}
      <ExportCard />
      {/* )} */}
    </>
  )
}

export default Export
