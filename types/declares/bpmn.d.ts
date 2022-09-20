/************************************* 基础扩展功能定义 *************************************/
declare module 'bpmn-js' {
  import Viewer from 'bpmn-js/lib/Viewer'

  export default Viewer
}
declare module 'bpmn-js/lib/Viewer' {
  import BaseViewer from 'bpmn-js/lib/BaseViewer'
  import { ViewerOptions } from 'diagram-js/lib/model'
  import { ModuleDefinition } from 'didi'

  export default class Viewer extends BaseViewer {
    constructor(options?: ViewerOptions<Element>)
    _modules: ModuleDefinition[]
    _moddleExtensions: Object
  }
}
declare module 'bpmn-js/lib/BaseViewer' {
  import Diagram from 'diagram-js'
  import { EventCallback } from 'diagram-js/lib/core/EventBus'
  import { ViewerOptions } from 'diagram-js/lib/model'
  import { InternalEvent } from 'diagram-js/lib/core/EventBus'
  import { ModuleDefinition } from 'didi'
  import BpmnModdle, { ModdleElement } from 'bpmn-moddle'

  export interface WriterOptions {
    format?: boolean
    preamble?: boolean
  }
  export interface DoneCallbackOpt {
    warnings: any[]
    xml?: string
    svg?: string
    err?: any
  }
  export type BPMNEvent = string
  export type BPMNEventCallback<P extends InternalEvent> = (params: P) => void

  export default class BaseViewer extends Diagram {
    constructor(options?: ViewerOptions<Element>)
    _moddle: BpmnModdle
    _container: Element
    _setDefinitions(definitions: ModdleElement): void
    _modules: ModuleDefinition[]

    _init(container: Element, moddle: Object, options: Object)

    importXML(xml: string): Promise<DoneCallbackOpt>
    open(diagram: string): Promise<DoneCallbackOpt>
    saveXML(options?: WriterOptions): Promise<DoneCallbackOpt>
    saveSVG(options?: WriterOptions): Promise<DoneCallbackOpt>
    clear(): void
    destroy(): void
    on<T extends BPMNEvent, P extends InternalEvent>(
      event: T,
      priority: number | BPMNEventCallback<P>,
      callback?: EventCallback<T, any>,
      that?: this
    ): void
    off<T extends BPMNEvent, P extends InternalEvent>(
      events: T | T[],
      callback?: BPMNEventCallback<P>
    ): void
    attachTo<T extends Element>(parentNode: string | T): void
    detach(): void
    importDefinitions(): ModdleElement
    getDefinitions(): ModdleElement
  }
}
declare module 'bpmn-js/lib/NavigatedViewer' {
  import Viewer from 'bpmn-js'
  import { ViewerOptions } from 'diagram-js/lib/model'

  export default class NavigatedViewer extends Viewer {
    constructor(options?: ViewerOptions<Element>)
  }
}
declare module 'bpmn-js/lib/BaseModeler' {
  import Viewer from 'bpmn-js'
  import { ViewerOptions } from 'diagram-js/lib/model'
  import BpmnModdle, { ModdleElement } from 'bpmn-moddle'

  export default class BaseModeler extends Viewer {
    constructor(options?: ViewerOptions<Element>)
    _createModdle(options: Object): BpmnModdle
    _collectIds(definitions: ModdleElement, elementsById: Object): void
  }
}
declare module 'bpmn-js/lib/Modeler' {
  import BaseModeler from 'bpmn-js/lib/BaseModeler'
  import Viewer from 'bpmn-js'
  import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer'
  import { ModuleDefinition } from 'didi'
  import { ViewerOptions } from 'diagram-js/lib/model'

  export default class Modeler extends BaseModeler {
    constructor(options?: ViewerOptions<Element>)
    Viewer: Viewer
    NavigatedViewer: NavigatedViewer
    _interactionModules: ModuleDefinition[]
    _modelingModules: ModuleDefinition[]
    _modules: ModuleDefinition[]

    createDiagram(): void // 创建流程图
  }
}
/************************************* core 核心模块( draw, import) *************************************/
//
declare module 'bpmn-js/lib/core' {}
/************************************* draw 图形元素绘制模块 *************************************/
// bpmn 元素核心绘制模块
declare module 'bpmn-js/lib/draw/BpmnRenderer' {
  import Canvas, { Position } from 'diagram-js/lib/core/Canvas'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'
  import Styles from 'diagram-js/lib/draw/Styles'
  import PathMap from 'bpmn-js/lib/draw/PathMap'
  import TextRenderer from 'bpmn-js/lib/draw/TextRenderer'
  import { Base, Connection, Shape } from 'diagram-js/lib/model'

  export type RendererHandler = <E extends Base, T extends SVGElement>(
    parentGfx: SVGElement,
    element: E,
    options?: any
  ) => SVGElement
  export type RendererType =
    | 'bpmn:Event'
    | 'bpmn:StartEvent'
    | 'bpmn:MessageEventDefinition'
    | 'bpmn:TimerEventDefinition'
    | 'bpmn:EscalationEventDefinition'
    | 'bpmn:ConditionalEventDefinition'
    | 'bpmn:LinkEventDefinition'
    | 'bpmn:ErrorEventDefinition'
    | 'bpmn:CancelEventDefinition'
    | 'bpmn:CompensateEventDefinition'
    | 'bpmn:SignalEventDefinition'
    | 'bpmn:MultipleEventDefinition'
    | 'bpmn:ParallelMultipleEventDefinition'
    | 'bpmn:EndEvent'
    | 'bpmn:TerminateEventDefinition'
    | 'bpmn:IntermediateEvent'
    | 'bpmn:IntermediateCatchEvent'
    | 'bpmn:IntermediateThrowEvent'
    | 'bpmn:Activity'
    | 'bpmn:Task'
    | 'bpmn:ServiceTask'
    | 'bpmn:UserTask'
    | 'bpmn:ManualTask'
    | 'bpmn:SendTask'
    | 'bpmn:ReceiveTask'
    | 'bpmn:ScriptTask'
    | 'bpmn:BusinessRuleTask'
    | 'bpmn:SubProcess'
    | 'bpmn:AdHocSubProcess'
    | 'bpmn:Transaction'
    | 'bpmn:CallActivity'
    | 'bpmn:Participant'
    | 'bpmn:Lane'
    | 'bpmn:InclusiveGateway'
    | 'bpmn:ExclusiveGateway'
    | 'bpmn:ComplexGateway'
    | 'bpmn:ParallelGateway'
    | 'bpmn:EventBasedGateway'
    | 'bpmn:Gateway'
    | 'bpmn:SequenceFlow'
    | 'bpmn:Association'
    | 'bpmn:DataInputAssociation'
    | 'bpmn:DataOutputAssociation'
    | 'bpmn:MessageFlow'
    | 'bpmn:DataObject'
    | 'bpmn:DataObjectReference'
    | 'bpmn:DataInput'
    | 'bpmn:DataOutput'
    | 'bpmn:DataStoreReference'
    | 'bpmn:BoundaryEvent'
    | 'bpmn:Group'
    | 'label'
    | 'bpmn:TextAnnotation'
    | 'ParticipantMultiplicityMarker'
    | 'SubProcessMarker'
    | 'ParallelMarker'
    | 'SequentialMarker'
    | 'CompensationMarker'
    | 'LoopMarker'
    | 'AdhocMarker'

