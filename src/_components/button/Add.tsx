import {FC} from 'react'

const AddInputBtn: FC<any> = ({onClick, size = 30, dataCy = 'add-input-btn'}: any) => {
  size === 'sm' && (size = 25)
  size === 'md' && (size = 30)
  return (
    <button
      className={`col-auto border border-dashed shadow-sm border-primary h-${size}px w-${size}px btn btn-icon btn-light-primary rounded-circle mx-2 d-flex align-items-center justify-content-center`}
      type='button'
      data-cy={dataCy}
      onClick={onClick}
    >
      <i className='fas fa-plus'></i>
    </button>
  )
}

export {AddInputBtn}
