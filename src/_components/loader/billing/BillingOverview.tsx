import 'react-loading-skeleton/dist/skeleton.css'

import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'

const BillingOverviewLoader: FC<any> = ({height = 35}) => {
  const random: number = Math.floor(Math.random() * 5) + 2
  return (
    <SkeletonTheme baseColor='#f5f5f5' highlightColor='#fafafa'>
      <PageTitle breadcrumbs={[]}>Billing</PageTitle>
      <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
        <div className='d-flex flex-column flex-column-fluid p-7'>
          <p className='h2'>
            <Skeleton className='my-3' width={random * 14 + '%'} height={height} count={1} />
          </p>
          <div className='card mt-4'>
            <div className='d-flex card-body bg-light p-10 w-75 shadow p-3 mb-5 bg-body rounded p-7'>
              <div className='row w-100'>
                <div className='col-7'>
                  <p className='h4'>
                    <Skeleton
                      className='my-0'
                      width={random * 10 + '%'}
                      height={height / 3}
                      count={1}
                    />
                  </p>
                  <span>
                    <Skeleton
                      className='my-3'
                      width={random * 20 + '%'}
                      height={height}
                      count={1}
                    />
                    <Skeleton
                      className='my-0'
                      width={random * 19 + '%'}
                      height={height / 3}
                      count={1}
                    />
                  </span>
                  <div className='mt-4'>
                    <div className='row'>
                      <div className='col-2'>
                        <span>
                          <Skeleton className='my-3' height={height} count={1} />
                        </span>
                      </div>
                      <div className='col-9'>
                        <span>
                          <Skeleton
                            className='my-0'
                            width={random * 20 + '%'}
                            height={height / 3}
                            count={1}
                          />
                        </span>
                        <span>
                          <Skeleton
                            className='my-0'
                            width={random * 17 + '%'}
                            height={height / 3}
                            count={1}
                          />
                        </span>
                        <span>
                          <Skeleton
                            className='my-0'
                            width={random * 20 + '%'}
                            height={height / 3}
                            count={1}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-5 d-flex justify-content-end'>
                  <Skeleton className='my-3' width={'50%'} height={5} count={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}

export {BillingOverviewLoader}
