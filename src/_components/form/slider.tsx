import './custom.scss'

import {FC, useLayoutEffect, useRef} from 'react'

const BasicSlider: FC<any> = ({
  placement = 'top',
  min = 0,
  max = 100,
  value = 0,
  defaultValue = 0,
  step = 1,
  onChange = () => '',
  ondragend = () => '',
}) => {
  const inputRef: any = useRef()
  const valueRef: any = useRef()
  const isTop: boolean = placement !== 'bottom'
  useLayoutEffect(() => {
    if (inputRef?.current && valueRef?.current) {
      const inputRange: any = inputRef?.current
      const valueRange: any = valueRef?.current
      if (value) {
        inputRef.current.value = value
      }
      const units: any = ''
      const off: any =
        (inputRange?.offsetWidth - 5) / (parseInt(inputRange?.max) - parseInt(inputRange?.min))
      const px: any =
        (inputRange?.valueAsNumber - parseInt(inputRange?.min)) * off -
        valueRange?.offsetParent.offsetWidth / 2

      valueRange.parentElement.style.left = `${px}px`
      valueRange.parentElement.style.top = `${inputRange?.offsetHeight - (isTop ? 50 : -8)}px`
      valueRange.innerHTML = `${inputRange?.value} ${units}`

      inputRange.oninput = () => {
        valueRange.style.visibility = 'visible'
        const px: any =
          (inputRange?.valueAsNumber - parseInt(inputRange?.min)) * off -
          (valueRange?.offsetWidth - 5) / 2
        valueRange.innerHTML = `${inputRange?.value} ${units}`
        valueRange.parentElement.style.left = `${px}px`
        onChange(inputRange?.value)
      }
      inputRange.ontouchend = () => {
        valueRange.style.visibility = 'hidden'
        ondragend(inputRange?.value)
      }
      inputRange.onmouseup = () => {
        valueRange.style.visibility = 'hidden'
        ondragend(inputRange?.value)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return (
    <div className='position-relative'>
      <div className='position-absolute' style={{zIndex: 1}}>
        <div
          ref={valueRef}
          className='slider-tooltip'
          data-placement={isTop ? 'top' : 'bottom'}
          style={{visibility: 'hidden'}}
        />
      </div>
      <input
        ref={inputRef}
        type='range'
        className='form-range border-0'
        min={min}
        max={max}
        defaultValue={defaultValue}
        step={step}
      />
    </div>
  )
}

export {BasicSlider}
