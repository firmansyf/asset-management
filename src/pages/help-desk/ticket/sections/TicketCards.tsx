import {FC, memo} from 'react'

let Cards: FC<any> = ({detail}) => {
  return (
    <div className='row'>
      <div className='col-sm-6 col-md-3 col-xl-2 mb-5' data-cy='ticket-card-id'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-4 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>Ticket ID</p>
            <span className='text-dark fw-bolder'>{detail?.ticket_id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

Cards = memo(Cards, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Cards
