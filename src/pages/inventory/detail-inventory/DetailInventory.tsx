/* eslint-disable react-hooks/exhaustive-deps */
import 'react-loading-skeleton/dist/skeleton.css'

import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageSubTitle} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {getDatabaseInventory} from '@pages/setup/databases/Serivce'
import {useQuery} from '@tanstack/react-query'
import cx from 'classnames'
import {FC, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate, useParams} from 'react-router-dom'

import {getDetailInventory, printInventory} from '../redux/InventoryCRUD'
import {AddStock} from './AddStock'
import {HistoryStock} from './HistoryStock'
import {RemoveStock} from './RemoveStock'
import {Actions} from './sections/actions'
import {Cards} from './sections/cards'
import {Comment} from './sections/comment'
import {Delete as DeleteInventory} from './sections/delete'
import {Files} from './sections/files'
import {General} from './sections/general'
import {Quantity} from './sections/quantity'
import {Reservation} from './sections/reservation'
import {StockDetail} from './sections/stockDetail'
import {SendEmail} from './SendEmail'

const InventoryDetail: FC<any> = () => {
  const location: any = useLocation()
  const navigate = useNavigate()
  const params: any = useParams()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}

  const [showModalSendEmail, setShowModalSendEmail] = useState<boolean>(false)
  const [showModalRemoveStock, setShowModalRemoveStock] = useState<boolean>(false)
  const [showModalHistoryStock, setShowModalHistoryStock] = useState<boolean>(false)
  const [showModalAddStock, setShowModalAddStock] = useState<boolean>(false)
  const [reload, setReload] = useState<any>([])
  const [reloadReservation, setReloadReservation] = useState<number>(0)
  const [tab, setTab] = useState<string>('general')
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [inventoryGuid, setInventoryGuid] = useState<string>()
  const [inventoryName, setInventoryName] = useState<string>()
  const [pagePermission, setPagePermission] = useState<boolean>(true)

  const optDatabaseQuery: any = useQuery({
    queryKey: ['getDatabaseInventory', {pagePermission}],
    queryFn: async () => {
      const {guid} = params || {}
      if (guid && pagePermission) {
        const res: any = await getDatabaseInventory({})
        const dataResult: any = res?.data?.data as never[]
        return dataResult as never[]
      } else {
        return []
      }
    },
  })
  const optDatabase: any = optDatabaseQuery?.data || []

  const detailInventoryQuery: any = useQuery({
    queryKey: [
      'getDetailInventory',
      {pagePermission, reload, reloadReservation, guid: params?.guid},
    ],
    queryFn: async () => {
      const {guid} = params || {}
      if (guid && pagePermission) {
        const res: any = await getDetailInventory(guid)
        const dataResult: any = res?.data?.data || {}
        return dataResult || {}
      } else {
        return {}
      }
    },
  })
  const detailInventory: any = detailInventoryQuery?.data || []
  const loading: any = !detailInventoryQuery?.isFetched

  const onPrintInventory = () => {
    const {guid} = params || {}

    printInventory(guid)
      .then(({data: res}) => {
        const {message, url} = res || {}

        if (url !== '') {
          window.open(url, '_blank')
          ToastMessage({message: message || 'Success : ', type: 'success'})
        }
      })
      .catch(({response}) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onDelete = () => {
    if (detailInventory) {
      const {guid, inventory_name} = detailInventory || {}
      setInventoryName(inventory_name)
      setInventoryGuid(guid)
      setShowModalConfirm(true)
      ToastMessage({type: 'clear'})
    }
  }

  useEffect(() => {
    if (Object.keys(feature)?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'inventory')
        ?.map((feature: any) => setPagePermission(feature?.value === 0 ? false : true))
    }
  }, [feature])

  useEffect(() => {
    setTab(location?.hash ? location?.hash?.split('#')[1] : 'general')
  }, [location?.hash])

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {detailInventory?.inventory_name || 'Detail Inventory'}
      </PageTitle>
      <PageSubTitle title={`Details of ${detailInventory?.inventory_idno || 'inventory'}`} />
      {loading ? (
        <PageLoader />
      ) : (
        <>
          {!pagePermission ? (
            <Forbidden />
          ) : (
            <>
              <Actions
                data={detailInventory}
                setShowModal={setShowModalSendEmail}
                setShowModalRemoveStock={setShowModalRemoveStock}
                setShowModalHistoryStock={setShowModalHistoryStock}
                onPrintInventory={onPrintInventory}
                setShowModalAddStock={setShowModalAddStock}
                reloadReservation={reloadReservation}
                setReloadReservation={setReloadReservation}
                onDelete={onDelete}
              />
              <Cards data={detailInventory} loading={loading} />

              <div className='row'>
                <div className='col-md-8'>
                  <div className='card border border-2'>
                    <div className='card-header align-items-center px-4'>
                      <h3 className='card-title fw-bold fs-3 m-0' data-cy='card-title'>
                        Inventory Information
                      </h3>
                    </div>

                    <div className='card-body align-items-center p-0'>
                      <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                        <li className='nav-item'>
                          <div
                            className={cx(
                              'm-0 px-5 py-3 cursor-pointer',
                              tab === 'general' && 'bg-primary border-primary text-white fw-bolder'
                            )}
                            onClick={() => {
                              navigate({...location, hash: 'general'}, {replace: true})
                              setTab('general')
                            }}
                          >
                            Inventory Detail
                          </div>
                        </li>

                        <li className='nav-item'>
                          <div
                            className={cx(
                              'm-0 px-5 py-3 cursor-pointer',
                              tab === 'quantity' && 'bg-primary border-primary text-white fw-bolder'
                            )}
                            data-cy='btnQuantity'
                            onClick={() => {
                              navigate({...location, hash: 'quantity'}, {replace: true})
                              setTab('quantity')
                            }}
                          >
                            Quantity by Location
                          </div>
                        </li>

                        <li className='nav-item'>
                          <div
                            className={cx(
                              'm-0 px-5 py-3 cursor-pointer',
                              tab === 'reservation' &&
                                'bg-primary border-primary text-white fw-bolder'
                              // { active: tab === m.key }
                            )}
                            data-cy='btnReservation'
                            onClick={() => {
                              navigate({...location, hash: 'reservation'}, {replace: true})
                              setTab('reservation')
                            }}
                          >
                            Reservation
                          </div>
                        </li>

                        <li className='nav-item'>
                          <div
                            className={cx(
                              'm-0 px-5 py-3 cursor-pointer',
                              tab === 'stock-detail' &&
                                'bg-primary border-primary text-white fw-bolder'
                            )}
                            data-cy='btnStockDetail'
                            onClick={() => {
                              navigate({...location, hash: 'stock-detail'}, {replace: true})
                              setTab('stock-detail')
                            }}
                          >
                            Stock Detail
                          </div>
                        </li>
                      </ul>
                      <div className='tab-content'>
                        <div
                          className={cx(
                            'tab-pane fade',
                            {show: tab === 'general'},
                            {active: tab === 'general'}
                          )}
                        >
                          {loading ? (
                            <>
                              <div className='mt-3'>&nbsp;</div>
                              <PageLoader />
                            </>
                          ) : (
                            <General data={detailInventory} />
                          )}
                        </div>

                        <div
                          className={cx(
                            'tab-pane fade',
                            {show: tab === 'quantity'},
                            {active: tab === 'quantity'}
                          )}
                        >
                          {loading ? (
                            <>
                              <div className='mt-3'>&nbsp;</div>
                              <PageLoader />
                            </>
                          ) : (
                            <Quantity data={detailInventory} reload={reloadReservation} />
                          )}
                        </div>

                        <div
                          className={cx(
                            'tab-pane fade',
                            {show: tab === 'reservation'},
                            {active: tab === 'reservation'}
                          )}
                        >
                          <Reservation
                            data={detailInventory}
                            reloadReservation={reloadReservation}
                            setReloadReservation={setReloadReservation}
                          />
                        </div>

                        <div
                          className={cx(
                            'tab-pane fade',
                            {show: tab === 'stock-detail'},
                            {active: tab === 'stock-detail'}
                          )}
                        >
                          {loading ? (
                            <PageLoader />
                          ) : (
                            <StockDetail detail={detailInventory} reload={reload} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <Files data={detailInventory} />
                  <Comment data={detailInventory} />
                </div>
              </div>

              <SendEmail
                showModal={showModalSendEmail}
                setShowModal={setShowModalSendEmail}
                reloadSendEmail={reload}
                setReloadSendEmail={setReload}
                detailInventory={detailInventory}
              />

              <RemoveStock
                showModal={showModalRemoveStock}
                setShowModal={setShowModalRemoveStock}
                reloadRemoveStock={reload}
                setReloadRemoveStock={setReload}
                detailInventory={detailInventory}
                optDatabase={optDatabase}
              />

              <AddStock
                showModal={showModalAddStock}
                setShowModal={setShowModalAddStock}
                reloadAddStock={reload}
                setReloadAddStock={setReload}
                detailInventory={detailInventory}
                optDatabase={optDatabase}
              />

              <HistoryStock
                reload={reload}
                showModal={showModalHistoryStock}
                setShowModal={setShowModalHistoryStock}
                detailInventory={detailInventory}
              />

              <DeleteInventory
                showModal={showModalConfirm}
                setShowModal={setShowModalConfirm}
                setReloadInventory={setReload}
                reloadInventory={reload}
                inventoryGuid={inventoryGuid}
                inventoryName={inventoryName}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

export default InventoryDetail
