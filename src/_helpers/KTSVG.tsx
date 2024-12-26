import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import SVG from 'react-inlinesvg'

type Props = {
  className?: string
  path: string
  svgClassName?: string
  width?: number
  height?: number
  style?: any
  alt?: any
}

const KTSVG: FC<Props> = ({
  className = '',
  path,
  svgClassName = 'mh-50px',
  width,
  height,
  style,
}) => {
  return (
    <span className={`svg-icon ${className}`}>
      <SVG
        src={toAbsoluteUrl(path)}
        className={svgClassName}
        width={width}
        height={height}
        style={style}
      />
    </span>
  )
}
const IMG: FC<Props> = ({className = '', path, width, height, style, alt = ''}) => {
  return (
    <img
      src={toAbsoluteUrl(path)}
      className={className}
      alt={alt}
      width={width || 'auto'}
      height={height || 'auto'}
      style={style}
    />
  )
}

export {IMG, KTSVG}
