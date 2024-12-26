/* eslint-disable react-hooks/exhaustive-deps */
import {
  cleanAssetBulkTemp,
  deleteAssetBulkTemp,
  deleteAttachAsset,
  getAssetBulkTemp,
} from '@api/Service'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {ModalAsset} from './ModalAsset'

type ModalAssetlocationProps = {
  showModal: any
  locationDetail: any
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

const AssetLocationAttach: FC<ModalAssetlocationProps> = ({
  showModal,
  locationDetail,
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

  const [to, setTo] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [from, setFrom] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [dataAsset, setDataAsset] = useState<any>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [reloadTempAsset, setReloadTempAsset] = useState<number>(0)
  const [showModalAsset, setShowModalAsset] = useState<boolean>(false)
  const [loadingDatatable, setLoadingDatatable] = useState<boolean>(true)

  useEffect(() => {
    setLoadingDatatable(true)

    showModal
      ? cleanAssetBulkTemp({type: 'location'})
          .then(({data: {data: res}}: any) => {
            res && setLoadingDatatable(false)
          })
          .catch(() => setTimeout(() => setLoadingDatatable(false), 800))
      : setLoadingDatatable(true)
  }, [])

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original} = ticked || {}
        const {guid} = original || {}
        ar_guid.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onDeleteExistingAsset = (e: any) => {
    if (locationDetail) {
      deleteAttachAsset(locationDetail?.guid, e?.guid).then(({data: {message}}: any) => {
        const total_data_page: number = totalPageExistingAsset - pageFrom
        if (total_data_page - 1 <= 0) {
          setPageExistingAsset(pageExistingAsset - 1)
        } else {
          setPageExistingAsset(pageExistingAsset)
        }
        setReloadExistingAsset(reloadExistingAsset + 1)
        ToastMessage({type: 'success', message})
      })
    }
  }

  const deletSelectedTemp = useCallback(() => {
    setLoadingDatatable(true)
    deleteAssetBulkTemp({type: 'location', guids: dataChecked})
      .then(({status, data: {message}}: any) => {
        if (status === 200) {
          ToastMessage({message, type: 'success'})
          setTimeout(() => {
            const crn_page: number = to - from + 1

            setDataChecked([])
            setLoadingDatatable(false)
            setReloadTempAsset(reloadTempAsset + 1)
            setPage(crn_page - dataChecked?.length === 0 ? page - 1 : page)
          }, 800)
        }
      })
      .catch(({response}: any) => {
        setLoadingDatatable(false)
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [dataChecked, from, page, reloadTempAsset, to])

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  const onChangeLimitExistingAsset = (e: any) => {
    setDataChecked([])
    setPageExistingAsset(1)
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
      setLoadingDatatable(true)
      const params: any = {page, limit, orderCol, orderDir}
      getAssetBulkTemp(params, 'location')
        .then(({data: {data: res_assets, meta}}: any) => {
          const {total, current_page, from, to}: any = meta || {}

          if (res_assets) {
            const dataAsset: any = []
            res_assets?.forEach((res: any) => {
              const {asset_id, name, category}: any = res || {}
              const {name: category_name}: any = category || {}

              dataAsset.push({
                checkbox: res,
                asset_id: asset_id || '-',
                name: name || '-',
                category: category_name || '-',
                original: res,
              })
            })
            setDataAsset(dataAsset as never[])
          }
          setTo(to)
          setFrom(from)
          setTotalPage(total)
          setPage(current_page)
          setTimeout(() => setLoadingDatatable(false), 800)
        })
        .catch(() => setTimeout(() => setLoadingDatatable(false), 800))
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
                id: 'LIST_OF_EXISTING_ASSETS_THAT_ASSIGNED_IN_THIS_LOCATION',
              })}
            </p>
          </div>

          <div className='card card-custom card-table'>
            <div className='table-responsive' style={{marginTop: '10px'}}>
              <DataTable
                page={pageExistingAsset}
                limit={limitExistingAsset}
                data={attachExistingAsset}
                columns={columns_existing}
                onSort={onSortExistingAsset}
                loading={loadingExistingAsset}
                total={totalPageExistingAsset}
                onDelete={onDeleteExistingAsset}
                customEmptyTable='No Asset Added'
                onChangeLimit={onChangeLimitExistingAsset}
                onChangePage={(e: any) => setPageExistingAsset(e)}
              />
            </div>
          </div>
        </div>
      )}

      <div className='row mt-5'>
        <div className='col-md-8 mt-4'>
          <p>
            {intl.formatMessage({
              id: 'LIST_OF_ASSETS_THAT_ASSIGNED_IN_THIS_LOCATION',
            })}
          </p>
        </div>

        <div className='col-md-4 mt-4 text-end'>
          <p>
            <span>{dataChecked?.length || 0}</span> asset selected
          </p>
        </div>

        <div className='col-12 mb-5'>
          <ModalAsset
            showModal={showModalAsset}
            reloadTempAsset={reloadTempAsset}
            setShowModalAsset={setShowModalAsset}
            setReloadTempAsset={setReloadTempAsset}
          />

          {dataChecked?.length > 0 && (
            <button
              type='button'
              data-cy='bulkDelete'
              style={{float: 'right'}}
              onClick={deletSelectedTemp}
              className='btn btn-sm btn-danger me-2 mt-4'
            >
              <span className='indicator-label'>Delete Selected</span>
            </button>
          )}
        </div>
        <div className='card card-custom card-table'>
          <div className='table-responsive' style={{marginTop: '10px'}}>
            <DataTable
              limit={limit}
              onSort={onSort}
              data={dataAsset}
              total={totalPage}
              columns={columns}
              onChecked={onChecked}
              loading={loadingDatatable}
              onChangeLimit={onChangeLimit}
              customEmptyTable='No Asset Added'
              onChangePage={(e: any) => setPage(e)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const AddLocationAsset = memo(
  AssetLocationAttach,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddLocationAsset
