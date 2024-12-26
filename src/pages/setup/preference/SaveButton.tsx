import {ToastMessage} from '@components/toast-message'
import {FC} from 'react'
import {Button} from 'react-bootstrap'

interface Props {
  loading: any
  label: string
  isPrefEdit: any
}

const SaveButton: FC<Props> = ({loading, label, isPrefEdit}) => {
  const resetForm = () => {
    ToastMessage({
      type: 'error',
      message: 'Does not have right permissions to edit preference data',
    })
  }
  return (
    <>
      {!isPrefEdit && (
        <Button
          disabled={loading}
          onClick={resetForm}
          className='btn-sm'
          type='reset'
          variant='primary'
        >
          {!loading && <span className='indicator-label'>{label}</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      )}

      {isPrefEdit && (
        <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
          {!loading && <span className='indicator-label'>{label}</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      )}
    </>
  )
}

export {SaveButton}
