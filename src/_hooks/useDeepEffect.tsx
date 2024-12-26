import {isEqual} from 'lodash'
import {useEffect, useRef} from 'react'

export function useDeepEffect(fn: any, deps: any) {
  const isFirst: any = useRef(true)
  const prevDeps: any = useRef(deps)

  useEffect(() => {
    const isFirstEffect: boolean = isFirst?.current
    const isSame: boolean = prevDeps?.current?.every((obj: any, index: number) =>
      isEqual(obj, deps?.[index])
    )

    isFirst.current = false
    prevDeps.current = deps

    if (isFirstEffect || !isSame) {
      return fn()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
