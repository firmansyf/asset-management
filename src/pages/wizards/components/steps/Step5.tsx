import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {deleteCustomField, getCustomField} from '@pages/wizards/redux/WizardService'
import uniqBy from 'lodash/uniqBy'
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react'
import {useIntl} from 'react-intl'

type DatabaseProps = {
  database: any
  reloadCustomField: any
  setDetailCustomField: any
  setShowModalCustomField: any
  setFieldAssetData: any
  setArrayOption: any
}

let Step5: FC<DatabaseProps> = ({
  database,
  reloadCustomField,
  setDetailCustomField,
  setShowModalCustomField,
  setFieldAssetData,
  setArrayOption,
}) => {
  const intl: any = useIntl()
  const cfRef: any = useRef()

  const [meta, setMeta] = useState<any>()
  const [data, setData] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [totalasset, setTotalAsset] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [checkAll, setCheckAll] = useState<boolean>(false)
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [dataCustomField, setDataCustomField] = useState<any>([])
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [customfieldname, setCustomFieldName] = useState<boolean>(false)
  const [custom_field_guid, setCustomFieldGuid] = useState<boolean>(false)

  useEffect(() => {
    getCustomField({page, limit, orderCol, orderDir, 'filter[section_type]': 'assets'}).then(
      ({data: {data: result, meta}}: any) => {
        const {current_page, per_page, total}: any = meta || {}
        setLimit(per_page)
        setTotalPage(total)
        setMeta(meta || {})
        setPage(current_page)

        if (result) {
          const data: any = result
            ?.sort((a: any, b: any) => {
              const compareResult: any = a?.[orderCol]?.localeCompare(b?.name, 'en', {
                numeric: true,
              })

              if (orderDir === 'asc') {
                return compareResult
              } else {
                return -compareResult
              }
            })
            ?.map((res: any) => {
              const {name, element_type_label, conditions}: any = res || {}
              const cateogrys: any =
                conditions !== undefined
                  ? conditions?.map(({name}: any) => name)?.join(', ')
                  : 'All Category'

              return {
                name: name || '-',
                elemet_type: element_type_label || '-',
                category_name: cateogrys || '-',
                edit: 'Edit',
                delete: 'Delete',
                original: res,
              }
            })

          setTotalPerPage(data?.length || 0)
          setDataCustomField(data as never[])
        }
      }
    )
  }, [page, limit, orderCol, orderDir, reloadCustomField, reloadDelete])

  const confirmDeleteCustomField = useCallback(() => {
    setLoading(true)
    deleteCustomField(custom_field_guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          ToastMessage({message, type: 'success'})
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [custom_field_guid, reloadDelete])

  useEffect(() => {
    const checked: any = database?.filter(({is_selected}: any) => is_selected)?.length || 0
    setCheckAll(checked >= database?.length)
    setData(database)
  }, [database])

  let alert_message: any = [
    'Are you sure to delete this ',
    <strong key='cf_name'>{customfieldname || '-'}</strong>,
    ' field ?',
  ]

  if (totalasset > 0) {
    alert_message = [
      'Are you sure to delete ',
      <strong key='key-1'>{customfieldname || '-'}</strong>,
      ' custom field?',
      <br key='newline1' />,
      'This custom field is currently being used in',
      <strong key='key-2'>{totalasset || 0}</strong>,
      ' asset(s)',
      <br key='newline2' />,
      'If you proceed to delete this custom field, it will no longer shown on asset details.',
    ]
  }

  const changeRequired = (data: any, field_name: any, status: boolean) => {
    const res: any =
      data &&
      data?.length > 0 &&
      data?.map((e: any) => {
        const {field}: any = e || {}
        if (field === field_name) {
          return {...e, is_required: status}
        }
        return e
      })
    setData(res as never[])
    setFieldAssetData(res as never[])
  }

  const changeStatus = (data: any, field_name: any, status: boolean) => {
    const res: any =
      data &&
      data?.length > 0 &&
      data?.map((e: any) => {
        const {field, is_required}: any = e || {}
        if (field === field_name) {
          return {
            ...e,
            is_selected: status,
            is_required: is_required === false ? false : false,
          }
        }
        return e
      })

    const restCount: any = res?.filter(({is_selected}: any) => is_selected)?.length || 0
    setCheckAll(restCount >= res?.length)
    setFieldAssetData(res as never[])
    setData(res as never[])
  }

  const onSelectAll = ({target: {checked}}: any) => {
    const is_checked: any = checked
    let checkable: any = data?.filter(({is_default}: any) => !is_default)
    const data_default: any = data?.filter(({is_default}: any) => is_default)

    checkable = checkable?.map((m: any) => {
      m.is_selected = is_checked
      return m
    })
    setCheckAll(is_checked)
    setData(data_default?.concat(checkable))
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onEdit = (e: any) => {
    setDetailCustomField(e)
    setShowModalCustomField(true)
    const {options} = e || {}
    if (options !== undefined) {
      const arr_init_option: any[] = []
      options &&
        options?.length > 0 &&
        options?.map((item: any) => arr_init_option?.push(item?.value))
      setArrayOption(arr_init_option as never[])
    }
  }

  const onDelete = (e: any) => {
    const {guid, name, total_asset}: any = e || {}

    setShowModalConfirm(true)
    setCustomFieldGuid(guid || '')
    setCustomFieldName(name || '')
    setTotalAsset(total_asset || 0)
  }

  const columns: any = [
    {header: 'Field Name', value: 'name', sort: true},
    {header: 'Data Type', value: 'element_type_label', sort: true},
    {header: 'Category', value: 'category_name', sort: true},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page - 1 ? meta?.current_page - 1 : 1)
    }
  }, [meta, totalPerPage])

  return (
    <>
      <div className='w-100 mb-5'>
        <div className='form-row mb-10' data-cy='db-container'>
          <div className='pb-md-10 pb-lg-12' data-cy='card-title-db'>
            <div className='row flex-center'>
              <div className='col'>
                <h3 className='fw-bolder text-dark'>
                  <KTSVG
                    path='/media/icons/duotone/Clothes/Briefcase.svg'
                    className='svg-icon-2x me-5'
                  />
                  Asset Database Fields
                </h3>

                <div className='text-black-400 fs-6 ms-14'>
                  <p className='m-0'>
                    {intl.formatMessage({id: 'FILL_IN_THE_APPROPRIATE_FIELDS_FOR_YOUR_ASSETS'})}
                  </p>

                  <p className='m-0'>
                    {intl.formatMessage({
                      id: 'CHECK_THE_BOXES_NEXT_TO_THE_FIELD_NAMES_YOU_WANT_TO_INCLUDE',
                    })}
                  </p>
                </div>
              </div>

              {cfRef?.current && (
                <div className='col-auto'>
                  <div
                    data-cy='go-to-cf'
                    className='btn btn-sm btn-light-primary radius-50 p-2'
                    onClick={() => window.scrollTo(0, cfRef?.current?.offsetTop)}
                  >
                    <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
                      <i className='las la-arrow-down fs-5 text-white' />
                    </span>
                    <span className='px-2'>Asset Custom Field</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <table id='database' className='table table-row-dashed'>
            <thead>
              <tr className='fw-bolder fs-6 text-gray-800'>
                <th className='checkbox'>
                  <input
                    type='checkbox'
                    checked={checkAll}
                    data-cy='checkBoxAll'
                    onChange={onSelectAll}
                  />
                </th>
                <th>Field Name</th>
                <th>Required Field</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                uniqBy(data, 'field')?.map(
                  (
                    {label, field, example, description, is_required, is_default, is_selected}: any,
                    index: number
                  ) => {
                    return (
                      <tr key={index || 0}>
                        <td>
                          <input
                            type='checkbox'
                            data-cy='checkBox'
                            disabled={is_default || false}
                            checked={is_selected || false}
                            onChange={() => changeStatus(data, field, !is_selected)}
                          />
                        </td>
                        <td>
                          {label || ''}{' '}
                          <span className='text-danger'>{is_required ? '*' : ''}</span>
                        </td>
                        <td>
                          {is_selected && (
                            <div className='d-flex flex-row'>
                              <div className='d-flex flex-row me-3'>
                                <input
                                  type='radio'
                                  name={field}
                                  className='me-2'
                                  data-cy='checkBoxYes'
                                  disabled={is_default || false}
                                  checked={is_required || false}
                                  onChange={() => changeRequired(data, field, true)}
                                />
                                <label>Yes</label>
                              </div>

                              {!is_default && (
                                <div className='d-flex flex-row me-3'>
                                  <input
                                    type='radio'
                                    name={field}
                                    className='me-2'
                                    data-cy='checkBoxNo'
                                    checked={!is_required}
                                    onChange={() => changeRequired(data, field, false)}
                                  />
                                  <label>No</label>
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td>{description || '-'}</td>
                        <td>{example || '-'}</td>
                      </tr>
                    )
                  }
                )}
            </tbody>
          </table>
        </div>

        <div className='form-row border-top' data-cy='cf-container'>
          <div className='py-10 pb-lg-12' data-cy='card-title-cf' ref={cfRef}>
            <div className='row'>
              <h3 className='fw-bolder text-dark'>
                <KTSVG
                  path='/media/icons/duotone/Clothes/Briefcase.svg'
                  className='svg-icon-2x me-5'
                />
                Asset Custom Fields
              </h3>
            </div>

            <div className='text-black-400 fs-6 ms-14'>
              {intl.formatMessage({
                id: 'ADD_CUSTOM_FIELDS_TO_JOIN_THE_OTHERS_THAT_WE_PROVIDED_FEEL_FREE_TO_GET_CREATIVE',
              })}
            </div>
          </div>

          <div className=''>
            <div className='d-flex justify-content-between pb-10'>
              <button
                type='button'
                data-cy='AddCustomFiled'
                className='btn btn-primary'
                onClick={() => {
                  setDetailCustomField(null)
                  setShowModalCustomField(true)
                }}
              >
                <span className='indicator-label'>+ Add Custom Field</span>
              </button>
            </div>

            <DataTable
              page={page}
              limit={limit}
              onSort={onSort}
              onEdit={onEdit}
              total={totalPage}
              loading={loading}
              columns={columns}
              onDelete={onDelete}
              data={dataCustomField}
              onChangePage={onPageChange}
              onChangeLimit={onChangeLimit}
              className={'wizard-custom-field'}
              customEmptyTable='No Asset Custom Field Added'
            />
          </div>
        </div>
      </div>

      <Alert
        type={'delete'}
        loading={loading}
        body={alert_message}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Custom Field'}
        setShowModal={setShowModalConfirm}
        onCancel={() => setShowModalConfirm(false)}
        onConfirm={() => confirmDeleteCustomField()}
      />
    </>
  )
}

Step5 = memo(Step5, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Step5}
