import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {deleteBulkCategory, deleteCategory, getCategory} from '@pages/wizards/redux/WizardService'
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'

type Props = {
  setDetailCategory: any
  reloadCategory: any
  setShowModalCategory: any
  handleShowToast?: any
}

let Step4: FC<Props> = ({setDetailCategory, reloadCategory, setShowModalCategory}) => {
  const intl = useIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingTable, setLoadingTable] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any[]>([])
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [dataCategory, setDataCategory] = useState<any[]>([])
  const [categoryname, setCategoryName] = useState<any>(false)
  const [category_guid, setCategoryGuid] = useState<any>(false)
  const [reloadDelete, setReloadDelete] = useState<number>(1)

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderCol, setOrderCol] = useState<string>('name')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [meta, setMeta] = useState<any>()
  const [totalPerPage, setTotalPerPage] = useState<number>(0)

  useEffect(() => {
    setLoadingTable(true)
    getCategory({page, limit, orderCol, orderDir})
      .then(({data: {data: result, meta}}: any) => {
        const {current_page, per_page, total}: any = meta || {}
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)
        setLimit(per_page)
        setMeta(meta || {})
        if (result) {
          const data = result?.map((res: any) => {
            const {name}: any = res || {}
            return {
              checkbox: res,
              name: name || '-',
              edit: 'Edit',
              delete: 'Delete',
              original: res,
            }
          })
          setDataChecked([])
          setLoadingTable(false)
          setTotalPerPage(result?.length || 0)
          setDataCategory(data as never[])
        }
      })
      .catch(() => setLoadingTable(false))
  }, [page, limit, reloadCategory, reloadDelete, orderCol, orderDir])

  const confirmDeleteCategory = useCallback(() => {
    setLoading(true)
    deleteCategory(category_guid).then(({status, data: {message}}: any) => {
      if (status === 200) {
        setDataChecked([])
        ToastMessage({message, type: 'success'})
        setTimeout(() => {
          setLoading(false)
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
        }, 1000)
      }
    })
  }, [category_guid, reloadDelete])

  const msg_alert: any = [
    'Are you sure you want to delete ',
    <strong key='location_name'>{categoryname || '-'}</strong>,
    '?',
  ]

  const msg_alert_bulk: any = [
    'Are you sure you want to delete ',
    <strong key='total_category'>{dataChecked?.length || 0}</strong>,
    ' category data?',
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onEdit = (e: any) => {
    setDetailCategory(e)
    setShowModalCategory(true)
  }

  const onDelete = (e: any) => {
    const {guid, name} = e || {}
    setCategoryGuid(guid || '')
    setCategoryName(name || '')
    setShowModalConfirm(true)
  }

  const onDeletedChecked = useCallback(() => {
    deleteBulkCategory({guids: dataChecked})
      .then(({data: {message}}) => {
        setDataChecked([])
        setShowModalConfirmBulk(false)
        setReloadDelete(reloadDelete + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch((error: any) => {
        const {response}: any = error || {}
        const {status, data}: any = response || {}
        const {data: data_response}: any = data || {}
        const {reason}: any = data_response || {}

        if (reason && status === 400) {
          setShowModalConfirmBulk(true)
          ToastMessage({type: 'error', message: reason || ''})
        }
      })
  }, [reloadDelete, dataChecked])

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid} = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columns = useMemo<any>(
    () => [
      {header: 'checkbox', width: '20px'},
      {header: 'Category', value: 'name', sort: true},
      {
        header: 'Edit',
        width: '20px',
      },
      {
        header: 'Delete',
        width: '20px',
      },
    ],
    []
  )

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [meta, totalPerPage])

  return (
    <>
      <div className='w-100 mb-10' data-cy='wizardStep4'>
        <div className='form-row'>
          <div className='pb-lg-12'>
            <div className='row'>
              <h3 data-cy='headerWizardStep4' className='fw-bolder text-dark'>
                {intl.formatMessage({id: 'LIST_OF_CATEGORIES'})}
              </h3>
            </div>

            <div className='text-black-600 fs-6'>
              <p data-cy='descHeader1Category' className='mb-0'>
                {intl.formatMessage({
                  id: 'ADD_CATEGORY_HERE_WE_HAVE_PROVIDED_COMMONLY_USED_CATEGORIES_FOR_YOU',
                })}
              </p>

              <p data-cy='descHeader2Category' className='mb-0'>
                {intl.formatMessage({
                  id: 'MAKE_THEM_AS_BROAD_OR_AS_SPECIFIC_AS_YOU_WANT_CUSTOMISE_TO_YOUR_SPECIFIC_NEEDS',
                })}
              </p>
            </div>
          </div>

          <div className=''>
            <div className='d-flex justify-content-between pb-5'>
              <div>
                {dataChecked?.length > 0 && (
                  <button
                    type='button'
                    data-cy='btnBulkDelete'
                    className='btn btn-danger me-2'
                    onClick={() => setShowModalConfirmBulk(true)}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                <button
                  type='button'
                  className='btn btn-primary'
                  data-cy='btn-add-new-category'
                  onClick={() => {
                    setDetailCategory(null)
                    setShowModalCategory(true)
                  }}
                >
                  <span className='indicator-label'>+ Add New Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='w-md-50'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            columns={columns}
            total={totalPage}
            data={dataCategory}
            onDelete={onDelete}
            onChecked={onChecked}
            loading={loadingTable}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            customEmptyTable='No Categories Added'
          />
        </div>
      </div>

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Category'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteCategory()}
        onCancel={() => setShowModalConfirm(false)}
      />

      <Alert
        loading={loading}
        type={'bulk delete'}
        body={msg_alert_bulk}
        confirmLabel={'Delete'}
        title={'Delete Category'}
        showModal={showModalBulk}
        onConfirm={() => onDeletedChecked()}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
      />
    </>
  )
}

Step4 = memo(Step4, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Step4}