  export default class BpmnRenderer extends BaseRenderer {
    constructor(
      config: any,
      eventBus: EventBus,
      styles: Styles,
      pathMap: PathMap,
      canvas: Canvas,
      textRenderer: TextRenderer,
      priority?: number
    )
    protected handlers: { [rendererType in RendererType]: RendererHandler }
    protected _drawPath(parentGfx: SVGElement, element: Base, attrs?: Object): SVGElement
    protected _renderer(type: RendererType): RendererHandler
    getConnectionPath<E extends Base>(connection: E): string
    canRender<E extends Base>(element: E): boolean
    drawShape<E extends Shape>(parentGfx: SVGElement, element: E): SVGRectElement
    drawConnection<E extends Connection>(parentGfx: SVGElement, element: E): SVGPolylineElement
    getShapePath<E extends Base>(element: E): string
  }
}
// bpmn 元素图形路径字典
declare module 'bpmn-js/lib/draw/PathMap' {
  export type Path = {
    d: string
    width?: number
    height?: number
    heightElements?: number[]
    widthElements?: number[]
  }
  export type PathId =
    | 'EVENT_MESSAGE'
    | 'EVENT_SIGNAL'
    | 'EVENT_ESCALATION'
    | 'EVENT_CONDITIONAL'
    | 'EVENT_LINK'
    | 'EVENT_ERROR'
    | 'EVENT_CANCEL_45'
    | 'EVENT_COMPENSATION'
    | 'EVENT_TIMER_WH'
    | 'EVENT_TIMER_LINE'
    | 'EVENT_MULTIPLE'
    | 'EVENT_PARALLEL_MULTIPLE'
    | 'GATEWAY_EXCLUSIVE'
    | 'GATEWAY_PARALLEL'
    | 'GATEWAY_EVENT_BASED'
    | 'GATEWAY_COMPLEX'
    | 'DATA_OBJECT_PATH'
    | 'DATA_OBJECT_COLLECTION_PATH'
    | 'DATA_ARROW'
    | 'DATA_STORE'
    | 'TEXT_ANNOTATION'
    | 'MARKER_SUB_PROCESS'
    | 'MARKER_PARALLEL'
    | 'MARKER_SEQUENTIAL'
    | 'MARKER_COMPENSATION'
    | 'MARKER_LOOP'
    | 'MARKER_ADHOC'
    | 'TASK_TYPE_SEND'
    | 'TASK_TYPE_SCRIPT'
    | 'TASK_TYPE_USER_1'
    | 'TASK_TYPE_USER_2'
    | 'TASK_TYPE_USER_3'
    | 'TASK_TYPE_MANUAL'
    | 'TASK_TYPE_INSTANTIATING_SEND'
    | 'TASK_TYPE_SERVICE'
    | 'TASK_TYPE_SERVICE_FILL'
    | 'TASK_TYPE_BUSINESS_RULE_HEADER'
    | 'TASK_TYPE_BUSINESS_RULE_MAIN'
    | 'MESSAGE_FLOW_MARKER'
  export default class PathMap {
    protected pathMap: { [pathId in PathId]: Path }
    getRawPath(pathId: PathId): string
    getScaledPath(pathId: string, param: Object): Object
  }
}
// bpmn 文本渲染
declare module 'bpmn-js/lib/draw/TextRenderer' {
  import { Bounds } from 'diagram-js/lib/core/Canvas'
  import { ModuleConstructor } from 'didi'

  export type TextStyle = {
    fontFamily: string
    fontSize: number
    fontWeight: string
    lineHeight: number
  }

  export default class TextRenderer extends ModuleConstructor {
    constructor(config: any)
    getExternalLabelBounds(bounds: Bounds, text: string): Bounds
    getTextAnnotationBounds(bounds: Bounds, text: string): Bounds
    createText(text: string, options?: Object): SVGElement
    getDefaultStyle(): TextStyle
    getExternalStyle(): TextStyle
  }
}
/************************************* import 文件导入 *************************************/
// 导入
declare module 'bpmn-js/lib/import/Importer' {
  import Diagram from 'diagram-js'
  import { ModdleElement } from 'bpmn-moddle'
  import { DoneCallbackOpt } from 'bpmn-js/lib/BaseViewer'

  export function importBpmnDiagram(
    diagram: Diagram,
    definitions: ModdleElement,
    bpmnDiagram: ModdleElement
  ): Promise<DoneCallbackOpt>
}
//
declare module 'bpmn-js/lib/import/BpmnImporter' {
  import { ModdleElement } from 'bpmn-moddle'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import ElementFactory from 'diagram-js/lib/core/ElementFactory'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import { Base } from 'diagram-js/lib/model'
  import TextRenderer from 'bpmn-js/lib/draw/TextRenderer'
  import { ModuleConstructor } from 'didi'

  export default class BpmnImporter extends ModuleConstructor {
    constructor(
      eventBus: EventBus,
      canvas: Canvas,
      elementFactory: ElementFactory,
      elementRegistry: ElementRegistry,
      translate: Translate,
      textRenderer: TextRenderer
    )
    protected _eventBus: EventBus
    protected _canvas: Canvas
    protected _elementFactory: ElementFactory
    protected _elementRegistry: ElementRegistry
    protected _translate: Translate
    protected _textRenderer: TextRenderer

    add<E extends Base>(semantic: ModdleElement, di: ModdleElement, parentElement?: E): E
    addLabel(semantic: ModdleElement, di: ModdleElement, element: Base): Base

    //将边界元素附加到给定的主机
    protected _attachBoundary(boundarySemantic: ModdleElement, boundaryElement: Base): void
    protected _getEnd(semantic: ModdleElement, side: string): Base
    protected _getSource(semantic: ModdleElement): Base
    protected _getTarget(semantic: ModdleElement): Base
    protected _getElement(semantic: ModdleElement): Base
  }
}
// xml 树形结构遍历
declare module 'bpmn-js/lib/import/BpmnTreeWalker' {
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import { ModdleElement } from 'bpmn-moddle'

  export default class BpmnTreeWalker {
    constructor(handler, translate: Translate)
    handleDeferred(): void
    handleDefinitions(definitions: ModdleElement, diagram?: ModdleElement): void
    handleSubProcess(subProcess: ModdleElement, context: Object): void
    registerDi(di: ModdleElement): void
  }
}
/************************************* feature modeling 核心扩展功能 *************************************/
declare module 'bpmn-js/lib/features/modeling/Modeling' {
  import BaseModeling from 'diagram-js/lib/features/modeling/Modeling'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import ElementFactory from 'diagram-js/lib/core/ElementFactory'
  import CommandStack from 'diagram-js/lib/command/CommandStack'
  import { Base, Connection, Hints, Label, Root, Shape } from 'diagram-js/lib/model'
  import { Lane, ModdleElement } from 'bpmn-moddle'
  import { ModelingHandler } from 'diagram-js/lib/features/modeling/Modeling'
  import { Bounds } from 'diagram-js/lib/core/Canvas'
  import Rules from 'diagram-js/lib/features/rules/Rules'

