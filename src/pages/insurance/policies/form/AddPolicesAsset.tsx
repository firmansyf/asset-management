/* eslint-disable react-hooks/exhaustive-deps */
import {cleanAssetBulkTemp, deleteAssetBulkTemp, getAssetBulkTemp} from '@api/Service'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {deleteAttachAssetInsurance} from '../Service'
import {ModalAsset} from './ModalAsset'

type ModalAssetlocationProps = {
  showModal: any
  policyDetail: any
  attachExistingAsset: any
  formEdit: any
  setLimitExistingAsset: any
  limitExistingAsset: any
  totalPageExistingAsset: any
  setPageExistingAsset: any
  pageExistingAsset: any
  setOrderDirExistingAsset: any
  orderDirExistingAsset: any
  setOrderColExistingAsset: any
  loadingExistingAsset: any
  reloadExistingAsset: any
  setReloadExistingAsset: any
  pageFrom: any
}

const AssetPoliceAttach: FC<ModalAssetlocationProps> = ({
  showModal,
  policyDetail,
  attachExistingAsset,
  formEdit,
  setLimitExistingAsset,
  limitExistingAsset,
  totalPageExistingAsset,
  setPageExistingAsset,
  pageExistingAsset,
  setOrderDirExistingAsset,
  orderDirExistingAsset,
  setOrderColExistingAsset,
  loadingExistingAsset,
  reloadExistingAsset,
  setReloadExistingAsset,
  pageFrom,
}) => {
  const intl: any = useIntl()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [totalPage, setTotalPage] = useState<number>(0)

  const [dataChecked, setDataChecked] = useState<any>([])
  const [loadingDatatable, setLoadingDatatable] = useState<boolean>(true)
  const [dataAsset, setDataAsset] = useState<any>([])
  const [from, setFrom] = useState<number>(0)
  const [to, setTo] = useState<number>(0)

  const [showModalAsset, setShowModalAsset] = useState<boolean>(false)
  const [reloadTempAsset, setReloadTempAsset] = useState<number>(0)

  useEffect(() => {
    if (showModal) {
      const params = {type: 'insurance_policy'}
      setLoadingDatatable(true)
      cleanAssetBulkTemp(params)
        .then(({data: {data: res}}) => {
          if (res) {
            setLoadingDatatable(false)
          }
        })
        .catch(() => {
          setTimeout(() => {
            setLoadingDatatable(false)
          }, 800)
        })
    }
  }, [])

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked} = ck || {}
      if (checked) {
        const {original} = ck || {}
        const {guid} = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid)
  }

  const onDeleteExistingAsset = (e: any) => {
    if (policyDetail) {
      deleteAttachAssetInsurance(policyDetail?.guid, e?.asset_guid)
        .then(({data: {message}}: any) => {
          const total_data_page: number = totalPageExistingAsset - pageFrom
          if (total_data_page - 1 <= 0) {
            setPageExistingAsset(pageExistingAsset - 1)
          } else {
            setPageExistingAsset(pageExistingAsset)
          }
          setReloadExistingAsset(reloadExistingAsset + 1)
          ToastMessage({type: 'success', message})
        })
        .catch(() => '')
    }
  }

  const deletSelectedTemp = useCallback(() => {
    setLoadingDatatable(true)
    deleteAssetBulkTemp({type: 'insurance_policy', guids: dataChecked})
      .then((res: any) => {
        if (res.status === 200) {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setTimeout(() => {
            const crn_page: number = to - from + 1
            if (crn_page - dataChecked?.length === 0) {
              setPage(page - 1)
            } else {
              const newPage: number = page || 1
              setPage(newPage)
            }
            setLoadingDatatable(false)
            setDataChecked([])
            setReloadTempAsset(reloadTempAsset + 1)
          }, 800)
        }
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
        setLoadingDatatable(false)
      })
  }, [dataChecked, from, page, reloadTempAsset, to])

  const onChangeLimit = (e: any) => {
    setPage(1)
    setDataChecked([])
    setLimit(e)
  }

  const onChangeLimitExistingAsset = (e: any) => {
    setPageExistingAsset(1)
    setDataChecked([])
    setLimitExistingAsset(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onSortExistingAsset = (value: any) => {
    setOrderColExistingAsset(value)
    setOrderDirExistingAsset(orderDirExistingAsset === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    if (showModal) {
      const params = {page, limit, orderCol, orderDir}
      setLoadingDatatable(true)
      getAssetBulkTemp(params, 'insurance_policy')
        .then(({data: {data: res_assets, meta}}) => {
          const {total, current_page, from, to} = meta || {}
          const newLimit: number = limit || 10
          if (res_assets) {
            const dataAsset: any = []
            res_assets?.forEach((res: any) => {
              const {asset_id, name, category} = res || {}
              const {name: category_name} = category || {}
              dataAsset.push({
                checkbox: res,
                asset_id: asset_id || '-',
                name: name || '-',
                category: category_name || '-',
                original: res,
              })
            })
            setDataAsset(dataAsset)
          }
          setTotalPage(total)
          setPage(current_page)
          setLimit(newLimit)
          setFrom(from)
          setTo(to)
          setTimeout(() => {
            setLoadingDatatable(false)
          }, 800)
        })
        .catch(() => {
          setTimeout(() => {
            setLoadingDatatable(false)
          }, 800)
        })
    }
  }, [page, limit, orderCol, orderDir, showModal, reloadTempAsset])

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'Asset ID', value: 'asset_id', sort: true},
    {header: 'Asset Name', value: 'name', sort: true},
    {header: 'Asset Category', value: 'category_name', sort: true},
  ]

  const columns_existing: any = [
    {header: 'Asset ID', value: 'asset_id', sort: true},
    {header: 'Asset Name', value: 'name', sort: true},
    {header: 'Asset Category', value: 'category_name', sort: true},
    {header: 'Delete', width: '20px'},
  ]

  return (
    <>
      {formEdit && (
        <div className='row mt-5'>
          <div className='col-md-8 mb-2'>
            <p>
              {intl.formatMessage({
                id: 'LIST_OF_EXISTING_ASSETS_THAT_ASSIGNED_IN_THIS_POLICIES',
              })}
            </p>
          </div>
          <div className='card card-custom card-table'>
            <div className='table-responsive' style={{marginTop: '10px'}}>
              <DataTable
                limit={limitExistingAsset}
                total={totalPageExistingAsset}
                page={pageExistingAsset}
                data={attachExistingAsset}
                columns={columns_existing}
                onChangePage={(e: any) => {
                  setPageExistingAsset(e)
                }}
                customEmptyTable='No Asset Added'
                onChangeLimit={onChangeLimitExistingAsset}
                onDelete={onDeleteExistingAsset}
                onSort={onSortExistingAsset}
                loading={loadingExistingAsset}
              />
            </div>
          </div>
        </div>
      )}

      <div className='row mt-5'>
        <div className='col-md-8 mt-4'>
          <p>
            {intl.formatMessage({
              id: 'LIST_OF_ASSETS_THAT_ASSIGNED_IN_THIS_POLICIES',
            })}
          </p>
        </div>
        <div className='col-md-4 mt-4 text-end'>
          <p>
            <span>{dataChecked?.length}</span> asset selected
          </p>
        </div>
        <div className='col-12 mb-5'>
          <ModalAsset
            showModal={showModalAsset}
            setShowModalAsset={setShowModalAsset}
            setReloadTempAsset={setReloadTempAsset}
            reloadTempAsset={reloadTempAsset}
          />
          {dataChecked?.length > 0 && (
            <button
              data-cy='bulkDelete'
              type='button'
              className='btn btn-sm btn-danger me-2 mt-4'
              style={{float: 'right'}}
              onClick={deletSelectedTemp}
            >
              <span className='indicator-label'>Delete Selected</span>
            </button>
          )}
        </div>
        <div className='card card-custom card-table'>
          <div className='table-responsive' style={{marginTop: '10px'}}>
            <DataTable
              limit={limit}
              total={totalPage}
              data={dataAsset}
              columns={columns}
              onChangePage={(e: any) => {
                setPage(e)
              }}
              customEmptyTable='No Asset Added'
              onChangeLimit={onChangeLimit}
              onChecked={onChecked}
              onSort={onSort}
              loading={loadingDatatable}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const AddPoliceAsset = memo(
  AssetPoliceAttach,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddPoliceAsset
