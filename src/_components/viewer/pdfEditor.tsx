import {bufferToBase64, isValidURL} from '@helpers'
import {FC, useEffect, useRef} from 'react'

export const PDF: FC<any> = ({src, readOnly, onChange}) => {
  const containerRef = useRef<any>(null)
  useEffect(() => {
    const container: any = containerRef?.current
    let PSPDFKit: any
    const readOnlyItems: any = [
      'sidebar-thumbnails',
      'pager',
      'zoom-in',
      'zoom-out',
      'zoom-mode',
      'spacer',
      'search',
      'print',
      'export-pdf',
    ]
    const isPDF: any = src?.split(',')?.[0]?.split(';')?.[0]?.split('/')?.slice(-1)?.[0] === 'pdf'
    if (src && (isPDF || isValidURL(src))) {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(async () => {
        PSPDFKit = await import('pspdfkit')
        await PSPDFKit.load({
          disableWebAssemblyStreaming: true,
          container,
          headless: false,
          toolbarItems: readOnly
            ? readOnlyItems?.map((type: string) => ({type}))
            : PSPDFKit.defaultToolbarItems
                ?.filter((toolbarItem: any) => toolbarItem?.type)
                ?.concat({type: 'content-editor'}),
          document: src,
          baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
          instant: true,
          renderPageCallback(ctx: any, _pageIndex: any, pageSize: any) {
            const {width, height}: any = pageSize || {}
            const isLandscape: boolean = width >= height
            ctx.restore()
            ctx.font = '900 100px Arial'
            ctx.fillStyle = '#050990'
            ctx.globalAlpha = 0.1
            ctx.rotate(-Math.PI / 5)
            if (isLandscape) {
              ctx.textAlign = 'right'
              ctx.fillText(` `, width / 1.85, height / 1.2)
            } else {
              ctx.textAlign = 'center'
              ctx.fillText(` `, 0, height / 1.575)
            }
            ctx.save()
          },
        }).then(async (instance: any) => {
          await instance.applyOperations([
            {
              type: 'cropPages',
              pageIndexes: 'all',
              cropBox: new PSPDFKit.Geometry.Rect({
                left: 0,
                top: -1,
                width: 1,
                height: 1,
              }),
            },
            {
              type: 'rotatePages',
              pageIndexes: [0],
              rotateBy: 0,
            },
          ])

          // instance.setViewState((v: any) =>
          //   v.set('interactionMode', PSPDFKit.InteractionMode.CONTENT_EDITOR)
          // )

          const pagesAnnotations: any = Array.from({length: instance?.totalPageCount || 0})?.map(
            (_, pageIndex) => instance.textLinesForPageIndex(pageIndex)
          )

          pagesAnnotations?.flatMap(async (pageAnnotation: any) => {
            const texts: any = await pageAnnotation
            return texts?.map(({contents}: any) => contents)?.toArray()
          })

          const eventListener: any = ['document.change', 'annotations.change']
          eventListener.forEach((ev: any) => {
            instance.addEventListener(ev, () => {
              instance.exportPDF().then((buffer: any) => {
                onChange && onChange(`data:application/pdf;base64,${bufferToBase64(buffer)}`)
              })
            })
          })
          instance.save()
          return instance
        })
      })()
    }
    return () => {
      PSPDFKit && PSPDFKit.unload(container)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, onChange])
  return (
    <div className='row'>
      <div className='col-12'>
        <div ref={containerRef} className='w-100' style={{height: '70vh'}} />
      </div>
    </div>
  )
}