  type Properties = Record<string, string | number | boolean | ModdleElement | null | undefined>

  export default class Modeling extends BaseModeling {
    constructor(
      eventBus: EventBus,
      elementFactory: ElementFactory,
      commandStack: CommandStack,
      bpmnRules: Rules
    )
    protected _bpmnRules: Rules
    getHandlers<H extends ModelingHandler>(): Record<string, H>
    updateLabel(element: Base, newLabel: Label | string, newBounds?: Bounds, hints?: Hints): void
    connect(source: Shape, target: Shape, attrs?: Object, hints?: Hints): Connection
    updateModdleProperties(
      element: Base,
      moddleElement: ModdleElement,
      properties: Properties
    ): void
    updateProperties(element: Base, properties: Properties): void
    resizeLane(laneShape: Shape, newBounds: Bounds, balanced?: boolean): void
    addLane(targetLaneShape: Shape, location: Location): Lane
    splitLane(targetLane: Lane, count: number): void
    makeCollaboration(): Root
    updateLaneRefs(flowNodeShapes: Shape, laneShapes: Shape): void
    makeProcess(): Root
    claimId(id: string, moddleElement: ModdleElement): void
    unclaimId(id: string, moddleElement: ModdleElement): void
    setColor(elements: Base | Base[], colors): void
  }
}
// bpmn DI 元素工厂
declare module 'bpmn-js/lib/features/modeling/BpmnFactory' {
  import BpmnModdle from 'bpmn-moddle'
  import { Base } from 'diagram-js/lib/model'
  import { ModdleElement } from 'bpmn-moddle'
  import { ModuleConstructor } from 'didi'

  export default class BpmnFactory extends ModuleConstructor {
    constructor(moddle: BpmnModdle)
    protected _model: BpmnModdle
    protected _needsId<E extends Base>(element: E): boolean
    protected _ensureId<E extends Base>(element: E): void
    create<E extends Base>(type: string, attrs?: Object): E & ModdleElement
    createDiLabel<E extends Base>(): E
    createDiShape<E extends Base>(): E
    createDiBounds<E extends Base>(): E
    createDiWaypoints<E extends Base>(): E
    createDiWaypoint<E extends Base>(): E
    createDiEdge<E extends Base>(): E
    createDiPlane<E extends Base>(): E
  }
}
//
declare module 'bpmn-js/lib/features/modeling/BpmnLayouter' {
  import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter'
  import { Point } from 'diagram-js/lib/model'

  export default class BpmnLayouter extends BaseLayouter {
    constructor()

    layoutConnection(connection, hints): [Point, Point]
  }
}
// 一个处理程序，负责在图上发生更改后更新基础BPMN 2.0 XML
declare module 'bpmn-js/lib/features/modeling/BpmnUpdater' {
  import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import ConnectionDocking from 'diagram-js/lib/layout/ConnectionDocking'
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import { Base, Connection, Label, Shape } from 'diagram-js/lib/model'
  import { ModdleElement } from 'moddle'

  type Context = {
    shape: Shape
  }

  export default class BpmnUpdater extends CommandInterceptor {
    constructor(
      eventBus: EventBus,
      bpmnFactory: BpmnFactory,
      connectionDocking: ConnectionDocking,
      translate: Translate
    )
    protected _bpmnFactory: BpmnFactory
    protected _translate: Translate

    updateAttachment(context: Context): void
    updateParent(element: Base, oldParent?: Base): void
    updateBounds(shape: Shape): void
    updateFlowNodeRefs(
      businessObject: ModdleElement,
      newContainment: ModdleElement | Base,
      oldContainment: ModdleElement | Base
    ): void
    updateDiConnection(connection: Connection, newSource: Shape, newTarget: Shape): void
    updateDiParent(di: ModdleElement, parentDi?: ModdleElement): void
    getLaneSet(container: Base | ModdleElement): Shape
    updateSemanticParent(
      businessObject: ModdleElement,
      newParent: Shape,
      visualParent?: ModdleElement
    ): void
    updateConnectionWaypoints(connection: Connection): void
    updateConnection(connection: Connection): void
    _getLabel(di: ModdleElement): ModdleElement & Label
  }
}
// bpmn 元素实例工厂
declare module 'bpmn-js/lib/features/modeling/ElementFactory' {
  import { default as DiagramElementFactory } from 'diagram-js/lib/core/ElementFactory'
  import BpmnModdle, { ModdleElement } from 'bpmn-moddle'
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import { Base, Shape } from 'diagram-js/lib/model'
  import { Dimensions } from 'diagram-js/lib/core/Canvas'

  export default class ElementFactory extends DiagramElementFactory {
    constructor(bpmnFactory: BpmnFactory, moddle: BpmnModdle, translate: Translate)
    _bpmnFactory: BpmnFactory
    _moddle: BpmnModdle
    _translate: Translate

    baseCreate: typeof DiagramElementFactory.prototype.create
    create<E extends Base>(elementType: string, attrs?: Object): E & ModdleElement
    createBpmnElement<E extends Base>(elementType: string, attrs?: Object): E & ModdleElement
    getDefaultSize(element: Base, di?: ModdleElement): Dimensions
    createParticipantShape(attrs: Object | boolean): Shape & ModdleElement
  }
}
/************************************* feature modules 扩展功能 *************************************/
// 定位
declare module 'bpmn-js/lib/features/auto-place/BpmnAutoPlace' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import { ModuleConstructor } from 'didi'

  // 在实例化时注册一个 autoPlace 事件监听，触发时返回 要连接到源的目标元素的新位置。
  export default class BpmnAutoPlace extends ModuleConstructor {
    constructor(eventBus: EventBus)
  }
}
// 实现BPMN特定调整大小功能的AutoResize模块的子类。
declare module 'bpmn-js/lib/features/auto-resize/BpmnAutoResize' {
  import { Injector } from 'didi'
  import AutoResize from 'diagram-js/lib/features/auto-resize/AutoResize'
  import { Hints, Shape } from 'diagram-js/lib/model'
  import { Bounds } from 'diagram-js/lib/core/Canvas'

  export default class BpmnAutoResize extends AutoResize {
    constructor(injector: Injector)
    /**
     * 调整形状和泳道的大小
     * 根据 target 是否是 Participant 元素
     * 来确定调用 modeling.resizeLane(target, newBounds, null, hints)
     * 或者 modeling.resizeShape(target, newBounds, null, hints)
     * @param {Shape} target
     * @param {Bounds} newBounds
     * @param {Object} hints
     */
    resize(target: Shape, newBounds: Bounds, hints?: Hints): void
  }
}
// 模块是自动调整父BPMN元素大小的具体实现类
declare module 'bpmn-js/lib/features/auto-resize/BpmnAutoResizeProvider' {
  import AutoResizeProvider from 'diagram-js/lib/features/auto-resize/AutoResizeProvider'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'
  import { Base, Shape } from 'diagram-js/lib/model'
  export default class BpmnAutoResizeProvider extends AutoResizeProvider {
    constructor(eventBus: EventBus, modeling: Modeling)
    _modeling: Modeling

