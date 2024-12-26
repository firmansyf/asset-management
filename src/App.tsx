import {I18nProvider} from '@metronic/i18n/i18nProvider'
import {LayoutProvider} from '@metronic/layout/core'
import {FC} from 'react'
import {Outlet} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'

const App: FC<any> = () => {
  return (
    <I18nProvider>
      <LayoutProvider>
        <Outlet />
        <ToastContainer />
      </LayoutProvider>
    </I18nProvider>
  )
}

export {App}
