import {Title} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageSubTitle} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useParams} from 'react-router-dom'

import {getDetailPO} from '../Services'
import ApprovalNegotiation from './action-form/ApprovalNegotiation'
import DeliveryCheckForm from './action-form/DeliveryCheckForm'
import Negotiation from './action-form/NegotiationForm'
import PaymentForm from './action-form/PaymentForm'
import PurchaseOrderForm from './action-form/PurchaseOrderForm'
import {Actions} from './section/actions'
import {GeneralPO} from './section/generalDetail'
import {SecondGeneral} from './section/secondGeneral'

const DetailPO: FC = () => {
  const params: any = useParams()
  const {guid}: any = params || {}

  const [reloadPODetail, setReloadPODetail] = useState<number>(1)
  const [showModalPayment, setShowModalPayment] = useState<boolean>(false)
  const [showModalPOStatus, setShowModalPOStatus] = useState<boolean>(false)
  const [showModalCheckOrder, setShowModalCheckOrder] = useState<boolean>(false)
  const [showModalNegotiation, setShowModalNegotiation] = useState<boolean>(false)
  const [showModalApprovalNegotiation, setShowModalApprovalNegotiation] = useState<boolean>(false)

  const detailPOQuery: any = useQuery({
    queryKey: ['getDetailPO', {guid, reloadPODetail}],
    queryFn: async () => {
      if (guid) {
        const res: any = await getDetailPO(guid)
        const dataResult: any = res?.data?.data
        return dataResult
      } else {
        return {}
      }
    },
  })
  const detailPO: any = detailPOQuery?.data || {}

  const changePurchaseOrderStatus = (po_status: any) => {
    switch (po_status) {
      case 'Pending Approval RO':
        return setShowModalPOStatus(true)
      case 'Rejected':
        return setShowModalPOStatus(true)
      case 'Negotiation':
      case 'Negotation RO':
        return setShowModalNegotiation(true)
      case 'Pending Negotation RO':
        return setShowModalApprovalNegotiation(true)
      case 'Rejected Negotiation':
        return setShowModalPOStatus(true)
      case 'Purchase Order':
        return setShowModalPOStatus(true)
      case 'On Delivery':
        return setShowModalCheckOrder(true)
      case 'Delivery Checked':
        return setShowModalPayment(true)
      default:
        return false
    }
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{detailPO?.name || 'Detail Purchase Order'}</PageTitle>
      <PageSubTitle title={`Details of Purchase Order ${detailPO?.po_id || 'Purchase Order'}`} />
      {!detailPOQuery?.isFetched ? (
        <PageLoader />
      ) : (
        <div className='row'>
          <div className='col'>
            <div className='card'>
              <div className='card-header'>
                <div className='d-flex w-100 justify-content-between align-items-center'>
                  <Actions
                    detailPO={detailPO}
                    reloadPODetail={reloadPODetail}
                    setReloadPODetail={setReloadPODetail}
                  />

                  <div>
                    <Button
                      type='submit'
                      className='btn btn-sm btn-primary'
                      onClick={() => changePurchaseOrderStatus(detailPO?.status?.alias)}
                    >
                      {detailPO?.status?.name === 'Delivery Checked'
                        ? 'Payment'
                        : detailPO?.status?.name || 'Status'}
                    </Button>
                  </div>
                </div>

                <div className='d-flex text-dark-400 w-100 fs-4'>Purchase Order Information</div>
                <Title title='General' sticky={false} className='my-2' />
              </div>

              <div className='card-body'>
                <GeneralPO detail={detailPO} />
                <SecondGeneral data={detailPO} />
              </div>
            </div>
          </div>
        </div>
      )}

      <PurchaseOrderForm
        detailPO={detailPO}
        reloadPO={reloadPODetail}
        showModal={showModalPOStatus}
        setReloadPO={setReloadPODetail}
        setShowModal={setShowModalPOStatus}
      />

      <DeliveryCheckForm
        detailPO={detailPO}
        reloadPO={reloadPODetail}
        showModal={showModalCheckOrder}
        setReloadPO={setReloadPODetail}
        setShowModal={setShowModalCheckOrder}
      />

      <PaymentForm
        detailPO={detailPO}
        reloadPO={reloadPODetail}
        showModal={showModalPayment}
        setReloadPO={setReloadPODetail}
        setShowModal={setShowModalPayment}
      />

      <Negotiation
        detail={detailPO}
        reloadPO={reloadPODetail}
        setReloadPO={setReloadPODetail}
        showModal={showModalNegotiation}
        setShowModal={setShowModalNegotiation}
      />

      <ApprovalNegotiation
        detailPO={detailPO}
        reloadPO={reloadPODetail}
        setReloadPO={setReloadPODetail}
        showModal={showModalApprovalNegotiation}
        setShowModal={setShowModalApprovalNegotiation}
      />
    </>
  )
}

export default DetailPO