    /**
     * 检查给定的目标是否可以扩展, elements 中任意一个不能扩展则返回 false
     * @param  {Shape[]} elements
     * @param  {Shape} target
     * @return {boolean}
     */
    canResize(elements: Base[], target: Shape): boolean
  }
}
// 元素上下文菜单
declare module 'bpmn-js/lib/features/context-pad/ContextPadProvider' {
  import { Injector, ModuleConstructor } from 'didi'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import ContextPad from 'diagram-js/lib/features/context-pad/ContextPad'
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'
  import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
  import Connect from 'diagram-js/lib/features/connect/Connect'
  import Create from 'diagram-js/lib/features/create/Create'
  import PopupMenu from 'diagram-js/lib/features/popup-menu/PopupMenu'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import Rules from 'diagram-js/lib/features/rules/Rules'
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import AutoPlace from 'diagram-js/lib/features/auto-place/AutoPlace'
  import { Base } from 'diagram-js/lib/model'

  type ContextPadAction = {
    group: string
    className: string
    title: string
    action: Record<string, (event: Event, element: Base) => unknown>
  }

  /**
   * 元素对应的上下文菜单
   * 实例化时添加对 autoPlace 实例的依赖
   * 注册 create.end 事件监听函数，手动触发 replace 下面的点击事件
   */
  export default class ContextPadProvider extends ModuleConstructor {
    constructor(
      config: any,
      injector: Injector,
      eventBus: EventBus,
      contextPad: ContextPad,
      modeling: Modeling,
      elementFactory: ElementFactory,
      connect: Connect,
      create: Create,
      popupMenu: PopupMenu,
      canvas: Canvas,
      rules: Rules,
      translate?: Translate,
      priority?: number
    )

    _config: any
    _contextPad: ContextPad
    _modeling: Modeling
    _elementFactory: ElementFactory
    _connect: Connect
    _create: Create
    _popupMenu: PopupMenu
    _canvas: Canvas
    _rules: Rules
    _translate: Translate
    _autoPlace: AutoPlace

    /**
     * 根据当前节点提供可见上下文菜单入口
     * 可以通过继承或者重写来增加上下文菜单可用功能
     * @param element { Base }
     * @returns {Record<string, ContextPadAction>} entries
     */
    getContextPadEntries(element: Base): Record<string, ContextPadAction>
  }
}
// bpmn 元素实例的复制粘贴
declare module 'bpmn-js/lib/features/copy-paste/BpmnCopyPaste' {
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'
  import { ModuleConstructor } from 'didi'

  /**
   * bpmn 元素实例的复制粘贴, 优先级指数 750
   * 初始化时注册 copyPaste.copyElement, moddleCopy.canCopyProperty,
   * copyPaste.pasteElements, copyPaste.pasteElement 事件的监听函数
   *
   */
  export default class BpmnCopyPaste extends ModuleConstructor {
    constructor(bpmnFactory: BpmnFactory, eventBus: EventBus, moddleCopy: ModdleCopy)
  }
}
//
declare module 'bpmn-js/lib/features/copy-paste/ModdleCopy' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import BpmnModdle, { ModdleElement } from 'bpmn-moddle'
  import { Base } from 'diagram-js/lib/model'
  import { ModuleConstructor } from 'didi'

  /**
   * 用于将模型属性从源元素复制到目标元素。
   * 初始化时注册 moddleCopy.canCopyProperties, moddleCopy.canCopyProperty,
   * moddleCopy.canSetCopiedProperty 事件的监听函数， 对元素实例与元素属性的可复制性进行校验
   */
  export default class ModdleCopy extends ModuleConstructor {
    constructor(eventBus: EventBus, bpmnFactory: BpmnFactory, moddle: BpmnModdle)
    protected _bpmnFactory: BpmnFactory
    protected _eventBus: EventBus
    protected _moddle: BpmnModdle

    /**
     * 将源元素的模型属性复制到目标元素。
     * @param {ModdleElement} sourceElement
     * @param {ModdleElement} targetElement
     * @param {Array<string>} [propertyNames]
     * @returns {ModdleElement}
     */
    copyElement<T extends ModdleElement>(
      sourceElement: T,
      targetElement: T,
      propertyNames?: string[]
    ): T

    /**
     * Copy model property.
     *
     * @param {*} property
     * @param {ModdleElement} parent
     * @param {string} propertyName
     *
     * @returns {*}
     */
    copyProperty<T extends ModdleElement, U>(property: U, parent: T, propertyName: string): U

    // 返回copy元素对应的新id，不需要id的返回undefined
    _copyId(id: string, element: Base): string | undefined
  }
}
//
declare module 'bpmn-js/lib/features/di-ordering/BpmnDiOrdering' {
  import { ModuleConstructor } from 'didi'
  export default class BpmnDiOrdering extends ModuleConstructor {}
}
// 排除bpmn定义的不可均分元素
declare module 'bpmn-js/lib/features/distribute-elements/BpmnDistributeElements' {
  import DistributeElements from 'diagram-js/lib/features/distribute-elements/DistributeElements'
  import { ModuleConstructor } from 'didi'
  /**
   * 初始化时注册一个过滤器，默认排除以下元素：
   * 'bpmn:Association',
   * 'bpmn:BoundaryEvent',
   * 'bpmn:DataInputAssociation',
   * 'bpmn:DataOutputAssociation',
   * 'bpmn:Lane',
   * 'bpmn:MessageFlow',
   * 'bpmn:Participant',
   * 'bpmn:SequenceFlow',
   * 'bpmn:TextAnnotation'
   */
  export default class BpmnDistributeElements extends ModuleConstructor {
    constructor(distributeElements: DistributeElements)
  }
}
// 添加允许在折叠的子进程上切换平面的叠加层。
declare module 'bpmn-js/lib/features/drilldown/DrilldownBreadcrumbs' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import Overlays from 'diagram-js/lib/features/overlays/Overlays'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import { Base } from 'diagram-js/lib/model'
  import { ModuleConstructor } from 'didi'
  /**
   * 添加允许在折叠的子进程上切换平面的叠加层。
   * 初始化时会在画布中添加一个 `<ul class="bjs-breadcrumbs"></ul>` 标签
   * 在 element.changed, root.set 事件触发时会更新 Breadcrumbs
   */
  export default class DrilldownBreadcrumbs extends ModuleConstructor {
    constructor(
      eventBus: EventBus,
      elementRegistry: ElementRegistry,
      overlays: Overlays,
      canvas: Canvas
    )

    /**
     * 更新显示的面包屑。如果未提供元素，则仅更新标签
     * @param element
     */
    updateBreadcrumbs(element: Base): void
  }
}
// 向下钻取时，将折叠的子流程移动到视图中。
declare module 'bpmn-js/lib/features/drilldown/DrilldownCentering' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import { ModuleConstructor } from 'didi'

  type PositionEntry = {
    x: number
    y: number
    zoom: number
  }

  export class Map {
    constructor()
    _entries: [string, PositionEntry][]
    set(key: string, value: PositionEntry): void
    get(key: string): null | PositionEntry
    clear: void
    remove(key: string): void
  }

  // 向下钻取时，将折叠的子流程移动到视图中。
  // 缩放和滚动保存在会话中。
  export default class DrilldownCentering extends ModuleConstructor {
    constructor(eventBus: EventBus, canvas: Canvas)
  }
}
//
declare module 'bpmn-js/lib/features/drilldown/DrilldownOverlayBehavior' {
  import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import Overlays from 'diagram-js/lib/features/overlays/Overlays'
  import { Base } from 'diagram-js/lib/model'

