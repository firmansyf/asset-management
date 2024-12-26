/* eslint-disable react-hooks/exhaustive-deps */

import {getAssetLocation, storeAssetBulkTemp} from '@api/Service'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {Select as SelectAjax} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {getCategory} from '@pages/setup/settings/categories/redux/CategoryCRUD'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

interface AssetLocation {
  showModal?: boolean
  setShowModalAsset?: any
  setReloadTempAsset?: any
  reloadTempAsset: any
}

let ModalAsset: FC<AssetLocation> = ({
  showModal,
  setShowModalAsset,
  setReloadTempAsset,
  reloadTempAsset,
}) => {
  const [_meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>()
  const [dataAssets, setDataAssets] = useState<any>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [categoryId, setCategoryId] = useState<string>('')
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [loadingAsset, setLoadingAsset] = useState<boolean>(false)
  const [loadingDatatable, setLoadingDatatable] = useState<boolean>(true)

  const categoryChange = (guid: any) => {
    setCategoryId(guid !== null ? guid : '')
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original}: any = ticked || {}
        const {guid}: any = original || {}
        ar_guid.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const handleSubmit = () => {
    setLoadingAsset(true)
    if (dataChecked && dataChecked?.length > 0) {
      storeAssetBulkTemp({type: 'location', guids: dataChecked}).then(({data: {message}}: any) => {
        onHide()
        setLoadingAsset(false)
        setReloadTempAsset(reloadTempAsset + 1)
        ToastMessage({message, type: 'success'})
      })
    } else {
      setLoadingAsset(false)
      ToastMessage({
        type: 'error',
        message: 'At least select one Asset for add to list.',
      })
    }
  }

  const onHide = () => {
    setPage(1)
    setLimit(10)
    setKeyword('')
    setTotalPage(0)
    setShowModalAsset(false)
  }

  const onSelectUser = () => {
    setShowModalAsset(true)
  }

  useEffect(() => {
    if (showModal) {
      const params: any = {
        page,
        limit,
        keyword,
        orderCol,
        orderDir,
        location_guid: '',
        category_guid: categoryId,
        exclude_temp_location: 1,
      }

      setLoadingDatatable(true)
      getAssetLocation(params)
        .then(({data: {data: res, meta: metas}}: any) => {
          const {current_page, total}: any = metas || {}
          if (res) {
            const dataAsset: any = []
            res?.forEach((res: any) => {
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
            setDataAssets(dataAsset as never[])
          }

          setMeta(metas)
          setTotalPage(total)
          setPage(current_page)
          setTimeout(() => setLoadingDatatable(false), 800)
        })
        .catch(() => setTimeout(() => setLoadingDatatable(false), 800))
    }
  }, [page, limit, keyword, orderCol, orderDir, showModal, categoryId])

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'Asset ID', value: 'asset_id', sort: true},
    {header: 'Asset Name', value: 'name', sort: true},
    {header: 'Asset Category', value: 'category_name', sort: true},
  ]

  return (
    <>
      <button
        type='button'
        data-cy='addUser'
        onClick={() => onSelectUser()}
        className='btn btn-sm btn-primary mt-4'
      >
        + Select Assets
      </button>

      <Modal dialogClassName='modal-lg' show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select Assets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='card card-custom card-table'>
            <div className='card-header'>
              <div className='d-flex flex-wrap flex-stack'>
                <div style={{zIndex: 10, width: '200px', marginRight: '10px'}}>
                  <SelectAjax
                    sm={true}
                    api={getCategory}
                    params={{}}
                    reload={false}
                    name='category'
                    className='col p-0'
                    // defaultValue={false}
                    placeholder='Choose Category'
                    onChange={(e: any) => categoryChange(e?.value)}
                    parse={({guid, name}: any) => ({value: guid, label: name})}
                  />
                </div>

                <div className='d-flex align-items-center position-relative'>
                  <KTSVG
                    path='/media/icons/duotone/General/Search.svg'
                    className='svg-icon-3 position-absolute ms-3'
                  />
                  <Search bg='solid' onChange={onSearch} />
                </div>
              </div>
            </div>
            <div className='card-body'>
              <DataTable
                limit={limit}
                onSort={onSort}
                total={totalPage}
                data={dataAssets}
                columns={columns}
                onChecked={onChecked}
                loading={loadingDatatable}
                onChangeLimit={onChangeLimit}
                onChangePage={(e: any) => setPage(e)}
                customEmptyTable={
                  (dataAssets?.length === 0 && categoryId) || keyword
                    ? 'No Result Found'
                    : 'No Asset Added'
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='submit'
            id='isBtn-user'
            variant='primary'
            className='btn-sm'
            onClick={handleSubmit}
            disabled={loadingAsset}
          >
            {!loadingAsset && <span className='indicator-label'>Add to List</span>}
            {loadingAsset && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
          <Button className='btn-sm' variant='secondary' onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

ModalAsset = memo(
  ModalAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {ModalAsset}
