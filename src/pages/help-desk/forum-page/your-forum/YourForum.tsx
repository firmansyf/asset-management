/* eslint-disable react-hooks/exhaustive-deps */
import {Nodata} from '@components/pages'
import {ToastMessage} from '@components/toast-message'
import {decodeHTMLEntities, toAbsoluteUrl} from '@helpers'
import {FC, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'

const YourForum: FC<any> = ({data, ...elProps}) => {
  const navigate: any = useNavigate()
  const params: any = useParams()
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const container: any = useRef([])
  const itemsRef: any = useRef([])

  const [activeGuid, setActiveGuid] = useState<any>(null)

  useEffect(() => {
    setActiveGuid(params?.guid)
  }, [params?.guid])

  useLayoutEffect(() => {
    // First Load Action
    setTimeout(() => {
      const currentActiveGuid: any = itemsRef?.current?.[params?.guid]
      const heightOfHeader: number = 55
      container?.current?.scrollTo(
        0,
        (currentActiveGuid?.offsetTop || heightOfHeader) - heightOfHeader
      )
    }, 100)
  }, [])

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <div ref={container} {...elProps}>
      {data?.length < 1 ? (
        <Nodata
          height='35vh'
          scale={0.75}
          text='You have no forum yet. Click "Add Forum" button to create new'
        />
      ) : (
        Array.isArray(data) &&
        data?.map((item: any, index: any) => {
          const thisIsActiveGuid: boolean = activeGuid === item?.guid
          return (
            <div
              className={`p-3 cursor-default border-bottom ${thisIsActiveGuid ? 'bg-primary' : ''}`}
              key={index}
              ref={(el: any) => (itemsRef.current[item?.guid] = el)}
              onClick={() =>
                navigate(`/help-desk/forum/detail-forum/${item?.guid}#your-forum`, {replace: true})
              }
              onMouseEnter={() => {
                const thisRef: any = itemsRef?.current?.[item?.guid]
                if (thisRef) {
                  thisRef.style.backgroundColor = '#fafafa'
                }
              }}
              onMouseLeave={() => {
                const thisRef: any = itemsRef?.current?.[item?.guid]
                if (thisRef) {
                  thisRef.style.backgroundColor = 'unset'
                }
              }}
            >
              <div className='row m-0 flex-nowrap'>
                <div className='col-auto px-0'>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: `#fff url(${
                        item?.user?.photos?.length > 0
                          ? `${item?.user?.photos?.[0]?.url}?token=${token}`
                          : toAbsoluteUrl('/images/blank.png')
                      }) center / cover no-repeat`,
                    }}
                    className='radius-50 mt-1'
                  />
                </div>
                <div className='col'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className={`text-${thisIsActiveGuid ? 'white' : 'dark'}`}>
                      <div className='fw-bolder fs-6'>
                        {item?.user?.first_name} {item?.user?.last_name}
                      </div>
                      <div className='fs-8 fst-italic fw-bold text-truncate'>- {item?.title}</div>
                    </div>
                    <div className=''>
                      {item?.answered ? (
                        <i className='fas fa-reply text-warning fs-8' />
                      ) : (
                        <i className='fas fa-comment-alt text-success fs-8' />
                      )}
                    </div>
                  </div>
                  <div className='mt-1'>
                    <div
                      className={`text-truncate fs-7 w-200px text-${
                        thisIsActiveGuid ? 'white' : 'dark'
                      }`}
                    >
                      {decodeHTMLEntities(item?.content)}
                    </div>
                    <div className='d-flex align-items-center justify-content-between mt-2'>
                      <div style={{fontSize: '12px'}} className='text-truncate'>
                        {item?.category !== null ? (
                          <span className={`fs-8 text-${thisIsActiveGuid ? 'white' : 'primary'}`}>
                            In {item?.category?.name}
                          </span>
                        ) : (
                          <span className={`fs-8 text-${thisIsActiveGuid ? 'white' : 'gray-400'}`}>
                            'No Category'
                          </span>
                        )}
                      </div>
                      <div
                        className={`fs-8 fw-bold text-end text-${
                          thisIsActiveGuid ? 'white' : 'gray-400'
                        }`}
                      >
                        {item?.time_ago}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export {YourForum}
