import {FC} from 'react'
export const Title: FC<any> = ({
  title = 'Title',
  sticky = false,
  line = true,
  icon = <i className='las la-dot-circle la-lg ms-n2 me-1 text-primary' />,
  className = 'mb-5',
  fullwidth = true,
  dataCY = 'title',
  uppercase = true,
  space = 3,
}: any) => {
  return (
    <div
      className={`${fullwidth ? 'w-100' : ''} d-flex align-items-center rounded ${className} ${
        sticky && 'position-sticky'
      }`}
      style={sticky ? {top: '5.75rem', zIndex: 99, background: '#fafafa'} : {}}
    >
      <div
        className={`col-auto pe-3 fw-bolder ${uppercase ? 'text-uppercase' : ''} space-${space}`}
      >
        <h4
          className='d-flex align-items-center text-primary m-0'
          style={{fontSize: '1.35rem'}}
          data-cy={dataCY}
        >
          {icon} {title}
        </h4>
      </div>
      <div className='col separator my-5' style={{borderBottomWidth: line ? '5px' : '0px'}} />
    </div>
  )
}
export const CustomTitle: FC<any> = ({title = 'Title', className = ''}: any) => {
  return (
    <div className={`d-flex align-items-center ${className}`}>
      <div className='btn btn-icon btn-flex w-25px h-25px rounded-circle'>
        <i className='las la-dot-circle fs-2x text-primary' />
      </div>
      <div
        className={`fw-bolder space-1 text-primary text-uppercase text-nowrap mx-2`}
        style={{userSelect: 'none'}}
      >
        {title}
      </div>
      <div className='separator w-100 border-bottom-4' />
    </div>
  )
}
