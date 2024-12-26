import {FC, memo, useState} from 'react'

import {ChooseBrand} from './modal/clean-brand/ChooseBrand'
import {ChooseManufacturer} from './modal/clean-manufacturer/ChooseManufacturer'
import {ChooseModel} from './modal/clean-model/ChooseModel'

const Card: FC<any> = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showModalBrand, setShowModalBrand] = useState<boolean>(false)
  const [showModalModel, setShowModalModel] = useState<boolean>(false)

  const onClickManufacturer = () => {
    setShowModal(true)
  }
  const onClickBrand = () => {
    setShowModalBrand(true)
  }
  const onClickModel = () => {
    setShowModalModel(true)
  }

  return (
    <>
      <div className='card card-custom card-table'>
        <div className='card-body'>
          <div className='table-responsive table-custom--'>
            <table className='table table-sm table-striped table-row-dashed table-row-gray-300 gx-3 gy-1 mb-1 rounded '>
              <thead>
                <tr className='fw-bolder fs-6 text-gray-800'>
                  <th className='text-dark fs-7 py-5'>Module</th>
                  <th className='sticky-cus text-center px-15 end-0'>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className='align-middle'>
                  <td className=' text-nowrap text-truncate fs-12px'>Manufacturer</td>
                  <td className='sticky-cus text-center px-2 end-0'>
                    <div
                      className='btn radius-5 m-1 btn-light-primary'
                      style={{
                        width: '155px',
                        fontSize: '13px',
                      }}
                      onClick={onClickManufacturer}
                    >
                      Data Clean Up
                    </div>
                  </td>
                </tr>
                <tr className='align-middle'>
                  <td className=' text-nowrap text-truncate fs-12px'>Model</td>
                  <td className='sticky-cus text-center px-2 end-0'>
                    <div
                      className='btn radius-5 m-1 btn-light-primary'
                      style={{
                        width: '155px',
                        fontSize: '13px',
                      }}
                      onClick={onClickModel}
                    >
                      Data Clean Up
                    </div>
                  </td>
                </tr>
                <tr className='align-middle'>
                  <td className=' text-nowrap text-truncate fs-12px'>Brand</td>
                  <td className='sticky-cus text-center px-2 end-0'>
                    <div
                      className='btn radius-5 m-1 btn-light-primary'
                      style={{
                        width: '155px',
                        fontSize: '13px',
                      }}
                      onClick={onClickBrand}
                    >
                      Data Clean Up
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ChooseManufacturer showModal={showModal} setShowModal={setShowModal} />
      <ChooseModel showModal={showModalModel} setShowModal={setShowModalModel} />
      <ChooseBrand showModal={showModalBrand} setShowModal={setShowModalBrand} />
    </>
  )
}

const CardICleanUp = memo(
  Card,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardICleanUp}
