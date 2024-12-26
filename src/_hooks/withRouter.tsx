import {useLocation, useNavigate, useParams} from 'react-router-dom'

export function withRouter(Component: any) {
  const ComponentWithRouter: any = (props: any) => {
    const location: any = useLocation()
    const navigate: any = useNavigate()
    const params: any = useParams()

    return <Component {...props} router={{location, navigate, params}} />
  }
  return ComponentWithRouter
}
