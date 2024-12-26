import {InputMentions} from '@components/form/InputMentions'
import {Title as CardTitle} from '@components/form/Title'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {getMeterComment, postMeterComment} from '@pages/maintenance/Service'
import {FC, KeyboardEvent, memo, useCallback, useEffect, useRef, useState} from 'react'

let Comment: FC<any> = (props: any) => {
  const messagesRef = useRef<any>(null)
  const [rowComment, setRowComment] = useState<any>([])
  const [comment, setComment] = useState<string>('')
  const [countComment, setCountComment] = useState<number>(0)
  const [reloadComment, setReloadComment] = useState<number>(0)

  const scrollToBottom = () => {
    messagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }

  const sendComment = () => {
    const {data}: any = props || {}
    const {guid}: any = data || {}
    const result: any = []
    let textComment: any = comment.replace(/ *\[[^)]*\] */g, ' ')
    textComment = textComment.replace(/ *\(*\( */g, '')
    textComment = textComment.replace(/ *\(*\) */g, ' ')

    for (const a of comment.split(' @')) {
      const value: any = a.substring(a.lastIndexOf('(') + 1, a.lastIndexOf(')'))
      const key: any = a.substring(a.lastIndexOf('[') + 1, a.lastIndexOf(']'))
      if (key !== '' && value !== '') {
        result.push({
          type: 'mention',
          attrs: {
            guid: key,
            text: '@' + value,
          },
        })
      }
    }
    result.push({type: 'text', text: textComment})

    const params: any = {
      message: {
        content: result,
      },
    }

    if (textComment === '') {
      ToastMessage({message: 'The comment cannot be blank', type: 'error'})
    } else {
      postMeterComment(params, guid)
        .then(() => {
          setReloadComment(reloadComment + 1)
          setComment('')
          setTimeout(() => {
            scrollToBottom()
          }, 1000)
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
      getMeterComment(guid)
        .then(({data: {data: res}}) => {
          if (res) {
            setRowComment(res)
            setCountComment(res?.length)
          }
        })
        .catch(() => '')
    }
  }, [props])

  useEffect(() => {
    if (countComment !== rowComment?.length) {
      setTimeout(() => {
        scrollToBottom()
      }, 1000)
    }
  }, [rowComment, countComment])

  useEffect(() => {
    getDataComment()
  }, [getDataComment, reloadComment])

  return (
    <div className='card card-custom border border-2 mt-5'>
      <div className='card-header align-items-center px-5'>
        <CardTitle title='Comments' sticky={false} />
      </div>
      <div className='card-body pb-0'>
        <div className='d-flex'>
          <div className='d-flex flex-grow-1 row' style={{overflowY: 'auto', height: '189px'}}>
            {Array.isArray(rowComment) &&
              rowComment?.map((item: any, index: any) => {
                const messageContent = item?.message !== null ? item?.message?.content : []
                return (
                  <div className='d-flex flex-column col-12 mb-7' key={index} data-cy='commentUser'>
                    <label className='text-gray-800 text-hover-primary fs-6 fw-bolder comment-user'>
                      {item?.creator?.name || '-'}
                    </label>
                    <div className='my-2'>
                      <div className='text-gray-800' data-cy='commentBody'>
                        {messageContent?.length > 0 &&
                          messageContent.map((arr: any, key: any) => {
                            if (arr.type === 'text') {
                              return (
                                <span key={key} className='comment-body'>
                                  {arr.text || '-'}
                                </span>
                              )
                            } else {
                              return ''
                            }
                          })}
                      </div>
                    </div>
                    <span className='text-gray-400 fw-bold' data-cy='commentCreateAt'>
                      {item?.created_at}
                    </span>
                  </div>
                )
              })}
            <div ref={messagesRef} />
          </div>
        </div>
        <div className='separator mb-4'></div>
        <form className='position-relative mb-6'>
          <InputMentions comment={comment} setComment={setComment} onKeyDown={onKeyDown} />
          <div className='position-absolute top-0 end-0 me-n5 btnComment'>
            <span
              className={`btn pt-3 btn-icon btn-sm ${
                comment !== '' ? 'btn-active-color-primary' : 'btn-secondary'
              } ps-0`}
              onClick={comment !== '' ? sendComment : undefined}
            >
              <KTSVG
                path='/media/icons/duotone/Communication/Send.svg'
                className='svg-icon-2 mb-3'
              />
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

Comment = memo(Comment, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Comment
