import {Title} from '@components/form/Title'
import {IMG} from '@helpers'
import cx from 'classnames'
import {ErrorMessage, Field} from 'formik'
import moment from 'moment'
import {FC, memo} from 'react'
import Datetime from 'react-datetime'
import InputMask from 'react-input-mask'

let CardDetail: FC<any> = ({configClass, setFieldValue}) => {
  const handleClick = () => {
    document.querySelector('.rdt')?.classList.toggle('rdtOpen')
  }

  return (
    <div className='card shadow-sm mb-10'>
      <div className='card-header px-6'>
        <Title title='Card Details' sticky={false} className='my-2' />
      </div>
      <div className='card-body px-5 py-3'>
        <div className='row'>
          <div className='col-lg-6 mb-5'>
            <label htmlFor='card_name' className={cx(configClass?.label, 'required')}>
              Name on Card
            </label>
            <Field
              name='card_name'
              placeholder='Enter Name on Card'
              className={configClass?.form}
            />
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='card_name' />
            </div>
          </div>
          <div className='col-lg-6 mb-5'>
            <label htmlFor='cvc' className={cx(configClass?.label, 'required')}>
              Security Code
            </label>
            <div className='input-group input-group-solid align-items-center m-0'>
              <InputMask
                mask='999'
                id='security_code'
                type='password'
                maskChar=''
                alwaysShowMask={false}
                className={configClass?.form}
                placeholder='Security Code'
                onChange={({target: {value}}: any) =>
                  setFieldValue('cvc', value.replace(/[^0-9]+/g, ''))
                }
              />
              <IMG path={'/media/icons/duotone/Shopping/Credit-card.svg'} className={'h-30px'} />
            </div>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='cvc' />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-6 mb-5'>
            <label htmlFor='number' className={cx(configClass?.label, 'required')}>
              Card Number
            </label>
            <div className='input-group input-group-solid align-items-center m-0'>
              <Field
                name='card_number'
                type='password'
                autoComplete='off'
                placeholder='Enter Card Number'
                maxLength='16'
                className={configClass?.form}
                onChange={({target: {value}}: any) =>
                  setFieldValue('card_number', value.replace(/[^0-9]+/g, ''))
                }
              />
              <div className=''>
                <IMG path={'/media/svg/card-logos/american-express.svg'} className={'h-30px'} />
                <IMG path={'/media/svg/card-logos/mastercard.svg'} className={'h-30px'} />
                <IMG path={'/media/svg/card-logos/visa.svg'} className={'h-30px'} />
              </div>
            </div>
            <div className='fv-plugins-message-container invalid-feedback'>
              <ErrorMessage name='card_number' />
            </div>
          </div>
          <div className='col-lg-6 mb-5'>
            <div className='row'>
              <div className='col'>
                <label htmlFor='exp_month' className={cx(configClass?.label, 'required')}>
                  Expiry Date
                </label>
                <div className='input-group  input-group-solid align-items-center m-0'>
                  <Datetime
                    className='col'
                    closeOnSelect
                    inputProps={{
                      id: 'exp_month',
                      autoComplete: 'off',
                      className: `${configClass?.form} exipry-date`,
                      placeholder: 'MM/YY',
                      name: 'exp_month',
                    }}
                    timeFormat={false}
                    dateFormat='MM-YYYY'
                    onChange={(e: any) => {
                      const exp_month = moment(e).format('MM')
                      const exp_year = moment(e).format('YYY').slice(2)
                      setFieldValue('exp_month', exp_month)
                      setFieldValue('exp_year', exp_year)
                    }}
                  />
                  <div
                    style={{cursor: 'pointer', height: 36}}
                    className='d-flex align-items-center justify-content-center'
                    onClick={handleClick}
                  >
                    <i className='fa fa-calendar-alt fa-lg me-4 icon' />
                  </div>
                </div>
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='exp_month' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

CardDetail = memo(
  CardDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {CardDetail}
