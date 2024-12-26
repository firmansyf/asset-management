import {ViewLoader} from '@components/loader/view'
import {generateUrlAPI} from '@helpers'
import axios from 'axios'
import cx from 'classnames'
import {FC, useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

import Files from './files'
import General from './general'

const Shared: FC<any> = (props: any) => {
  const navigate = useNavigate()
  const location: any = useLocation()
  const [loading, setLoading] = useState<any>(true)
  const [detailWorkOrder, setData] = useState<any>({})

  useEffect(() => {
    const {encode}: any = props?.match?.params || {}
    setLoading(true)
    axios
      .get(generateUrlAPI(`maintenance/share/${encode}`))
      .then(({data: {data: res}}: any) => {
        if (res) {
          setLoading(false)
          setData(res)
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }, [props])

  return (
    <div className='container my-5 pb-5'>
      <div className='row'>
        <div className='col-md-12'>
          <div className='card border border-2'>
            <div className='card-header align-items-center px-4'>
              <h3 className='card-title fw-bold fs-3 m-0' data-cy='card-title'>
                Work Order Information
              </h3>
            </div>

            <div className='card-body align-items-center p-0'>
              <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                <li className='nav-item'>
                  <div
                    className={
                      'm-0 px-5 py-3 cursor-pointer bg-primary border-primary text-white fw-bolder'
                    }
                    onClick={() => {
                      navigate({...location}, {replace: true})
                    }}
                  >
                    Work Order Detail
                  </div>
                </li>
              </ul>
              <div className='tab-content'>
                <div className={cx('tab-pane fade', {show: true}, {active: true})}>
                  {loading ? <ViewLoader /> : <General detail={detailWorkOrder} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-12'>
          <Files data={detailWorkOrder} />
        </div>
      </div>
    </div>
  )
}

export {Shared}
