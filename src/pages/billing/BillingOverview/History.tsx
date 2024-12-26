import {Title} from '@components/form/Title'
import moment from 'moment'
import {FC, Fragment} from 'react'
import {useNavigate} from 'react-router-dom'

const History: FC<any> = ({data}) => {
  const navigate = useNavigate()
  return (
    <>
      {/* <div className='d-flex flex-column flex-column-fluid'> */}
      <div className='d-flex flex-column-fluid p-5 position-relative'>
        <div className='card w-100'>
          <div className='d-flex card-body bg-light p-7 w-100 shadow-sm p-3 mb-5 bg-body rounded border border-2'>
            <div className='row w-100'>
              <div className='col-12'>
                {/* <p className='h4'>Bill History</p> */}
                <Title title='Bill History' sticky={false} className='my-2' />
                <div className='row'>
                  {data?.length > 0 &&
                    data?.map(({currency, amount_total, paid_at}: any, index: number) => {
                      return (
                        <Fragment key={index}>
                          <div className='col-6'>
                            <span>{moment(paid_at).format('MMMM, yyyy')}</span>
                            <br />
                            <span className='mt-3'></span>
                          </div>
                          <div className='col-6'>
                            <span className='mt-3'>
                              {currency} {amount_total}
                            </span>
                            <br />
                          </div>
                        </Fragment>
                      )
                    })}
                </div>
                <div className='mt-2 link-primary cursor-pointer'>
                  <span onClick={() => navigate(`/billing/history`)}>View Full History</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  )
}

export {History}
