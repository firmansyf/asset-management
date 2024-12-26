import cx from 'clsx'
import {FC} from 'react'

export const Button: FC<any> = ({
  type = 'button',
  size = 'sm',
  text = 'Button',
  theme = 'light',
  className = '',
  icon = 'check',
  iconClass = '',
  circle = false,
  dir = 'left',
  onClick = () => '',
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cx(
        `btn btn-flex btn-${size} btn-${theme}`,
        {'radius-50': circle},
        dir !== 'right' ? 'ps-4 pe-5' : 'ps-5 pe-3',
        className
      )}
      onClick={onClick}
    >
      {loading ? (
        <span className='indicator-progress d-block'>
          Please wait...
          <span className='spinner-border spinner-border-sm align-middle ms-2' />
        </span>
      ) : (
        <>
          {dir !== 'right' && <i className={`las la-${icon} ${iconClass} ${icon ? 'me-1' : ''}`} />}
          {text}
          {dir === 'right' && <i className={`las la-${icon} ${iconClass} ${icon ? 'ms-2' : ''}`} />}
        </>
      )}
    </button>
  )
}

export const ButtonPill: FC<any> = ({
  type = 'button',
  onClick = () => '',
  title = 'Button',
  titleClass = 'fw-bolder',
  size = 'sm',
  icon = 'check',
  theme = 'primary',
  className = '',
  right = false,
  radius = 50,
}: any) => {
  let padding: number = 2
  let diameter: number = 20
  let fs: any = ''
  let border: any = ''
  if (size === 'md') {
    padding = 3
    diameter = 25
    fs = 4
  }
  if (size === 'lg') {
    padding = 4
    diameter = 35
    fs = 2
  }
  if (theme?.includes('light-')) {
    theme = 'light'
  }
  const isLight: boolean = !!theme?.match(/(light-?|white)/gi)
  isLight && (border = 'border border-dd')
  return (
    <div className={`d-inline ${className}`}>
      <button
        type={type}
        onClick={onClick}
        className={`btn btn-flex btn-${size} btn-light-${theme} radius-${radius} p-${padding} ${border}`}
      >
        {right && <span className={`px-2 ${titleClass}`}>{title}</span>}
        <span
          className={`btn btn-icon w-${diameter}px h-${diameter}px btn-${theme} rounded-circle ${border}`}
        >
          <i className={`las la-${icon} fs-${fs} text-${isLight ? 'dark' : 'white'}`} />
        </span>
        {!right && <span className={`px-2 ${titleClass}`}>{title}</span>}
      </button>
    </div>
  )
}

export const ButtonIcon: FC<any> = ({
  type = 'button',
  onClick = () => '',
  size = 'sm',
  icon = 'check',
  theme = 'primary',
  className = '',
}: any) => {
  let diameter: number = 25
  let fs: any = 3
  const border: any = ''
  if (size === 'md') {
    diameter = 30
    fs = 2
  }
  if (size === 'lg') {
    diameter = 40
    fs = '2x'
  }
  return (
    <div className={`d-inline ${className}`}>
      <button
        type={type}
        onClick={onClick}
        className={`btn btn-icon w-${diameter}px h-${diameter}px btn-${size} btn-${theme} radius-50 p-2 ${border}`}
      >
        <i className={`las la-${icon} fs-${fs}`} />
      </button>
    </div>
  )
}
