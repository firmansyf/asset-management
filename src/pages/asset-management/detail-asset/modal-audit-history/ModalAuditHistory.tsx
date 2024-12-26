import Tooltip from '@components/alert/tooltip'
import {preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, memo, useState} from 'react'
import {Modal} from 'react-bootstrap'

import ModalLocationAudit from './ModalLocationAudit'

const ModalAuditHistory: FC<any> = ({showModal, setShowModal, detail}) => {
  const {audits} = detail
  const pref_date_time: any = preferenceDateTime()
  const [showModaLoc, setShowModalLoc] = useState(false)
  const [isLat, setIsLat] = useState<any>()
  const [isLng, setIsLng] = useState<any>()
  return (
    <>
      <Modal
        dialogClassName='modal-lg modal-dialog-centered'
        show={showModal}
        onHide={() => {
          setShowModal(false)
        }}
      >
        <Modal.Header>
          <Modal.Title>Audit History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {audits?.length > 0 && (
            <table className='table w-full table-sm table-striped table-hover m-0 gx-3 border rounded overflow-hidden'>
              <tr className=''>
                <th className='fw-bolder bg-primary text-white text-uppercase fs-7'>
                  Date and Time
                </th>
                <th className='fw-bolder bg-primary text-white text-uppercase fs-7'>Auditor</th>
                <th className='fw-bolder bg-primary text-white text-uppercase fs-7'>Remarks</th>
                <th className='fw-bolder bg-primary text-white text-uppercase fs-7'>Location</th>
              </tr>
              {Array.isArray(audits) &&
                audits?.map(({audit_at, audit_by, note, lng, lat}: any, index: number) => {
                  const {first_name, last_name} = audit_by
                  return (
                    <tr key={index}>
                      <td className='p-2 border'>
                        {audit_at !== null && audit_at !== undefined
                          ? moment(audit_at).format(pref_date_time)
                          : '-'}
                      </td>
                      <td className='p-2'>{`${first_name} ${last_name}`}</td>
                      <td className='p-2'>{note || '- '}</td>
                      <td className='p-2 d-flex align-items-center'>
                        <b>Lat:</b> {lat}, <b>Lang: </b> {lng}
                        <Tooltip placement='right' title='View'>
                          <div
                            className='mx-2 d-flex align-items-center'
                            style={{
                              height: 30,
                              border: 'none',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              setShowModalLoc(true)
                              setIsLat(lat)
                              setIsLng(lng)
                            }}
                          >
                            <i className='las la-eye fs-1' />
                          </div>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
            </table>
          )}

          {audits?.length < 1 && <div className='text-center'>No Changes</div>}
        </Modal.Body>
        <Modal.Footer>
          <div
            className='btn btn-sm btn-primary'
            onClick={() => {
              setShowModal(false)
            }}
          >
            Cancel
          </div>
        </Modal.Footer>
      </Modal>

      <ModalLocationAudit
        showModal={showModaLoc}
        setShowModal={setShowModalLoc}
        isLat={isLat}
        isLang={isLng}
      />
    </>
  )
}

const ModalAudit = memo(
  ModalAuditHistory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalAudit
