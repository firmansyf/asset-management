import {logout} from '@redux'
import qs from 'qs'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

export function Logout() {
  const navigate: any = useNavigate()
  useEffect(() => {
    logout()
    setTimeout(() => {
      navigate({
        pathname: '/auth/login',
        search: qs.stringify({request: btoa('/')}, {encode: false}),
      })
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
