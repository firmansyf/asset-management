import {Result} from '@zxing/library'
import {FC} from 'react'

interface MediaTrackConstraintSet {
  aspectRatio?: any
  autoGainControl?: any
  channelCount?: any
  deviceId?: any
  displaySurface?: any
  echoCancellation?: any
  facingMode?: any
  frameRate?: any
  groupId?: any
  height?: any
  noiseSuppression?: any
  sampleRate?: any
  sampleSize?: any
  width?: any
}

interface MediaTrackConstraints extends MediaTrackConstraintSet {
  advanced?: MediaTrackConstraintSet[]
}

declare const BarcodeScannerComponent: ({
  onUpdate,
  onError,
  width,
  height,
  facingMode,
  torch,
  delay,
  videoConstraints,
  stopStream,
}: {
  onUpdate: (arg0: unknown, arg1?: Result) => void
  onError?: (arg0: string | DOMException) => void
  width?: number | string
  height?: number | string
  facingMode?: 'environment' | 'user'
  torch?: boolean
  delay?: number
  videoConstraints?: MediaTrackConstraints
  stopStream?: boolean
}) => FC
export default BarcodeScannerComponent
