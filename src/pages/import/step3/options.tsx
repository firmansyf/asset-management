import {FC} from 'react'
import {useIntl} from 'react-intl'

const OptionStep3: FC<any> = () => {
  const intl = useIntl()
  return (
    <div>
      <div>
        {intl.formatMessage({
          id: 'ASSET_SIMILARITY_FOUND_IN_THE_SYSTEM_WHAT_DO_YOU_WISH_TO_DO',
        })}
      </div>
      <div className='form-check form-check-custom form-check-solid mt-3 mb-5'>
        <input className='form-check-input' type='radio' name='type' id='update_assets' />
        <label className='form-check-label fw-bold text-gray-700 fs-6 me-3' htmlFor='update_assets'>
          {intl.formatMessage({id: 'UPDATE_EXISTING_ASSETS'})}
        </label>
        <input className='form-check-input' type='radio' checked name='type' id='add_assets' />
        <label className='form-check-label fw-bold text-gray-700 fs-6' htmlFor='add_assets'>
          {intl.formatMessage({id: 'DO_NOT_UPDATE_ASSETS_ADD_NEW'})}
        </label>
      </div>
      <div>
        {intl.formatMessage({
          id: 'EXISTING_ASSETS_IN_THE_SYSTEM_HAS_VALUE_AND_IMPORT_DATA_IN_THE_BANK_OR_HAVE_A_DIFFRENT_VALUE_WHAT_NEXT',
        })}
      </div>
      <div className='form-check form-check-custom form-check-solid mt-3 mb-5'>
        <input
          className='form-check-input'
          type='radio'
          name='exiting_assets'
          id='update_existing_assets'
        />
        <label
          className='form-check-label fw-bold text-gray-700 fs-6 me-3'
          htmlFor='update_existing_assets'
        >
          {intl.formatMessage({id: 'UPDATE_WITH_IMPORT_DATA_INCLUDING_BLANK'})}
        </label>
        <input
          className='form-check-input'
          type='radio'
          checked
          name='exiting_assets'
          id='keep_values'
        />
        <label className='form-check-label fw-bold text-gray-700 fs-6' htmlFor='keep_values'>
          {intl.formatMessage({id: 'KEEP_EXISTING_VALUE_IN_SYSTEM'})}
        </label>
      </div>
      <div>
        {intl.formatMessage({
          id: 'IF_IMPORT_DATA_HAS_LINKING_FIELDS_LIKE_CATEGORIES_SIZE_LOCATION_ETC_AND_EXISTING_TABLE_IS_MISSING_DATA_THEN_IN_THE_LINKING_TABLE',
        })}
      </div>
      <div className='form-check form-check-custom form-check-solid mt-3 mb-5'>
        <input className='form-check-input' type='radio' name='linked_assets' id='insert_assets' />
        <label className='form-check-label fw-bold text-gray-700 fs-6 me-3' htmlFor='insert_assets'>
          Insert
        </label>
        <input
          className='form-check-input'
          type='radio'
          checked
          name='linked_assets'
          id='skip_assets'
        />
        <label className='form-check-label fw-bold text-gray-700 fs-6' htmlFor='skip_assets'>
          Skip
        </label>
      </div>
      <div>{intl.formatMessage({id: 'IF_WE_FOUND_STATUS_THAT_DOESN_T_EXIST_IN_OUR_SYSTEM'})}</div>
      <div className='form-check form-check-custom form-check-solid mt-3 mb-5'>
        <input
          className='form-check-input'
          type='radio'
          name='exist_in_our_system'
          id='set_default'
        />
        <label className='form-check-label fw-bold text-gray-700 fs-6 me-3' htmlFor='set_default'>
          Set Default
        </label>
        <input
          className='form-check-input'
          type='radio'
          checked
          name='exist_in_our_system'
          id='insert_new'
        />
        <label className='form-check-label fw-bold text-gray-700 fs-6' htmlFor='insert_new'>
          Insert New
        </label>
      </div>
    </div>
  )
}

export {OptionStep3}
