/* eslint-disable react-hooks/exhaustive-deps */
import './custom.css'

import {AccordionAddButton} from '@components/AccordionAddButton'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageSubTitle} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getCannedResponse} from '@pages/help-desk/canned-response/Service'
import parse from 'html-react-parser'
import {keyBy, mapValues} from 'lodash'
import {FC, Fragment, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {useParams} from 'react-router-dom'

import ApprovalTicket from './form/ApprovalTicket'
import AsigneTicket from './form/AsigneTicket'
import {ConvertToForum} from './form/ConvertToForum'
import ResolverTicket from './form/ResolverTicket'
import ForumLinks from './sections/ForumLinks'
import TicketAssetLinked from './sections/TicketAssetLinked'
import {TicketCannedForms} from './sections/TicketCannedForms'
import TicketComment from './sections/TicketComment'
import TicketFiles from './sections/TicketFiles'
import TicketGeneral from './sections/TicketGeneral'
import TicketEmail from './sections/TicketInteraction'
import TicketLinks from './sections/TicketLinks'
import TicketRequest from './sections/TicketRequest'
import TicketSendEmail from './sections/TicketSendEmail'
import TicketTimeLog from './sections/TicketTimeLog'
import TicketToDo from './sections/TicketToDo'
import {getTicketDetail} from './Service'

const TicketDetail: FC<any> = () => {
  const params: any = useParams()
  const {preference: preferenceStore, currentUser: user}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {feature}: any = preferenceStore || {}

  const [classBar, setClassBar] = useState<any>('')
  const [isFeature, setFeature] = useState<any>({})
  const [ticketGuid, setTicketGuid] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [dataMessage, setdataMessage] = useState<any>('')
  const [detailTicket, setDetailTicket] = useState<any>({})
  const [reloadLinked, setReloadLinked] = useState<any>([])
  const [reloadAll, setReloadAll] = useState<boolean>(false)
  const [reloadTicket, setReloadTicket] = useState<number>(1)
  const [reloadSendEmail, setReloadSendEmail] = useState<any>([])
  const [dataCannedResponse, setCannedResponse] = useState<any>([])
  const [showModalAsigne, setShowModalAsigne] = useState<boolean>(false)
  const [loadingTextEditor, setLoadingTextEditor] = useState<boolean>(false)
  const [showModalApproval, setShowModalApproval] = useState<boolean>(false)
  const [showModalResolver, setShowModalResolver] = useState<boolean>(false)
  const [showModalSendEmail, setShowModalSendEmail] = useState<boolean>(false)
  const [showModalConvertToForum, setShowModalConvertToForum] = useState<boolean>(false)
  const [classBarCannedForms, setClassBarCannedForms] = useState<any>('')

  const submitCannedResponse = (response: any) => {
    setLoadingTextEditor(true)
    setTimeout(() => setLoadingTextEditor(false), 1700)
    setdataMessage(dataMessage + '  ' + (response || ''))
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 3000)

    getCannedResponse({}).then(({data: {data: res}}: any) => {
      res && setCannedResponse(res as never[])
    })
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeature(mapValues(resObj, 'value'))
    }
  }, [feature])

  useEffect(() => {
    const {guid} = params || {}
    if (guid !== ticketGuid) {
      setTicketGuid(guid)
    }
  }, [params])

  useEffect(() => {
    setLoading(true)
    ticketGuid !== undefined
      ? getTicketDetail(ticketGuid)
          .then(({data: {data: res}}: any) => {
            res && setDetailTicket(res)
            setTimeout(() => setLoading(false), 800)
          })
          .catch(() => setTimeout(() => setLoading(false), 800))
      : setTimeout(() => setLoading(false), 800)
  }, [reloadTicket, reloadAll, ticketGuid])

  if (loading) {
    return (
      <div data-cy='detail-loading'>
        <PageTitle breadcrumbs={[]}>Detail</PageTitle>
        <PageSubTitle title='Details of ticket' />
        <PageLoader />
      </div>
    )
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{detailTicket?.name || 'Detail'}</PageTitle>
      <PageSubTitle title={`Details of ${detailTicket?.ticket_id || 'ticket'}`} />

      <div className='row'>
        <div className='col-md-8 position-relative'>
          <div className='card'>
            <div className='card-body align-items-center p-0'>
              <TicketEmail
                classBar={classBar}
                reloadAll={reloadAll}
                setClassBar={setClassBar}
                dataMessage={dataMessage}
                reloadTicket={reloadTicket}
                setReloadAll={setReloadAll}
                detailTicket={detailTicket}
                setdataMessage={setdataMessage}
                setReloadTicket={setReloadTicket}
                loadingTextEditor={loadingTextEditor}
                setShowModalAsigne={setShowModalAsigne}
                classBarCannedForms={classBarCannedForms}
                setShowModalSendEmail={setShowModalSendEmail}
                setClassBarCannedForms={setClassBarCannedForms}
                setShowModalConvertToForum={setShowModalConvertToForum}
              />
            </div>
          </div>

          <TicketComment detailTicket={detailTicket} user={user} reloadAll={reloadAll} />
        </div>

        <div className='col-md-4'>
          <TicketGeneral detailTicket={detailTicket} loading={loading} />
          <TicketRequest detailTicket={detailTicket} loading={loading} />
          <TicketLinks detailTicket={detailTicket} />
          <ForumLinks detailTicket={detailTicket} />
          {isFeature?.asset_linked === 1 && (
            <TicketAssetLinked
              detailTicket={detailTicket}
              setReload={setReloadLinked}
              reload={reloadLinked}
            />
          )}
          <TicketFiles detailTicket={detailTicket} />
          <TicketToDo detailTicket={detailTicket} />
          <TicketTimeLog detailTicket={detailTicket} user={user} />
        </div>
      </div>

      <div id='seconddiv' className={'card card-custom card-table ' + classBar}>
        <div className='card-table-header' style={{position: 'initial'}}>
          <span>Canned Response</span>
          <a href='#' onClick={() => setClassBar('')}>
            <i className='las la-times' style={{float: 'right', fontSize: '18px'}}></i>
          </a>
        </div>

        <div className='card-body mt-5'>
          {dataCannedResponse && dataCannedResponse?.length > 0 && (
            <AccordionAddButton
              id='canned_reponse'
              default='canned_reponse'
              style={{
                overflowY: 'scroll',
                height: '60vh',
              }}
            >
              {dataCannedResponse?.map((item: any, index: number) => {
                const indexKey: number = index + 1
                return (
                  <Fragment key={indexKey}>
                    <div
                      className='d-flex'
                      data-value={`${item?.guid || ''}`}
                      data-label={`${item?.name || ''}`}
                      data-body={`${item?.message || ''}`}
                      data-addAction={submitCannedResponse}
                    >
                      <div className='row'>
                        <div className='col-12'>{parse(`${item?.message || ''}`)}</div>
                      </div>
                    </div>
                  </Fragment>
                )
              })}
            </AccordionAddButton>
          )}
        </div>
      </div>

      <TicketSendEmail
        detailTicket={detailTicket}
        showModal={showModalSendEmail}
        reloadSendEmail={reloadSendEmail}
        setShowModal={setShowModalSendEmail}
        setReloadSendEmail={setReloadSendEmail}
      />

      <AsigneTicket
        showModal={showModalAsigne}
        reloadTicket={reloadTicket}
        ticketDetail={detailTicket}
        setShowModal={setShowModalAsigne}
        setReloadTicket={setReloadTicket}
      />

      <ApprovalTicket
        reloadTicket={reloadTicket}
        ticketDetail={detailTicket}
        showModal={showModalApproval}
        setReloadTicket={setReloadTicket}
        setShowModal={setShowModalApproval}
      />

      <ResolverTicket
        reloadTicket={reloadTicket}
        ticketDetail={detailTicket}
        showModal={showModalResolver}
        setReloadTicket={setReloadTicket}
        setShowModal={setShowModalResolver}
      />

      <ConvertToForum
        detailTicket={detailTicket}
        showModal={showModalConvertToForum}
        setShowModal={setShowModalConvertToForum}
      />

      <TicketCannedForms
        dataMessage={dataMessage}
        setdataMessage={setdataMessage}
        classBarCannedForms={classBarCannedForms}
        setLoadingTextEditor={setLoadingTextEditor}
        setClassBarCannedForms={setClassBarCannedForms}
      />
    </>
  )
}

export default TicketDetail
