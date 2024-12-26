import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, hasPermission, preferenceDate, validationViewDate} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import Datetime from 'react-datetime'

import {getApprovalStatus, postApprovalStatus} from '../Service'

let PostApproval: FC<any> = ({detailInsurance}) => {
  const pref_date: any = preferenceDate()

  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState<any>(0)
  const [receiveDate, setreceiveDate] = useState<any>('')
  const [selectApproval, setSelectApproval] = useState<any>('')
  const [submissionDate, setsubmissionDate] = useState<any>('')
  const [confirmationDate, setconfirmationDate] = useState<any>('')

  const statusApprove: any = ['Approved', 'Approved (Not Claimable)']

  const status: any = data?.insurance_claim_status?.name || ''
  const approved: any = statusApprove?.find((keys: any) => keys === status)
  const permissionApproved: any = hasPermission('insurance_claim.update_post_approval') || false

  useEffect(() => {
    if (detailInsurance) {
      setData(detailInsurance || {})
    }
  }, [detailInsurance])

  const changeUpdateApproval = () => {
    if (selectApproval !== '' || data?.post_approval_status?.guid !== undefined) {
      postApprovalStatus(
        {
          status: selectApproval || data?.post_approval_status?.guid || '',
          submission_date:
            submissionDate === ''
              ? moment(data?.submission_date).isValid()
                ? data?.submission_date
                : ''
              : moment(submissionDate).isValid()
              ? submissionDate
              : '',
          receive_date:
            receiveDate === ''
              ? moment(data?.receive_date).isValid()
                ? data?.receive_date
                : ''
              : moment(receiveDate).isValid()
              ? receiveDate
              : '',
          confirmation_date:
            confirmationDate === ''
              ? moment(data?.confirmation_date).isValid()
                ? data?.confirmation_date
                : ''
              : moment(confirmationDate).isValid()
              ? confirmationDate
              : '',
        },
        data?.guid
      )
        .then(({data: res}: any) => {
          if (res) {
            const {message} = res || {}
            ToastMessage({message, type: 'success'})
            setLoading(loading + 1)
          }
        })
        .catch(({response}: any) => {
          const {message, data}: any = response?.data || {}
          const {fields}: any = data || {}

          if (Object.keys(fields || {})?.length > 0) {
            Object.keys(fields || {})?.map((item: any) => {
              ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
              return false
            })
          } else {
            ToastMessage({message, type: 'error'})
          }
        })
    } else {
      ToastMessage({message: 'Please, Choose Approval Status', type: 'error'})
    }
  }

  return (
    <>
      {approved && (
        <div className='card border border-gray-300 mt-5'>
          <div className='card-body align-items-center p-5'>
            <div className='row'>
              <div className='col-12'>
                <div className='fw-bolder'>Post Approval Status</div>
                {approved && permissionApproved ? (
                  <div>
                    <Select
                      sm={true}
                      api={getApprovalStatus}
                      key='status'
                      name='status'
                      reload={loading}
                      className='col p-0'
                      placeholder='Select user'
                      params={{orderCol: 'first_name', orderDir: 'asc'}}
                      onChange={({value}: any) => setSelectApproval(value || '')}
                      parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                      defaultValue={{
                        value: data?.post_approval_status?.guid || '',
                        label: data?.post_approval_status?.name || '',
                      }}
                    />
                  </div>
                ) : (
                  <div>{data?.post_approval_status?.name || 'N/A'}</div>
                )}
              </div>
              <div className='col-12 mt-3'>
                <div className='fw-bolder'>Submission Date</div>
                {approved && permissionApproved ? (
                  <div>
                    <Datetime
                      closeOnSelect
                      inputProps={{
                        autoComplete: 'off',
                        className: configClass?.form,
                        name: 'submission_date',
                        placeholder: 'Enter Submission Date',
                      }}
                      onChange={(e: any) => {
                        const m: any = moment(e || '')?.format('YYYY-MM-DD')
                        setsubmissionDate(m || '')
                      }}
                      initialValue={
                        moment(data?.submission_date).isValid()
                          ? moment(data?.submission_date || '')?.format(pref_date)
                          : ''
                      }
                      dateFormat={pref_date}
                      timeFormat={false}
                    />
                  </div>
                ) : (
                  <div>
                    {data?.submission_date
                      ? validationViewDate(data?.submission_date, pref_date)
                      : 'N/A'}
                  </div>
                )}
              </div>
              <div className='col-12 mt-3'>
                <div className='fw-bolder'>Confirmation Date</div>
                {approved && permissionApproved ? (
                  <div>
                    <Datetime
                      closeOnSelect
                      inputProps={{
                        autoComplete: 'off',
                        className: configClass?.form,
                        name: 'confirmation_date',
                        placeholder: 'Enter Confirmation Date',
                      }}
                      onChange={(e: any) => {
                        const m: any = moment(e || '')?.format('YYYY-MM-DD')
                        setconfirmationDate(m || '')
                      }}
                      initialValue={
                        moment(data?.confirmation_date).isValid()
                          ? moment(data?.confirmation_date || '')?.format(pref_date)
                          : ''
                      }
                      dateFormat={pref_date}
                      timeFormat={false}
                    />
                  </div>
                ) : (
                  <div>
                    {data?.confirmation_date
                      ? validationViewDate(data?.confirmation_date, pref_date)
                      : 'N/A'}
                  </div>
                )}
              </div>
              <div className='col-12 mt-3'>
                <div className='fw-bolder'>Receive Date</div>
                {approved && permissionApproved ? (
                  <div>
                    <Datetime
                      closeOnSelect
                      inputProps={{
                        autoComplete: 'off',
                        className: configClass?.form,
                        name: 'receive_date',
                        placeholder: 'Enter Receive Date',
                      }}
                      onChange={(e: any) => {
                        const m: any = moment(e || '')?.format('YYYY-MM-DD')
                        setreceiveDate(m || '')
                      }}
                      initialValue={
                        moment(data?.receive_date).isValid()
                          ? moment(data?.receive_date || '')?.format(pref_date)
                          : ''
                      }
                      dateFormat={pref_date}
                      timeFormat={false}
                    />
                  </div>
                ) : (
                  <div>
                    {data?.receive_date ? validationViewDate(data?.receive_date, pref_date) : 'N/A'}
                  </div>
                )}
              </div>
              <div className='col-12 mt-5' style={{textAlign: 'right'}}>
                <button className='btn btn-sm btn-primary' onClick={changeUpdateApproval}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

PostApproval = memo(
  PostApproval,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default PostApproval
