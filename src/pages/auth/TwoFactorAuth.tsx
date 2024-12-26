import {
  checkTwoFactorAuth,
  countdownTwoFactorAuth,
  getUserFromLogin,
  resendTwoFactorAuth,
} from '@api/AuthCRUD'
import {
  getCountry,
  getCurrency,
  getDateFormat,
  getFeature,
  getPhoneCode,
  getPreference,
  getTimeFormat,
  getTimezone,
} from '@api/authPreference'
import {ToastMessage} from '@components/toast-message'
import {toAbsoluteUrl} from '@helpers'
import {saveCurrentUser, savePreference, saveToken} from '@redux'
import axios from 'axios'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'

import OTPInput from './components/two-factor-auth'

const TwoFactorAuthentication: FC = () => {
  const params = new URLSearchParams(window.location.search)
  const token: any = params.get('response')
  const nextRequest: any = params.get('request')
  const [reloadOTP, setReloadOTP] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [countDownTime, setCountDownTime] = useState<string>('')

  const [currentTime, setCurrentTime] = useState<any>(moment())
  const [timeBetween, setTimeBetween] = useState<any>(moment())

  const onChangeAction = (code: any) => {
    setErrorMessage('')
    if (code.length === 6) {
      checkTwoFactorAuth({code: code}, token)
        .then(async () => {
          const {
            data: {data: user},
          }: any = await getUserFromLogin(token)
          await axios
            .all([
              getDateFormat(token),
              getTimeFormat(token),
              getTimezone(token),
              getCountry(token),
              getPreference(token),
              getCurrency(token),
              getFeature(token),
              getPhoneCode(token),
            ])
            .then(
              axios.spread(
                (
                  {data: {data: date_format}}: any,
                  {data: {data: time_format}}: any,
                  {data: {data: timezone}}: any,
                  {data: {data: country}}: any,
                  {data: {data: preference}}: any,
                  {data: {data: currency}}: any,
                  {data: {data: feature}}: any,
                  {data: {data: phone_code}}: any
                ) => {
                  savePreference({
                    date_format,
                    time_format,
                    timezone,
                    country,
                    preference,
                    currency,
                    feature,
                    phone_code,
                  })
                }
              )
            )

          await saveCurrentUser(user)
          await saveToken(token)

          const {registration_wizard_status, is_petronas}: any = user || {}

          if (registration_wizard_status === 1) {
            window.location.href = '/setup/wizard'
          } else if (nextRequest) {
            if (atob(nextRequest) === '/' && is_petronas === 1) {
              window.location.href = '/insurance-claims/all'
            } else {
              window.location.href = atob(nextRequest)
            }
          } else if (is_petronas === 1) {
            window.location.href = '/insurance-claims/all'
          } else {
            window.location.href = '/dashboard'
          }
        })
        .catch((error: any) => {
          setErrorMessage(error?.response?.data?.message)
        })
    }
  }

  const resendOtp = () => {
    setReloadOTP(true)
    resendTwoFactorAuth(token)
      .then((res: any) => {
        if (res?.status === 200) {
          ToastMessage({
            type: 'success',
            message: 'Resend otp code successfully, please check your email',
          })
          setReloadOTP(false)
          const interval: any = setInterval(() => {
            window.location.reload()
          }, 4000)
          return () => clearInterval(interval)
        }
      })
      .catch((error: any) => {
        setErrorMessage(error?.response?.data?.message)
        setReloadOTP(false)
      })
  }

  useEffect(() => {
    countdownTwoFactorAuth(token)
      .then((result: any) => {
        const dataTime: any = result?.data?.time
        const dataSeconds: any = dataTime.split(':').pop()
        setCountDownTime(moment().add(dataSeconds, 'seconds').format('YYYY-MM-DD hh:mm:ss'))
      })
      .catch(() => {
        /**/
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadOTP])

  useEffect(() => {
    const interval: any = setInterval(() => {
      setCurrentTime(moment().format('YYYY-MM-DD hh:mm:ss'))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setTimeBetween(moment.duration(moment(countDownTime).diff(currentTime)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime])

  return (
    <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-assetdata.png')} className='h-45px' />
        <div className='row two-factor-auth'>
          <div className='col-12 text-center'>
            <h1>Please enter your login code</h1>
            <span>
              Two-factor authentication (2FA) is enable for your account. <br />
              Please enter the code sent to your email to log in
            </span>

            <OTPInput
              autoFocus
              length={6}
              className='otpContainer'
              inputClassName='otpInput'
              isNumberInput={false}
              onChangeOTP={(code: any) => onChangeAction(code)}
            />
            {errorMessage !== '' && (
              <>
                <div className='fv-plugins-message-container invalid-feedback'>
                  <span role='alert'>
                    {errorMessage}
                    {timeBetween.seconds() > 0 && (
                      <div>
                        Wait {timeBetween.seconds()} seconds to resend the verification code
                      </div>
                    )}
                  </span>
                </div>
                {(!timeBetween.seconds() || timeBetween.seconds() < 0) && (
                  <button
                    type='button'
                    className='btn btn-sm btn-primary fw-bolder mt-5'
                    onClick={resendOtp}
                  >
                    Resend OTP Code
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export {TwoFactorAuthentication}
