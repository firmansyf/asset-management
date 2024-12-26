import {getAssetLocation} from '@api/Service'
import {Title as CardTitle} from '@components/form/Title'
import size from 'lodash/size'
import {FC, useEffect, useState} from 'react'
import {Table} from 'react-bootstrap'

import LocationAssetModal from './LocationAssetModal'

const LocationAssets: FC<any> = ({detailLocation, reloadLocation}) => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [orderCol] = useState('name')
  const [orderDir] = useState('asc')
  const [attachAsset, setAttachAsset] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (detailLocation?.guid !== undefined) {
      getAssetLocation({orderDir, orderCol, page, limit, location_guid: detailLocation?.guid})
        .then(({data: {data: res_asset, meta}}) => {
          const {current_page, per_page} = meta || {}
          setPage(current_page)
          setLimit(per_page)
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
        })
        .catch(() => '')
    }
  }, [reloadLocation, detailLocation?.guid, page, limit, orderDir, orderCol])

  return (
    <div className='card border border-gray-300'>
      <div className='card-header align-items-center px-4'>
        <CardTitle title='Assets' sticky={false} />
      </div>
      <div className='card-body align-items-center px-4 py-3'>
        {size(attachAsset) !== 0 ? (
          <>
            <Table bordered responsive='md' data-cy='assetsTable'>
              <thead>
                <tr className='border-bottom border-primary'>
                  <th className='fw-bold fs-5'>Asset ID</th>
                  <th className='fw-bold fs-5'>Asset Name</th>
                </tr>
              </thead>
              <tbody>
                {size(attachAsset) > 0 &&
                  attachAsset?.map((custom: any, index: any) => {
                    if (index <= 4) {
                      return (
                        <tr key={index} className='border-bottom mt-15 mb-15'>
                          <td>{custom.asset_id}</td>
                          <td>{custom.name}</td>
                        </tr>
                      )
                    } else {
                      return false
                    }
                  })}
              </tbody>
            </Table>
            {size(attachAsset) > 5 && (
              <div>
                <u
                  className='cursor-pointer text-primary fw-bold'
                  onClick={() => setShowModal(true)}
                >
                  Show More
                </u>
              </div>
            )}
          </>
        ) : (
          <div className='text-black-400 text-center py-5'>No asset attached to this location</div>
        )}

        <LocationAssetModal
          detailLocation={detailLocation}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </div>
    </div>
  )
}

export default LocationAssets
