import {
  DataUtil,
  DOMEventHandlerUtil,
  ElementAnimateUtil,
  ElementStyleUtil,
  EventHandlerUtil,
  getElementIndex,
  getUniqueIdWithPrefix,
} from '../_utils/index'

export interface IStepperOptions {
  startIndex: number
  animation: boolean
  animationSpeed: string
  animationNextClass: string
  animationPreviousClass: string
}

const defaultStepperOptions: IStepperOptions = {
  startIndex: 1,
  animation: false,
  animationSpeed: '0.3s',
  animationNextClass: 'animate__animated animate__slideInRight animate__fast',
  animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast',
}

class StepperComponent {
  element: HTMLElement
  options: IStepperOptions
  instanceUid: string
  // eslint-disable-next-line no-undef, sonar/no-reference-error
  steps: NodeListOf<HTMLElement>
  btnNext: HTMLElement | null
  btnPrev: HTMLElement | null
  btnSubmit: HTMLElement | null
  totatStepsNumber = 0
  passedStepIndex = 0
  currentStepIndex = 1

  constructor(_element: HTMLElement, options: IStepperOptions) {
    this.element = _element
    this.options = Object.assign(defaultStepperOptions, options)
    this.instanceUid = getUniqueIdWithPrefix('stepper')

    // Elements
    this.steps = this?.element?.querySelectorAll('[data-kt-stepper-element="nav"]')
    this.btnNext = this?.element?.querySelector('[data-kt-stepper-action="next"]')
    this.btnPrev = this?.element?.querySelector('[data-kt-stepper-action="previous"]')
    this.btnSubmit = this?.element?.querySelector('[data-kt-stepper-action="submit"]')

    // Variables
    this.totatStepsNumber = this?.steps?.length | 0
    this.passedStepIndex = 0
    this.currentStepIndex = 1

    // Set Current Step
    if (this?.options?.startIndex > 1) {
      this?._goTo(this?.options?.startIndex)
    }

    // Event Handlers
    this?.initHandlers()

    // Bind Instance
    DataUtil?.set(this?.element, 'stepper', this)
  }

  private _goTo = (index: number) => {
    EventHandlerUtil?.trigger(this?.element, 'kt?.stepper?.change')
    // Skip if this step is already shown
    if (index === this?.currentStepIndex || index > this?.totatStepsNumber || index < 0) {
      return
    }

    // Validate step number
    index = parseInt(index?.toString())
    // Set current step
    this.passedStepIndex = this?.currentStepIndex
    this.currentStepIndex = index

    // Refresh elements
    this?.refreshUI()

    EventHandlerUtil?.trigger(this?.element, 'kt?.stepper?.changed')
  }

  private initHandlers = () => {
    this?.btnNext?.addEventListener('click', (e: Event) => {
      e?.preventDefault()

      EventHandlerUtil?.trigger(this?.element, 'kt?.stepper?.next', e)
    })

    this?.btnPrev?.addEventListener('click', (e: Event) => {
      e?.preventDefault()

      EventHandlerUtil?.trigger(this?.element, 'kt?.stepper?.previous', e)
    })

    DOMEventHandlerUtil?.on(
      this?.element,
      '[data-kt-stepper-action="step"]',
      'click',
      (e: Event) => {
        e?.preventDefault()

        if (this?.steps && this?.steps?.length > 0) {
          for (let i = 0; i < this?.steps?.length; i++) {
            if ((this?.steps[i] as HTMLElement) === this?.element) {
              const index = i + 1

              const stepDirection = this?._getStepDirection(index)
              EventHandlerUtil?.trigger(this?.element, `stepper?.${stepDirection}`, e)
              return
            }
          }
        }
      }
    )
  }

  private _getStepDirection = (index: number) =>
    index > this?.currentStepIndex ? 'next' : 'previous'

  private getStepContent = (index: number) => {
    const content = this?.element?.querySelectorAll('[data-kt-stepper-element="content"]')
    if (!content) {
      return false
    }

    if (content[index - 1]) {
      return content[index - 1]
    }

    return false
  }

  private getLastStepIndex = () => this?.totatStepsNumber

  private getTotalStepsNumber = () => this?.totatStepsNumber

