import {preferenceDate, preferenceDateTime, validationViewDate} from '@helpers'
import moment from 'moment'
import {FC, memo} from 'react'

let DetailInsurance: FC<any> = ({data}) => {
  const statusClaim: any = [
    'Pending Documents Upload',
    'Pending GR Done',
    'Pending Invoice Upload',
    'Ready for Review 1',
  ]

  const status: any = data?.insurance_claim_status?.name
  const claimble: any = statusClaim.find((keys: any) => keys === status)
  const pref_date_time: any = preferenceDateTime()
  const pref_date: any = preferenceDate()

  return (
    <>
      <div className='row'>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Case ID</div>
          <div>{data?.case_id || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Damages</div>
          <div>{data?.damages || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Details of Damages</div>
          <div>{data?.damages_details || 'N/A'}</div>
        </div>
      </div>
      <div className='row mt-3'>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Sitename</div>
          <div>{data?.location?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Site ID</div>
          <div>{data?.location?.site_id || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Region</div>
          <div>{data?.location?.region || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Territory Manager</div>
          <div>{data?.location?.tm?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>TM&lsquo;s Superior 1</div>
          <div>{data?.location?.superior1?.tm?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>TM&lsquo;s Superior 2</div>
          <div>{data?.location?.superior2?.tm?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Regional Engineer</div>
          <div>{data?.location?.re?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>RE&lsquo;s Superior 1</div>
          <div>{data?.location?.superior1?.re?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>RE&lsquo;s Superior 2</div>
          <div>{data?.location?.superior2?.re?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Digital RE</div>
          <div>{data?.location?.re_digital?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Digital Superior 1</div>
          <div>{data?.location?.superior1?.re_digital?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Digital Superior 2</div>
          <div>{data?.location?.superior2?.re_digital?.name || 'N/A'}</div>
        </div>
      </div>
      <div className='row'>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Incident Date and Time</div>
          <div>{validationViewDate(data?.incident_timestamp, pref_date_time)}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Police Report Date</div>
          <div>
            {data?.police_report_date !== 'N/A'
              ? moment(data?.police_report_date).isValid()
                ? moment(data?.police_report_date).format(pref_date)
                : 'N/A'
              : data?.police_report_date}
          </div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Police Report No</div>
          <div>{data?.police_report_no || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Any Suspicions</div>
          <div>{data?.suspicions ? 'Yes' : 'No'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Suspicions Details</div>
          <div>{data?.suspicions_details || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Import Date and Time</div>
          <div>
            {validationViewDate(data?.import_date_and_time, pref_date_time)} <br /> ({' '}
            {data?.import_from} )
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Brief Description</div>
          <div>{data?.brief_description || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Action Taken</div>
          <div>{data?.action_taken || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Approved by (RS)</div>
          <div>{data?.claim_approver || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Case Title</div>
          <div>{data?.case_title || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Type of Peril</div>
          <div>{data?.insurance_claim_peril?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Report Time</div>
          <div>
            {data?.claim_time !== 'N/A'
              ? moment(data?.claim_time).isValid()
                ? moment(data?.claim_time).format(pref_date_time)
                : 'N/A'
              : data?.claim_time}
          </div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Status</div>
          <div>{data?.insurance_claim_status?.name || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>GR Status</div>
          <div>{data?.gr_status || 'N/A'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Claimable</div>
          <div>{claimble ? 'N/A' : data?.is_claimable === 1 ? 'YES' : 'NO'}</div>
        </div>
        <div className='col-4 mb-4'>
          <div className='fw-bolder'>Rejection comment</div>
          <div>{data?.approval?.rejected_comment || 'N/A'}</div>
        </div>
      </div>
    </>
  )
}

DetailInsurance = memo(
  DetailInsurance,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DetailInsurance