  export default class DrilldownOverlayBehavior extends CommandInterceptor {
    constructor(
      canvas: Canvas,
      eventBus: EventBus,
      elementRegistry: ElementRegistry,
      overlays: Overlays
    )

    canDrillDown(element: Base): boolean

    /**
     * 更新向下钻入覆盖的可见性。如果平面没有元素，则仅在选择元素时才显示向下钻取。
     * @param element { Base }
     */
    updateOverlayVisibility(element: Base): void

    /**
     * 将一个向下钻入按钮附加到给定的元素上。我们假设平面与元素具有相同的id。
     * @param element { Base }
     */
    addOverlay(element: Base): void

    /**
     * 移除元素对应的 overlays 覆盖物, 调用 overlays.remove
     * @param element { Base }
     */
    removeOverlay(element: Base): void
  }
}
// 在生命周期钩子 `import.render.start` 触发时为具有折叠的子进程和所有dis在同一平面上的图创建新平面
declare module 'bpmn-js/lib/features/drilldown/SubprocessCompatibility' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import BpmnModdle, { Definitions } from 'bpmn-moddle'

  export default class SubprocessCompatibility {
    constructor(eventBus: EventBus, moddle: BpmnModdle)

    protected _definitions: Definitions | undefined
    protected _processToDiagramMap: Record<string, any> | undefined

    handleImport(definitions: Definitions): void

    /**
     * 将所有DI元素从折叠的子进程移动到新平面.
     * @param {Object} plane
     * @return {Array} new diagrams created for the collapsed subprocesses
     */
    createNewDiagrams(plane: Object): any[]

    // 移动后重新定位
    movePlaneElementsToOrigin(plane: Object): void

    moveToDiPlane(diElement: Object, newPlane: Object): void

    createDiagram(bo: Object): void
  }
}
//
declare module 'bpmn-js/lib/features/editor-actions/BpmnEditorActions' {
  import { Injector } from 'didi'
  import EditorActions from 'diagram-js/lib/features/editor-actions/EditorActions'

  export default class BpmnEditorActions extends EditorActions {
    constructor(injector: Injector)

    /**
     * 注册 bpmn 相关的操作事件
     * 1. selectElements 对应的元素选中事件，默认排除根元素
     * 2. spaceTool 对应的 toggle 事件
     * 3. lassoTool 对应的 toggle 事件
     * 4. handTool 对应的 toggle 事件
     * 5. globalConnectTool 对应的 toggle 事件
     * 6. distributeElements 触发时执行 distributeElements.trigger
     * 7. alignElements 事件触发时对齐当前选中元素，执行 alignElements.trigger
     * 等等
     * @param injector
     */
    _registerDefaultActions(injector: Injector): void
  }
}
//
declare module 'bpmn-js/lib/features/grid-snapping/BpmnGridSnapping' {
  import { ModuleConstructor } from 'didi'
  export default class BpmnGridSnapping extends ModuleConstructor {
    constructor(eventBus)
  }
}
//
declare module 'bpmn-js/lib/features/grid-snapping/behavior/AutoPlaceBehavior' {
  import { ModuleConstructor } from 'didi'
  export default class AutoPlaceBehavior extends ModuleConstructor {
    constructor(eventBus, gridSnapping)
  }
}
//
declare module 'bpmn-js/lib/features/grid-snapping/behavior/CreateParticipantBehavior' {
  import { ModuleConstructor } from 'didi'
  export default class CreateParticipantBehavior extends ModuleConstructor {
    constructor(canvas, eventBus, gridSnapping)
  }
}
//
declare module 'bpmn-js/lib/features/grid-snapping/behavior/LayoutConnectionBehavior' {
  import { ModuleConstructor } from 'didi'
  import { Point } from 'diagram-js/lib/model'
  export default class LayoutConnectionBehavior extends ModuleConstructor {
    constructor(eventBus, gridSnapping, modeling)

    snapMiddleSegments(waypoints: Point[]): Point[]
  }
}
// PMN特定的命中区域和交互修复。
declare module 'bpmn-js/lib/features/interaction-events/BpmnInteractionEvents' {
  import { ModuleConstructor } from 'didi'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import InteractionEvents from 'diagram-js/lib/features/interaction-events/InteractionEvents'
  import { Base } from 'diagram-js/lib/model'
  export default class BpmnInteractionEvents extends ModuleConstructor {
    constructor(eventBus: EventBus, interactionEvents: InteractionEvents)
    _interactionEvents: InteractionEvents

    createDefaultHit(element: Base, gfx: SVGElement): true
    createParticipantHit(element: Base, gfx: SVGElement): true
    createSubProcessHit(element: Base, gfx: SVGElement): true
  }
}
// BPMN 2.0 specific keyboard bindings.
declare module 'bpmn-js/lib/features/keyboard/BpmnKeyboardBindings' {
  import KeyboardBindings from 'diagram-js/lib/features/keyboard/KeyboardBindings'
  import { Injector } from 'didi'

  export default class BpmnKeyboardBindings extends KeyboardBindings<Element> {
    constructor(injector: Injector)

    /**
     *  注册 bpmn 相关快捷键
     *  CTRL + A: select all elements
     *  CTRL + F: search labels
     *  S: activate space tool
     *  L: activate lasso tool
     *  H: activate hand tool
     *  C: activate global connect tool
     *  E: activate direct editing
     */
    registerBindings(keyboard, editorActions): void
  }
}
//
declare module 'bpmn-js/lib/features/label-editing/LabelEditingPreview' {
  import { ModuleConstructor } from 'didi'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import PathMap from 'bpmn-js/lib/draw/PathMap'
  export default class LabelEditingPreview extends ModuleConstructor {
    constructor(
      eventBus: EventBus,
      canvas: Canvas,
      elementRegistry: ElementRegistry,
      pathMap: PathMap
    )
  }
}
//
declare module 'bpmn-js/lib/features/label-editing/LabelEditingProvider' {
  import { ModuleConstructor } from 'didi'
  import { Base } from 'diagram-js/lib/model'
  export default class LabelEditingProvider extends ModuleConstructor {
    constructor(eventBus, bpmnFactory, canvas, directEditing, modeling, resizeHandles, textRenderer)

    // 为活动和文本注释激活直接编辑
    activate(element: Base): Object
    //  根据元素的大小和位置获取编辑边界框
    getEditingBBox(element: Base): void
    // 调用 modeling.updateLabel 更新 label
    update(element: Base, newLabel?, activeContextText?, bounds?): void
  }
}
// 更新BPMN元素文本的处理程序。
declare module 'bpmn-js/lib/features/label-editing/cmd/UpdateLabelHandler' {
  import { ModuleConstructor } from 'didi'
  // 结构类似继承的 CommandInterceptor
  export default class UpdateLabelHandler extends ModuleConstructor {
    constructor(modeling, textRenderer, bpmnFactory)
  }
}
// 一个简单的订购提供商，可确保：
// (0) 标签和组始终呈现在顶部 (1) 元素按 {level} 属性排序
declare module 'bpmn-js/lib/features/ordering/BpmnOrderingProvider' {
  import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider'
  import { Base } from 'diagram-js/lib/model'

