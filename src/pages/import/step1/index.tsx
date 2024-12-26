/* eslint-disable react-hooks/exhaustive-deps */
import {FileUpload} from '@components/FileUpload'
import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {configClass, KTSVG} from '@helpers'
import clsx from 'clsx'
import orderBy from 'lodash/orderBy'
import {FC, useEffect, useRef, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import Select from 'react-select'

const Step1: FC<any> = ({
  onDownloadTemplate,
  setType,
  setLabel,
  setFile,
  type,
  setTypeImport,
  file,
  setNextButton,
  fileName,
  setFileName,
  selectedOptions,
  setSelectedOptions,
  features,
}) => {
  const intl: any = useIntl()
  const urlParams: any = new URLSearchParams(window.location.search)
  const paramsSearch: any = Object.fromEntries(urlParams.entries())
  const uploaderRef: any = useRef()
  const {type: importType} = paramsSearch
  const [options, setOptions] = useState<any>([])
  const navigate: any = useNavigate()
  const isSelected: boolean = Boolean(type) && type !== 'unset'

  const onChange = (e: any) => {
    setSelectedOptions(e)
    setType(e?.value)
    setLabel(e.label)
    setTypeImport(e.import_type)
    navigate(`/tools/import?type=${e.value}`)
    if (file !== undefined) {
      setNextButton(true)
    }
  }

  const onClear = () => {
    setSelectedOptions(null)
    setType('unset')
    setFile(undefined)
    setNextButton(false)
    setFileName(undefined)
    navigate(`/tools/import`)
  }

  const onDrop = (acceptedFiles: any) => {
    acceptedFiles?.map((file: any) => {
      const reader: any = new FileReader()
      reader.onload = () => {
        const base64Image: any = reader.result
        setFile({
          data: base64Image,
          title: file.name,
        })
        setFileName(file.name)
        if (type !== 'unset') {
          setNextButton(true)
        }
      }
      return reader.readAsDataURL(file)
    })
  }

  useEffect(() => {
    const default_options: any = [
      {import_type: 1, value: 'asset', label: 'Assets'},
      {import_type: 2, value: 'location', label: 'Locations'},
      {import_type: 4, value: 'sub-location', label: 'Sub Locations'},
      {import_type: 5, value: 'category', label: 'Categories'},
      {import_type: 6, value: 'department', label: 'Departments'},
      {import_type: 7, value: 'manufacturer', label: 'Manufacturers'},
      {import_type: 8, value: 'type', label: 'Types'},
      {import_type: 9, value: 'model', label: 'Models'},
      {import_type: 10, value: 'asset-status', label: 'Asset Status'},
      {import_type: 11, value: 'supplier', label: 'Supplier'},
      {import_type: 13, value: 'company', label: 'Companies'},
      {import_type: 15, value: 'employee', label: 'Employees'},
      {import_type: 16, value: 'brand', label: 'Brands'},
      {import_type: 17, value: 'vendor', label: 'Vendor'},
      {import_type: 20, value: 'maintenance-category', label: 'Work Orders Category'},
      {import_type: 21, value: 'maintenance', label: 'Work Order'},
    ]

    if (features?.warranty === 1) {
      default_options.push({import_type: 12, value: 'warranty', label: 'Warranties'})
    }

    if (features?.inventory === 1) {
      default_options.push({import_type: 18, value: 'inventory', label: 'Inventory'})
    }

    if (features?.insurance_claim === 1) {
      default_options.push({import_type: 3, value: 'insurance', label: 'Insurance Claims'})
    }

    if (features?.insurance === 1) {
      default_options.push({
        import_type: 14,
        value: 'insurance-policy',
        label: 'Insurance Policies',
      })
    }

    setNextButton(false)
    setOptions(orderBy(default_options, ['label'], ['asc']))

    if (file !== undefined && type !== 'unset') {
      setNextButton(true)
    }
  }, [setNextButton, file, type, features])

  useEffect(() => {
    if (importType !== undefined && importType !== '') {
      options
        ?.filter((opt: {value: any}) => opt?.value === importType)
        ?.map((default_opt: any) => {
          setType(default_opt?.value)
          setLabel(default_opt?.label)
          setTypeImport(default_opt?.import_type)
          setSelectedOptions(selectedOptions !== null ? default_opt : null)
          return true
        })
    }
  }, [importType, options, setLabel, selectedOptions, setSelectedOptions, setType, setTypeImport])

  return (
    <>
      <div className='p-4 bg-light mb-5'>
        {intl.formatMessage({
          id: 'IMPORT_YOUR_DATA_USING_AN_EXCEL_SPREADSHEET_DOWNLOAD_OUR_TEMPLATE_FILL_IT_IN_AND_UPLOAD_YOU_CAN_IMPORT_UP_TO_5_000_RECORDS_IN_ONE_SPREADSHEET_IF_YOU_NEED_ASSISTANCE_IN_UPLOADING_YOUR_ASSETS_PLEASE_FEEL_FREE_TO_EMAIL_YOUR_SPREADSHEET_TO',
        })}
        <a href='mailto:info@assetdata.io'>info@assetdata.io.</a>
        {intl.formatMessage({id: 'WE_LL_TAKE_CARE_OF_THE_REST'})}
      </div>
      <div className='row align-items-center my-2'>
        <div className='col-sm-12 col-md-6 col-lg-6 my-1'>
          <div className='row align-items-center m-0'>
            <div className='col-auto'>
              <label className={`${configClass?.label}`}>Import To :</label>
            </div>
            <div className='col px-3'>
              <Select
                options={options}
                name='type'
                styles={customStyles(true, {})}
                components={{ClearIndicator, DropdownIndicator}}
                placeholder='Choose Import Table'
                onChange={onChange}
                value={selectedOptions}
              />
            </div>
          </div>
        </div>
        <div className='col-sm-12 col-md-6 col-lg-3 my-1'>
          <button
            onClick={() => onDownloadTemplate(type)}
            className='btn btn-sm btn-primary'
            disabled={type === 'unset' ? true : false}
          >
            Download Template
          </button>
        </div>
      </div>

      <FileUpload
        ref={uploaderRef}
        className={clsx(
          'btn d-flex flex-center my-5 w-100 h-125px border-dashed border-primary',
          !isSelected && 'bg-light border opacity-25 cursor-na',
          fileName && isSelected && 'bg-light-primary border',
          !fileName && isSelected && 'btn-outline btn-bg-light btn-active-light-primary'
        )}
        classNameOndragOver='btn-bg-primary text-white'
        name='files'
        multiple={false}
        onChange={onDrop}
        accept={'.xlsx'}
        disabled={!isSelected}
      >
        <div className='d-block'>
          <KTSVG
            className='svg-icon-5x ms-n1'
            path={`/media/icons/duotone/Files/${fileName ? 'Selected-file' : 'Upload'}.svg`}
          />
          <div className='mt-2'>
            {!isSelected
              ? 'Choose Import Type First'
              : fileName || 'Drag and drop file here, or click to Browse.'}
          </div>
        </div>
      </FileUpload>

      <div className='d-flex float-end'>
        <div className='me-2'>
          <button
            className='btn btn-sm btn-light-primary'
            onClick={() => {
              onClear()
            }}
          >
            Reset
          </button>
        </div>
        <div className=''>
          <button
            className='btn btn-sm btn-primary'
            onClick={(e: any) => {
              e?.preventDefault()
              uploaderRef?.current?.click()
            }}
          >
            Browse File
          </button>
        </div>
      </div>
    </>
  )
}

export {Step1}
