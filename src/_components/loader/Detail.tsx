import {FC} from 'react'

import {CardLoader, SimpleLoader, TextLoader} from './list'

export const DetailLoader: FC<any> = () => {
  return (
    <>
      <div className='row align-items-center'>
        <SimpleLoader count={4} height={30} width={30} className='col-auto' circle />
        <div className='ms-auto col-auto'>
          <div className='row'>
            <SimpleLoader count={2} height={30} width={75} className='col-auto' />
          </div>
        </div>
      </div>
      <div className='row'>
        <SimpleLoader count={4} height={75} className='col-md-3' />
      </div>
      <div className='row mt-7'>
        <div className='col-md-8'>
          <TextLoader count={1} height={25} className='mb-7' />
          <div className='row'>
            <CardLoader count={6} height={45} icon={false} className='col-md-6 mb-5' />
          </div>
        </div>
        <div className='col-md-4'>
          <CardLoader count={2} icon={true} className='mb-5' />
        </div>
      </div>
    </>
  )
}
