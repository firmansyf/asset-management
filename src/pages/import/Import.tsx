import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {keyBy, mapValues} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {
  downloadTemplate,
  mappingData,
  previewData,
  showData,
  storeData,
  uploadData,
} from './redux/importRedux'
import {Step1} from './step1'
import {Step2} from './step2'
import {Step3} from './step3'
import {Step4} from './step4'

const ImportCard: FC<any> = ({features}) => {
  const [, setCustomField] = useState<any>([])
  const [, setFieldSelected] = useState<any>({})
  const [, setPagePreview] = useState<number>(1)

  const [file, setFile] = useState<any>()
  const [page, setPage] = useState<number>(1)
  const [step, setStep] = useState<number>(0)
  const [fields, setField] = useState<any>([])
  const [result, setResult] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [label, setLabel] = useState<string>('')
  const [fileName, setFileName] = useState<any>()
  const [columns, setColumns] = useState<any>([])
  const [type, setType] = useState<string>('unset')
  const [idImport, seIDImport] = useState<string>('')
  const [fileHeader, setFileHeader] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [dataPerview, setDataPreview] = useState<any>([])
  const [typeImport, setTypeImport] = useState<number>(1)
  const [fieldMapping, setFieldMapping] = useState<any>([])
  const [nextButton, setNextButton] = useState<boolean>(false)
  const [limitPreview, setLimitPreview] = useState<number>(10)
  const [selectedOptions, setSelectedOptions] = useState<any>()
  const [excelColOptions, setExcelColOptions] = useState<any>([])
  const [fistRowHeader, setFistRowHeader] = useState<boolean>(true)
  const [dataTotalPreview, setDataTotalPreview] = useState<number>(1)

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  useEffect(() => {
    if (fieldMapping) {
      const selected_cols: any = fieldMapping?.map(({label, key}: any) => {
        return {[key]: label || ''}
      })
      setFileHeader(Object.assign({}, ...selected_cols))
    }
  }, [fieldMapping])

  useEffect(() => {
    const set: any = {}
    fieldMapping &&
      fieldMapping?.length &&
      fieldMapping?.forEach(({key, label}: any) => {
        if (key?.split('.')?.[0] === 'asset') {
          const newKey: any = key?.split('.')?.[1] || ''
          set[newKey] = label || ''
        } else {
          set[key] = label || ''
        }
      })

    const params: any = {
      new_option: [],
      custom_field: [],
      field: set || {},
      first_row_header: fistRowHeader,
    }

    if (idImport && Object.keys(set || {})?.length > 0) {
      mappingData(params, idImport).then(({data: {data: _res}}: any) => {
        previewData({page, limit}, idImport).then(
          ({
            data: {
              data: result,
              columns: data_columns,
              meta: {current_page, total, per_page},
            },
          }: any) => {
            setDataPreview(result)
            setColumns(data_columns)
            setDataTotalPreview(total)
            setPagePreview(current_page)
            setLimitPreview(parseInt(per_page))
          }
        )
      })
    }
  }, [page, limit, idImport, fistRowHeader, fieldMapping])

  const submitNext = (step: any) => {
    setLoading(true)
    switch (step) {
      case 0: {
        const {title, data}: any = file || {}
        const params: any = {
          import_type: typeImport || '',
          files_import: data || '',
          file_name: title || '',
        }

        uploadData(params)
          .then(({data: {data: result}}: any) => {
            const {guid} = result || {}
            if (guid) {
              seIDImport(guid)
              showData(guid).then(({data: {data: res}}: any) => {
                const {fixed_field, excel_col_options, custom_field}: any = res || {}
                const set: any = {}
                fixed_field?.forEach(({key, label}: any) => {
                  set[key] = label || ''
                })

                setLoading(false)
                setStep(step + 1)
                setFieldSelected(set)
                setField(fixed_field)
                setFieldMapping(fixed_field)
                setCustomField(custom_field)
                setExcelColOptions(excel_col_options)
              })
            }
          })
          .catch(({response}: any) => {
            setLoading(false)
            const {data, message}: any = response?.data || {}
            const {fields}: any = data || {}

            const check_data: any = Object.keys(data || {})?.length || 0
            if (check_data > 0) {
              ToastMessage({type: 'error', message: fields?.file_name?.[0] || ''})
            } else {
              ToastMessage({type: 'error', message})
            }
          })
        break
      }
      case 1:
        setTimeout(() => {
          const set: any = {}
          fieldMapping?.forEach(({key, label}: any) => {
            if (key?.split('.')?.[0] === 'asset') {
              const newKey: any = key?.split('.')?.[1] || ''
              set[newKey] = label || ''
            } else {
              set[key] = label || ''
            }
          })

          const params: any = {
            new_option: [],
            custom_field: [],
            field: set || {},
            first_row_header: fistRowHeader,
          }

          mappingData(params, idImport).then(({data: {data: _res}}: any) => {
            previewData({page, limit}, idImport).then(
              ({
                data: {
                  data: result,
                  columns: data_columns,
                  meta: {current_page, total, per_page},
                },
              }: any) => {
                setDataPreview(result)
                setColumns(data_columns)
                setDataTotalPreview(total)
                setPagePreview(current_page)
                setLimitPreview(parseInt(per_page))
              }
            )
          })

          setLoading(false)
          setStep(step + 1)
        }, 2000)
        break

      case 2:
        setTimeout(() => {
          storeData(
            {
              existing_different_value_found: 0,
              similarity_found: 0,
              linking_field: 0,
              status_field: 0,
            },
            idImport
          )
            .then(({data: {data}}: any) => {
              setResult(data)
              setLoading(false)
              setStep(step + 1)
            })
            .catch(({response}: any) => {
              const {status} = response || {}
              if (status === 400) {
                setLoading(false)
                ToastMessage({
                  message:
                    'Your assets exceed the maximum limit. Please import according to the limit asset or Upgrade your plans',
                  type: 'error',
                })
              }
            })
        }, 2000)
        break

      case 3:
        setTimeout(() => {
          setLoading(false)
          setStep(step + 1)
        }, 2000)
        break

      case 4:
        setTimeout(() => {
          setLoading(false)
          setStep(step + 1)
        }, 2000)
        break

      default:
        break
    }
  }

  const onDownloadTemplate = (type: any) => {
    if (type && type !== 'unset' && type !== null) {
      downloadTemplate({type})
        .then(({data: {data: res}}: any) => {
          const {url}: any = res || {}
          window.open(url, '_blank')
        })
        .catch(({response}: any) => {
          const {message}: any = response?.data || {}
          ToastMessage({message, type: 'error'})
        })
    } else {
      ToastMessage({type: 'error', message: 'Please Choose Import Type'})
    }
  }

  const cards: any = [
    {title: '1. Import File', desc: 'Import data using an excel spreadsheet'},
    {
      title: '2. Map Fields',
      desc: 'Map and match fields from spreadsheet with fields in the system',
    },
    {title: '3. Import', desc: `Create ${label || ''} after set your own preferences`},
    {title: '4. Import Summary', desc: `Create ${label || ''} after set your own preferences`},
  ]

  return (
    <div className='card card-custom'>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{cards?.[step]?.title || ''}</span>
          <span className='text-black-400 fw-bold fs-7'>{cards?.[step]?.desc || ''}</span>
        </h3>
      </div>
      <div className='card-body'>
        {step === 0 && (
          <Step1
            type={type}
            file={file}
            setType={setType}
            setFile={setFile}
            setLabel={setLabel}
            fileName={fileName}
            features={features}
            setFileName={setFileName}
            setNextButton={setNextButton}
            setTypeImport={setTypeImport}
            selectedOptions={selectedOptions}
            onDownloadTemplate={onDownloadTemplate}
            setSelectedOptions={setSelectedOptions}
          />
        )}
        {step === 1 && (
          <Step2
            fields={fields}
            fieldMapping={fieldMapping}
            setNextButton={setNextButton}
            fistRowHeader={fistRowHeader}
            setFieldMapping={setFieldMapping}
            excelColOptions={excelColOptions}
            setFistRowHeader={setFistRowHeader}
          />
        )}
        {step === 2 && (
          <Step3
            type={type}
            columns={columns}
            loading={loading}
            data={dataPerview}
            limit={limitPreview}
            fileHeader={fileHeader}
            // setLoading={setLoading}
            totalPage={dataTotalPreview}
            fistRowHeader={fistRowHeader}
            onPageChange={(e: any) => setPage(e)}
            onChangeLimit={(e: any) => {
              setPage(1)
              setLimit(e)
            }}
          />
        )}
        {step === 3 && <Step4 type={type} result={result} setStep={setStep} guid={idImport} />}
      </div>
      <div className='card-footer py-5'>
        <div className='d-flex justify-content-between'>
          <div className=''>
            {step > 0 && step < 3 && (
              <button className='btn btn-light-primary' onClick={() => setStep(step - 1)}>
                <KTSVG
                  path='/media/icons/duotone/Navigation/Left-2.svg'
                  className='svg-icon-4 me-1'
                />
                Back
              </button>
            )}
          </div>
          <div className=''>
            {step < 3 && (
              <button
                onClick={() => submitNext(step)}
                className='btn btn-light-primary'
                disabled={!nextButton || loading}
              >
                {!loading && (
                  <>
                    {step < 2 ? 'Next' : 'Import'}
                    <KTSVG
                      path='/media/icons/duotone/Navigation/Right-2.svg'
                      className='svg-icon-3 ms-2 me-0'
                    />
                  </>
                )}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const Import: FC = () => {
  const intl: any = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [features, setFeatures] = useState<any>({})
  // const [loading, setLoading] = useState<boolean>(true)

  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 400)
  // }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.IMPORT'})}</PageTitle>
      {/* {loading ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={500} />
          </div>
        </div>
      ) : ( */}
      {features?.bulk_import !== 1 ? <Forbidden /> : <ImportCard features={features} />}
      {/* )} */}
    </>
  )
}

export default Import
