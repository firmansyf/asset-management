import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {KTSVG} from '@helpers'
import {getAssetSelectedInsurancePolicies} from '@pages/insurance/policies/Service'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'

let ModalAssets: FC<any> = (props: any) => {
  const [showModal, setShowModal] = useState(false)
  const [assetData, setAssetData] = useState<any>({})
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [orderCol, setOrderCol] = useState('asset_name')
  const [orderDir, setOrderDir] = useState('asc')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setShowModal(props.show)
  }, [props.show])

  useEffect(() => {
    setLoading(true)
    const {paramGuid} = props || {}
    const {guid} = paramGuid || {}

    getAssetSelectedInsurancePolicies(guid, {page, limit, keyword, orderDir, orderCol})
      .then(({data: {data: res, meta}}: any) => {
        const {total} = meta || {}
        setTotalPage(total)
        if (res) {
          const data = res?.map((asset_polices: any) => {
            const {asset_id, asset_name} = asset_polices || {}
            return {
              original: asset_polices,
              view: 'view',
              asset_id,
              asset_name,
            }
          })
          setAssetData(data)
        }
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
      .catch(() => {
        setTimeout(() => {
          setLoading(false)
        }, 800)
      })
  }, [props, page, limit, keyword, orderDir, orderCol])

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const closeModal = () => {
    setShowModal(false)
    props.setShow && props.setShow(false)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onDetail = (e: any) => {
    const {asset_guid} = e || {}

    window.open(`/asset-management/detail/${asset_guid}`, '_blank')
  }

  const columns = useMemo(
    () => [
      {header: 'View', width: '20px'},
      {header: 'Asset ID', value: 'asset_id', sort: true},
      {header: 'Asset Name', value: 'asset_name', sort: true},
    ],
    []
  )
  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>Assets</Modal.Title>
      </Modal.Header>
      <Modal.Body className='pb-0'>
        <div className='card card-custom card-table mb-5'>
          <div className='my-5 mx-5 border-bottom border-1 border-bottom-solid'>
            <div className='d-flex flex-wrap flex-stack mb-5'>
              <div className='d-flex align-items-center position-relative me-4 my-1'>
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
              loading={loading}
              limit={limit}
              total={totalPage}
              data={assetData}
              columns={columns}
              onChangePage={onPageChange}
              onChangeLimit={onChangeLimit}
              onSort={onSort}
              onDetail={onDetail}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={closeModal}>
          Close
        </div>
      </Modal.Footer>
    </Modal>
  )
}
ModalAssets = memo(ModalAssets)

let Assets: FC<any> = ({paramGuid, reloadAsset}) => {
  const [showModal, setShowModal] = useState(false)
  const [dataAsset, setDataAsset] = useState<any>({})
  const {guid} = paramGuid || {}

  useEffect(() => {
    getAssetSelectedInsurancePolicies(guid, {})
      .then(({data: {data: res}}) => {
        setDataAsset(res)
      })
      .catch(() => '')
  }, [guid, reloadAsset])

  return (
    <div className='card border border-2'>
      <div className='card-header align-items-center px-4'>
        <h3 className='card-title fw-bold fs-3 m-0'>Assets</h3>
      </div>
      <div className='card-body align-items-center py-2'>
        {dataAsset && dataAsset?.length > 0 ? (
          <div className='row mb-3'>
            {dataAsset?.map((e: any, index: number) => {
              if (index < 5) {
                return (
                  <div
                    className='col-md-12 py-2 border-bottom border-1 border-bottom-solid'
                    key={index}
                  >
                    <Link
                      target={'_blank'}
                      to={`/asset-management/detail/${e?.asset_guid}`}
                      className='link-primary'
                    >
                      <div className='link-primary'>
                        {`${e?.asset_id} - ${e?.asset_name}` || '-'}
                      </div>
                    </Link>
                  </div>
                )
              }
              return null
            })}
          </div>
        ) : (
          <div className='row'>
            <div className='col-md-12'>
              <div className='mx-auto my-5' style={{textAlign: 'center', padding: '50px 0px'}}>
                <img
                  src={'/media/svg/others/no-data.png'}
                  style={{opacity: 0.2}}
                  className='w-auto h-50px'
                  alt=''
                />
                <p className='mt-3'>Attachment asset is empty</p>
              </div>
            </div>
          </div>
        )}

        {dataAsset?.length > 5 && (
          <a
            href='##'
            className='btn btn-primary ps-3 pe-3 py-1 mb-2'
            onClick={() => setShowModal(true)}
            style={{fontSize: '12px'}}
          >
            <i className='fas fa-arrow-circle-right'></i> More Assets
          </a>
        )}
      </div>
      <ModalAssets show={showModal} paramGuid={paramGuid} setShow={() => setShowModal(false)} />
    </div>
  )
}

Assets = memo(Assets)
export {Assets}
