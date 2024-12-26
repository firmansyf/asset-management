import {PageTitle as Title} from '@metronic/layout/core'
import {FC, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import {useIntl} from 'react-intl'

interface PropTypes {
  context?: string
}
export const PageTitle: FC<PropTypes> = ({context = 'APP.NAME'}) => {
  const intl = useIntl()
  return <Title breadcrumbs={[]}>{intl.formatMessage({id: context})}</Title>
}
export const PageAddons: FC<any> = ({children}) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const toolbar: any = createRoot(document.getElementById('toolbar-addons')!)
    toolbar.render(children)
    return () => {
      toolbar.render('')
    }
  }, [children])
  return null
}
