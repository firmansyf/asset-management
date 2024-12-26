import IsCommentBox from '@components/form/commentSection'
import {Title as CardTitle} from '@components/form/Title'
import {ToastMessage} from '@components/toast-message'
import {getPoliciesComment, postPoliciesComment} from '@pages/insurance/policies/Service'
import {FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState} from 'react'

let Comment: FC<any> = (props: any) => {
  const messagesRef: any = useRef<any>(null)

  const [comment, setComment] = useState<string>('')
  const [rowComment, setRowComment] = useState<any>([])
  const [countComment, setCountComment] = useState<number>(0)
  const [reloadComment, setReloadComment] = useState<number>(0)

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  const sendComment = () => {
    if (comment !== '') {
      const {guid}: any = props?.data || {}

      const result: any = []
      let textComment: any = comment?.replace(/ *\[[^)]*\] */g, ' ')
      textComment = textComment?.replace(/ *\(*\( */g, '')
      textComment = textComment?.replace(/ *\(*\) */g, ' ')

      for (const a of comment?.split(' @')) {
        const key: any = a?.substring(a?.lastIndexOf('[') + 1, a?.lastIndexOf(']'))
        const value: any = a?.substring(a?.lastIndexOf('(') + 1, a?.lastIndexOf(')'))

        if (key !== '' && value !== '') {
          result?.push({
            type: 'mention',
            attrs: {
              guid: key || '',
              text: '@' + value || '',
            },
          })
        }
      }
      result?.push({type: 'text', text: textComment || ''})

      const params: any = {
        message: {
          content: result as never[],
        },
      }

      postPoliciesComment(params, guid)
        .then(() => {
          setComment('')
          setReloadComment(reloadComment + 1)
          setTimeout(() => scrollToBottom(), 1000)
        })
        .catch(({response}: any) => {
          const {devMessage, data, message} = response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            }

            if (fields) {
              Object.keys(fields || {})?.forEach((item: any) => {
                ToastMessage({message: fields?.[item]?.[0] || 'Error.', type: 'error'})
              })
            }
          }
        })
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event?.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()

      sendComment()
      setComment('')
    }
  }

  const getDataComment = useCallback(() => {
    const {guid} = props?.data || {}

    guid &&
      getPoliciesComment(guid).then(({data: {data: res}}: any) => {
        if (res) {
          setRowComment(res)
          setCountComment(res?.length)
          setTimeout(() => scrollToBottom(), 1000)
        }
      })
  }, [props])

  useEffect(() => {
    countComment !== rowComment?.length && setTimeout(() => scrollToBottom(), 1000)
  }, [rowComment, countComment])

  useEffect(() => {
    getDataComment()
  }, [getDataComment, reloadComment])

  return (
    <div className='card border border-gray-300 mt-6'>
      <div className='card-header align-items-center px-4'>
        <CardTitle title='Comments' sticky={false} />
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
