/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useEffect, useState} from 'react'

import AddEditCustomField from '../component/AddEditCustomFiled'
import {headerColumn, messageAlertBulk} from '../component/CustomFieldHelpers'
import DetailCustomField from '../component/DetailCustomFiled'
import {
  checkDeleteCustomField,
  deleteBulkCustomField,
  getCustomField,
} from '../redux/ReduxCustomField'

let CardCustomFieldWarranty: FC<any> = ({
  onDelete,
  setReloadData,
  reloadData,
  checked,
  setChecked,
  totalPage,
  setTotalPage,
  resetKeyword,
  setResetKeyword,
  pageFrom,
  setPageFrom,
  page,
  setPage,
}) => {
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [orderCol, setOrderCol] = useState<string>('name')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [cfDetail, setCFDetail] = useState<any>()
  const [keyword, setKeyword] = useState<any>('')
  const [limit, setLimit] = useState<number>(10)
  const [showModalConfirmBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [customFileDetail, setCustomFileDetail] = useState<any>()
  const [checkDeleteBulk, setCheckDeleteBulk] = useState<any>({})
  const [mandatoryDeleteBulk, setMandatoryDeleteBulk] = useState<any>([])

  const label: string = 'Custom Field Warranty'
  const section_type: string = 'warranty'

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onPageChange = (e: any) => {
    setChecked([])
    setPage(e)
  }

  const onDetail = (e: any) => {
    setCustomFileDetail(e)
    setShowModalDetail(true)
  }

  const onEdit = (e: any) => {
    setCFDetail(e)
    setShowModalAdd(true)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const confirmDeleteBulk = () => {
    const guids = checked?.map(({guid}: any) => guid)
    deleteBulkCustomField({guids, section_type})
      .then(({data: {message}}: any) => {
        ToastMessage({message: message, type: 'success'})
        setShowModalConfirmBulk(false)
        setReloadData(reloadData + 1)
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
        setShowModalConfirmBulk(false)
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
      })
  }

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

  const params: any = {
    page,
    limit,
    orderDir,
    orderCol,
    keyword,
    filter: {section_type: 'warranty'},
  }
  const CustomFieldsWarrantyQuery: any = useQuery({
    queryKey: ['getDataCFWarranty', {...params, reloadData, setReloadData}],
    queryFn: async () => {
      const res: any = await getCustomField(params)
      const {data: results}: any = res || {}
      const {total, from}: any = results?.meta || {}
      setTotalPage(total)
      setPageFrom(from)
      const dataRes = results?.data.map((item: any) => {
        const {guid, name, is_required, element_type_label} = item || {}
        return {
          original: item,
          guid: guid,
          checkbox: 'checkbox',
          view: 'view',
          name,
          element_type_label: element_type_label || '-',
          is_required: is_required ? 'Yes' : 'No',
          edit: 'Edit',
          delete: 'Delete',
        }
      })
      return dataRes
    },
  })
  const dataCFWarranty: any = CustomFieldsWarrantyQuery?.data || []

  const columns: any = headerColumn() || {}

  useEffect(() => {
    if (resetKeyword) {
      onSearch('')
      setResetKeyword(false)
    }
  }, [resetKeyword])

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
            page={page}
            loading={!CustomFieldsWarrantyQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataCFWarranty}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={setLimit}
            onDelete={onDelete}
            onDetail={onDetail}
            onEdit={onEdit}
            onSort={onSort}
            onChecked={(e: any) => setChecked(e.filter(({checked}: any) => checked))}
            customEmptyTable={'No Warranty Custom Field Added'}
          />
        </div>
      </div>

      <AddEditCustomField
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        customFieldDetail={cfDetail}
        reloadCustomField={reloadData}
        setReloadCustomField={setReloadData}
        sectionType={section_type}
        formTitle={label}
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
        category={false}
      />
    </>
  )
}

CardCustomFieldWarranty = memo(
  CardCustomFieldWarranty,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CardCustomFieldWarranty