  type Ordering = {
    index: number
    parent: Base
  }

  export default class BpmnOrderingProvider extends OrderingProvider {
    constructor(eventBus, canvas, translate)
    readonly orders: [
      { type: 'bpmn:SubProcess'; order: { level: 6 } },
      {
        type: 'bpmn:SequenceFlow'
        order: {
          level: 3
          containers: ['bpmn:Participant', 'bpmn:FlowElementsContainer']
        }
      },
      {
        type: 'bpmn:DataAssociation'
        order: {
          level: 9
          containers: ['bpmn:Collaboration', 'bpmn:FlowElementsContainer']
        }
      },
      {
        type: 'bpmn:MessageFlow'
        order: {
          level: 9
          containers: ['bpmn:Collaboration']
        }
      },
      {
        type: 'bpmn:Association'
        order: {
          level: 6
          containers: ['bpmn:Participant', 'bpmn:FlowElementsContainer', 'bpmn:Collaboration']
        }
      },
      { type: 'bpmn:BoundaryEvent'; order: { level: 8 } },
      {
        type: 'bpmn:Group'
        order: {
          level: 10
          containers: ['bpmn:Collaboration', 'bpmn:FlowElementsContainer']
        }
      },
      { type: 'bpmn:FlowElement'; order: { level: 5 } },
      { type: 'bpmn:Participant'; order: { level: -2 } },
      { type: 'bpmn:Lane'; order: { level: -1 } }
    ]

    getOrdering(element: Base, newParent: Base): Ordering
  }
}
//
declare module 'bpmn-js/lib/features/palette/PaletteProvider' {
  import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
  import Create from 'diagram-js/lib/features/create/Create'
  import SpaceTool from 'diagram-js/lib/features/space-tool/SpaceTool'
  import LassoTool from 'diagram-js/lib/features/lasso-tool/LassoTool'
  import HandTool from 'diagram-js/lib/features/hand-tool/HandTool'
  import GlobalConnect from 'diagram-js/lib/features/global-connect/GlobalConnect'
  import Palette from 'diagram-js/lib/features/palette/Palette'
  import { Base } from 'diagram-js/lib/model'

  export default class PaletteProvider {
    static $inject?: string[]
    constructor(
      palette: Palette,
      create: Create,
      elementFactory: ElementFactory,
      spaceTool: SpaceTool,
      lassoTool: LassoTool,
      handTool: HandTool,
      globalConnect: GlobalConnect,
      translate?: any,
      priority?: number
    )

    getPaletteEntries(element: Base): Object
  }
}
// 此模块是弹出菜单的元素不可知替换菜单提供程序
declare module 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider' {
  import { ModuleConstructor } from 'didi'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import PopupMenu, { PopupMenuEntry } from 'diagram-js/lib/features/popup-menu/PopupMenu'
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling'
  import BpmnReplace from 'bpmn-js/lib/features/replace/BpmnReplace'
  import Rules from 'diagram-js/lib/features/rules/Rules'
  import { Translate } from 'diagram-js/lib/i18n/translate'
  import { Base } from 'diagram-js/lib/model'
  import { ReplaceOption } from 'bpmn-js/lib/features/replace/ReplaceOptions'
  import BpmnModdle from 'bpmn-moddle'

  export default class ReplaceMenuProvider extends ModuleConstructor {
    constructor(
      bpmnFactory: BpmnFactory,
      popupMenu: PopupMenu,
      modeling: Modeling,
      moddle: BpmnModdle,
      bpmnReplace: BpmnReplace,
      rules: Rules,
      translate: Translate
    )
    protected _bpmnFactory: BpmnFactory
    protected _popupMenu: PopupMenu
    protected _modeling: Modeling
    protected _moddle: BpmnModdle
    protected _bpmnReplace: BpmnReplace
    protected _rules: Rules
    protected _translate: Translate

    // 在弹出菜单中注册替换菜单提供程序
    register(): void

    //从给定元素的replaceOptions中获取所有条目，并在其上应用过滤器。例如，仅获取与当前元素不同的元素。
    getEntries(element: Base): PopupMenuEntry[]

    // 获取给定元素的标题项列表。这包括用于多实例标记和临时标记的按钮。
    getHeaderEntries(element: Base): PopupMenuEntry[]

    _createEntries(element: Base, replaceOptions: Object)

    _createSequenceFlowEntries(element: Base, replaceOptions: ReplaceOption[]): PopupMenuEntry[]

    _createMenuEntry(definition: ReplaceOption, element: Base, action?: Function): PopupMenuEntry

    _getLoopEntries(element: Base): PopupMenuEntry[]

    _getDataObjectIsCollection(element: Base): PopupMenuEntry[]

    _getParticipantMultiplicity(element: Base): PopupMenuEntry[]

    _getAdHocEntry(element: Base): PopupMenuEntry
  }
}
// 该模块负责更换BPMN元素
declare module 'bpmn-js/lib/features/replace/BpmnReplace' {
  import { ModuleConstructor } from 'didi'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
  import ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling'
  import Replace from 'diagram-js/lib/features/replace/Replace'
  import Rules from 'diagram-js/lib/features/rules/Rules'
  import Selection from 'diagram-js/lib/features/selection/Selection'
  import { Base } from 'diagram-js/lib/model'

  export const CUSTOM_PROPERTIES: [
    'cancelActivity',
    'instantiate',
    'eventGatewayType',
    'triggeredByEvent',
    'isInterrupting'
  ]

  export default class BpmnReplace extends ModuleConstructor {
    constructor(
      bpmnFactory: BpmnFactory,
      elementFactory: ElementFactory,
      moddleCopy: ModdleCopy,
      modeling: Modeling,
      replace: Replace,
      rules: Rules,
      selection: Selection
    )

