import {FC, useEffect, useState} from 'react'
import {Table} from 'react-bootstrap'

const Quantity: FC<any> = ({data, reload}) => {
  const [dataQuantity, setDataQuantity] = useState<any>([])
  const [totalQuantity, setTotalQuantity] = useState<any>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (data?.quantity_by_location) {
      let total = 0
      data?.quantity_by_location?.forEach((item: any) => {
        total = Number(total) + Number(item?.quantity)
      })

      setTotalQuantity(total)
      setDataQuantity(data?.quantity_by_location)
    }
  }, [data?.quantity_by_location, reload])

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }, [reload])

  return (
    <div className=''>
      {isLoading ? (
        <div className='d-flex h-350px flex-center'>
          <span className='indicator-progress d-block text-center'>
            <span className='spinner-border spinner-border-sm w-50px h-50px align-middle'></span>
            <div className='mt-2 text-gray-500'>Please wait...</div>
          </span>
        </div>
      ) : (
        <div className='row'>
          <div className='col-12 px-10 py-10'>
            <Table striped bordered hover>
              <thead>
                <tr className='border-bottom border-primary'>
                  <th className='fw-bold fs-5'>Location</th>
                  <th className='fw-bold fs-5'>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {dataQuantity?.length > 0 ? (
                  dataQuantity?.map(({location_name, quantity}: any, index: any) => {
                    return (
                      <tr key={index} className='border-bottom mt-15 mb-15'>
                        <td>{location_name || '-'}</td>
                        <td>{quantity || '-'}</td>
                      </tr>
                    )
                  })
                ) : (
                  <tr key={0} className='border-bottom mt-15 mb-15'>
                    <td>{'-'}</td>
                    <td>{'-'}</td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr style={{fontWeight: 600}}>
                  <td>Total Quantity</td>
                  <td>{totalQuantity}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export {Quantity}
