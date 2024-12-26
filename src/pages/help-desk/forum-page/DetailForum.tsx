import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {IMG, PageSubTitle, toAbsoluteUrl} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import parse from 'html-react-parser'
import {FC, useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import {useOutletContext, useParams} from 'react-router-dom'

import {ActionBtn} from './section/actions'
import {Links} from './section/links'
import {ReplyForum} from './section/replyForum'
import {getForumDetails} from './service'

const DetailForum: FC<any> = () => {
  const params: any = useParams()
  const {style, setReloadParent = () => ''}: any = useOutletContext()
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const {guid} = params || {}

  const [detail, setDetail] = useState<any>()
  const [reload, setReload] = useState<any>(0)
  const [showReply, setShowReply] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<any>({body: ''})
  const [reloadReply, setReloadReply] = useState<number>(0)
  const [isReplyLoading, setIsReplyLoading] = useState(false)

  const imgSize: any = '35px'

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 3500)
  }, [])

  useEffect(() => {
    setLoading(true)
    getForumDetails(guid)
      .then(({data}: any) => {
        setDetail(data?.data)
        setTimeout(() => setLoading(false), 100)
      })
      .catch(() => setTimeout(() => setLoading(false), 100))
  }, [guid, reload, reloadReply])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{detail?.title || 'Detail Forum'}</PageTitle>

      <PageSubTitle title={`Details of ${detail?.time_ago || '-'}`} />
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className='d-flex align-items-center justify-content-end p-3 border-bottom border-bottom-2'>
            <Dropdown>
              <Dropdown.Toggle variant='light-primary' size='sm' className='btn-flex p-2'>
                <span className='btn btn-icon w-20px h-20px ms-1 btn-primary rounded-circle'>
                  <i className='las la-link text-white' />
                </span>
                <span className='px-2'>Linked Ticket</span>
                <i className='las la-angle-down' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <div className='w-300px'>
                  <Links guid={guid} />
                </div>
              </Dropdown.Menu>
            </Dropdown>
            <ActionBtn
              data={detail}
              reload={reload}
              setReload={(e: any) => {
                setReload(e)
                setReloadParent(e)
              }}
              setShowReply={setShowReply}
              setIsReplyLoading={setIsReplyLoading}
              showReply={showReply}
              isReplyLoading={isReplyLoading}
            />
          </div>

          <div className='overflow-auto h-500px mb-5' style={style}>
            <div className='row m-0'>
              <div className='col-12'>
                <div className='row'>
                  <div className='col-12'>
                    <div className='card px-5 mb-20'>
                      <div className='d-flex mt-7 justify-content-between'>
                        <div className='d-flex flex-column card-body'>
                          <div className='d-flex fw-bolder mb-2 justify-content-end'>
                            {`${detail?.user?.first_name || '-'} ${detail?.user?.last_name || ''}`},
                            &nbsp;
                            <span className='badge bg-light-primary text-primary text-wrap'>
                              {detail?.category?.name}
                            </span>
                          </div>
                          <div className='text-end'>
                            <div
                              className='bg-f9 py-2 px-3 radius-10 fs-7 my-1 d-inline-block'
                              style={{width: 'fit-content'}}
                            >
                              {detail?.content ? parse(detail?.content) : '-'}
                            </div>
                            <div>
                              <span className='mx-2 text-gray-500 fs-8'>{detail?.time_ago}</span>
                            </div>
                          </div>
                        </div>
                        <div className='image-profile mt-2'>
                          <IMG
                            path={
                              detail?.user?.photos?.length > 0
                                ? `${detail?.user?.photos?.[0]?.url}?token=${token}`
                                : toAbsoluteUrl('/images/blank.png')
                            }
                            className={`h-${imgSize} w-${imgSize} rounded-circle`}
                          />
                        </div>
                      </div>

                      {detail?.last_reply && (
                        <div className='d-flex justify-content-between'>
                          <div className='image-profile mt-2'>
                            <IMG
                              path={
                                detail?.last_reply?.user?.photos?.length > 0
                                  ? `${detail?.last_reply?.user?.photos?.[0]?.url}?token=${token}`
                                  : toAbsoluteUrl('/images/blank.png')
                              }
                              className={`h-${imgSize} w-${imgSize} rounded-circle`}
                            />
                          </div>
                          <div className='d-flex flex-column card-body'>
                            <div className='d-flex fw-bolder mb-2'>
                              {detail?.last_reply?.user?.first_name || '-'} &nbsp;
                              {detail?.last_reply?.user?.last_name || ''}
                              {detail?.answered === true && (
                                <>
                                  <span className='me-2'>,</span>
                                  <span className='badge bg-light-success text-success'>
                                    Replied
                                  </span>
                                </>
                              )}
                            </div>
                            <div className='text-start'>
                              <div
                                className='bg-f9 py-2 px-3 radius-10 fs-7 my-1 d-inline-block'
                                style={{width: 'fit-content'}}
                              >
                                {parse(`${detail?.last_reply?.body || '-'}`)}
                              </div>
                            </div>
                            <div className='mx-2 text-gray-500 fs-8'>
                              {detail?.last_reply?.time_ago}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className='w-100 position-absolute bottom-0'>
        <ReplyForum
          guid={guid}
          message={message}
          loading={loading}
          reload={reloadReply}
          showReply={showReply}
          setMessage={setMessage}
          setLoading={setLoading}
          setReload={setReloadReply}
          setShowReply={setShowReply}
        />
      </div>
    </>
  )
}

export default DetailForum
