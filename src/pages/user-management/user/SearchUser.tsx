import {configClass} from '@helpers'
import {FC} from 'react'

interface Props {
  handleChange: (e: any) => void
}

const SearchUser: FC<Props> = ({handleChange}) => {
  return (
    <input
      type='text'
      id='kt_filter_search'
      data-cy='searchUser'
      className={`${configClass?.form} w-250px ps-9`}
      placeholder='Search'
      onChange={handleChange}
    />
  )
}

export default SearchUser
