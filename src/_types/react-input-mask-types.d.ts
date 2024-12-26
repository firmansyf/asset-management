declare module 'react-input-mask' {
  import {Component, InputHTMLAttributes, Ref} from 'react'
  export interface Selection {
    start: number
    end: number
  }
  export interface InputState {
    value: string
    selection: Selection | null
  }
  export interface BeforeMaskedStateChangeStates {
    previousState: InputState
    currentState: InputState
    nextState: InputState
  }
  export interface MaskOptions {
    mask: string
    maskChar: string | null
    alwaysShowMask: boolean
    formatChars: any
    permanents: Array<number>
  }
  export interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string | Array<string | RegExp>
    maskChar?: string | null
    formatChars?: any
    maskPlaceholder?: string | null
    alwaysShowMask?: boolean
    inputRef?: Ref<HTMLInputElement> | null | any
    ref?: Ref<HTMLInputElement> | null | any
    beforeMaskedValueChange?(
      newState: InputState,
      oldState: InputState,
      userInput: string | null,
      maskOptions: MaskOptions
    ): InputState
  }
  export class ReactInputMask extends Component<InputMaskProps> {}
  export default ReactInputMask
}
