import {createContext, FC, useContext, useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

import {DefaultLayoutConfig} from './DefaultLayoutConfig'
import {
  ILayout,
  ILayoutCSSClasses,
  ILayoutCSSVariables,
  ILayoutHTMLAttributes,
} from './LayoutModels'
import {
  getEmptyCssClasses,
  getEmptyCSSVariables,
  getEmptyHTMLAttributes,
  LayoutSetup,
} from './LayoutSetup'

export interface LayoutContextModel {
  config: ILayout
  classes: ILayoutCSSClasses
  attributes: ILayoutHTMLAttributes
  cssVariables: ILayoutCSSVariables
  setLayout: (config: LayoutSetup) => void
}

const LayoutContext = createContext<LayoutContextModel>({
  config: DefaultLayoutConfig,
  classes: getEmptyCssClasses(),
  attributes: getEmptyHTMLAttributes(),
  cssVariables: getEmptyCSSVariables(),
  setLayout: (_config: LayoutSetup) => undefined,
})

export const enableSplashScreen = () => {
  const splashScreen = document.getElementById('splash-screen')
  if (splashScreen) {
    splashScreen.style.setProperty('display', 'flex')
  }
}

export const disableSplashScreen = () => {
  const splashScreen = document.getElementById('splash-screen')
  if (splashScreen) {
    splashScreen.style.setProperty('display', 'none')
  }
}

const LayoutProvider: FC<any> = ({children}) => {
  const location: any = useLocation()
  const {pathname} = location
  const [config, setConfig] = useState(LayoutSetup.config)
  const [classes, setClasses] = useState(LayoutSetup.classes)
  const [attributes, setAttributes] = useState(LayoutSetup.attributes)
  const [cssVariables, setCSSVariables] = useState(LayoutSetup.cssVariables)
  LayoutSetup.updatePartialConfig(config)
  const setLayout = (_themeConfig: Partial<ILayout>) => {
    // enableSplashScreen()
    const bodyClasses = Array.from(document?.body?.classList)
    bodyClasses.forEach((cl: any) => document?.body?.classList?.remove(cl))
    setConfig(Object.assign({}, LayoutSetup.config))
    setClasses(LayoutSetup.classes)
    setAttributes(LayoutSetup.attributes)
    setCSSVariables(LayoutSetup.cssVariables)
    setTimeout(() => {
      disableSplashScreen()
    }, 100)
  }
  const value: LayoutContextModel = {
    config,
    classes,
    attributes,
    cssVariables,
    setLayout,
  }

  useEffect(() => {
    setTimeout(() => {
      disableSplashScreen()
    }, 100)
  }, [])

  useEffect(() => {
    const layoutConfig: any = LayoutSetup.config
    const {aside} = layoutConfig
    const asideDisabled: any = {...layoutConfig, aside: {...aside, display: false}}
    if (pathname === '/setup/wizard') {
      setConfig(asideDisabled)
    } else {
      setConfig(layoutConfig)
    }
  }, [pathname])

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export {LayoutContext, LayoutProvider}

export function useLayout() {
  return useContext(LayoutContext)
}
