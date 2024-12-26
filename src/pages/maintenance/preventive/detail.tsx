import {PageLoader} from '@components/loader/cloud'
import {useQuery} from '@tanstack/react-query'
import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {getDetailPreventive} from '../Service'
type DetailPreventiveProps = {
  detailPreventive: any
  showDetail: any
  setShowDetail: any
}

let ModalDetailPreventive: FC<DetailPreventiveProps> = ({
  detailPreventive,
  showDetail,
  setShowDetail,
}) => {
  const detailPreventiveQuery: any = useQuery({
    queryKey: ['getDetailPreventive', {guid: detailPreventive?.guid}],
    queryFn: async () => {
      if (detailPreventive?.guid) {
        const res: any = await getDetailPreventive(detailPreventive?.guid)
        const dataResult: any = res?.data?.data
        return dataResult
      } else {
        return {}
      }
    },
  })

  const data: any = detailPreventiveQuery?.data || {}

  return (
    <Modal dialogClassName='modal-md' show={showDetail} onHide={() => setShowDetail(false)}>
      <Modal.Header>
        <Modal.Title>Preventive Maintenance Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detailPreventiveQuery?.isFetched ? (
          <div className='row'>
            <div className='col-md-12'>
              <label htmlFor='name' className='mb-2'>
                Preventive Maintenance Name
              </label>
              <p>
                <strong>{data?.name || '-'}</strong>
              </p>
            </div>
            <div className='col-md-12'>
              <label htmlFor='name' className='mb-2'>
                Work Order Name
              </label>
              <p>
                <a
                  href={
                    data?.maintenance_guid !== undefined && data?.maintenance_guid !== null
                      ? `/maintenance/work-order/detail/${data?.maintenance_guid}`
                      : 'javascript:void(0)'
                  }
                >
                  {data?.wo_title || '-'}
                </a>
              </p>
            </div>
          </div>
        ) : (
          <PageLoader height={250} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowDetail(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalDetailPreventive = memo(
  ModalDetailPreventive,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalDetailPreventive
