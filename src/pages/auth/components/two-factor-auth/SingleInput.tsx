/* eslint-disable react/jsx-props-no-spreading */
import React, {memo, useLayoutEffect, useRef} from 'react'

import usePrevious from './HookUsePrevious'

export interface SingleOTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focus?: boolean
}

export function SingleOTPInputComponent(props: SingleOTPInputProps) {
  const {focus, autoFocus, ...rest} = props
  const inputRef = useRef<HTMLInputElement>(null)
  const prevFocus = usePrevious(!!focus)

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus()
      }
      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    }
  }, [autoFocus, focus, prevFocus])

  return <input type='number' inputMode='numeric' pattern='[0-9]*' ref={inputRef} {...rest} />
}

const SingleOTPInput = memo(SingleOTPInputComponent)

export default SingleOTPInput
