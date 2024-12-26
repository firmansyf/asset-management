import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'

export const CannedFormAddButton: FC<any> = ({children, id, style}: any) => {
  const [items, setItems] = useState<any>([])

  useEffect(() => {
    children && setItems(Array(0).concat(children) as never[])
  }, [children])

  return (
    <ul className='list-group' id={id} style={style}>
      {items &&
        items?.length > 0 &&
        items?.map((e: any, index: number) => {
          return (
            <li className='list-group-item' key={index}>
              <div className='row'>
                <div className='col-md-7'>
                  <span className='text-primary fw-bold'>
                    {e?.props?.children?.props?.['data-label'] || '-'}
                  </span>{' '}
                </div>
                <div className='col-md-5 float-end'>
                  <Button
                    className='btn btn-sm btn-primary float-end'
                    type='submit'
                    style={{padding: '6px 12px 6px 12px', marginLeft: '5px'}}
                    onClick={() => {
                      e?.props?.children?.props?.['data-addAction'](
                        e?.props?.children?.props?.['data-body'] || ''
                      )
                    }}
                  >
                    add
                  </Button>
                  <Button
                    className='btn btn-sm btn-primary float-end'
                    style={{padding: '6px 12px 6px 12px'}}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </li>
          )
        })}
    </ul>
  )
}
