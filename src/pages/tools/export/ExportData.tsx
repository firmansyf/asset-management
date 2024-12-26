import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {configClass} from '@helpers'
import remove from 'lodash/remove'
import {FC, useState} from 'react'
import {Button} from 'react-bootstrap'
import Select from 'react-select'

const ExportData: FC<any> = ({
  feature,
  onDownloadTemplate,
  type,
  setType,
  fileFormat,
  setFileFormat,
  loading,
  disableDownload,
  setDisableDownload,
}) => {
  const options: any = [
    {value: 'asset', label: 'Assets'},
    {value: 'asset-status', label: 'Asset Status'},
    {value: 'brand', label: 'Brands'},
    {value: 'category', label: 'Categories'},
    {value: 'company', label: 'Companies'},
    {value: 'department', label: 'Departments'},
    {value: 'employee', label: 'Employees'},
    {value: 'location', label: 'Locations'},
    {value: 'manufacturer', label: 'Manufacturers'},
    {value: 'model', label: 'Models'},
    {value: 'my-asset', label: 'My Asset'},
    {value: 'sub-location', label: 'Sub Locations'},
    {value: 'supplier', label: 'Supplier'},
    {value: 'type', label: 'Types'},
    {value: 'user', label: 'Users'},
    {value: 'warranty', label: 'Warranties'},
  ]

  if (feature?.warranty === 0) {
    remove(options, {value: 'warranty', label: 'Warranties'})
  }

  if (feature?.insurance === 1) {
    options.push({value: 'insurance-policy', label: 'Insurance Policies'})
  }

  const [value, setValue] = useState(null)
  const handleRadio = (value: any) => {
    setFileFormat(value)
    if (type !== 'unset') {
      setDisableDownload(true)
    }
  }

  const onChange = (value: any) => {
    setValue(value)
    setType(value?.value)
    setFileFormat(fileFormat)
    if (fileFormat !== undefined) {
      setDisableDownload(true)
    }
  }

  const onClear = () => {
    setValue(null)
    setType('unset')
    setFileFormat(undefined)
    setDisableDownload(false)
  }

  return (
    <>
      <div className='p-4 bg-light mb-5'>
        Export your data by downloading it in PDF or Excel format. If data are more than 500 the
        file will be send to your email
      </div>

      <div className='col-sm-5 m-10'>
        <div className='col-md-12 mb-3 row'>
          <div className='col-sm-12 col-md-6 col-lg-5'>
            <label htmlFor='name' className={`${configClass?.label} required`}>
              <strong>Select Table</strong>
            </label>
          </div>
          <div className='col-sm-12 col-md-6 col-lg-7'>
            <Select
              styles={customStyles(true, {})}
              components={{ClearIndicator, DropdownIndicator}}
              options={options}
              name='type'
              placeholder='Choose Export Table'
              onChange={onChange}
              value={value}
            />
          </div>
        </div>
        <div className='col-md-12 mb-3 row'>
          <div className='col-sm-12 col-md-6 col-lg-5'>
            <label htmlFor='description' className={`${configClass?.label} required`}>
              <strong>Export File Format</strong>
            </label>
          </div>
          <div className='col-sm-12 col-md-6 col-lg-7 mt-2'>
            <div className='row'>
              <div className='col-12 mb-2'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='format'
                  onChange={(e: any) => handleRadio(e?.target?.value)}
                  value='pdf'
                  checked={fileFormat === 'pdf'}
                />
                <label className='form-check-label'>
                  <span className='m-5'>PDF</span>
                </label>
              </div>
              <div className='col-12'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='format'
                  onChange={(e: any) => handleRadio(e?.target?.value)}
                  value='xlsx'
                  checked={fileFormat === 'xlsx'}
                />
                <label className='form-check-label'>
                  <span className='m-5'>Excel</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex float-end'>
        <div className='me-2'>
          <Button
            className='btn btn-sm btn-light-primary'
            onClick={() => {
              onClear()
            }}
          >
            Reset
          </Button>
        </div>
        <div className='col-auto'>
          <Button
            disabled={!disableDownload || loading}
            className='btn-sm'
            type='submit'
            variant='primary'
            onClick={() => {
              onDownloadTemplate(type, fileFormat)
            }}
          >
            {!loading && <span className='indicator-label'>Download</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

export {ExportData}
