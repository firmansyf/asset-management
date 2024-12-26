import {FC, useEffect, useState} from 'react'
import {Button, Modal, Table} from 'react-bootstrap'

import {getHistoryStock} from '../redux/InventoryCRUD'

const HistoryStock: FC<any> = ({showModal, setShowModal, detailInventory, reload}) => {
  const [dataHistory, setDataHistory] = useState<any>([])

  useEffect(() => {
    if (detailInventory?.guid) {
      getHistoryStock(detailInventory?.guid).then(({data: {data: result}}: any) => {
        if (result) {
          const data: any = result
            ?.sort((a: any, b: any) => (a?.history_date > b?.history_date ? 1 : -1))
            ?.map((res: any) => {
              const {
                action_name,
                history_date,
                user,
                quantity,
                location,
                price,
                total_price,
                supplier,
              } = res || {}
              return {
                action: action_name || '-',
                user: user || '-',
                quantity: quantity || '-',
                date: history_date || '-',
                location: location || '-',
                price_unit: price || '-',
                total_price: total_price || '-',
                supplier: supplier || '-',
              }
            })
          setDataHistory(data as never[])
        }
      })
    }
  }, [detailInventory?.guid, reload])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>{detailInventory?.inventory_name} - History Stock</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-12 px-1 py-1'>
            <Table striped bordered hover responsive>
              <thead>
                <tr className='border-bottom bg-primary text-white'>
                  <th className='fw-bold fs-5 px-3 py-2'>Action</th>
                  <th className='fw-bold fs-5 px-3 py-2'>User</th>
                  <th className='fw-bold fs-5 px-3 py-2'>Quantity</th>
                  <th className='fw-bold fs-5 px-3 py-2'>Date</th>
                  <th className='fw-bold fs-5 px-3 py-2'>Location</th>
                  <th className='fw-bold fs-5 px-3 py-2' style={{width: '125px'}}>
                    Price per Unit
                  </th>
                  <th className='fw-bold fs-5 px-3 py-2' style={{width: '125px'}}>
                    Total Price
                  </th>
                  <th className='fw-bold fs-5 px-3 py-2'>Supplier</th>
                </tr>
              </thead>

              <tbody>
                {dataHistory?.length > 0 ? (
                  dataHistory?.map(
                    (
                      {
                        action,
                        user,
                        quantity,
                        date,
                        location,
                        price_unit,
                        total_price,
                        supplier,
                      }: any,
                      index: any
                    ) => {
                      return (
                        <tr key={index} className='border-bottom mt-15 mb-15'>
                          <td className='px-3 py-2'>{action || '-'}</td>
                          <td className='px-3 py-2'>{user || '-'}</td>
                          <td className='px-3 py-2'>{quantity || '-'}</td>
                          <td className='px-3 py-2'>{date || '-'}</td>
                          <td className='px-3 py-2'>{location || '-'}</td>
                          <td className='px-3 py-2'>{price_unit || '-'}</td>
                          <td className='px-3 py-2'>{total_price || '-'}</td>
                          <td className='px-3 py-2'>{supplier || '-'}</td>
                        </tr>
                      )
                    }
                  )
                ) : (
                  <tr key={0} className='border-bottom mt-15 mb-15'>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {HistoryStock}
