import {Options, options, tokenize} from 'linkifyjs'
import {Children, cloneElement, createElement, FC, Fragment, isValidElement} from 'react'
function stringToElements(str: any, opts: any, meta: any) {
  const tokens: any = tokenize(str)
  const elements: any = []

  for (let i = 0; i < tokens?.length; i++) {
    const token: any = tokens?.[i]

    if (token?.t === 'nl' && opts?.get('nl2br')) {
      const key: any = `__linkify-el-${meta.elementId++}`
      elements?.push(createElement('br', {key}))
    } else if (!token?.isLink || !opts?.check(token)) {
      // Regular text
      elements?.push(token?.toString())
    } else {
      let rendered: any = opts?.render(token)
      if (!('key' in rendered?.props)) {
        // Ensure generated element has unique key
        const key: any = `__linkify-el-${meta.elementId++}`
        const props: any = options.assign({key}, rendered?.props)
        rendered = cloneElement(rendered, props)
      }
      elements?.push(rendered)
    }
  }
  return elements
}
function linkifyReactElement(element: any, opts: any, meta: any) {
  if (Children?.count(element?.props?.children) === 0) {
    // No need to clone if the element had no children
    return element
  }
  const children: any = []

  Children?.forEach(element?.props?.children, (child: any) => {
    if (typeof child === 'string') {
      // ensure that we always generate unique element IDs for keys
      children?.push(...stringToElements(child, opts, meta))
    } else if (isValidElement(child)) {
      if (
        typeof child.type === 'string' &&
        opts?.ignoreTags?.indexOf(child?.type?.toUpperCase()) >= 0
      ) {
        // Don't linkify this element
        children?.push(child)
      } else {
        children?.push(linkifyReactElement(child, opts, meta))
      }
    } else {
      // Unknown element type, just push
      children?.push(child)
    }
  })
  // Set a default unique key, copy over remaining props
  const key: any = `__linkify-el-${meta.elementId++}`
  const newProps: any = options?.assign({key}, element?.props)
  return cloneElement(element, newProps, children)
}
const Linkify: FC<any> = (props: any) => {
  // Copy over all non-linkify-specific props
  let linkId = 0
  const defaultLinkRender = ({tagName, attributes, content}) => {
    attributes.key = `__linkify-lnk-${linkId++}`
    if (attributes?.class) {
      attributes.className = attributes?.class
      delete attributes.class
    }
    return createElement(tagName, attributes, content)
  }
  const newProps: any = {key: '__linkify-wrapper'}
  for (const prop in props) {
    if (prop !== 'options' && prop !== 'as' && prop !== 'tagName' && prop !== 'children') {
      newProps[prop] = props?.[prop]
    }
  }

  const opts: any = new Options(props?.options, defaultLinkRender)
  const as: any = props?.as || props?.tagName || Fragment || 'span'
  const children: any = props?.children
  const element: any = createElement(as, newProps, children)
  return linkifyReactElement(element, opts, {elementId: 0})
}
export default Linkify