    //为替换元素准备新的业务对象，并触发替换操作。
    replaceElement(element: Base, target: Object, hints?: Object): Base
  }
}
//
declare module 'bpmn-js/lib/features/replace/ReplaceOptions' {
  export type BaseReplaceOption = {
    label: string
    actionName: string
    className: string
    target: {
      type: string
    }
  }
  export type StartEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType?: string
    }
  }
  export type SubProcessStartEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType: string
      isInterrupting?: boolean
    }
  }
  export type IntermediateEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType?: string
      eventDefinitionAttrs?: {
        name: string
      }
    }
  }
  export type EndEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType?: string
    }
  }
  export type GatewayReplaceOption = BaseReplaceOption & {
    target: {
      instantiate?: boolean
      eventGatewayType?: string
    }
  }
  export type SubProcessReplaceOption = BaseReplaceOption & {
    target: {
      isExpanded: boolean
      triggeredByEvent?: boolean
    }
  }
  export type TaskReplaceOption = BaseReplaceOption & {
    target: {
      isExpanded?: boolean
    }
  }
  export type DataObjectReplaceOption = BaseReplaceOption
  export type DataStoreReplaceOption = BaseReplaceOption
  export type BoundaryEventReplaceOption = BaseReplaceOption & {
    target: {
      eventDefinitionType: string
      cancelActivity?: boolean
    }
  }
  export type SequenceFlowReplaceOption = {
    label: string
    actionName: string
    className: string
  }
  export type ParticipantReplaceOption = BaseReplaceOption & {
    label: string | Function
    target: {
      isExpanded: boolean
    }
  }
  export type ReplaceOption =
    | BaseReplaceOption
    | StartEventReplaceOption
    | SubProcessStartEventReplaceOption
    | IntermediateEventReplaceOption
    | EndEventReplaceOption
    | GatewayReplaceOption
    | SubProcessReplaceOption
    | TaskReplaceOption
    | DataObjectReplaceOption
    | DataStoreReplaceOption
    | BoundaryEventReplaceOption
    | SequenceFlowReplaceOption
    | ParticipantReplaceOption

  export const START_EVENT: StartEventReplaceOption[]
  export const START_EVENT_SUB_PROCESS: StartEventReplaceOption[]
  export const INTERMEDIATE_EVENT: IntermediateEventReplaceOption[]
  export const END_EVENT: EndEventReplaceOption[]
  export const GATEWAY: GatewayReplaceOption[]
  export const SUBPROCESS_EXPANDED: SubProcessReplaceOption[]
  export const TRANSACTION: SubProcessReplaceOption[]
  export const EVENT_SUB_PROCESS: SubProcessReplaceOption[]
  export const TASK: TaskReplaceOption[]
  export const DATA_OBJECT_REFERENCE: DataObjectReplaceOption[]
  export const DATA_STORE_REFERENCE: DataStoreReplaceOption[]
  export const BOUNDARY_EVENT: BoundaryEventReplaceOption[]
  export const EVENT_SUB_PROCESS_START_EVENT: SubProcessStartEventReplaceOption[]
  export const SEQUENCE_FLOW: SequenceFlowReplaceOption[]
  export const PARTICIPANT: ParticipantReplaceOption[]
}
//
declare module 'bpmn-js/lib/features/replace-preview/BpmnReplacePreview' {
  import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor'
  export default class BpmnReplacePreview extends CommandInterceptor {
    constructor(eventBus, elementRegistry, elementFactory, canvas, previewSupport)
  }
}
// BPMN特定建模规则
declare module 'bpmn-js/lib/features/rules/BpmnRules' {
  import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider'
  import { Base, Connection } from 'diagram-js/lib/model'
  import { Position } from 'diagram-js/lib/core/Canvas'
  export default class BpmnRules extends RuleProvider {
    constructor(eventBus)

    /**
     * 初始化默认规则
     * connection.start
     * connection.create
     * connection.reconnect
     * connection.updateWaypoints
     * shape.create
     * shape.resize
     * shape.attach
     * element.copy
     * elements.create
     * elements.move
     */
    init(): void

    canConnectMessageFlow(source: Base, target: Base): boolean
    canConnectSequenceFlow(source: Base, target: Base): boolean
    canConnectDataAssociation(source: Base, target: Base): boolean
    canConnectAssociation(source: Base, target: Base): boolean
    canMove(source: Base, target: Base): boolean
    // 能否挂载
    canAttach(elements: Base[], target: Base, source: Base, position?: Position): false | 'attach'
    //定义如何为给定目标替换元素。 返回一个包含将被替换的所有元素的数组。
    canReplace(elements: Base[], target: Base, position): false | Object[]
    // 是否可以将元素放入目标元素中
    canDrop(element: Base, target: Base, position?: Position): boolean
    canInsert(shape: Base, flow?: Connection, position?: Position): boolean
    canCreate(shape: Base, target: Base, source: Base, position?: Position): boolean
    canConnect(source: Base, target: Base, connection): boolean
    canResize(shape: Base, newBounds): boolean
    canCopy(elements: Base[], element): boolean
  }
}
// 提供搜索BPMN元素的能力
declare module 'bpmn-js/lib/features/search/BpmnSearchProvider' {
  import { ModuleConstructor } from 'didi'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import SearchPad from 'diagram-js/lib/features/search-pad/SearchPad'
  import Canvas from 'diagram-js/lib/core/Canvas'
  import { Base } from 'diagram-js/lib/model'

  export default class BpmnSearchProvider extends ModuleConstructor {
    constructor(elementRegistry: ElementRegistry, searchPad: SearchPad, canvas: Canvas)
    _elementRegistry: ElementRegistry
    _canvas: Canvas

    find(pattern: string): Base[]
  }
}
// 在连线过程中计算坐标
declare module 'bpmn-js/lib/features/snapping/BpmnConnectSnapping' {
  export default class BpmnConnectSnapping {}
}
// 在创建和移动过程中捕捉坐标。
declare module 'bpmn-js/lib/features/snapping/BpmnCreateMoveSnapping' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import CreateMoveSnapping from 'diagram-js/lib/features/snapping/CreateMoveSnapping'
  import { Injector } from 'didi'
  import SnapContext, { SnapPoints } from 'diagram-js/lib/features/snapping/SnapContext'
  import { Shape, Connection } from 'diagram-js/lib/model'

  export default class BpmnCreateMoveSnapping extends CreateMoveSnapping {
    constructor(eventBus: EventBus, injector: Injector)

    initSnap(event: Event): SnapContext
    addSnapTargetPoints(
      snapPoints: SnapPoints,
      shape: Shape | Connection,
      target: Shape | Connection,
      direction?: string
    ): SnapPoints
    getSnapTargets(shape: Shape | Connection, target: Shape | Connection): Array<Shape | Connection>
  }
}

/*************************************** utils 相关函数 ****************************************/
declare module 'bpmn-js/lib/draw/bpmnRenderUtil' {
  import { Base, Shape } from 'diagram-js/lib/model'
  import { ModdleElement } from 'moddle'

  import { getDi } from 'bpmn-js/lib/util/ModelUtil'
  export { getDi }

  export function isTypedEvent(
    event,
    eventDefinitionType: string,
    filter: Object | unknown[]
  ): boolean
  export function isThrowEvent(event): boolean
  export function isCollection(element: Base): boolean
  export function getSemantic(element: Base): ModdleElement

  export function getFillColor(element: Base, defaultColor: string): string
  export function getStrokeColor(element: Base, defaultColor: string): string
  export function getLabelColor(
    element: Base,
    defaultColor: string,
    defaultStrokeColor: string
  ): string

  export function getCirclePath(shape: Shape): string
  export function getRoundRectPath(shape: Shape, borderRadius: number): string
  export function getDiamondPath(shape: Shape): string
  export function getRectPath(shape: Shape): string
}

declare module 'bpmn-js/lib/features/auto-place/BpmnAutoPlaceUtil' {
  import { Point, Shape } from 'diagram-js/lib/model'

  //找到要连接到源的目标元素的新位置。
  export function getNewShapePosition(source: Shape, element: Shape): Point
  //始终尝试将元素置于源的右边; 计算与流中先前节点的实际距离。
  export function getFlowNodePosition(source: Shape, element: Shape): Point
  //始终尝试在源代码的右上方放置文本注释。
  export function getTextAnnotationPosition(source: Shape, element: Shape): Point
  //始终将元素放在source的右下方。
  export function getDataElementPosition(source: Shape, element: Shape): Point
}

