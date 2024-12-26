/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, KTSVG} from '@helpers'
import {
  checkDeleteCustomField,
  deleteBulkCustomField,
  getCustomField,
} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {getCategory} from '@pages/setup/settings/categories/redux/CategoryCRUD'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useCallback, useEffect, useState} from 'react'

import {messageAlertBulk} from '../component/CustomFieldHelpers'
import DetailCustomField from '../component/DetailCustomFiled'
import AddCustomFieldAsset from './AddCustomFieldAsset'

let CardCustomFieldAsset: FC<any> = ({
  onDelete,
  setRealodData,
  reloadData,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
  pageFrom,
  setPageFrom,
  page,
  setPage,
}) => {
  const label: any = 'Custom Field Asset'
  const section_type: string = 'assets'

  const [showModalAdd, setShowModalAdd] = useState(false)
  const [orderCol, setOrderCol] = useState('name')
  const [orderDir, setOrderDir] = useState('asc')
  const [reloadFieldAsset, setReloadFieldAsset] = useState([])
  const [cfDetail, setCFDetail] = useState<any>()
  const [optCategory, setCategoryOption] = useState([])
  const [limit, setLimit] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [arrOption, setArrayOption] = useState([])
  const [checked, setChecked] = useState([])
  const [showModalConfirmBulk, setShowModalConfirmBulk] = useState(false)
  const [checkDeleteBulk, setCheckDeleteBulk] = useState<any>({})
  const [mandatoryDeleteBulk, setMandatoryDeleteBulk] = useState<any>([])
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [customFileDetail, setCustomFileDetail] = useState<any>()

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setCustomFileDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setCFDetail(e)
    setShowModalAdd(true)
    if (e?.options !== undefined) {
      const arr_init_option: number[] = []
      e?.options?.map((item: any) => arr_init_option?.push(item?.value))
      setArrayOption(arr_init_option as never[])
    }
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const confirmDeleteBulk = useCallback(() => {
    const guids = checked?.map(({guid}: any) => guid)
    deleteBulkCustomField({guids, section_type})
      .then(({data: {message}}: any) => {
        setShowModalConfirmBulk(false)
        setRealodData(reloadData + 1)
        ToastMessage({type: 'success', message: message})
        const total_data_page: number = totalPage - pageFrom
        if (total_data_page - checked?.length <= 0) {
          if (page > 1) {
            setPage(page - 1)
          } else {
            setPage(page)
            setResetKeyword(true)
          }
        } else {
          setPage(page)
        }
        setChecked([])
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
      })
  }, [checked, setRealodData, reloadData])

  const onDeleteBulk = () => {
    const guids = checked?.map(({guid}: any) => guid)
    const params: any = {
      section_type: section_type,
      guids,
    }

    if (checked?.length) {
      const getMandatory: any = []
      checked?.map(({original}: any) => {
        original?.rules?.map((item: any) => {
          if (item?.key === 'required') {
            getMandatory?.push(item?.value !== 'nullable' && item?.value === true ? true : false)
          }
          return null
        })
        return null
      })
      setMandatoryDeleteBulk(getMandatory)
    }

    setShowModalConfirmBulk(true)
    checkDeleteCustomField(params)
      .then(({data: res}: any) => {
        if (res) {
          setCheckDeleteBulk(res)
        }
      })
      .catch(() => setCheckDeleteBulk([]))
  }

  const msg_alert_bulk = messageAlertBulk(mandatoryDeleteBulk, checkDeleteBulk)

  useEffect(() => {
    getCategory({})
      .then(({data: {data: res_cat}}) => {
        setCategoryOption(res_cat)
      })
      .catch((e: any) => {
        errorExpiredToken(e)
      })
  }, [])

  const params: any = {
    page,
    limit,
    orderDir,
    keyword,
    orderCol,
    filter: {section_type: 'assets'},
  }
  const CustomFieldsAssetQuery: any = useQuery({
    queryKey: ['getDataCFAsset', {...params, reloadFieldAsset, reloadData}],
    queryFn: async () => {
      const res: any = await getCustomField(params)
      const {data: results}: any = res || {}
      const {total, from}: any = results?.meta || {}
      setTotalPage(total)
      setPageFrom(from)
      const dataRes = results?.data?.map((item: any) => {
        const {guid, name, is_required, conditions, element_type_label, element_type} = item || {}
        const cateogrys: any =
          conditions !== undefined ? conditions?.map(({name}) => name)?.join(', ') : 'All Category'
        return {
          original: item,
          guid: guid,
          checkbox: item,
          view: 'view',
          name,
          element_type_label: element_type_label || element_type,
          category_name: cateogrys || '-',
          is_required: is_required ? 'Yes' : 'No',
          edit: 'Edit',
          delete: 'Delete',
        }
      })
      return dataRes
    },
  })
  const dataCFAsset: any = CustomFieldsAssetQuery?.data || []

  const columns = [
    {header: 'Checkbox', width: '20px'},
    {header: 'View', width: '20px'},
    {header: 'Field Name', sort: true, value: 'name'},
    {header: 'Data Type', sort: true, value: 'element_type_label'},
    {header: 'Category', sort: true, value: 'category_name'},
    {header: 'Mandatory', sort: true, value: 'is_required'},
    {header: 'Edit', width: '20px'},
    {header: 'Delete', width: '20px'},
  ]

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

  const onPageChange = (e: any) => {
    setChecked([])
    setPage(e)
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
    return () => {
      ToastMessage({type: 'clear'})
    }
  }, [])

  return (
    <>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />
              <Search
                bg='solid'
                onChange={onSearch}
                resetKeyword={resetKeyword}
                setResetKeyword={setResetKeyword}
              />
            </div>
            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {checked?.length > 0 && (
                  <button
                    type='button'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      onDeleteBulk()
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}
                <button
                  className='btn btn-sm btn-primary'
                  type='button'
                  data-cy='addNewCustomField'
                  onClick={() => {
                    setCFDetail(undefined)
                    setShowModalAdd(true)
                  }}
                >
                  + Add New {label}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            loading={!CustomFieldsAssetQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataCFAsset}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={setLimit}
            onDelete={onDelete}
            onDetail={onDetail}
            onEdit={onEdit}
            onSort={onSort}
            customEmptyTable={'No Asset Custom Field Added'}
            onChecked={(e: any) => setChecked(e?.filter(({checked}: any) => checked))}
          />
        </div>
      </div>

      <AddCustomFieldAsset
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        customFieldDetail={cfDetail}
        reloadCustomField={reloadFieldAsset}
        setReloadCustomField={setReloadFieldAsset}
        category={optCategory}
        arrOption={arrOption}
        setArrayOption={setArrayOption}
      />
      <Alert
        setShowModal={setShowModalConfirmBulk}
        showModal={showModalConfirmBulk}
        type={'delete'}
        title={'Delete Selected'}
        confirmLabel={'Delete'}
        body={msg_alert_bulk}
        onConfirm={confirmDeleteBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        loading={false}
      />
      <DetailCustomField
        customFileDetail={customFileDetail}
        showModalDetail={showModalDetail}
        setShowModalDetail={setShowModalDetail}
        title={label}
        category={true}
      />
    </>
  )
}

CardCustomFieldAsset = memo(
  CardCustomFieldAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardCustomFieldAsset
