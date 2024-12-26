import {FC} from 'react'
import {useNavigate} from 'react-router-dom'

const Button: FC<any> = () => {
  const navigate = useNavigate()
  return (
    <div className=''>
      <button
        type='button'
        className='btn btn-flex btn-sm btn-color-primary bg-light-primary ps-3 mx-2'
        onClick={() => navigate(-1)}
      >
        <i className='las la-angle-left fs-5' />
        Back
      </button>
      <button
        type='button'
        className='btn btn-flex btn-primary btn-sm ps-4 mx-2'
        onClick={() => navigate('/dashboard')}
      >
        <i className='las la-home fs-5' />
        Home
      </button>
    </div>
  )
}

export default Button
