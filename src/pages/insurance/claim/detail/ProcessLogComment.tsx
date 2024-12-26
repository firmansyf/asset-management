import {FC, memo, useState} from 'react'

let ProcessLogComment: FC<any> = ({comment}) => {
  const [isReadMore, setIsReadMore] = useState<boolean>(true)

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }

  return (
    <>
      {comment && comment?.split(' ')?.length > 10 ? (
        <div className={`position-relative ${isReadMore ? 'h-50px overflow-hidden' : ''}`}>
          <div dangerouslySetInnerHTML={{__html: comment}} />
          <div
            onClick={toggleReadMore}
            className={
              isReadMore
                ? 'position-absolute d-flex align-items-end justify-content-center w-100 h-100 top-0 start-0'
                : 'text-center pt-2'
            }
            style={{
              color: '#050990',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'linear-gradient(to bottom, transparent 0%, white 70%)',
            }}
          >
            {isReadMore ? 'Show More' : 'Show Less'}
          </div>
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{__html: comment}} />
      )}
    </>
  )
}

ProcessLogComment = memo(
  ProcessLogComment,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ProcessLogComment}
