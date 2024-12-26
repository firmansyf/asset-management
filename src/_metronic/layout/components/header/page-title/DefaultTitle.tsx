import {useLayout, usePageData} from '@metronic/layout/core'
import clsx from 'clsx'
import {FC} from 'react'
import {Link} from 'react-router-dom'

const DefaultTitle: FC = () => {
  const {config, attributes, classes}: any = useLayout()
  const {pageTitle, pageDescription, arrowBack, pageBreadcrumbs}: any = usePageData()

  return (
    <div
      {...attributes?.pageTitle}
      className={clsx('page-title d-flex', classes?.pageTitle?.join(' '))}
    >
      {arrowBack && Object.keys(arrowBack || {})?.length > 0 && arrowBack?.isActive && (
        <Link to={arrowBack?.url || ''} className='pe-5 pt-1'>
          <i className='fa-solid fa-chevron-left fs-2 text-black'></i>
        </Link>
      )}

      {/* begin::Title */}
      {pageTitle && (
        <h1 className='d-flex align-items-center text-dark fw-bolder my-1 fs-3'>
          <div>
            {pageTitle} <p className='pageSubTitle m-0 fs-7 fw-normal'></p>
          </div>
          {pageDescription && config.pageTitle && config.pageTitle.description && (
            <>
              <span className='h-20px border-gray-200 border-start ms-3 mx-2'></span>
              <small className='text-muted fs-7 fw-bold my-1 ms-1'>{pageDescription || ''}</small>
            </>
          )}
        </h1>
      )}
      {!pageTitle && (
        <h1 className='d-flex align-items-center text-primary fw-bolder my-1 fs-3'>
          <p className='pageSubTitle mb-0 mt-1 fs-7 fw-bold'></p>
        </h1>
      )}
      {/* end::Title */}

      {pageBreadcrumbs &&
        pageBreadcrumbs?.length > 0 &&
        config?.pageTitle &&
        config?.pageTitle?.breadCrumbs && (
          <>
            {config?.pageTitle?.direction === 'row' && (
              <span className='h-20px border-gray-200 border-start mx-4'></span>
            )}
            <ul className='breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1'>
              {Array.from(pageBreadcrumbs)?.map((item: any, index: number) => (
                <li
                  className={clsx('breadcrumb-item', {
                    'text-dark': !item?.isSeparator && item?.isActive,
                    'text-muted': !item?.isSeparator && !item?.isActive,
                  })}
                  key={`${item.path}${index}`}
                >
                  {!item.isSeparator ? (
                    <Link className='text-muted text-hover-primary' to={item?.path}>
                      {item?.title || ''}
                    </Link>
                  ) : (
                    <span className='bullet bg-gray-200 w-5px h-2px'></span>
                  )}
                </li>
              ))}
              <li className='breadcrumb-item text-dark'>{pageTitle}</li>
            </ul>
          </>
        )}
    </div>
  )
}

export {DefaultTitle}
