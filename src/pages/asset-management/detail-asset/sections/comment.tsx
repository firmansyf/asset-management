/* eslint-disable react-hooks/exhaustive-deps */
import IsCommentBox from '@components/form/commentSection'
import {Title as CardTitle} from '@components/form/Title'
import {ToastMessage} from '@components/toast-message'
import {getAssetComment, postAssetComment} from '@pages/asset-management/redux/AssetComment'
import {FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState} from 'react'

let Comment: FC<any> = (props: any) => {
  const messagesRef = useRef<any>(null)
  const [rowComment, setRowComment] = useState<any>([])
  const [comment, setComment] = useState<any>('')
  const [reloadComment, setReloadComment] = useState<number>(0)
  const [commentScrolling, setCommentScrolling] = useState<boolean>(false)

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  const sendComment = () => {
    if (comment !== '') {
      const {data}: any = props || {}
      const {guid}: any = data || {}
      const result: any = []
      let textComment: any = comment?.replace(/ *\[[^)]*\] */g, ' ')
      textComment = textComment?.replace(/ *\(*\( */g, '')
      textComment = textComment?.replace(/ *\(*\) */g, ' ')

      for (const a of comment?.split(' @')) {
        const value: any = a.substring(a.lastIndexOf('(') + 1, a.lastIndexOf(')'))
        const key: any = a.substring(a.lastIndexOf('[') + 1, a.lastIndexOf(']'))
        if (key !== '' && value !== '') {
          result?.push({
            type: 'mention',
            attrs: {
              guid: key,
              text: '@' + value,
            },
          })
        }
      }
      result?.push({type: 'text', text: textComment})

      const params: any = {
        message: {
          content: result,
        },
      }

      postAssetComment(params, guid)
        .then(() => {
          setComment('')
          setReloadComment(reloadComment + 1)
        })
        .catch((err: any) => {
          const {devMessage, data, message}: any = err?.response?.data || {}
          if (!devMessage) {
            const {fields}: any = data || {}
            if (fields === undefined) {
              ToastMessage({message: message, type: 'error'})
            }
            if (fields) {
              Object.keys(fields || {})?.forEach((item: any) => {
                ToastMessage({message: fields?.[item]?.[0], type: 'error'})
              })
            }
          }
        })
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      sendComment()
      setComment('')
    }
  }

  const getDataComment = useCallback(() => {
    const {data}: any = props || {}
    const {guid}: any = data || {}

    if (guid) {
      getAssetComment(guid)
        .then(({data: {data: res}}) => {
          if (res) {
            setRowComment(res)
          }
        })
        .catch(() => '')
    }
  }, [props])

  useEffect(() => {
    getDataComment()
  }, [reloadComment])

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 1600)
  }, [reloadComment])

  useEffect(() => {
    document.addEventListener('scroll', () => {
      setCommentScrolling(true)
    })
  }, [])

  useEffect(() => {
    if (commentScrolling) {
      scrollToBottom()
    }
  }, [commentScrolling])

  return (
    <div className='card border border-gray-200 border-2 mt-6'>
      <div className='card-header align-items-center px-4'>
        <CardTitle
          title='Comments'
          sticky={false}
          icon={''}
          uppercase={false}
          space='0'
          line={false}
        />
      </div>

      <IsCommentBox
        data={rowComment}
        comment={comment}
        setComment={setComment}
        onClick={sendComment}
        onKeyDown={onKeyDown}
      />
    </div>
  )
}

Comment = memo(Comment, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Comment
