import './style.scss'

import {base64ToArrayBuffer, isValidURL} from '@helpers'
import {convertToHtml} from 'mammoth'
import {FC, useEffect, useState} from 'react'
export const DOCX: FC<any> = ({src}) => {
  const [docx, setDocx] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (isValidURL(src)) {
      fetch(src)
        .then((res: any) => res.arrayBuffer())
        .then((arrayBuffer: any) => {
          convertToHtml({arrayBuffer}).then(({value}: any) => {
            setDocx(value)
            setLoading(false)
          })
          // .done()
        })
        .catch(() => {
          setDocx('<div>failed to load response</div>')
          setLoading(false)
        })
    } else {
      if (src !== null) {
        const arrayBuffer = base64ToArrayBuffer(src)
        convertToHtml({arrayBuffer}).then(({value}: any) => {
          setDocx(value)
          setLoading(false)
        })
        // .done()
      }
    }
    return () => {
      // unmounting
      setDocx('')
      setLoading(true)
    }
  }, [src])
  return (
    <>
      {loading ? (
        <div className='react-docx p-5 d-flex align-items-center justify-content-center text-muted'>
          waiting for load document . . .
        </div>
      ) : (
        <div className='react-docx p-5' dangerouslySetInnerHTML={{__html: docx}} />
      )}
    </>
  )
}
