/* eslint-disable react-hooks/exhaustive-deps */
import {InputMentions} from '@components/form/InputMentions'
import {KTSVG} from '@helpers'
import {FC, memo, useRef} from 'react'

interface Props {
  data: any
  comment: any
  setComment: any
  onClick: () => void
  onKeyDown: any
}

let IsCommentBox: FC<Props> = ({data, comment, setComment, onClick, onKeyDown}) => {
  const messagesRef: any = useRef()

  return (
    <div className='card-body pb-0'>
      <div className='d-flex'>
        <div className='d-flex flex-grow-1 row' style={{overflowY: 'auto', height: '189px'}}>
          {Array.isArray(data) &&
            data?.map((item: any, index: number) => {
              const messageContent = item?.message !== null ? item?.message?.content : []
              return (
                <div className='d-flex flex-column col-12 mb-7' key={index} data-cy='commentUser'>
                  <label className='text-gray-800 text-hover-primary fs-6 fw-bolder comment-user'>
                    {item?.creator?.name || '-'}
                  </label>
                  <div className='my-2'>
                    <div className='text-gray-800' data-cy='commentBody'>
                      {messageContent?.length > 0 &&
                        messageContent?.map((arr: any, key: any) => {
                          const indexKey: any = key + 1
                          if (arr?.type === 'text') {
                            return (
                              <span key={indexKey} className='comment-body'>
                                {arr?.text || '-'}
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
            onClick={onClick}
          >
            <KTSVG path='/media/icons/duotone/Communication/Send.svg' className='svg-icon-2 mb-3' />
          </span>
        </div>
      </form>
    </div>
  )
}

IsCommentBox = memo(
  IsCommentBox,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default IsCommentBox
