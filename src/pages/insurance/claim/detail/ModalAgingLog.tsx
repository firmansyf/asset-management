import './custom.css'

import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

let ModalAgingLog: FC<any> = ({showModal, setShowModal, detail}) => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    if (Object.keys(detail || {})?.length > 0) {
      const result: any = []
      Object.keys(detail || {})?.forEach((item: any) => {
        if (item !== 'guid') {
          const {activity_label, activity_age, activity_pic}: any = detail?.[item] || {}
          result?.push({
            label: activity_label || '',
            value: activity_age || '',
            pic: activity_pic || '',
          })
        }
      })
      setData(result as never[])
    } else {
      setData([])
    }
  }, [detail])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Aging Log</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-12'>
            <table className='table border table-aging'>
              <thead className='thead-aging'>
                <tr className='tr-aging'>
                  <th style={{width: '50%'}} className='fw-bolder text-center th-aging'>
                    Status Transition
                  </th>
                  <th style={{width: '25%'}} className='fw-bolder text-center th-aging'>
                    Days Taken
                  </th>
                  <th style={{width: '25%'}} className='fw-bolder text-center th-aging'>
                    PIC
                  </th>
                </tr>
              </thead>
              <tbody className='tbody-aging'>
                {data?.length > 0 &&
                  data?.map(({value, label, pic}: any, index: number) => {
                    return (
                      <tr className='tr-aging' key={index}>
                        <td
                          className='td-aging'
                          style={{width: '50%', textAlign: 'left', padding: '10px'}}
                        >
                          {label || '-'}
                        </td>
                        <td
                          className='td-aging'
                          style={{width: '25%', textAlign: 'center', padding: '10px'}}
                        >
                          {value || 0}
                        </td>
                        <td
                          className='td-aging'
                          style={{width: '25%', textAlign: 'center', padding: '10px'}}
                        >
                          {pic || 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

ModalAgingLog = memo(
  ModalAgingLog,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalAgingLog
