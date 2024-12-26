/* eslint-disable react-hooks/exhaustive-deps */
import {getUserV1} from '@api/UserCRUD'
import {ToastMessage} from '@components/toast-message'
import {IMG, preferenceDateTime} from '@helpers'
import cx from 'classnames'
import moment from 'moment'
import {FC, Fragment, useCallback, useEffect, useRef, useState} from 'react'
import {Mention, MentionsInput} from 'react-mentions'
import {shallowEqual, useSelector} from 'react-redux'

import {getComment, sendComment} from '../Service'

const TicketComment: FC<any> = ({detailTicket, reloadAll}) => {
  const {currentUser: user, token} = useSelector(
    ({currentUser, token}: any) => ({currentUser, token}),
    shallowEqual
  )
  const pref_date_time: any = preferenceDateTime()
  const messagesRef = useRef<any>(null)
  const isComment: any = useRef<any>(null)
  const {photos}: any = user || {}

  const [reload, setReload] = useState<boolean>(false)
  const [dataComment, setDataComment] = useState<any>([])
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [commentBody, setCommentBody] = useState<string>('')
  const [countComment, setCountComment] = useState<number>(0)
  const [reloadComment, setReloadComment] = useState<number>(0)

  const defaultStyle: any = {
    control: {
      fontSize: 13,
      fontWeight: 'normal',
    },
    resize: 'none',
    height: '65px',
    backgroundColor: '#eef3f7',
    border: 'none',
    suggestions: {
      bottom: '195px',
      left: '2px',
      top: 'unset',
      border: '1px solid #e4e6ef',
      minWidth: '340px',
      maxHeight: '400px',
      overflow: 'scroll',
      list: {
        backgroundColor: '#f5f8fa',
        fontSize: '12px',
      },
      item: {
        padding: '10px 15px',
        '&focused': {
          backgroundColor: '#050990',
          color: '#fff',
        },
      },
    },
  }

  const isFocusedStyle: any = {
    control: {
      fontSize: 13,
      fontWeight: 'normal',
    },
    resize: 'none',
    height: '150px',
    backgroundColor: '#eef3f7',
    border: 'none',
    suggestions: {
      bottom: '155px',
      left: '2px',
      top: 'unset',
      border: '1px solid #e4e6ef',
      minWidth: '340px',
      maxHeight: '350px',
      overflow: 'scroll',
      list: {
        backgroundColor: '#f5f8fa',
        fontSize: '12px',
      },
      item: {
        padding: '10px 15px',
        '&focused': {
          backgroundColor: '#050990',
          color: '#fff',
        },
      },
    },
  }

  const defaultMentionStyle: any = {
    backgroundColor: '#eff2f5',
    position: 'relative',
    borderRadius: '0.475rem',
  }

  const getTop = (el: any) => el?.offsetTop + (el?.offsetParent && getTop(el?.offsetParent))

  const scrollToTop = () => {
    const el: any = document?.querySelector('#commentBody')
    const elTop: number = getTop(el)
    const topScrollPosition: number = elTop - 250

    messagesRef?.current?.scrollIntoView({
      behavior: 'smooth',
    })

    window?.scrollTo({
      behavior: 'smooth',
      top: topScrollPosition,
    })
  }

  const getDataComment = useCallback(() => {
    const {guid} = detailTicket || {}
    if (guid !== undefined) {
      getComment(guid, {})
        .then(({data: {data: res}}: any) => {
          if (res) {
            res?.reverse()
            setDataComment(res)
            setCountComment(res?.length)
          }
        })
        .catch(() => setDataComment([]))
    }
  }, [detailTicket, reload, reloadAll])

  const saveComment = () => {
    const result: any = []
    let textComment: any = commentBody?.replace(/ *\[[^)]*\] */g, ' ')
    textComment = textComment?.replace(/ *\(*\( */g, '')
    textComment = textComment?.replace(/ *\(*\) */g, ' ')

    for (const a of commentBody?.split(' @')) {
      const value: any = a?.substring(a?.lastIndexOf('(') + 1, a?.lastIndexOf(')'))
      const key: any = a?.substring(a?.lastIndexOf('[') + 1, a?.lastIndexOf(']'))

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

    const {guid} = detailTicket || {}
    sendComment(guid, params)
      .then(({data: {message}}: any) => {
        setCommentBody('')
        setReload(!reload)
        setIsFocused(false)
        setReloadComment(reloadComment + 1)
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          scrollToTop()
        }, 1000)
      })
      .catch(({response}: any) => {
        const {devMessage, data, message} = response?.data || {}
        const {fields} = data || {}

        if (!devMessage) {
          if (fields === undefined) {
            ToastMessage({message, type: 'error'})
          }
          if (fields) {
            Object.keys(fields || {}).forEach((item: any) => {
              ToastMessage({message: fields?.[item]?.[0] || 'Error.', type: 'error'})
            })
          }
        }
      })
  }

  const capitalizeFirst = (str: string) => str?.charAt(0)?.toUpperCase() + str?.slice(1)

  const fetchUsers = (query: any, callback: any) => {
    getUserV1({limit: 10, keyword: `*${query}*`})
      .then(({data: {data: res}}: any) => {
        const data_user = res?.map(({guid, first_name, last_name, email, role_label}: any) => {
          return {
            email: email || '-',
            display: guid || '',
            role: role_label || '-',
            fullName: (first_name || '') + ' ' + (last_name || ''),
            id: capitalizeFirst(first_name || '') + '' + capitalizeFirst(last_name || ''),
          }
        })
        return data_user as never[]
      })
      .then(callback)
      .catch(() => '')
  }

  const renderSuggestion = (
    suggestion: any,
    _search: any,
    _highlightedDisplay: any,
    index: any
  ) => {
    return (
      <div className='parent' style={{display: 'flex'}} key={index || 0}>
        <i className='lar la-user' style={{fontSize: '35px'}}></i>
        <div style={{marginLeft: '7px'}}>
          <div style={{width: '100%'}}>{suggestion?.fullName || '-'}</div>
          <div className='title' style={{width: '100%', fontSize: '12px'}}>
            {suggestion?.email || '-'}
          </div>
          <div className='title' style={{width: '100%', fontSize: '11px'}}>
            {suggestion?.role || '-'}
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    if (countComment !== dataComment?.length) {
      setTimeout(() => {
        scrollToTop()
        oldComment()
      }, 1000)
    }
  }, [dataComment, countComment])

  useEffect(() => {
    getDataComment()
  }, [getDataComment, reloadComment])

  const oldComment = () => {
    isComment?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }

  return (
    <Fragment key='comment'>
      <div className='position-sticky bottom-0' style={{zIndex: 90}}>
        <div className='card border radius-0 border-gray-300 mt-4'>
          <div className='card-body p-5'>
            <div className={cx('row', {'align-items-center': !isFocused})}>
              <div className='col'>
                <MentionsInput
                  value={commentBody}
                  placeholder='Write your comment here or use @ to mention someone.'
                  markup='@[__display__,__id__]'
                  className='rounded comment'
                  onFocus={() => setIsFocused(true)}
                  style={isFocused ? isFocusedStyle : defaultStyle}
                  onBlur={() => !commentBody && setIsFocused(false)}
                  onChange={({target: {value}}: any) => {
                    setCommentBody(value || '')
                    setIsFocused(true)
                  }}
                >
                  <Mention
                    trigger='@'
                    data={fetchUsers}
                    style={defaultMentionStyle}
                    renderSuggestion={renderSuggestion}
                    displayTransform={(display: any) => `@${display || ''}`}
                  />
                </MentionsInput>
              </div>

              {!isFocused ? (
                <div className='col-auto'>
                  <button
                    type='button'
                    className='btn btn-sm btn-icon w-30px h-30px rounded-circle btn-primary'
                    onClick={saveComment}
                  >
                    <i className='las la-paper-plane fs-2' />
                  </button>
                </div>
              ) : (
                <div className='col-12 mt-3 text-end'>
                  <button
                    className='btn btn-sm btn-light me-2'
                    onClick={() => {
                      setCommentBody('')
                      setIsFocused(false)
                    }}
                  >
                    Cancel
                  </button>
                  <button className='btn btn-sm btn-primary' onClick={saveComment}>
                    <i className='las la-plus' />
                    Add Comment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        id='commentBody'
        className={cx('card border-bottom border-start border-end radius-0 border-gray-300 pb-20', {
          'd-none': dataComment?.length < 1,
        })}
      >
        <div
          className='card-body align-items-center p-4'
          style={{maxHeight: '345px', overflow: 'scroll', marginTop: '15px'}}
        >
          <div ref={messagesRef} />
          {dataComment &&
            dataComment?.length > 0 &&
            dataComment?.map((item: any, index: any) => {
              const {created_at, creator, message}: any = item || {}
              const momentObj: any = moment(created_at, [pref_date_time])
              const messageDate: any = moment(momentObj, 'YYYY-MM-DD HH:mm:ss').fromNow()
              const messageData: any = message?.content?.find(({type}: any) => type === 'text')

              return (
                <div className='row mb-3' key={index || 0} ref={isComment}>
                  <div className='col-auto pe-1'>
                    <IMG
                      alt='blank.png'
                      path={`${
                        photos?.length > 0
                          ? `${photos?.[0]?.url}?token=${token}`
                          : '/images/blank.png'
                      }`}
                      className='h-20px rounded-circle me-2'
                    />
                  </div>
                  <div className='col ps-0'>
                    <div className='fw-bolder mb-1'>{creator?.name || '-'}</div>
                    <div className='bg-f5 py-2 px-4 radius-20 fs-7 mb-1 d-inline-block'>
                      {/* {message?.content?.[1]?.text || message?.content?.[0]?.text || '-'} */}
                      {messageData?.text || '-'}
                    </div>
                    <div className='fw-bold fs-9 text-capitalize'>
                      <div className='text-gray-500'>
                        {messageDate || ''}, {created_at?.toUpperCase() || ''}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
        <div className='card-footer text-center p-2'>
          <span className='btn btn-sm fw-bolder fs-7 text-primary' onClick={oldComment}>
            Load Old Comments
          </span>
        </div>
      </div>
    </Fragment>
  )
}

export default TicketComment
