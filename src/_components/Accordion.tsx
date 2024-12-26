import {FC, useEffect, useState} from 'react'
export const Accordion: FC<any> = ({
  children,
  default: defaultItem,
  id,
  style,
  fit,
  flat,
  mainHeader = false,
}) => {
  const [activeItem, setActiveItem] = useState<any>('')
  const [items, setItems] = useState<any>([])
  useEffect(() => {
    children && setItems(Array(0).concat(children) as never[])
  }, [children])
  useEffect(() => {
    defaultItem && setActiveItem(defaultItem)
  }, [defaultItem])
  return (
    <div
      className={`accordion ${fit ? 'accordion-fit-content' : ''}`}
      id={id || 'accordionId'}
      style={style || {}}
    >
      {items &&
        items?.length > 0 &&
        items.map((e: any, index: number) => (
          <div className={`accordion-item ${flat ? 'border-0' : ''}`} key={index}>
            <h1
              onClick={() => {
                setActiveItem(
                  activeItem !== e?.props?.['data-value'] ? e?.props?.['data-value'] : ''
                )
              }}
              className='accordion-header'
              id={`head-${e?.props?.['data-value']}`}
            >
              <button
                className={`accordion-button ${
                  flat && 'p-0 border-0 bg-transparent shadow-none'
                } fw-bolder ${activeItem !== e?.props?.['data-value'] && 'collapsed'}`}
                type='button'
                data-bs-toggle='collapse'
                data-bs-target={`#${e?.props?.['data-value']}`}
                aria-expanded='false'
                aria-controls={e?.props?.['data-value']}
              >
                {mainHeader ? (
                  <div
                    className={`fw-bolder mx-n2 text-primary`}
                    style={{
                      userSelect: 'none',
                      fontSize: '1.35rem',
                      fontWeight: '600',
                      lineHeight: '1.2',
                    }}
                  >
                    {e?.props?.['data-label']}
                  </div>
                ) : (
                  !mainHeader && e?.props?.['data-label']
                )}
              </button>
            </h1>
            <div
              id={e?.props?.['data-value']}
              className={`accordion-collapse collapse ${
                activeItem === e?.props?.['data-value'] && 'show'
              }`}
              aria-labelledby={`head-${e?.props?.['data-value']}`}
              data-bs-parent={`#${id || 'accordionId'}`}
            >
              <div className={`accordion-body ${flat && 'p-0'}`}>{e}</div>
            </div>
          </div>
        ))}
    </div>
  )
}
