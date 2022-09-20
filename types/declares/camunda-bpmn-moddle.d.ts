// 复制粘贴的行为校验
declare module 'camunda-bpmn-moddle/lib/CopyPasteBehavior' {
  import EventBus from 'diagram-js/lib/core/EventBus'
  import { Base } from 'diagram-js/lib/model'

  // 注册一个  moddleCopy.canCopyProperty  监听事件
  export default class CopyPasteBehavior {
    constructor(eventBus: EventBus)

    /**
     * 检查是否不允许复制属性
     * @param property
     * @param parent
     */
    canCopyProperty(property: Object | string, parent: Base): boolean

    canHostInputOutput(parent: Base): boolean

    canHostConnector(parent: Base): boolean

    canHostIn(parent: Base): boolean
  }
}
//
declare module 'camunda-bpmn-moddle/lib/CopyPasteRootElementBehavior' {
  import Modeler from 'bpmn-js/lib/Modeler'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import { Injector } from 'didi'
  import ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'

  /**
   * 添加引用的根元素 (bpmn: Error)，如果它们不存在。复制和粘贴中引用的根元素
   * 内部继承 CommandInterceptor
   * 注册 copyPaste.copyElement, copyPaste.pasteElement 事件
   */
  export default class CopyPasteRootElementBehavior {
    constructor(
      bpmnjs: Modeler,
      eventBus: EventBus,
      injector: Injector,
      moddleCopy: ModdleCopy,
      bpmnFactory: BpmnFactory
    )
  }
}
//
declare module 'camunda-bpmn-moddle/lib/RemoveInitiatorBehaviour' {
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'
  import { Injector } from 'didi'

  /**
   * 移除 `camunda:initiator` 将startEvent移动到子进程或在子进程中创建时的属性
   * 继承 CommandInterceptor
   */
  export default class RemoveInitiatorBehaviour {
    constructor(modeling: Modeling, injector: Injector)
  }
}
//
declare module 'camunda-bpmn-moddle/lib/RemoveVariableEventBehaviour' {
  import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'
  import { Injector } from 'didi'
  import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
  import ModdleCopy from 'bpmn-js/lib/features/copy-paste/ModdleCopy'
  export default class RemoveVariableEventBehaviour {
    constructor(
      modeling: Modeling,
      injector: Injector,
      bpmnFactory: BpmnFactory,
      moddleCopy: ModdleCopy
    )
  }
}
