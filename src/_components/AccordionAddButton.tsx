import {FC, useEffect, useState} from 'react'
export const AccordionAddButton: FC<any> = ({
  children,
  default: defaultItem,
  id,
  style,
  flat,
}: any) => {
  const [activeItem, setActiveItem] = useState<any>('')
  const [items, setItems] = useState<any>([])

  useEffect(() => {
    children && setItems(Array(0).concat(children) as never[])
  }, [children])

  useEffect(() => {
    defaultItem && setActiveItem(defaultItem)
  }, [defaultItem])

  return (
    <div className='accordion' id={id || 'accordionId'} style={style || {}}>
      {items &&
        items?.length > 0 &&
        items?.map((e: any, index: number) => {
          return (
            <div className={`accordion-item ${flat ? 'border-0' : ''}`} key={index}>
              <h2
                className='accordion-header'
                id={`head-${e?.props?.children?.props?.['data-value']}`}
              >
                <button
                  onClick={() =>
                    setActiveItem(
                      activeItem !== e?.props?.children?.props?.['data-value']
                        ? e?.props?.children?.props?.['data-value']
                        : ''
                    )
                  }
                  className={`accordion-button ${
                    flat && 'p-0 border-0 bg-transparent shadow-none'
                  } fw-bolder ${
                    activeItem !== e?.props?.children?.props?.['data-value'] && 'collapsed'
                  }`}
                  type='button'
                  data-bs-toggle='collapse'
                  data-bs-target={`#${e?.props?.children?.props?.['data-value']}`}
                  aria-expanded='false'
                  aria-controls={e?.props?.children?.props?.['data-value']}
                  style={{width: '66%'}}
                >
                  {e?.props?.children?.props?.['data-label']}
                </button>
                <button
                  className='btn btn-sm btn-primary cannedResponseCus'
                  // style={{position: 'absolute', right: '32px', marginTop: '-44px'}}
                  onClick={() =>
                    e?.props?.children?.props?.['data-addAction'](
                      e?.props?.children?.props?.['data-body'] || ''
                    )
                  }
                >
                  add
                </button>
              </h2>
              <div
                id={e?.prosp?.children?.props?.['data-value']}
                className={`accordion-collapse collapse ${
                  activeItem === e?.props?.children?.props?.['data-value'] && 'show'
                }`}
                aria-labelledby={`head-${e?.props?.children?.props?.['data-value']}`}
                data-bs-parent={`#${id || 'accordionId'}`}
              >
                <div className={`accordion-body ${flat && 'p-0'}`}>{e}</div>
              </div>
            </div>
          )
        })}

      <style>{`
        .cannedResponseCus {
          float: right;
          margin-top: -44px;
          margin-right: 10px;        
        }
      `}</style>
    </div>
  )
}
