import {FC, useState} from 'react'

const Index: FC<any> = () => {
  const [state, setState] = useState<any>()

  return (
    <div className='d-flex flex-center' style={{height: '65vh'}}>
      <div className='row'>
        <div className='col'>
          {state}
          <div
            className='btn btn-sm btn-light-danger'
            onClick={() => {
              const newState: any = undefined
              setState(newState.sentry_test_error)
            }}
          >
            Create Error
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
