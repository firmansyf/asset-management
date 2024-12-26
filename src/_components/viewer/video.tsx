import {FC, useEffect, useRef} from 'react'
import ReactPlayer from 'react-player/lazy'

export const Video: FC<any> = ({src}) => {
  const videoRef: any = useRef()

  useEffect(() => {
    videoRef.current.addEventListener(
      'contextmenu',
      (e: any) => {
        e.preventDefault()
      },
      false
    )

    return videoRef.current.removeEventListener(
      'contextmenu',
      (e: any) => {
        e.preventDefault()
      },
      false
    )
  }, [])

  return (
    <div ref={videoRef} style={{margin: '20px'}}>
      <ReactPlayer
        width='100%'
        height='100%'
        controls={true}
        url={src}
        config={{file: {attributes: {controlsList: 'nodownload'}}}}
      />
    </div>
  )
}
