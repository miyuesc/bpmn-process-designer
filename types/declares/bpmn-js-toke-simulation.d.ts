declare module 'bpmn-js-token-simulation' {
  import ContextPads from 'bpmn-js-token-simulation/lib/features/context-pads/ContextPads'
  import ElementNotifications from 'bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications'
  import ElementSupport from 'bpmn-js-token-simulation/lib/features/element-support/ElementSupport'
  import Notifications from 'bpmn-js-token-simulation/lib/features/notifications/Notifications'
  import ExclusiveGatewaySettings from 'bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings'
  import PauseSimulation from 'bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation'
  import PreserveElementColors from 'bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors'
  import ProcessInstanceIds from 'bpmn-js-token-simulation/lib/features/process-instance-ids/ProcessInstanceIds'
  import ProcessInstanceSettings from 'bpmn-js-token-simulation/lib/features/process-instance-settings/ProcessInstanceSettings'
  import Log from 'bpmn-js-token-simulation/lib/features/log/Log'
  import ToggleMode from 'bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode'
  import ProcessInstances from 'bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances'
  import ResetSimulation from 'bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation'
  import SetAnimationSpeed from 'bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed'
  import ShowProcessInstance from 'bpmn-js-token-simulation/lib/features/show-process-instance/ShowProcessInstance'
  import SimulationState from 'bpmn-js-token-simulation/lib/features/simulation-state/SimulationState'
  import Palette from 'bpmn-js-token-simulation/lib/features/palette/Palette'
  import TokenCount from 'bpmn-js-token-simulation/lib/features/token-count/TokenCount'
  import TokenSimulationBehavior from 'bpmn-js-token-simulation/lib/features/token-simulation-behavior/TokenSimulationBehavior'
  import DisableModeling from 'bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling'
  import KeyboardBindings from 'bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings'
  import EditorActions from 'bpmn-js-token-simulation/lib/features/editor-actions/EditorActions'
  import { ModuleDefinition } from 'didi'

  const SimulationModeler: ModuleDefinition & {
    animation: ['type', Animation]
    contextPads: ['type', ContextPads]
    disableModeling: ['type', DisableModeling]
    elementNotifications: ['type', ElementNotifications]
    elementSupport: ['type', ElementSupport]
    exclusiveGatewaySettings: ['type', ExclusiveGatewaySettings]
    log: ['type', Log]
    notifications: ['type', Notifications]
    pauseSimulation: ['type', PauseSimulation]
    preserveElementColors: ['type', PreserveElementColors]
    processInstanceIds: ['type', ProcessInstanceIds]
    processInstanceSettings: ['type', ProcessInstanceSettings]
    processInstances: ['type', ProcessInstances]
    resetSimulation: ['type', ResetSimulation]
    setAnimationSpeed: ['type', SetAnimationSpeed]
    showProcessInstance: ['type', ShowProcessInstance]
    simulationState: ['type', SimulationState]
    toggleMode: ['type', ToggleMode]
    tokenCount: ['type', TokenCount]
    tokenSimulationBehavior: ['type', TokenSimulationBehavior]
    tokenSimulationEditorActions: ['type', EditorActions]
    tokenSimulationKeyboardBindings: ['type', KeyboardBindings]
    tokenSimulationPalette: ['type', Palette]
  }

  export default SimulationModeler
}

declare module 'bpmn-js-token-simulation/lib/viewer' {
  import { ModuleDefinition } from 'didi'
  import ContextPads from 'bpmn-js-token-simulation/lib/features/context-pads/ContextPads'
  import ElementNotifications from 'bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications'
  import ElementSupport from 'bpmn-js-token-simulation/lib/features/element-support/ElementSupport'
  import Notifications from 'bpmn-js-token-simulation/lib/features/notifications/Notifications'
  import ExclusiveGatewaySettings from 'bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings'
  import PauseSimulation from 'bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation'
  import PreserveElementColors from 'bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors'
  import ProcessInstanceIds from 'bpmn-js-token-simulation/lib/features/process-instance-ids/ProcessInstanceIds'
  import ProcessInstanceSettings from 'bpmn-js-token-simulation/lib/features/process-instance-settings/ProcessInstanceSettings'
  import Log from 'bpmn-js-token-simulation/lib/features/log/Log'
  import ToggleMode from 'bpmn-js-token-simulation/lib/features/toggle-mode/viewer/ToggleMode'
  import ProcessInstances from 'bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances'
  import ResetSimulation from 'bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation'
  import SetAnimationSpeed from 'bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed'
  import ShowProcessInstance from 'bpmn-js-token-simulation/lib/features/show-process-instance/ShowProcessInstance'
  import SimulationState from 'bpmn-js-token-simulation/lib/features/simulation-state/SimulationState'
  import Palette from 'bpmn-js-token-simulation/lib/features/palette/Palette'
  import TokenCount from 'bpmn-js-token-simulation/lib/features/token-count/TokenCount'
  import TokenSimulationBehavior from 'bpmn-js-token-simulation/lib/features/token-simulation-behavior/TokenSimulationBehavior'

