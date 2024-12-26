import {ToastMessage} from '@components/toast-message'
import {configClass, generateUrl, KTSVG} from '@helpers'
import {mailForgotPassword} from '@pages/profile/redux/Services'
import {Field} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

const fullUri = window.location.host
const subdomain = fullUri?.split('.')?.[0]
const minCharRegex =
  subdomain === 'petronas'
    ? /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{14,}/
    : /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}/
const textNumber = subdomain === 'petronas' ? '14' : '8'

const passMessage = [
  {
    id: 1,
    regex: /[!@#$%^&*(),.?":{}|<>]/,
    message: 'At least one special character.',
    status: false,
  },
  {id: 2, regex: /[a-z]/, message: 'At least one lowercase letter.', status: false},
  {id: 3, regex: /[A-Z]/, message: 'At least one uppercase letter.', status: false},
  {id: 4, regex: /[0-9]/, message: 'At least one number.', status: false},
  {id: 5, regex: minCharRegex, message: `Min ${textNumber} character.`, status: false},
]

let ChangePassword: FC<any> = ({errors, touched}) => {
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {email}: any = user || {}
  const [currentPasswordShown, setCurrentPasswordShown] = useState<boolean>(false)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [repeatPasswordShown, setRepeatPasswordShown] = useState<boolean>(false)
  const [showValidation, setShowValidation] = useState<boolean>(false)
  const [newPasswordMessage, setNewPasswordMessage] = useState<any>([])

  const forgotPassword = () => {
    const return_ok_url = generateUrl('set-password')
    mailForgotPassword({email, return_ok_url})
      .then(({data: {message}}: any) => {
        ToastMessage({type: 'success', message: message})
      })
      .catch(() => {
        ToastMessage({type: 'error', message: "Tenant doesn't exist"})
      })
  }

  const toggleCurrentPassword = () => {
    setCurrentPasswordShown(!currentPasswordShown)
  }

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const toggleRepeatPassword = () => {
    setRepeatPasswordShown(!repeatPasswordShown)
  }

  const onChange = (e: any) => {
    setShowValidation(true)
    passMessage?.forEach((message: any) => {
      const regex = message.regex
      if (regex.test(e)) {
        return (message.status = true)
      } else {
        return (message.status = false)
      }
    })
  }

  useEffect(() => {
    setNewPasswordMessage(passMessage as never)
  }, [])

  return (
    <div>
      <div className='row'>
        <div className='col-12 p-5'>
          <div className='row'>
            <div className='col-12'>
              <label className={`${configClass?.label} required`}>Current Password</label>
              <div className='pass-wrapper d-flex align-items-center input-group input-group-solid'>
                <Field
                  type={currentPasswordShown ? 'text' : 'password'}
                  name='password.old_password'
                  placeholder='Enter Current Password'
                  className={configClass?.form}
                />
                <span className='visible me-2' onClick={toggleCurrentPassword}>
                  {currentPasswordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-open-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-primary'}
                    />
                  )}
                  {!currentPasswordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-closed-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-dark-75'}
                    />
                  )}
                </span>
              </div>
              {touched?.password?.old_password && errors?.password?.old_password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <KTSVG
                      path={'/media/icons/duotone/Code/Error-circle.svg'}
                      className={'svg-icon svg-icon-1x svg-icon-danger'}
                    />
                    <span role='alert' className='mx-1'>
                      {errors?.password?.old_password}
                    </span>
                  </div>
                </div>
              )}
              <div className='py-4 m-1'>
                Forgot your password?
                <a onClick={forgotPassword} className='mx-2'>
                  <strong>Click here</strong>
                </a>
                and we’ll email you a link to reset your password.
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-12'>
              <label className={`${configClass?.label} required`}>New Password</label>
              <div className='pass-wrapper d-flex align-items-center input-group input-group-solid'>
                <Field
                  type={passwordShown ? 'text' : 'password'}
                  name='password.new_password'
                  placeholder='Enter New Password'
                  className={configClass?.form}
                  onChangeCapture={({target}: any) => {
                    const {value} = target
                    const passwd = `${value}`
                    onChange(passwd)
                  }}
                />
                <span className='visible me-2' onClick={togglePassword}>
                  {passwordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-open-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-primary'}
                    />
                  )}
                  {!passwordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-closed-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-dark-75'}
                    />
                  )}
                </span>
              </div>
              <div className='fv-plugins-message-container invalid-feedback'>
                {showValidation && (
                  <div>
                    {Array.isArray(newPasswordMessage) &&
                      newPasswordMessage.map(({message, status}: any, index: number) => {
                        if (status) {
                          return (
                            <p className='text-success' key={index}>
                              <KTSVG
                                path={'/media/icons/duotone/Code/Done-circle.svg'}
                                className={'svg-icon svg-icon-1x svg-icon-success'}
                              />
                              <span className='mx-1'>{message}</span>
                            </p>
                          )
                        } else {
                          return (
                            <p className='text-danger me-3' key={index}>
                              <KTSVG
                                path={'/media/icons/duotone/Code/Error-circle.svg'}
                                className={'svg-icon svg-icon-1x svg-icon-danger'}
                              />
                              <span className='mx-1'>{message}</span>
                            </p>
                          )
                        }
                      })}
                  </div>
                )}
                {touched?.password?.new_password &&
                  errors?.password?.new_password &&
                  errors?.password?.new_password === 'New password is required.' && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <KTSVG
                          path={'/media/icons/duotone/Code/Error-circle.svg'}
                          className={'svg-icon svg-icon-1x svg-icon-danger'}
                        />
                        <span role='alert' className='mx-1'>
                          {errors?.password?.new_password}
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-12'>
              <label className={`${configClass?.label} required`}>Repeat New Password</label>
              <div className='pass-wrapper d-flex align-items-center input-group input-group-solid'>
                <Field
                  type={repeatPasswordShown ? 'text' : 'password'}
                  name='password.new_password_confirm'
                  placeholder='Enter Repeat New Password'
                  className={configClass?.form}
                />
                <span className='visible me-2' onClick={toggleRepeatPassword}>
                  {repeatPasswordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-open-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-primary'}
                    />
                  )}
                  {!repeatPasswordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-closed-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-dark-75'}
                    />
                  )}
                </span>
              </div>
              {touched?.password?.new_password_confirm &&
                errors?.password?.new_password_confirm && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <KTSVG
                        path={'/media/icons/duotone/Code/Warning-1-circle.svg'}
                        className={'svg-icon svg-icon-1x svg-icon-danger'}
                      />
                      <span role='alert' className='mx-1'>
                        {errors?.password?.new_password_confirm}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ChangePassword = memo(ChangePassword)
export {ChangePassword}
