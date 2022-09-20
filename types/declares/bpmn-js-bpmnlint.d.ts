declare module 'bpmn-js-bpmnlint' {
  import { Injector, ModuleDefinition } from 'didi'
  import Modeler from 'bpmn-js/lib/Modeler'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import Overlays from 'diagram-js/lib/features/overlays/Overlays'
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions'

  type EmptyConfig = {
    resolver: {
      resolveRule: () => unknown
    }
    config: Record<string, any>
  }

  type State = 'error' | 'warning'

  type ButtonState = State | 'inactive' | 'success'

  type Entry = {
    rule: string
    message: string
    actualElementId: string
  }

  type Issue = {
    id: string
    category: string
    message: string
    rule: string
  }

  type Issues = Record<string, Issue[]>[]

  class Linting {
    constructor(
      bpmnjs: Modeler,
      canvas: Canvas,
      config: any,
      elementRegistry: ElementRegistry,
      eventBus: EventBus,
      overlays: Overlays,
      translate: Translate
    )
    protected _bpmnjs: Modeler
    protected _canvas: Canvas
    protected _config: any
    protected _elementRegistry: ElementRegistry
    protected _eventBus: EventBus
    protected _overlays: Overlays
    protected _translate: Translate

    protected _issues: Record<string, any>
    protected _active: boolean
    protected _linterConfig: EmptyConfig
    protected _overlayIds: Record<string, string>

    _init(): void
    _fireComplete(issues: Issues[]): void
    _createIssues(issues: Issues[]): void
    _createElementIssues(elementId: string, elementIssues: Issues[]): void
    _formatIssues(issues: Record<string, Issue>): Issues[]
    _setActive(active: boolean): void
    _addErrors($ul: Element, errors: Entry[]): void
    _addWarnings($ul: Element, warnings: Entry[]): void
    _addEntry($ul: Element, state: State, entry: Entry): void
    _clearOverlays(): void
    _clearIssues(): void
    _setButtonState(state: ButtonState, errors: Object, warnings: Object): void
    _updateButton(): void
    _createButton(): void

    setLinterConfig(linterConfig: EmptyConfig): void
    getLinterConfig(): EmptyConfig
    isActive(): boolean
    toggle(newActive: boolean): boolean
    lint(): any
    update(): void
  }

  class LintEditorActions extends EditorActions {
    constructor(injector: Injector, linting: Linting)
  }

  const bpmnlint: ModuleDefinition
  export default bpmnlint
}
