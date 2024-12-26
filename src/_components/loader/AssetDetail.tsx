import 'react-loading-skeleton/dist/skeleton.css'

import {keyBy, mapValues} from 'lodash'
import {FC, useEffect, useState} from 'react'
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import {shallowEqual, useSelector} from 'react-redux'

import {IconLoader} from './list'

export const AssetDetailLoader: FC<any> = ({height = 35}) => {
  const random: number = Math.floor(Math.random() * 5) + 2
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}
  const [features, setFeatures] = useState<any>({})
  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])
  return (
    <SkeletonTheme baseColor='#f5f5f5' highlightColor='#fafafa'>
      <div className='row'>
        <IconLoader size={35} count={4} className='col-auto mb-5 pe-0' />
      </div>

      <div className='row'>
        <div className='col-sm-6 col-md col-xl-2 mb-5'>
          <div className='card bg-gray-20 border border-dashed border-primary h-100'>
            <div className='card-body px-4 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>ASSET ID</p>
              <span className='text-dark fw-bolder'>
                <Skeleton
                  className='my-0'
                  width={random * 10 + '%'}
                  height={height / 3}
                  count={1}
                />
              </span>
            </div>
          </div>
        </div>
        <div className='col-sm-6 col-md col-xl-2 mb-5'>
          <div className='card bg-gray-20 border border-dashed border-primary h-100'>
            <div className='card-body px-4 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>QR CODE</p>
              <span className='text-dark fw-bolder'>
                <Skeleton
                  className='my-0'
                  width={random * 10 + '%'}
                  height={height / 3}
                  count={1}
                />
              </span>
            </div>
          </div>
        </div>
        <div className='col-sm-6 col-md col-xl-2 mb-5'>
          <div className='card bg-gray-20 border border-dashed border-primary h-100'>
            <div className='card-body px-4 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>AUDITED</p>
              <span className='text-dark fw-bolder'>
                <Skeleton
                  className='my-0'
                  width={random * 10 + '%'}
                  height={height / 3}
                  count={1}
                />
              </span>
            </div>
          </div>
        </div>
        {features?.maintenance === 1 && (
          <div className='col-sm-6 col-md col-xl-2 mb-5'>
            <div className='card bg-gray-20 border border-dashed border-primary h-100'>
              <div className='card-body px-4 py-3'>
                <p className='card-title fw-bold fs-7 mb-2 d-block'>MAINTENANCE</p>
                <span className='text-dark fw-bolder'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                </span>
              </div>
            </div>
          </div>
        )}
        <div className='col-sm-6 col-md col-xl-2 mb-5'>
          <div className='card bg-gray-20 border border-dashed border-primary h-100'>
            <div className='card-body px-4 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>Reservation Schedule</p>
              <span className='text-dark fw-bolder'>
                <Skeleton
                  className='my-0'
                  width={random * 10 + '%'}
                  height={height / 3}
                  count={1}
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-md-8'>
          <div className='card border border-gray-300'>
            <div className='card-header align-items-center px-4'>
              <h3 className='card-title fw-bold fs-3 m-0'>Asset Information</h3>
            </div>
            <div className='card-body align-items-center p-0'>
              <div className='row'>
                <div className='col-2'>
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
                <div className='col-2'>
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
                <div className='col-2'>
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
                <div className='col-6'>
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
              </div>
              <div className='row  m-5'>
                <div className='col-6'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
                <div className='col-6'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
              </div>
              <div className='row  m-5'>
                <div className='col-6'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
                <div className='col-6'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
              </div>
              <div className='row  m-5'>
                <div className='col-6'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
                <div className='col-6'>
                  <Skeleton
                    className='my-0'
                    width={random * 10 + '%'}
                    height={height / 3}
                    count={1}
                  />
                  <Skeleton className='my-3' height={height} count={1} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-4'>
          <div className='mb-3'>
            <div className='card bg-white border border-gray-300 h-100'>
              <div className='card-header align-items-center px-4'>
                <h3 className='card-title fw-bold fs-3 m-0'>Check Out/In</h3>
              </div>
              <div className='card-body align-items-center'>
                <Skeleton
                  className='my-0'
                  width={random * 10 + '%'}
                  height={height / 3}
                  count={1}
                />
                <Skeleton className='my-3' height={height} count={1} />
              </div>
            </div>

            <div className='card bg-white border border-gray-300 h-100 mt-10'>
              <div className='card-header align-items-center px-4'>
                <h3 className='card-title fw-bold fs-3 m-0'>File</h3>
              </div>
              <div className='card-body align-items-center'>
                <Skeleton
                  className='my-0'
                  width={random * 10 + '%'}
                  height={height / 3}
                  count={1}
                />
                <Skeleton className='my-3' height={height} count={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}
