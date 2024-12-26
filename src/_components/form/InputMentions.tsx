import {getUserV1} from '@api/UserCRUD'
import {FC, memo} from 'react'
import {Mention, MentionsInput} from 'react-mentions'

interface Props {
  comment?: any
  setComment?: any
  onKeyDown?: any
}

let InputMentions: FC<Props> = ({comment, setComment, onKeyDown}) => {
  const capitalizeFirst: any = (str: string) => str?.charAt(0)?.toUpperCase() + str?.slice(1)

  const fetchUsers = (query: any, callback: any) => {
    getUserV1({limit: 10, keyword: `*${query}*`})
      .then(({data: {data: res}}: any) => {
        const data_user = res?.map(({guid, first_name, last_name, email, role_label}: any) => {
          return {
            id: capitalizeFirst(first_name) + '' + capitalizeFirst(last_name),
            display: guid,
            fullName: first_name + ' ' + last_name,
            email: email || '-',
            role: role_label || '-',
          }
        })
        return data_user
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
      <div className='parent' style={{display: 'flex'}} key={index}>
        <i className='lar la-user' style={{fontSize: '35px'}}></i>
        <div style={{marginLeft: '7px'}}>
          <div style={{width: '100%'}}>{suggestion.fullName}</div>
          <div className='title' style={{width: '100%', fontSize: '12px'}}>
            {suggestion.email}
          </div>
          <div className='title' style={{width: '100%', fontSize: '11px'}}>
            {suggestion.role}
          </div>
        </div>
      </div>
    )
  }

  const defaultStyle = {
    control: {
      // backgroundColor: '#fff',
      fontSize: 13,
      fontWeight: 'normal',
    },
    resize: 'none',
    backgroundColor: '#eef3f7',
    height: '65px',
    suggestions: {
      bottom: '63px',
      left: '2px',
      top: 'unset',
      border: '1px solid #e4e6ef',
      minWidth: '340px',
      maxHeight: '400px',
      overflow: 'scroll',
      list: {
        backgroundColor: '#fff',
        fontSize: 14,
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

  const defaultMentionStyle = {
    backgroundColor: '#eff2f5',
    position: 'relative',
    borderRadius: '0.475rem',
  }

  return (
    <MentionsInput
      markup='@[__display__,__id__]'
      className='border rounded comment'
      placeholder='Write your comment here or use @ to mention someone.'
      value={comment}
      onChange={(e: any) => setComment(e?.target?.value)}
      onKeyPress={onKeyDown}
      style={defaultStyle}
    >
      <Mention
        displayTransform={(display: any) => `@${display}`}
        trigger='@'
        data={fetchUsers}
        style={defaultMentionStyle}
        renderSuggestion={renderSuggestion}
      />
    </MentionsInput>
  )
}

InputMentions = memo(
  InputMentions,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {InputMentions}
