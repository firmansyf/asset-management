export default ''
// import 'froala-editor/css/froala_style.min.css'
// import '@metronic/assets/sass/custom/froala.scss'
// import 'froala-editor/js/plugins.pkgd.min.js'

// import {forwardRef, ForwardRefRenderFunction, memo} from 'react'
// import FroalaEditor from 'react-froala-wysiwyg'

// type Props = {
//   id?: any
//   offsetTop?: any
//   onChange?: any
//   onBlur?: any
//   onFocus?: any
//   children?: any
//   tempMessage?: any
//   placeholder?: string
//   simple?: any
//   inline?: boolean
//   minHeight?: number
//   maxHeight?: number
//   reload?: boolean
// }

// const removeWatermark: any = () => {
//   const el: any = document.querySelector('a[href*="froala"]')
//   el && el.parentElement.remove()
//   const sec: any = document.querySelector('#fr-logo')
//   sec && sec.remove()
//   const ph: any = document.querySelector('.fr-placeholder')
//   ph && (ph.style.marginTop = 0)
// }

// const Editor: ForwardRefRenderFunction<HTMLTextAreaElement, Props> = (
//   {
//     id,
//     offsetTop,
//     onChange,
//     onBlur,
//     onFocus,
//     children,
//     tempMessage,
//     placeholder,
//     simple,
//     inline = false,
//     minHeight = 200,
//     maxHeight = 300,
//     reload = true,
//   },
//   ref: any
// ) => {
//   const toolbarButtons: any = {
//     moreText: {
//       buttons: [
//         'bold',
//         'italic',
//         'underline',
//         'strikeThrough',
//         'subscript',
//         'superscript',
//         'fontFamily',
//         'fontSize',
//         'textColor',
//         'backgroundColor',
//         'inlineClass',
//         'inlineStyle',
//         'clearFormatting',
//       ],
//     },
//     moreParagraph: {
//       buttons: [
//         'alignLeft',
//         'alignCenter',
//         'formatOLSimple',
//         'alignRight',
//         'alignJustify',
//         'formatOL',
//         'formatUL',
//         'paragraphFormat',
//         'paragraphStyle',
//         'lineHeight',
//         'outdent',
//         'indent',
//         'quote',
//       ],
//     },
//     moreRich: {
//       buttons: [
//         'insertLink',
//         // 'insertImage',
//         // 'insertVideo',
//         'insertTable',
//         'emoticons',
//         'fontAwesome',
//         'specialCharacters',
//         'embedly',
//         'insertHR',
//       ],
//       buttonsVisible: 7,
//     },
//     moreMisc: {
//       buttons: [
//         'undo',
//         'redo',
//         'fullscreen',
//         'print',
//         'getPDF',
//         'spellChecker',
//         'selectAll',
//         'html',
//         'help',
//       ],
//       align: 'right',
//       buttonsVisible: 2,
//     },
//   }

//   const toolbarSimple: any = {
//     moreText: {
//       buttons: ['bold', 'italic', 'clearFormatting'],
//       buttonsVisible: 3,
//     },
//     moreParagraph: {
//       buttons: ['formatOLSimple', 'formatUL', 'paragraphFormat'],
//     },
//     moreRich: {
//       buttons: ['insertLink', 'insertTable', 'insertHR'],
//       buttonsVisible: 3,
//     },
//     moreMisc: {
//       buttons: ['undo', 'redo'],
//       align: 'right',
//       buttonsVisible: 2,
//     },
//   }

//   const state: any = {
//     config: {
//       placeholderText: placeholder || '',
//       attribution: false,
//       heightMin: minHeight,
//       // heightMax: maxHeight,
//       toolbarSticky: true,
//       toolbarStickyOffset: offsetTop,
//       tooltips: false,
//       zIndex: 1,
//       charCounterCount: false,
//       quickInsertEnabled: false,
//       insertImageButtons: false,
//       imagePaste: false,
//       imageUpload: false,
//       imageByURL: false,
//       imageManager: false,
//       // imageAllowedTypes: ['jpeg', 'jpg', 'png'],
//       imageUploadRemoteUrls: false,
//       imageAllowDragAndDrop: false,
//       events: {
//         initialized: removeWatermark,
//         'html.beforeGet': removeWatermark,
//         blur: () => {
//           onBlur && onBlur()
//           removeWatermark()
//         },
//         focus: () => {
//           onFocus && onFocus()
//         },
//         // 'image.beforeUpload': function (files: any) {
//         //   const editor: any = this
//         //   if (files.length) {
//         //     const reader: any = new FileReader()
//         //     reader.onload = (e: any) => {
//         //       const result: any = e.target.result
//         //       editor.image.insert(result, null, null, editor.image.get())
//         //     }
//         //     reader.readAsDataURL(files[0])
//         //   }
//         //   editor.popups.hideAll()
//         //   return false
//         // },
//       },
//       // imageUploadURL: 'http://localhost',
//       quickInsertButtons: false,
//       // toolbarButtonsMD: toolbarSimple,
//       // toolbarButtonsSM: toolbarSimple,
//       // toolbarButtonsXS: toolbarSimple,
//       toolbarButtons: simple ? toolbarSimple : toolbarButtons,
//       toolbarInline: inline,
//     },
//   }

//   function onModelChange(e: any) {
//     const el: any = document.createElement('div')
//     el.innerHTML = e
//     el?.querySelector('a[href*="froala"]')?.parentElement?.remove()
//     onChange && onChange(el?.innerHTML || '')
//   }

//   return (
//     <div className='overflow-auto' id={id} style={{maxHeight}}>
//       {reload && (
//         <FroalaEditor
//           model={children !== undefined ? children : tempMessage}
//           ref={ref}
//           tag='textarea'
//           config={state.config}
//           onModelChange={onModelChange}
//         />
//       )}
//     </div>
//   )
// }

// export default memo(
//   forwardRef(Editor),
//   (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
// )
