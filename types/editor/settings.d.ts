import { ViewerOptions } from 'diagram-js/lib/model'
import { ModuleDeclaration } from 'didi'

export interface EditorSettings {
  processName: string
  processId: string
  processEngine: 'flowable' | 'activiti' | 'camunda'
  paletteMode: 'default' | 'custom' | 'rewrite' | 'enhancement'
  penalMode: 'default' | 'custom' | 'rewrite'
  contextPadMode: 'default' | 'rewrite' | 'enhancement'
  rendererMode: 'default' | 'rewrite' | 'enhancement'
  bg: string
  toolbar: boolean
  miniMap: boolean
  contextmenu: boolean
  customContextmenu: boolean
  otherModule: boolean
  templateChooser: boolean
  useLint: boolean
  customTheme: Record<string, string | number>
}

export type ModelerOptions<E extends Element> = ViewerOptions<E> & {
  additionalModules: ModuleDeclaration[]
  moddleExtensions: Object
}

// bpmn.js 事件参数
// 1. canvas 事件
type CanvasEventParams = {
  svg: SVGElement
  viewport: SVGElement
}
