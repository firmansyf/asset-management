import {SimpleLoader, TextLoader} from '@components/loader/list'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {getDocument} from '@pages/setup/insurance/claim-document/Service'
import {useQuery} from '@tanstack/react-query'
import {FC, memo, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

import {
  getDetailInsuranceClaim,
  getInsuranceAgingLog,
  getInsuranceProcessLog,
  sendBeforeReview,
  sendBeforeReview1,
} from '../Service'
import DetailInsurance from './DetailInsurance'
import DetailLink from './DetailLink'
import MandatoryDetail from './MandatoryDetail'
import ModalAgingLog from './ModalAgingLog'
import ModalApprove from './ModalApprove'
import ModalDigitalRE from './ModalDigitalRE'
import ModalGRDone from './ModalGRDone'
import ModalNoDigital from './ModalNoDigital'
import ModalProcessLog from './ModalProcessLog'
import ModalReject from './ModalReject'
import ModalRevert from './ModalRevert'
import ModalReview1 from './ModalReview1'
import ModalReview2 from './ModalReview2'
import ModalSAPLog from './ModalSAPLog'
import ModalSubmission from './ModalSubmission'
import ModalUndoGR from './ModalUndoGR'
import PostApproval from './PostApproval'
import TableDocument from './TableDocument'
import TableInvoice from './TableInvoice'
import TableRONumber from './TableRONumber'
import WidgetCommentBox from './WidgetCommentBox'

let InsuranceClaimDetail: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const params_url: any = useParams()
  const currentUser: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const permissions: any = currentUser?.permissions?.map(({name}: any) => name)

  const [users, setUsers] = useState<any>([])
  const [reload, setReload] = useState<number>(1)
  const [approvalGuid, setApprovalGuid] = useState<any>()
  const [dataAgingLog, setDataAgingLog] = useState<any>({})
  const [code_mandatory, setMandatoryCode] = useState<any>()
  const [idInsurance, setIDInsurance] = useState<string>('')
  const [dataProcessLog, setDataProcessLog] = useState<any>([])
  const [blank_mandatory, setMandatoryBlank] = useState<any>([])
  const [showModalSAPLog, setShowModalSAPLog] = useState<boolean>(false)
  const [showModalGRDone, setShowModalGrDone] = useState<boolean>(false)
  const [showModalUndoGR, setShowModalUndoGR] = useState<boolean>(false)
  const [showModalRevert, setShowModalRevert] = useState<boolean>(false)
  const [showModalReject, setShowModalReject] = useState<boolean>(false)
  const [showModalReview1, setShowModalReview1] = useState<boolean>(false)
  const [showModalReview2, setShowModalReview2] = useState<boolean>(false)
  const [showModalApprove, setShowModalApprove] = useState<boolean>(false)
  const [showModalAgingLog, setShowModalAgingLog] = useState<boolean>(false)
  const [showBlankMandatory, setShowBlankMandatory] = useState<boolean>(false)
  const [showModalDigitalRE, setShowModalDigitalRE] = useState<boolean>(false)
  const [showModalNonDigital, setShowModalNonDigital] = useState<boolean>(false)
  const [showModalSubmission, setShowModalSubmission] = useState<boolean>(false)
  const [showModalProcessLog, setShowModalProcessLog] = useState<boolean>(false)
  const [showModalUploadInvoice, setShowModalUploadInvoice] = useState<boolean>(false)

  const dataDocumentQuery: any = useQuery({
    queryKey: ['getDocumentInsuranceClaim'],
    queryFn: async () => {
      const res: any = await getDocument({limit: 1000})
      const dataResult: any = res?.data?.data || []
      return dataResult
    },
  })

  const optionDocument: any = dataDocumentQuery?.data || []

  const detailInsuranceClaimQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getDetailInsuranceClaim', {reload, params_url}],
    queryFn: async () => {
      const urlSearchParams: any = new URLSearchParams(window.location.search)
      const params_app: any = Object.fromEntries(urlSearchParams.entries())
      const {approval_id} = params_app || {}
      const {guid} = params_url || {}

      setIDInsurance(guid)
      setApprovalGuid(approval_id)
      const res: any = await getDetailInsuranceClaim(guid)
      const dataResult: any = res?.data?.data || []
      const {location} = dataResult || {}
      const {re, tm, re_digital}: any = location || {}
      const {guid: re_guid, name: re_name, email: re_email}: any = re || {}
      const {guid: tm_guid, name: tm_name, email: tm_email}: any = tm || {}
      const {
        guid: re_digital_guid,
        name: re_digital_name,
        email: re_digital_email,
      }: any = re_digital || {}
      const assign_revert: any = []
      if (re_digital_name) {
        assign_revert?.push({
          value: re_digital_guid || '',
          name: re_digital_name || '',
          revert_to: 'Digital RE',
          email: re_digital_email || '',
          label: 'Digital RE - ' + (re_digital_name || ''),
        })
      }

      if (re_name) {
        assign_revert?.push({
          value: re_guid || '',
          name: re_name || '',
          revert_to: 'Regional Engineer',
          email: re_email || '',
          label: 'Regional Engineer - ' + (re_name || ''),
        })
      }

      if (tm_name) {
        assign_revert?.push({
          value: tm_guid || '',
          name: tm_name || '',
          revert_to: 'Territory Manager',
          email: tm_email || '',
          label: 'Territory Manager - ' + (tm_name || ''),
        })
      }

      setUsers(assign_revert)
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      if (response) {
        const {devMessage, data, message} = response?.data || {}

        if (!devMessage) {
          const {fields} = data || {}

          if (fields === undefined) {
            ToastMessage({message, type: 'error'})
          }

          if (fields) {
            Object.keys(fields).forEach((item: any) => {
              ToastMessage({message: fields[item][0], type: 'error'})
              return true
            })
          }
        }
      }
    },
  })

  const detailInsuranceClaim: any = detailInsuranceClaimQuery?.data || {}
  const insuranceClaimStatus: any =
    detailInsuranceClaimQuery?.data?.insurance_claim_status?.name || ''
  const loadingPage: any = !detailInsuranceClaimQuery?.isFetched && !detailInsuranceClaim?.guid

  const checkStatus = (e: string, status: any) => e === status

  const cekConfirmSubmitReject = () => {
    const {guid}: any = params_url || {}
    sendBeforeReview({}, guid)
      .then(() => setShowModalReview2(true))
      .catch(({response}: any) => {
        const {data: res}: any = response || {}
        const {data, code}: any = res || {}
        const {blank_mandatory_fields}: any = data || {}

        if (blank_mandatory_fields || code === 'err_insurance_claim_blank_mandatory_document') {
          setMandatoryCode(code)
          setShowBlankMandatory(true)
          setMandatoryBlank(blank_mandatory_fields)
        }
      })
  }

  const cekConfirmReview1 = () => {
    const {guid}: any = params_url || {}
    sendBeforeReview1(
      {
        review_comment: '-',
        is_claimable: 0,
        review_status: 0,
      },
      guid
    )
      .then(() => setShowModalReview1(true))
      .catch(({response}: any) => {
        const {data: res}: any = response || {}
        const {data, code}: any = res || {}
        const {blank_mandatory_fields}: any = data || {}

        if (blank_mandatory_fields || code === 'err_insurance_claim_blank_mandatory_document') {
          setMandatoryCode(code)
          setShowBlankMandatory(true)
          setMandatoryBlank(blank_mandatory_fields)
        }
      })
  }

  const showProcessLog = () => {
    getInsuranceProcessLog(idInsurance).then(({data: {data: res}}: any) => {
      res && setDataProcessLog(res)
      res && setShowModalProcessLog(true)
    })
  }

  const showAgingLog = () => {
    getInsuranceAgingLog(idInsurance).then(({data: {data: res}}: any) => {
      res && setDataAgingLog(res)
      res && setShowModalAgingLog(true)
    })
  }

  // const isApproved = checkStatus('Approved')
  // const isPendingDocUpload = checkStatus('Pending Documents Upload')
  const isRejected: any = checkStatus('Rejected', insuranceClaimStatus) || false
  const isApproved: any = checkStatus('Approved', insuranceClaimStatus) || false
  const isPendingGRDone: any = checkStatus('Pending GR Done', insuranceClaimStatus) || false
  const isReverted: any = checkStatus('Reverted for Revision', insuranceClaimStatus) || false
  const isRejectClosed: any = checkStatus('rejected and closed', insuranceClaimStatus) || false
  const isReadyForReview1: any = checkStatus('Ready for Review 1', insuranceClaimStatus) || false
  const isReadyForReview2: any = checkStatus('Ready for Review 2', insuranceClaimStatus) || false
  const isReadyForApproval: any = checkStatus('Ready for Approval', insuranceClaimStatus) || false
  const isPendingInvUpload: any =
    checkStatus('Pending Invoice Upload', insuranceClaimStatus) || false
  const isApprovedClaimble: any =
    checkStatus('approved (not claimable)', insuranceClaimStatus) || false
  const isProposedToRejectAndClose: any =
    checkStatus('Proposed to Reject and Close', insuranceClaimStatus) || false

  const isEnableBtnResubmit: any = isReverted || false
  const isEnableBtnGrDone: any = isPendingGRDone || false
  const isEnableBtnReject: any = isReadyForApproval || false
  const isEnableBtnUploadInv: any = isPendingInvUpload || false
  const isEnableBtnSubmitReview: any = isReadyForReview1 || false
  const isEnableBtnApproveClaimable: any = isReadyForApproval || false
  const isEnableBtnRejectAndRevert2: any = isProposedToRejectAndClose || false
  const isEnableBtnSubmitForApproval2: any = isProposedToRejectAndClose || false
  const isEnableBtnSubmitForApproval: any = isReadyForReview2 || isRejected || false
  const isEnableBtnDigital: any = !isApproved && !isApprovedClaimble && !isRejectClosed
  const isEnableBtnRejectAndRevert: any =
    isReadyForReview2 || isRejected || isReadyForReview1 || false

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.INSURANCE.CLAIM_DETAIL'})}
      </PageTitle>

      <div>
        {!loadingPage ? (
          <div className='row mt-3'>
            <div className='mb-3 col-auto ms-n1'>
              {approvalGuid && isEnableBtnApproveClaimable && (
                <button
                  className='btn btn-sm btn-success m-1'
                  onClick={() => setShowModalApprove(true)}
                >
                  Approve
                </button>
              )}

              {approvalGuid && isEnableBtnReject && (
                <button
                  className='btn btn-sm btn-danger m-1'
                  onClick={() => setShowModalReject(true)}
                >
                  Reject
                </button>
              )}

              {isEnableBtnGrDone && permissions?.includes('insurance_claim.gr_done') && (
                <button
                  className='btn btn-sm btn-primary m-1'
                  onClick={() => setShowModalGrDone(true)}
                >
                  GR Done
                </button>
              )}

              {isEnableBtnUploadInv && permissions?.includes('insurance_claim.undo_gr') && (
                <button
                  className='btn btn-sm btn-primary m-1'
                  onClick={() => setShowModalUndoGR(true)}
                >
                  Undo GR
                </button>
              )}

              {isEnableBtnUploadInv && permissions?.includes('insurance_claim.invoice_upload') && (
                <button
                  className='btn btn-sm btn-primary m-1'
                  onClick={() => setShowModalUploadInvoice(true)}
                >
                  Upload Invoice
                </button>
              )}

              {isEnableBtnSubmitReview &&
                permissions?.includes('insurance_claim.submit_first_review') && (
                  <button
                    onClick={() => cekConfirmReview1()}
                    className='btn btn-sm btn-primary m-1'
                  >
                    Submit Review
                  </button>
                )}

              {isEnableBtnRejectAndRevert && (
                <button
                  className='btn btn-sm btn-danger m-1'
                  onClick={() => setShowModalRevert(true)}
                >
                  Revert
                </button>
              )}

              {isEnableBtnRejectAndRevert2 && (
                <button
                  className='btn btn-sm btn-danger m-1'
                  onClick={() => setShowModalRevert(true)}
                >
                  Revert
                </button>
              )}

              {isEnableBtnSubmitForApproval2 &&
                permissions?.includes('insurance_claim.submit_for_approval') && (
                  <button
                    className='btn btn-sm btn-primary m-1'
                    onClick={() => cekConfirmSubmitReject()}
                  >
                    Submit/Reject
                  </button>
                )}

              {isEnableBtnSubmitForApproval &&
                permissions?.includes('insurance_claim.submit_for_approval') && (
                  <button
                    className='btn btn-sm btn-primary m-1'
                    onClick={() => cekConfirmSubmitReject()}
                  >
                    Submit/Reject
                  </button>
                )}

              {isEnableBtnResubmit && permissions?.includes('insurance_claim.resubmit') && (
                <button
                  className='btn btn-sm btn-primary m-1'
                  onClick={() => setShowModalSubmission(true)}
                >
                  Resubmit
                </button>
              )}

              {isEnableBtnDigital && detailInsuranceClaim?.is_digital === 0 && (
                <button
                  data-cy='AssignDigitalRE'
                  className='btn btn-sm btn-primary m-1'
                  onClick={() => setShowModalDigitalRE(true)}
                >
                  Assign to Digital RE
                </button>
              )}

              {isEnableBtnDigital && detailInsuranceClaim?.is_digital === 1 && (
                <button
                  data-cy='AssignDigitalRE'
                  className='btn btn-sm btn-primary m-1'
                  onClick={() => setShowModalNonDigital(true)}
                >
                  Assign to Non Digital
                </button>
              )}

              {![
                'Rejected and Closed',
                'Approved',
                'Approved (Claimable)',
                'Approved (Not Claimable)',
              ]?.includes(insuranceClaimStatus) &&
                permissions?.includes('insurance_claim.edit') && (
                  <button
                    className='btn btn-sm btn-primary m-1'
                    onClick={() => navigate('/insurance-claims/' + (idInsurance || '') + '/edit')}
                  >
                    Edit
                  </button>
                )}
            </div>

            <div className='dropdown col-auto ms-auto mb-3 d-flex align-items-center justify-content-end'>
              {isEnableBtnDigital && detailInsuranceClaim?.is_digital === 1 && (
                <div
                  style={{
                    background: '#ffc700',
                    color: '#fff',
                    textAlign: 'center',
                    borderRadius: '5px',
                    padding: '7px 5px',
                    marginRight: '7px',
                    width: '100px',
                    right: '35px',
                  }}
                >
                  Digital Case
                </div>
              )}

              <Dropdown>
                <Dropdown.Toggle
                  size='sm'
                  data-cy='moreMenu'
                  id='dropdown-basic'
                  variant='light-primary'
                >
                  Log {/* Actions */}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href='#' onClick={() => showProcessLog()}>
                    Process Log
                  </Dropdown.Item>

                  <Dropdown.Item href='#' onClick={() => showAgingLog()}>
                    Aging Log
                  </Dropdown.Item>

                  <Dropdown.Item href='#' onClick={() => setShowModalSAPLog(true)}>
                    SAP Log
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        ) : (
          <div className='row mt-3'>
            <SimpleLoader
              count={2}
              width={100}
              height={35}
              className='col-auto mb-7'
              baseColor='#060990'
              highlightColor='#3f42c6'
            />
          </div>
        )}

        <div className='card card-custom'>
          <div className='card-body px-0'>
            <div className='row'>
              <div className='col-8'>
                {!loadingPage ? (
                  <DetailInsurance data={detailInsuranceClaim} />
                ) : (
                  <div className='row'>
                    <TextLoader count={4} className='col-md-6 mb-7' />
                  </div>
                )}
              </div>

              <div className='col-4'>
                {!loadingPage ? (
                  <>
                    <DetailLink detailInsurance={detailInsuranceClaim} setReload={setReload} />
                    <PostApproval detailInsurance={detailInsuranceClaim} />
                  </>
                ) : (
                  <div className='row'>
                    <TextLoader count={3} className='col-12 mb-4' />
                  </div>
                )}
              </div>
            </div>
            <div className='mt-5 mb-3'>
              <div className='fw-bolder mb-3'>RO Numbers :</div>
              <TableRONumber data={detailInsuranceClaim} loadingPage={loadingPage} />
            </div>
            <div className='mt-5 mb-2'>
              <TableInvoice
                data={detailInsuranceClaim}
                loadingPage={loadingPage}
                reload={reload}
                setReload={setReload}
                showModalUploadInvoice={showModalUploadInvoice}
                setShowModalUploadInvoice={setShowModalUploadInvoice}
              />
            </div>
            <div className='mt-5'>
              <div className='fw-bolder mb-2'>Documents : </div>
              <TableDocument
                data={detailInsuranceClaim}
                optionDocument={optionDocument}
                loadingPage={loadingPage}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalReview1
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalReview1}
        setShowModal={setShowModalReview1}
        setMandatoryBlank={setMandatoryBlank}
      />

      <ModalReview2
        data={detailInsuranceClaim}
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalReview2}
        setShowModal={setShowModalReview2}
        setMandatoryBlank={setMandatoryBlank}
        setShowBlankMandatory={setShowBlankMandatory}
      />

      <ModalProcessLog
        data={dataProcessLog}
        caseId={detailInsuranceClaim?.case_id}
        showModal={showModalProcessLog}
        setShowModal={setShowModalProcessLog}
      />

      <ModalAgingLog
        detail={dataAgingLog}
        showModal={showModalAgingLog}
        setShowModal={setShowModalAgingLog}
      />

      <ModalSAPLog showModal={showModalSAPLog} id={idInsurance} setShowModal={setShowModalSAPLog} />

      <ModalSubmission
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalSubmission}
        setShowModal={setShowModalSubmission}
      />

      <ModalGRDone
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalGRDone}
        setShowModal={setShowModalGrDone}
      />

      <ModalUndoGR
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalUndoGR}
        setShowModal={setShowModalUndoGR}
      />

      <ModalRevert
        detail={detailInsuranceClaim}
        reload={reload}
        id={idInsurance}
        assignRevert={users}
        setReload={setReload}
        showModal={showModalRevert}
        setShowModal={setShowModalRevert}
      />

      <ModalApprove
        reload={reload}
        id={approvalGuid}
        setReload={setReload}
        showModal={showModalApprove}
        setShowModal={setShowModalApprove}
      />

      <ModalReject
        reload={reload}
        id={approvalGuid}
        setReload={setReload}
        showModal={showModalReject}
        setShowModal={setShowModalReject}
      />

      <MandatoryDetail
        mandatory={blank_mandatory}
        codeMandatory={code_mandatory}
        showModal={showBlankMandatory}
        setShowModal={setShowBlankMandatory}
      />

      <ModalDigitalRE
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalDigitalRE}
        setShowModal={setShowModalDigitalRE}
      />

      <ModalNoDigital
        reload={reload}
        id={idInsurance}
        setReload={setReload}
        showModal={showModalNonDigital}
        setShowModal={setShowModalNonDigital}
      />

      <WidgetCommentBox id={idInsurance} />
    </>
  )
}

InsuranceClaimDetail = memo(
  InsuranceClaimDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default InsuranceClaimDetail
