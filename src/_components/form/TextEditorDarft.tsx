// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// import {ContentState, convertFromHTML, convertToRaw, EditorState} from 'draft-js'
// import draftToHtml from 'draftjs-to-html'
// import {FC, memo, useEffect, useState} from 'react'
// import {Editor} from 'react-draft-wysiwyg'
// type Props = {
//   id?: any
//   defaultData?: string
//   placeholder?: string
//   setFieldValue?: any
//   editorName?: any
//   loading?: boolean
//   ungroupAll?: boolean
//   toolbarOnFocus?: boolean
//   toolbarClass?: any
//   bodyClass?: any
//   onFocus?: any
//   onBlur?: any
//   onChange?: any
// }

// const toolbarOptions: any = ({ungroupAll}) => ({
//   options: [
//     'blockType',
//     'inline',
//     'fontSize',
//     'list',
//     'textAlign',
//     'colorPicker',
//     'link',
//     'emoji',
//     'image',
//     'history',
//   ],
//   inline: {
//     inDropdown: false,
//     bold: {
//       icon: '/media/svg/editor/bold.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//     italic: {
//       icon: '/media/svg/editor/italic.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//     underline: {
//       icon: '/media/svg/editor/underline.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//     strikethrough: {
//       icon: '/media/svg/editor/strikethrough.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//     monospace: {
//       icon: '/media/svg/editor//monospace.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//     superscript: {
//       icon: '/media/svg/editor//superscript.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//     subscript: {
//       icon: '/media/svg/editor/subscript.png',
//       className: 'inline-button rdw-custom-svg',
//     },
//   },
//   fontSize: {
//     className: 'inline-button',
//   },
//   list: {
//     inDropdown: !ungroupAll,
//     icon: '/media/icons/duotone/Text/Bullet-list.svg',
//     className: 'inline-button',
//   },
//   textAlign: {
//     inDropdown: !ungroupAll,
//     className: 'inline-button',
//   },
//   link: {inDropdown: !ungroupAll, className: 'inline-button'},
//   colorPicker: {className: 'inline-button', popupClassName: 'emoji-custom-popup'},
//   emoji: {className: 'inline-button'},
//   blockType: {
//     inDropdown: !ungroupAll,
//     options: ['H1', 'H2', 'H3', 'H4', 'Normal', 'Blockquote'],
//     className: 'block-type-button',
//     component: undefined,
//     dropdownClassName: undefined,
//   },
//   image: {
//     className: 'inline-button',
//     component: undefined,
//     popupClassName: undefined,
//     urlEnabled: true,
//     uploadEnabled: true,
//     alignmentEnabled: true,
//     uploadCallback: undefined,
//     previewImage: false,
//     inputAccept: 'image/gif,image/jpeg,image/jpg,image/png',
//     alt: {present: true, mandatory: true},
//     defaultSize: {
//       height: 'auto',
//       width: 'auto',
//     },
//   },
//   history: {
//     inDropdown: false,
//     options: ['undo', 'redo'],
//     undo: {icon: '/media/svg/editor/undo.svg', className: 'inline-button rdw-custom-svg'},
//     redo: {
//       icon: '/media/svg/editor/redo.svg',
//       className: 'inline-button rdw-custom-svg',
//     },
//   },
// })

// const TextEditor: FC<Props> = ({
//   id,
//   defaultData,
//   placeholder,
//   setFieldValue,
//   editorName,
//   loading = false,
//   ungroupAll = false,
//   toolbarOnFocus = false,
//   toolbarClass = '',
//   bodyClass = '',
//   onFocus = () => '',
//   onBlur = () => '',
//   onChange = () => '',
// }) => {
//   const [editorState, setEditorState] = useState<any>(() => EditorState.createEmpty())

//   const onEditorStateChange = (value: any) => {
//     const body: string = draftToHtml(convertToRaw(value?.getCurrentContent()))
//     setEditorState(value)
//     setFieldValue(editorName, body)
//   }

//   useEffect(() => {
//     if (defaultData) {
//       setEditorState(
//         EditorState.createWithContent(
//           ContentState.createFromBlockArray(convertFromHTML(defaultData) as any)
//         )
//       )
//     } else {
//       setEditorState(EditorState.createEmpty())
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [loading])

//   return (
//     <div className='overflow-auto' id={id}>
//       {loading ? (
//         <div className='d-flex h-350px flex-center'>
//           <span className='indicator-progress d-block text-center'>
//             <span className='spinner-border spinner-border-sm w-50px h-50px align-middle'></span>
//             <div className='mt-2 text-gray-500'>Loading editor ...</div>
//           </span>
//         </div>
//       ) : (
//         <Editor
//           editorState={editorState}
//           wrapperClassName='wrapper-class'
//           editorClassName={`editor-class editor-class-custom ${bodyClass}`}
//           toolbarClassName={`toolbar-class toolbar-class-custom ${toolbarClass}`}
//           placeholder={placeholder}
//           toolbar={toolbarOptions({ungroupAll})}
//           onFocus={onFocus}
//           toolbarOnFocus={toolbarOnFocus}
//           onBlur={onBlur}
//           onEditorStateChange={onEditorStateChange}
//           onChange={onChange}
//         />
//       )}
//     </div>
//   )
// }

// const TextEditorDraft = memo(TextEditor, (prev: any, next: any) => {
//   return JSON.stringify(prev) === JSON.stringify(next)
// })
// export {TextEditorDraft}
export {}
