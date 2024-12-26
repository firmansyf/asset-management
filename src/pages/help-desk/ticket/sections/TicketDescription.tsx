import Linkify from '@components/linkify'
import {PageLoader} from '@components/loader/cloud'
import parse from 'html-react-parser'
import {FC} from 'react'

const TicketDescription: FC<any> = ({detailTicket, loading}) => {
  const linkProps: any = {
    onClick: (e: any) => {
      e?.preventDefault()
      const {href} = e?.target || {}
      window.open(href, '_blank')
    },
  }

  return (
    <>
      {loading ? (
        <PageLoader height={250} />
      ) : (
        <div className='card card-custom'>
          <div className='card-body p-5'>
            <div className='row'>
              <div className='col-md-12 mb-5'>
                <div className='bg-gray-100 p-5 rounded'>
                  <div className='text-dark'>
                    <Linkify options={{attributes: linkProps}}>
                      {parse(`${detailTicket?.description}`) !== undefined
                        ? parse(`${detailTicket?.description}`)
                        : '-'}
                    </Linkify>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TicketDescription
