import {KTSVG, toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const Complete: FC<any> = ({onBack, onComplete, index}) => {
  const intl = useIntl()
  return (
    <div className='w-100' style={{marginTop: '150px'}}>
      <div className='d-flex align-items-center justify-content-between'>
        <img
          alt='Success'
          height={250}
          src={toAbsoluteUrl('/media/svg/others/success.svg')}
          style={{opacity: 0.5}}
        />
        <div className=''>
          <div className='d-flex align-items-center mb-4'>
            <div className='symbol symbol-35px me-2'>
              <div className='symbol-label bg-light-success'>
                <KTSVG
                  path='/media/icons/duotone/Code/Done-circle.svg'
                  className='svg-icon-success svg-icon-2x'
                />
              </div>
            </div>
            <h1 data-cy='headerCompleteWizard' className='m-0'>
              {intl.formatMessage({id: 'YOUR_ARE_DONE'})}
            </h1>
          </div>
          <div className='text-dark fw-bold fs-6 mb-3'>
            Click{' '}
            <strong className='text-dark' style={{fontWeight: 700}}>
              " &#10004; Complete"
            </strong>{' '}
            {intl.formatMessage({id: 'BUTTON_BELOW_TO_START_USING_GREAT_TOOLS'})}
          </div>
          <button
            type='button'
            onClick={onBack}
            data-cy='btnBackCompleteWizard'
            className='btn btn-light-primary me-3'
            data-kt-stepper-action='previous'
          >
            <i className='fas fa-arrow-left me-1' />
            Back
          </button>
          <button
            id={index}
            type='button'
            data-cy='btnCompleteWizard'
            onClick={onComplete}
            className='btn btn-primary'
          >
            <i className='fas fa-check me-1' />
            Complete
          </button>
        </div>
      </div>
    </div>
  )
}

export {Complete}
