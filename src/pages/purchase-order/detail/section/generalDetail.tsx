import {configClass} from '@helpers'
import {FC, Fragment} from 'react'

interface Props {
  detail: any
}

const GeneralPO: FC<Props> = ({detail}) => {
  const {asset}: any = detail || {}

  return (
    <>
      <div className='table-asset text-center w-100'>
        <table className='table table-border'>
          <tr className='bg-secondary'>
            <th className='fw-bolder p-2 border'>Asset ID</th>
            <th className='fw-bolder p-2 border'>Asset Name</th>
            <th className='fw-bolder p-2 border'>Category</th>
          </tr>
          {asset?.map((item: any) => {
            return (
              <Fragment key={item?.unique_id}>
                <tr key={item?.unique_id}>
                  <td className='border p-3'>{item?.unique_id || '-'}</td>
                  <td className='border p-3'>{item?.name || '-'}</td>
                  <td className='border p-3'>{item?.category || '-'}</td>
                </tr>
              </Fragment>
            )
          })}
        </table>
      </div>

      <div className='row'>
        <div className='col-6'>
          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Location Name</div>
              <div className='text-dark'>{detail?.location?.name || '-'}</div>
            </div>
          </div>

          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'> Supplier</div>
              <div className='text-dark'>{detail?.supplier?.name || '-'}</div>
            </div>
          </div>

          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Quantity</div>
              <div className='text-dark'>{detail?.quantity || 0}</div>
            </div>
          </div>

          <div className='' style={{height: 125}}>
            <div className={`${configClass?.body} h-100`}>
              <div className='fw-bolder text-dark mb-1'>Description</div>
              <div className='text-dark word-break'>{detail?.description || '-'}</div>
            </div>
          </div>
        </div>

        <div className='col-6'>
          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Due Date</div>
              <div className='text-dark'>{detail?.due_date || '-'}</div>
            </div>
          </div>

          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Price</div>
              <div className='text-dark'>{detail?.price || '-'}</div>
            </div>
          </div>

          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Status</div>
              <div className='text-dark'>{detail?.status?.name || '-'}</div>
            </div>
          </div>

          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Submitter</div>
              <div className='text-dark'>
                {detail?.submitter?.first_name
                  ? `${detail?.submitter?.first_name || ''} ${detail?.submitter?.last_name || ''}`
                  : '-'}
              </div>
            </div>
          </div>

          <div className='mb-4'>
            <div className={configClass?.body}>
              <div className='fw-bolder text-dark mb-1'>Approval</div>
              <div className='text-dark'>
                {detail?.approver?.first_name
                  ? `${detail?.approver?.first_name || ''} ${detail?.approver?.last_name || ''} `
                  : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export {GeneralPO}