  const SimulationViewer: ModuleDefinition & {
    animation: ['type', Animation]
    contextPads: ['type', ContextPads]
    elementNotifications: ['type', ElementNotifications]
    elementSupport: ['type', ElementSupport]
    exclusiveGatewaySettings: ['type', ExclusiveGatewaySettings]
    log: ['type', Log]
    notifications: ['type', Notifications]
    pauseSimulation: ['type', PauseSimulation]
    preserveElementColors: ['type', PreserveElementColors]
    processInstanceIds: ['type', ProcessInstanceIds]
    processInstanceSettings: ['type', ProcessInstanceSettings]
    processInstances: ['type', ProcessInstances]
    resetSimulation: ['type', ResetSimulation]
    setAnimationSpeed: ['type', SetAnimationSpeed]
    showProcessInstance: ['type', ShowProcessInstance]
    simulationState: ['type', SimulationState]
    toggleMode: ['type', ToggleMode]
    tokenCount: ['type', TokenCount]
    tokenSimulationBehavior: ['type', TokenSimulationBehavior]
    tokenSimulationPalette: ['type', Palette]
  }

  export default SimulationViewer
}

declare module 'bpmn-js-token-simulation/lib/animation/Animation' {
  import Canvas from 'diagram-js/lib/core/Canvas'
  import EventBus from 'diagram-js/lib/core/EventBus'
  export default class Animation {
    constructor(canvas: Canvas, eventBus: EventBus)
  }
}
declare module 'bpmn-js-token-simulation/lib/features/context-pads/ContextPads' {
  import Canvas from 'diagram-js/lib/core/Canvas'
  import EventBus from 'diagram-js/lib/core/EventBus'
  import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
  import Overlays from 'diagram-js/lib/features/overlays/Overlays'
  import { Injector } from 'didi'
  import ProcessInstances from 'bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances'
  export default class ContextPads {
    constructor(
      eventBus: EventBus,
      elementRegistry: ElementRegistry,
      overlays: Overlays,
      injector: Injector,
      canvas: Canvas,
      processInstances: ProcessInstances
    )
    registerHandler(type: string, handler: Object): void
    openContextPads(element: any): void
    openElementContextPads(parent: any): void
    closeContextPads(parent: any): void
    closeElementContextPads(element: any): void
  }
}
declare module 'bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling' {
  export default class DisableModeling {}
}
declare module 'bpmn-js-token-simulation/lib/features/editor-actions/EditorActions' {
  export default class EditorActions {}
}
declare module 'bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications' {
  export default class ElementNotifications {}
}
declare module 'bpmn-js-token-simulation/lib/features/element-support/ElementSupport' {
  export default class ElementSupport {}
}
declare module 'bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings' {
  export default class ExclusiveGatewaySettings {}
}
declare module 'bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings' {
  export default class KeyboardBindings {}
}
declare module 'bpmn-js-token-simulation/lib/features/log/Log' {
  export default class Log {}
}
declare module 'bpmn-js-token-simulation/lib/features/notifications/Notifications' {
  export default class Notifications {}
}
declare module 'bpmn-js-token-simulation/lib/features/palette/Palette' {
  export default class Palette {}
}
declare module 'bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation' {
  export default class PauseSimulation {}
}
declare module 'bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors' {
  export default class PreserveElementColors {}
}
declare module 'bpmn-js-token-simulation/lib/features/process-instance-ids/ProcessInstanceIds' {
  export default class ProcessInstanceIds {}
}
declare module 'bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances' {
  export default class ProcessInstances {}
}
declare module 'bpmn-js-token-simulation/lib/features/process-instance-settings/ProcessInstanceSettings' {
  export default class ProcessInstanceSettings {}
}
declare module 'bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation' {
  export default class ResetSimulation {}
}
declare module 'bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed' {
  export default class SetAnimationSpeed {}
}
declare module 'bpmn-js-token-simulation/lib/features/show-process-instance/ShowProcessInstance' {
  export default class ShowProcessInstance {}
}
declare module 'bpmn-js-token-simulation/lib/features/simulation-state/SimulationState' {
  export default class SimulationState {}
}
declare module 'bpmn-js-token-simulation/lib/features/toggle-mode/viewer/ToggleMode' {
  export default class ToggleMode {}
}
declare module 'bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode' {
  export default class ToggleMode {
    constructor()
    toggleMode(): void
  }
}
declare module 'bpmn-js-token-simulation/lib/features/token-count/TokenCount' {
  export default class TokenCount {}
}
declare module 'bpmn-js-token-simulation/lib/features/token-simulation-behavior/TokenSimulationBehavior' {
  export default class TokenSimulationBehavior {}
}
