/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {hasPermission} from '@helpers'
import {getTags} from '@pages/help-desk/tags/core/service'
import AddContact from '@pages/user-management/contact/AddContact'
import {FC, useEffect, useState} from 'react'
// import {Button} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

// import ModalProcessLog from './TicketProcessLog'
import AddEditTicket from '../form/AddEditTicket'
import {
  deleteTicket,
  getDatabaseTicket,
  printTicket,
  updateArchive,
  updateBookmark,
  updateFlag,
  updatePending,
  updateSpam,
} from '../Service'
import ValidationSchema from '../ValidationSchema'
import {ActionWatcher} from './ActionWatcher'
import ModalExecuteScenario from './TicketExecuteScenario'

type ActionProps = {
  setShowModalEmail: any
  detailTicket: any
  setReloadTicket: any
  reloadTicket: any
  onScenarioExecuted: any
  setShowModalAsigne?: any
  setShowModalConvertToForum: any
}

const TicketActions: FC<ActionProps> = ({
  setShowModalEmail,
  detailTicket,
  setReloadTicket,
  reloadTicket,
  onScenarioExecuted,
  setShowModalAsigne,
  setShowModalConvertToForum,
}) => {
  const {guid}: any = detailTicket || {}
  const navigate: any = useNavigate()

  const [dataTags, setDataTag] = useState<any>([])
  const [checkType, setCheckType] = useState<any>([])
  const [flagSpam, setFlagSpam] = useState<any>(false)
  const [flagTicket, setFlagTicket] = useState<any>('0')
  const [loading, setLoading] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [contactDetail, setContactDetail] = useState<any>()
  const [ticketSchema, setTicketSchema] = useState<any>([])
  const [stopContinue, setStopContinue] = useState<any>('0')
  const [checkPriority, setCheckPriority] = useState<any>([])
  const [includePrint, setIncludePrint] = useState<any>(false)
  const [reloadTags, setReloadTags] = useState<boolean>(false)
  const [reloadContact, setReloadContact] = useState<number>(0)
  const [bookmarkTicket, setBookmarkTicket] = useState<any>('0')
  const [archiveTicket, setArchiveTicket] = useState<any>(false)
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [printLoading, setPrintLoading] = useState<boolean>(false)
  const [showModalPrint, setShowModalPrint] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [showModalContact, setShowModalContact] = useState<boolean>(false)
  const [otherReportChanel, setOtherReportChanel] = useState<boolean>(false)
  const [showModalExecuteScenario, setShowModalExecuteScenario] = useState<boolean>(false)

  const ticketEditPermission: any = hasPermission('help-desk.ticket.edit') || false
  const ticketDeletePermission: any = hasPermission('help-desk.ticket.delete') || false

  const confirmDeleteLocation = () => {
    setLoading(true)
    deleteTicket(guid)
      .then(({data: {message}}: any) => {
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          setLoading(false)
          setRedirect(true)
          setShowModalDelete(false)
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response || {}
        ToastMessage({type: 'error', message})
      })
  }

  const handlePrint = () => {
    setShowModalPrint(true)
    setIncludePrint(0)
  }

  const print = () => {
    setPrintLoading(true)
    printTicket(guid, {include_interaction: includePrint ? 1 : 0})
      .then(({data: {url, message}}: any) => {
        setPrintLoading(false)
        setShowModalPrint(false)
        ToastMessage({type: 'success', message})

        window.open(url, '_blank')
      })
      .catch(({response}: any) => {
        setPrintLoading(false)
        if (response) {
          const {devMessage, data, message}: any = response?.data || {}
          const {fields}: any = data || {}
          if (!devMessage) {
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields && Object.keys(fields || {})?.length > 0) {
              Object.keys(fields || {})?.map((item: any) => {
                ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                return true
              })
            }
          }
        }
      })
  }

  const onEdit = () => {
    setShowModalAdd(true)
  }

  const handleBookmark = () => {
    const value: any = bookmarkTicket === 1 ? 0 : 1
    const params: any = {is_star: value}
    updateBookmark(params, guid)
      .then(({data: {message}}: any) => {
        setBookmarkTicket(value)
        setReloadTicket(reloadTicket + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        // setBookmarkLoading(false)
        const {data, message}: any = response?.data || {}
        const {fields}: any = data || {}
        if (fields !== undefined) {
          const error: any = fields || []
          for (const key in error) {
            const value = error?.[key]
            ToastMessage({type: 'error', message: value?.[0]})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  const handleFlag = () => {
    const value: any = flagTicket === 1 ? 0 : 1
    const params: any = {is_flag: value}
    updateFlag(params, guid)
      .then(({data: {message}}: any) => {
        setFlagTicket(value)
        setReloadTicket(reloadTicket + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        // setStopContinueLoading(false)
        const {data, message}: any = response?.data || {}
        const {fields}: any = data || {}
        const error: any = fields || {}

        if (fields !== undefined) {
          for (const key in error) {
            const value: any = error?.[key] || []
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  const handelSpam = () => {
    const value: any = flagSpam === 1 ? 0 : 1
    const params: any = {is_spam: value}
    updateSpam(params, guid)
      .then(({data: {message}}: any) => {
        setFlagSpam(value)
        setReloadTicket(reloadTicket + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        const {data, message}: any = response?.data || {}
        const {fields}: any = data || {}
        const error: any = fields || {}

        if (fields !== undefined) {
          for (const key in error) {
            const value: any = error?.[key] || []
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  const handelArchive = () => {
    const value: any = archiveTicket === 1 ? 0 : 1
    const params: any = {is_archive: value}
    updateArchive(params, guid)
      .then(({data: {message}}: any) => {
        setArchiveTicket(value)
        setReloadTicket(reloadTicket + 1)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        const {data, message}: any = response?.data || {}
        const {fields}: any = data || {}
        const error: any = fields || {}

        if (fields !== undefined) {
          for (const key in error) {
            const value: any = error?.[key] || []
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  const handleStopContinue = () => {
    const value: any = stopContinue === 1 ? 0 : 1
    const params: any = {is_pending: value}
    updatePending(params, guid)
      .then(({data: {message}}: any) => {
        const messageValidation: any = stopContinue === 0 ? 'change to be Pending' : 'continue'
        const messageData: any = message?.replace('update pending', messageValidation)
        ToastMessage({type: 'success', message: messageData})
        setReloadTicket(reloadTicket + 1)
        setStopContinue(value)
      })
      .catch(({response}: any) => {
        const {data, message}: any = response?.data || {}
        const {fields}: any = data || {}
        const error: any = fields || {}

        if (fields !== undefined) {
          for (const key in error) {
            const value: any = error?.[key] || []
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  useEffect(() => {
    getDatabaseTicket({}).then(({data: {data: result}}) => {
      if (result) {
        result
          ?.filter((set_database: {field: any}) => set_database?.field === 'type_guid')
          ?.map((database: any) => setCheckType(database))
        result
          ?.filter((set_database: {field: any}) => set_database?.field === 'priority_guid')
          ?.map((database: any) => setCheckPriority(database))
      }
    })
  }, [])

  useEffect(() => {
    const {is_star, is_flag, is_spam, is_archive, is_pending}: any = detailTicket || {}
    setBookmarkTicket(is_star)
    setFlagTicket(is_flag)
    setFlagSpam(is_spam)
    setArchiveTicket(is_archive)
    setStopContinue(is_pending)
  }, [detailTicket])

  useEffect(() => {
    getTags({}).then(({data: {data: res}}: any) => {
      const data_tag: any = res?.map(({guid, name}: any) => {
        return {
          value: guid,
          label: name,
        }
      })
      setDataTag(data_tag)
    })
  }, [reloadTags])

  useEffect(() => {
    redirect && navigate(`/help-desk/ticket/`)
  }, [redirect])

  return (
    <>
      <Dropdown
        className='btn btn-outline btn-outline-primary btn-sm col-12 col-lg-auto p-0'
        style={{height: '35px'}}
      >
        <Dropdown.Toggle
          variant='light-primary'
          size='sm'
          id='dropdown-basic'
          style={{height: '30px', background: '#fff'}}
        >
          <i className='fa-solid fa-bars ms-1 btn-outline-icon'></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {detailTicket?.is_pending === 0 && detailTicket?.status_name === 'To Do' && (
            <Dropdown.Item
              href='#'
              data-cy='assigneeTicket'
              onClick={() => setShowModalAsigne(true)}
            >
              To Do
            </Dropdown.Item>
          )}

          {flagSpam === 0 && (
            <>
              <Dropdown.Item href='#' data-cy='btnReservation' onClick={handleBookmark}>
                {bookmarkTicket === 1 ? 'Unbookmark' : 'Bookmark'}
              </Dropdown.Item>
              <Dropdown.Item href='#' data-cy='btnHistorystock' onClick={handleFlag}>
                {flagTicket === 1 ? 'Unflag' : 'Flag'}
              </Dropdown.Item>
            </>
          )}

          <Dropdown.Item href='#' data-cy='btnHistorystock' onClick={handelSpam}>
            {flagSpam === 0 ? 'mark as spam' : 'unmark as spam'}
          </Dropdown.Item>

          {flagSpam === 0 && (
            <>
              <Dropdown.Item href='#' data-cy='btnHistorystock' onClick={handelArchive}>
                {archiveTicket === 1 ? 'Unarchive' : 'Archive'}
              </Dropdown.Item>
              <Dropdown.Item href='#' data-cy='btnHistorystock' onClick={handlePrint}>
                Print
              </Dropdown.Item>
              {ticketEditPermission && (
                <Dropdown.Item href='#' data-cy='btnHistorystock' onClick={onEdit}>
                  Edit
                </Dropdown.Item>
              )}
            </>
          )}

          {ticketDeletePermission && (
            <Dropdown.Item
              href='#'
              data-cy='btnHistorystock'
              onClick={() => setShowModalDelete(true)}
            >
              Delete
            </Dropdown.Item>
          )}

          {flagSpam === 0 && (
            <Dropdown.Item
              href='#'
              data-cy='btnReservation'
              onClick={() => setShowModalEmail(true)}
            >
              Email
            </Dropdown.Item>
          )}

          <Dropdown.Item href='#' data-cy='btnHistorystock' onClick={handleStopContinue}>
            {stopContinue === 1 ? 'Continue Ticket' : 'Pending'}
          </Dropdown.Item>

          <Dropdown.Item href='#' onClick={() => setShowModalExecuteScenario(true)}>
            Execute Scenario
          </Dropdown.Item>
          <Dropdown.Item href='#' onClick={() => setShowModalConvertToForum(true)}>
            Convert to Forum
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Alert
        setShowModal={setShowModalPrint}
        showModal={showModalPrint}
        loading={printLoading}
        body={
          <div className='form-check form-check-custom form-check-solid'>
            <input
              type='checkbox'
              id='includePrint'
              className='form-check-input me-2'
              onChange={() => setIncludePrint(!includePrint)}
            />
            <span className='m-0'>
              Do you want to print ticket include interaction on ticket ?*
            </span>
          </div>
        }
        type={'print'}
        title={'Print Ticket'}
        confirmLabel={'Yes'}
        onConfirm={print}
        onCancel={() => setShowModalPrint(false)}
      />

      <Alert
        type={'delete'}
        loading={loading}
        title={'Delete Ticket'}
        confirmLabel={'Delete'}
        showModal={showModalDelete}
        onConfirm={confirmDeleteLocation}
        setShowModal={setShowModalDelete}
        onCancel={() => setShowModalDelete(false)}
        body={
          <p className='m-0'>
            Are you sure you want to delete <strong>{detailTicket?.name || '-'}</strong> ?
          </p>
        }
      />

      <ActionWatcher guid={detailTicket?.guid} />

      {/* <ModalProcessLog
        guid={guid}
        showModal={showModalProcessLog}
        reloadProcessLog={reloadProcessLog}
        setShowModal={setShowModalProcessLog}
      /> */}

      <ModalExecuteScenario
        guid={guid}
        onSuccess={onScenarioExecuted}
        showModal={showModalExecuteScenario}
        setShowModal={setShowModalExecuteScenario}
      />

      <ValidationSchema
        checkPriority={checkPriority}
        setTicketSchema={setTicketSchema}
        otherReportChanel={otherReportChanel}
      />

      <AddEditTicket
        dataTags={dataTags}
        checkType={checkType}
        showModal={showModalAdd}
        setTypeDetail={undefined}
        reloadTicket={reloadTicket}
        ticketDetail={detailTicket}
        ticketSchema={ticketSchema}
        setShowModalType={undefined}
        checkPriority={checkPriority}
        setReloadTags={setReloadTags}
        setShowModal={setShowModalAdd}
        setReloadTicket={setReloadTicket}
        setContactDetail={setContactDetail}
        otherReportChanel={otherReportChanel}
        setShowModalContact={setShowModalContact}
        setOtherReportChanel={setOtherReportChanel}
      />

      <AddContact
        reloadTags={reloadTags}
        showModal={showModalContact}
        contactDetail={contactDetail}
        reloadContact={reloadContact}
        setReloadTags={setReloadTags}
        setShowModal={setShowModalContact}
        setReloadContact={setReloadContact}
      />
    </>
  )
}

export default TicketActions
