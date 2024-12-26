import {Accordion} from '@components/Accordion'
import {IMG} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'

import {errorData} from '../redux/importRedux'

const Step4: FC<any> = ({result, setStep, guid}) => {
  const intl: any = useIntl()

  const [error, setError] = useState<any>([])
  const [errorCount, setErrorCount] = useState<any>([])
  const [importLink, setImportLink] = useState<string>('')
  const [typeLabelPlural, setTypeLabelPlural] = useState<string>('')
  const [typeLabelSingular, setTypeLabelSingular] = useState<string>('')

  useEffect(() => {
    if (result?.errors || !result.success) {
      errorData({limit: 10, [`filter[files_guid]`]: guid}).then(({data: {data}}: any) => {
        if (data) {
          const arr_data: any = []
          data?.map(({error_field}: any) => {
            if (error_field !== null) {
              return arr_data.push(error_field)
            }
            return true
          })

          setError(arr_data as never[])
          setErrorCount(data?.length || 0)
        }
      })
    }

    if (result) {
      switch (result?.type) {
        case 'assets':
          setTypeLabelSingular('Asset(s)')
          setTypeLabelPlural('Assets')
          setImportLink('/my-assets')
          break
        case 'asset_status':
          setTypeLabelSingular('Asset Status')
          setTypeLabelPlural('Asset Status')
          setImportLink('/setup/settings/asset-status')
          break
        case 'locations':
          setTypeLabelSingular('Location(s)')
          setTypeLabelPlural('Locations')
          setImportLink('/location/location')
          break
        case 'location_sub':
          setTypeLabelSingular('Sub Location(s)')
          setTypeLabelPlural('Sub Locations')
          setImportLink('/location/sub-location')
          break
        case 'brand':
          setTypeLabelSingular('Brand(s)')
          setTypeLabelPlural('Brands')
          setImportLink('/setup/settings/brand')
          break
        case 'insurance_claims':
          setTypeLabelSingular('Insurance Claim(s)')
          setTypeLabelPlural('Insurance Claims')
          setImportLink('/insurance-claims/all')
          break
        case 'categories':
          setTypeLabelSingular('Category(s)')
          setTypeLabelPlural('Categories')
          setImportLink('/setup/settings/categories')
          break
        case 'departments':
          setTypeLabelSingular('Department(s)')
          setTypeLabelPlural('Departments')
          setImportLink('/setup/settings/department')
          break
        case 'manufacturer':
          setTypeLabelSingular('Manufacturer(s)')
          setTypeLabelPlural('Manufacturers')
          setImportLink('/setup/settings/manufacturer')
          break
        case 'type':
          setTypeLabelSingular('Type(s)')
          setTypeLabelPlural('Types')
          setImportLink('/setup/settings/type')
          break
        case 'model':
          setTypeLabelSingular('Model(s)')
          setTypeLabelPlural('Models')
          setImportLink('/setup/settings/model')
          break
        case 'supplier':
          setTypeLabelSingular('Supplier(s)')
          setTypeLabelPlural('Suppliers')
          setImportLink('/setup/settings/supplier')
          break
        case 'warranty':
          setTypeLabelSingular('Warranty(s)')
          setTypeLabelPlural('Warranties')
          setImportLink('/warranty')
          break
        case 'company':
          setTypeLabelSingular('Company(s)')
          setTypeLabelPlural('Companies')
          setImportLink('/setup/settings/companies')
          break
        case 'insurance_policies':
          setTypeLabelSingular('Insurance Policy(s)')
          setTypeLabelPlural('Insurance Policies')
          setImportLink('/insurance/policies')
          break
        case 'employee':
          setTypeLabelSingular('Employee(s)')
          setTypeLabelPlural('Employees')
          setImportLink('/user-management/employee')
          break
        case 'maintenance-category':
          setTypeLabelSingular('Maintenance Categories')
          setTypeLabelPlural('Maintenance Categories')
          setImportLink('/setup/maintenance/maintenance-category')
          break
        default:
          setTypeLabelSingular('Dashboard')
          setTypeLabelPlural('Dashboard')
          setImportLink('/dashboard')
      }
    }
  }, [guid, result])

  return (
    <div className='text-center'>
      <div className='mb-5'>
        <IMG
          path={`/media/icons/duotone/Code/${!result.success ? 'Error' : 'Done'}-circle.svg`}
          height={60}
        />
      </div>
      <div className='mb-5'>
        {result?.success || errorCount} {typeLabelSingular || 'data'}{' '}
        {result?.success ? 'successfully' : 'failed'} to be imported.{' '}
        {!!result?.errors && 'please review the errors below.'}{' '}
        {result?.limits > 0 &&
          `Failed to import remaining ${result?.limits || 0} rows due to limit`}
      </div>
      {!!result?.errors && (
        <div className='row'>
          <div className='col-md-6 offset-md-3'>
            <div className='btn d-block btn-danger mb-3'>
              <i className='fa fa-info me-3' />
              <strong>Error Summary</strong>
            </div>

            <Accordion id='errors' default={error?.[0]?.row}>
              {error &&
                error?.length > 0 &&
                error?.map(({row, mappedErrors: err}: any, index: number) => (
                  <div
                    className=''
                    key={index || 0}
                    data-value={row || ''}
                    data-label={
                      <span>
                        Row # {row || 0}{' '}
                        <small className='text-danger ms-2'>({err?.length || 0} errors)</small>
                      </span>
                    }
                  >
                    <table className='table table-sm table-row-dashed table-row-gray-300 table-striped table-hover'>
                      <thead>
                        <tr>
                          <th className='fw-bolder bg-danger text-white text-start px-3 text-nowrap'>
                            Field Name
                          </th>
                          <th className='fw-bolder bg-danger text-white text-start px-3 text-nowrap'>
                            Field Data
                          </th>
                          <th className='fw-bolder bg-danger text-white text-start px-3 text-nowrap'>
                            Error
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {!!err &&
                          err?.length > 0 &&
                          err?.map(({label, data, errors}: any, key: number) => (
                            <tr key={key || 0}>
                              <td className='text-start px-3 fw-bold'>{label || '-'}</td>
                              <td className='text-start px-3 fw-bold'>{data || '-'}</td>
                              <td className='text-start px-3 fw-bold text-danger'>
                                <ol className='m-0 ps-4'>
                                  {errors &&
                                    errors?.length > 0 &&
                                    errors?.map((errDetail: any, key2: number) => (
                                      <li key={`${key || 0}-${key2 || 0}`}>{errDetail}</li>
                                    ))}
                                </ol>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </Accordion>

            <div className='alert d-block alert-danger my-3'>
              <strong>
                {intl.formatMessage({
                  id: 'PLEASE_CHANGE_VALUE_S_APPROPRIATELY_AND_UPLOAD_NEW_IMPORT_FILE',
                })}
              </strong>
            </div>
          </div>
        </div>
      )}

      <div>
        <button className='btn btn-sm btn-primary' onClick={() => setStep(0)}>
          Import New Spreadsheet
        </button>

        {!result?.errors && (
          <Link to={importLink || ''} className='btn btn-sm btn-light text-dark ms-2'>
            Go To {typeLabelPlural || ''}
            <i className='fa fa-angle-right text-dark ms-2' />
          </Link>
        )}
      </div>
    </div>
  )
}

export {Step4}