declare module 'bpmn-js/lib/features/label-editing/LabelUtil' {
  import { Base } from 'diagram-js/lib/model'

  export function getLabel(element: Base): string
  export function setLabel(element: Base, text: string, isExternal?: boolean): Base
}

declare module 'bpmn-js/lib/features/modeling/util/LaneUtil' {
  import { Base, Shape } from 'diagram-js/lib/model'
  import { Bounds } from 'diagram-js/lib/core/Canvas'

  export const LANE_INDENTATION: 30
  //收集给定参数中的所有 lane 元素
  export function collectLanes(shape: Shape, collectedShapes?: Shape[]): Base[]
  // 返回给定元素的 lane 子项。
  export function getChildLanes(shape: Shape): Shape[]
  //返回包含给定 lane 的根元素
  export function getLanesRoot(shape: Shape): Shape
  //假设将其大小调整到给定的新边界，计算与给定形状相邻的通道所需的调整大小操作。
  export function computeLanesResize(shape: Shape, newBounds: Bounds): Object[]
}

declare module 'bpmn-js/lib/features/modeling/util/ModelingUtil' {
  import { Base } from 'diagram-js/lib/model'
  import { isAny, is } from 'bpmn-js/lib/util/ModelUtil'

  export function getParent(element: Base, anyType: string | string[]): Base

  export { isAny, is }
}

declare module 'bpmn-js/lib/features/popup-menu/util/TypeUtil' {
  import { Base } from 'diagram-js/lib/model'

  function isDifferent(entry: Object): boolean

  // 如果元素来自与目标定义不同的类型，则返回true。考虑类型、事件定义类型和 triggeredByEvent 属性
  export function isDifferentType(element: Base): typeof isDifferent
}

declare module 'bpmn-js/lib/import/Util' {
  import { ModdleElement } from 'bpmn-moddle'

  // 根据元素返回标签，无参数时返回 <null>，否则返回 `<${e.$type} ${e.id ? e.id : ''} />`
  export function elementToString(e?: ModdleElement): string
}

declare module 'bpmn-js/lib/util/CompatibilityUtil' {
  import { ModdleElement } from 'bpmn-moddle'

  export function wrapForCompatibility(api: Function): Function
  export function ensureCompatDiRef(businessObject: ModdleElement): void
}

declare module 'bpmn-js/lib/util/DiUtil' {
  import { ModdleElement } from 'bpmn-moddle'
  import { Base } from 'diagram-js/lib/model'

  export function isExpanded(element: Base, di?: ModdleElement): boolean
  export function isInterrupting(element: Base | ModdleElement): boolean
  export function isEventSubProcess(element: Base | ModdleElement): boolean
  export function hasEventDefinition(element: Base | ModdleElement, eventType: string): boolean
  export function hasErrorEventDefinition(element: Base | ModdleElement): boolean
  export function hasEscalationEventDefinition(element: Base | ModdleElement): boolean
  export function hasCompensateEventDefinition(element: Base | ModdleElement): boolean
}

declare module 'bpmn-js/lib/util/DrilldownUtil' {
  import { ModdleElement } from 'bpmn-moddle'
  import { Base } from 'diagram-js/lib/model'

  export const planeSuffix: '_plane'
  //获取 plane 的主要形状ID
  export function getShapeIdFromPlane(element: Base | ModdleElement): string
  //获取主形状的平面ID。
  export function getPlaneIdFromShape(element: Base | ModdleElement): string
  //获取主形状ID的平面ID
  export function toPlaneId(id: string): string
  //检查元素是否为 Plane。
  export function isPlane(element: Base | ModdleElement): boolean
}

declare module 'bpmn-js/lib/util/LabelUtil' {
  import { ModdleElement } from 'bpmn-moddle'
  import { Base, Point, Shape } from 'diagram-js/lib/model'
  import { Bounds } from 'diagram-js/lib/core/Canvas'
  export type DefaultLabelSize = {
    width: 90
    height: 20
  }
  export const DEFAULT_LABEL_SIZE: DefaultLabelSize
  // 如果给定的语义具有 label 标签，则返回true
  export function isLabelExternal(semantic: Base): boolean
  // 如果给定元素具有外部标签，则返回true
  export function hasExternalLabel(element: Shape): boolean
  // 获取 连线的 标签的位置
  export function getFlowLabelPosition(waypoints: Point[]): Point
  // 获取多个航点的中间位置
  export function getWaypointsMid(waypoints: Point[]): Point
  // 获取 label 元素的中间点
  export function getExternalLabelMid(element: Base): Point
  // 返回从元素DI解析或从其边界生成的元素标签的边界。
  export function getExternalLabelBounds(di: ModdleElement, element: Base): Bounds
  // 判断当前元素是否是 label 元素
  export function isLabel(element: Base): boolean
}

declare module 'bpmn-js/lib/util/ModelUtil' {
  import { ModdleElement } from 'bpmn-moddle'
  import { Base } from 'diagram-js/lib/model'

  export function is(element: Base | ModdleElement, type: string): boolean

  export function isAny(element: Base | ModdleElement, types: string[]): boolean

  export function getBusinessObject(element: Base | ModdleElement): ModdleElement

  export function getDi(element: Base): ModdleElement
}

declare module 'bpmn-js/lib/util/PoweredByUtil' {
  export const BPMNIO_IMG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.02 5.57" width="53" height="21"><path fill="currentColor" d="M1.88.92v.14c0 .41-.13.68-.4.8.33.14.46.44.46.86v.33c0 .61-.33.95-.95.95H0V0h.95c.65 0 .93.3.93.92zM.63.57v1.06h.24c.24 0 .38-.1.38-.43V.98c0-.28-.1-.4-.32-.4zm0 1.63v1.22h.36c.2 0 .32-.1.32-.39v-.35c0-.37-.12-.48-.4-.48H.63zM4.18.99v.52c0 .64-.31.98-.94.98h-.3V4h-.62V0h.92c.63 0 .94.35.94.99zM2.94.57v1.35h.3c.2 0 .3-.09.3-.37v-.6c0-.29-.1-.38-.3-.38h-.3zm2.89 2.27L6.25 0h.88v4h-.6V1.12L6.1 3.99h-.6l-.46-2.82v2.82h-.55V0h.87zM8.14 1.1V4h-.56V0h.79L9 2.4V0h.56v4h-.64zm2.49 2.29v.6h-.6v-.6zM12.12 1c0-.63.33-1 .95-1 .61 0 .95.37.95 1v2.04c0 .64-.34 1-.95 1-.62 0-.95-.37-.95-1zm.62 2.08c0 .28.13.39.33.39s.32-.1.32-.4V.98c0-.29-.12-.4-.32-.4s-.33.11-.33.4z"/><path fill="currentColor" d="M0 4.53h14.02v1.04H0zM11.08 0h.63v.62h-.63zm.63 4V1h-.63v2.98z"/></svg>'
  export const LOGO_STYLES: {
    verticalAlign: 'middle'
  }
  export const LINK_STYLES: {
    color: '#404040'
  }

  export function open(): void
}
