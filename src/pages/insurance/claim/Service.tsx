import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export function editInsuranceClaim(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'insurance_claim/' + id,
    data: params,
  })
}

export function getInsuranceClaim(params: object) {
  return axiosV2({
    method: 'get',
    url: 'insurance_claim',
    params,
  })
}

export function getInsuranceProcessLog(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/process-log',
  })
}

export function exportInsuranceClaim(params: object) {
  return axios({
    method: 'post',
    url: 'insurance_claim/export',
    params,
  })
}

export function deleteInsuranceClaim(id: any) {
  return axios({
    method: 'delete',
    url: 'insurance_claim/' + id,
  })
}

export function getDetailInsuranceClaim(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id,
  })
}

export function getPerils(params: object) {
  return axios({
    method: 'get',
    url: 'insurance_claim/peril',
    params,
  })
}

export function getInsuranceClaimStatus(params: object) {
  return axios({
    method: 'get',
    url: 'insurance_claim/status',
    params,
  })
}

export function resubmitInsurance(id: object) {
  return axios({
    method: 'put',
    url: 'insurance_claim/' + id + '/resubmit',
  })
}

export function submitGRDone(id: object) {
  return axios({
    method: 'post',
    url: 'insurance_claim/' + id + '/done',
  })
}

export function downloadFormInsuranceClaim(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/attachmentPDF',
  })
}

export function addInvoice(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/' + id + '/upload_invoice',
  })
}

export function editInvoice(params: any, id: any, id_file: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'insurance_claim/' + id + '/invoice/' + id_file,
  })
}

export function deleteInvoice(id: any, id_file: any) {
  return axios({
    method: 'delete',
    url: 'insurance_claim/' + id + '/invoice/' + id_file,
  })
}

export function addDocument(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/' + id + '/document',
  })
}

export function editDocument(params: any, id: any, id_file: any) {
  return axios({
    method: 'put',
    url: 'insurance_claim/' + id + '/document/' + id_file,
    data: params,
  })
}

export function deleteDocument(id: any, id_file: any) {
  return axios({
    method: 'delete',
    url: 'insurance_claim/' + id + '/document/' + id_file,
  })
}

export function revertInsurance(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/' + id + '/reject_revert',
  })
}

export function sendCommentBox(params: any, id: object) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/' + id + '/comment_box',
  })
}

export function getCommentBox(id: object) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/comment_box',
  })
}

export function sendBeforeReview1(params: any, id: object) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/' + id + '/submit-first-review',
  })
}
export function sendReview1(params: any, id: object) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/' + id + '/submit-first-review?check_validation=true',
  })
}

export function sendBeforeReview(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/approval/' + id + '/submit',
  })
}

export function sendReview2(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/approval/' + id + '/submit?check_validation=true',
  })
}

export function checkMandatoryField(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/submit',
  })
}

export function checkRONumber(id: object, ro_number: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/check-ro-number?ro-number=' + ro_number,
  })
}

export function getReportPercentage(year: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/insurance-complete-percentage?year=' + year,
  })
}

export function exportReportPercentage(year: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/export-insurance-complete-percentage?year=' + year,
  })
}

export function getReportSF(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/salesforce/filter',
    params,
  })
}

export function getReportSFDetail(id: any, params: any) {
  return axios({
    method: 'get',
    params,
    url: 'insurance_claim/salesforce/' + id,
  })
}

export function importCaseID(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/salesforce/import-by-caseid',
  })
}

export function setupEmailSF(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/salesforce/setting-email',
  })
}

export function getEmailSF(params: any) {
  return axios({
    method: 'get',
    data: params,
    url: 'insurance_claim/salesforce/setting-email',
  })
}

export function getAccessEdit(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/view-edit/' + id,
  })
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function clearAccessEdit(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/view-edit/' + id,
  })
}

export function getReportPendingClaim(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/pending-claim-by-pic',
    params,
  })
}

export function exportReportPendingClaim(year: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/export-pending-claim-by-pic?year=' + year,
  })
}

export function getOptionYear() {
  return axios({
    method: 'get',
    url: 'insurance_claim/years-ref',
  })
}

export function setColumnInsuranceClaim(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/setting/column',
    params,
  })
}

export function saveColumnInsuranceClaim(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/setting/column',
  })
}

export function approveInsurance(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/approval/' + id + '/approve',
  })
}

export function rejectInsurance(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/approval/' + id + '/reject',
  })
}

export function AssignDigitalREInsurance(guid: object, params: any) {
  return axios({
    method: 'post',
    url: `insurance_claim/${guid}/assign-digital`,
    data: params,
  })
}

export function getLink(params: object, guid: any) {
  return axios({
    method: 'get',
    url: `insurance_claim/link_cases/${guid}`,
    params,
  })
}

export function sendLink(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/link_cases/add_case',
  })
}

export function sendUnLink(guid: any) {
  return axios({
    method: 'DELETE',
    url: `insurance_claim/link_cases/${guid}`,
  })
}

export function getSearchLink(params: any) {
  const guid: any = params?.guid !== undefined ? params?.guid : ''
  Object.prototype.hasOwnProperty.call(params, 'guid') && delete params['guid']
  return axios({
    method: 'get',
    url: `insurance_claim/link_cases/search_claim/${guid}`,
    params,
  })
}

export function getApprovalStatus(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/post-approval-status',
    params,
  })
}

export function postApprovalStatus(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `insurance_claim/${guid}/post-approval`,
    data: params,
  })
}

export function getDetailReportPercentage(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/insurance-complete-percentage-detail',
    params,
  })
}

export function getROStatusOption() {
  return axios({
    method: 'get',
    url: 'insurance_claim/ro-status',
  })
}

export function getListStatusInsurance() {
  return axios({
    method: 'get',
    url: 'insurance_claim/status',
  })
}

export function submitUndoGR(id: object) {
  return axios({
    method: 'post',
    url: 'insurance_claim/' + id + '/undo-gr',
  })
}

export function getInsuranceAgingLog(id: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/aging',
  })
}

export function getRevertHistory(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/revert-revision-history',
    params,
  })
}

export function exportExcelRevertHistory() {
  return axios({
    method: 'post',
    url: 'insurance_claim/export-revert-revision-history',
  })
}

export function getClaimFilter(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/filter-value',
    params,
  })
}

export function getReportSAP(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/ro-number/history-SAP',
    params,
  })
}

export function importRONumber(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/ro-number/manual-SAP',
  })
}

export function getInsuranceSAPLog(id: any, params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/' + id + '/sap-history',
    params,
  })
}

export function getReportSAPDetail(id: any, params: any) {
  return axios({
    method: 'get',
    url: `insurance_claim/ro-number/history-SAP/${id}`,
    params,
  })
}

export function getStatusSAP() {
  return axios({
    method: 'get',
    url: `insurance_claim/ro-number/status-SAP`,
  })
}

export function viewByCase(case_id: any) {
  return axios({
    method: 'get',
    url: `insurance_claim/view-by-case/${case_id}`,
  })
}
