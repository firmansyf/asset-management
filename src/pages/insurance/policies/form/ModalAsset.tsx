/* eslint-disable react-hooks/exhaustive-deps */

import {storeAssetBulkTemp} from '@api/Service'
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {Select as SelectAjax} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {getCategory} from '@pages/setup/settings/categories/redux/CategoryCRUD'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {getAssetInsurancePolicies} from '../Service'

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
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>()
  const [dataAssets, setDataAssets] = useState<any>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('asset_id')
  const [loadingAsset, setLoadingAsset] = useState<boolean>(false)
  const [loadingDatatable, setLoadingDatatable] = useState<boolean>(true)
  const [categoryId, setCategoryId] = useState<string>('')

  const categoryChange = (guid: any) => {
    if (guid !== null) {
      setCategoryId(guid)
    } else {
      setCategoryId('')
    }
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setLimit(e)
    setPage(1)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ck: any) => {
      const {checked} = ck || {}
      if (checked) {
        const {original}: any = ck
        const {guid}: any = original || {}
        ar_guid.push(guid)
      }
    })
    setDataChecked(ar_guid)
  }

  const handleSubmit = () => {
    setLoadingAsset(true)
    if (dataChecked && dataChecked?.length > 0) {
      storeAssetBulkTemp({type: 'insurance_policy', guids: dataChecked})
        .then((data: any) => {
          setReloadTempAsset(reloadTempAsset + 1)
          setLoadingAsset(false)
          onHide()
          const {data: response}: any = data || {}
          ToastMessage({message: response?.message, type: 'success'})
        })

        .catch(() => '')
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
        insurance_guid: 'null',
        category_guid: categoryId,
        exclude_temp_policy: 1,
      }
      setLoadingDatatable(true)
      getAssetInsurancePolicies(params)
        .then(({data: {data: res, meta: metas}}: any) => {
          const {current_page, total}: any = metas || {}
          const newLimit: number = limit || 10
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
            setDataAssets(dataAsset)
          }
          setLimit(newLimit)
          setPage(current_page)
          setTotalPage(total)
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
        data-cy='addUser'
        className='btn btn-sm btn-primary mt-4'
        type='button'
        onClick={() => {
          onSelectUser()
        }}
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
                    className='col p-0'
                    name='category'
                    api={getCategory}
                    params={{}}
                    reload={false}
                    placeholder='Choose Category'
                    onChange={(e: any) => categoryChange(e?.value)}
                    parse={(e: any) => {
                      return {
                        value: e?.guid,
                        label: e?.name,
                      }
                    }}
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
                total={totalPage}
                data={dataAssets}
                columns={columns}
                onChangePage={(e: any) => {
                  setPage(e)
                }}
                customEmptyTable={
                  (dataAssets?.length === 0 && categoryId) || keyword
                    ? 'No Result Found'
                    : 'No Asset Added'
                }
                onChangeLimit={onChangeLimit}
                onChecked={onChecked}
                onSort={onSort}
                loading={loadingDatatable}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            disabled={loadingAsset}
            id='isBtn-user'
            className='btn-sm'
            type='submit'
            variant='primary'
            onClick={handleSubmit}
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