  private refreshUI = () => {
    let state = ''

    if (this?.isLastStep()) {
      state = 'last'
    } else if (this?.isFirstStep()) {
      state = 'first'
    } else {
      state = 'between'
    }

    // Set state class
    this?.element?.classList?.remove('last')
    this?.element?.classList?.remove('first')
    this?.element?.classList?.remove('between')

    this?.element?.classList?.add(state)

    // Step Items
    const elements = this?.element?.querySelectorAll(
      '[data-kt-stepper-element="nav"], [data-kt-stepper-element="content"], [data-kt-stepper-element="info"]'
    )

    if (!elements || elements?.length <= 0) {
      return
    }

    for (let i = 0, len = elements?.length; i < len; i++) {
      const element = elements[i] as HTMLElement
      const index = getElementIndex(element) + 1

      element?.classList?.remove('current')
      element?.classList?.remove('completed')
      element?.classList?.remove('pending')

      if (index === this?.currentStepIndex) {
        element?.classList?.add('current')

        if (
          this?.options?.animation !== false &&
          element?.getAttribute('data-kt-stepper-element') === 'content'
        ) {
          ElementStyleUtil?.set(element, 'animationDuration', this?.options?.animationSpeed)

          const animation =
            this?._getStepDirection(this?.passedStepIndex) === 'previous'
              ? this?.options?.animationPreviousClass
              : this?.options?.animationNextClass
          ElementAnimateUtil?.animateClass(element, animation)
        }
      } else {
        if (index < this?.currentStepIndex) {
          element?.classList?.add('completed')
        } else {
          element?.classList?.add('pending')
        }
      }
    }
  }

  private isLastStep = () => this?.currentStepIndex === this?.totatStepsNumber

  private isFirstStep = () => this?.currentStepIndex === 1

  private isBetweenStep = () => this?.isLastStep() === false && this?.isFirstStep() === false

  //   ///////////////////////
  //   // ** Public API  ** //
  //   ///////////////////////

  //   // Plugin API
  public goto = (index: number) => this?._goTo(index)

  public goNext = () => this?.goto(this?.getNextStepIndex())

  public goPrev = () => this?.goto(this?.getPrevStepIndex())

  public goFirst = () => this?.goto(1)

  public goLast = () => this?.goto(this?.getLastStepIndex())

  public getCurrentStepIndex = () => this?.currentStepIndex

  public getNextStepIndex = () => {
    if (this?.totatStepsNumber >= this?.currentStepIndex + 1) {
      return this?.currentStepIndex + 1
    } else {
      return this?.totatStepsNumber
    }
  }

  public getPassedStepIndex = () => this?.passedStepIndex

  public getPrevStepIndex = () => {
    if (this?.currentStepIndex - 1 > 1) {
      return this?.currentStepIndex - 1
    } else {
      return 1
    }
  }

  public getElement = (_index: number) => this?.element

  // Event API
  public on = (name: string, handler: any) => EventHandlerUtil?.on(this?.element, name, handler)

  public one = (name: string, handler: any) => EventHandlerUtil?.one(this?.element, name, handler)

  public off = (name: string) => EventHandlerUtil?.off(this?.element, name)

  public destroy = () => {
    null
  }

  public trigger = (name: string, event: Event) =>
    EventHandlerUtil?.trigger(this?.element, name, event)

  // Static methods
  public static hasInstace(element: HTMLElement): boolean {
    return DataUtil?.has(element, 'stepper')
  }

  public static getInstance(element: HTMLElement): StepperComponent | null {
    if (element !== null && StepperComponent?.hasInstace(element)) {
      return DataUtil?.get(element, 'stepper')
    }
    return null
  }

  // Create Instances
  public static createInstances(selector: string): void {
    const elements = document?.body?.querySelectorAll(selector)
    elements?.forEach((element: any) => {
      const item = element as HTMLElement
      let stepper = StepperComponent?.getInstance(item)
      if (!stepper) {
        stepper = new StepperComponent(item, defaultStepperOptions)
      }
    })
  }

  public static createInsance = (
    element: HTMLElement,
    options: IStepperOptions = defaultStepperOptions
  ): StepperComponent | null => {
    if (!element) {
      return null
    }
    let stepper = StepperComponent?.getInstance(element)
    if (!stepper) {
      stepper = new StepperComponent(element, options)
    }
    return stepper
  }

  public static bootstrap(attr = '[data-kt-stepper]') {
    StepperComponent?.createInstances(attr)
  }
}

export {defaultStepperOptions, StepperComponent}