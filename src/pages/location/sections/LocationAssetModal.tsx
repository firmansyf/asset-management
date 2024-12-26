/* eslint-disable react-hooks/exhaustive-deps */
import {getAssetLocation} from '@api/Service'
import {DataTable} from '@components/datatable'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type ModalProps = {
  detailLocation: any
  showModal: any
  setShowModal: any
}

const LocationAssetModal: FC<ModalProps> = ({detailLocation, showModal, setShowModal}) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [orderCol, setOrderCol] = useState('name')
  const [orderDir, setOrderDir] = useState('asc')
  const [attachAsset, setAttachAsset] = useState([])
  const [loadingAsset, setLoadingAsset] = useState<boolean>(true)

  useEffect(() => {
    setLoadingAsset(true)
    if (showModal) {
      getAssetLocation({orderDir, orderCol, page, limit, location_guid: detailLocation?.guid})
        .then(({data: {data: res_asset, meta}}) => {
          const {current_page, total} = meta || {}
          setTotalPage(total)
          setPage(current_page)
          if (res_asset) {
            const dataAsset = res_asset?.map((res: any) => {
              const {asset_id, name} = res || {}
              return {
                asset_id: asset_id || '-',
                name: name || '-',
              }
            })
            setAttachAsset(dataAsset)
          }
          setTimeout(() => {
            setLoadingAsset(false)
          }, 800)
        })
        .catch(() => {
          setTimeout(() => {
            setLoadingAsset(false)
          }, 800)
        })
    }
  }, [showModal, orderDir, orderCol, page, limit])

  const onChangeLimit = (e: any) => {
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const columns = [
    {header: 'Asset ID', value: 'asset_id', sort: true},
    {header: 'Asset Name', value: 'name', sort: true},
  ]

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Assets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {attachAsset?.length !== 0 ? (
          <DataTable
            loading={loadingAsset}
            limit={limit}
            total={totalPage}
            data={attachAsset}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onSort={onSort}
          />
        ) : (
          <div className='text-black-400 text-center py-5'>No asset attached to this location</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LocationAssetModal
