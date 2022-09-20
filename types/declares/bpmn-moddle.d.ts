declare module 'bpmn-moddle' {
  import { Moddle, Package, ModdleElement } from 'moddle'

  export { Moddle, Package, ModdleElement }

  type ParseResult = {
    rootElement: ModdleElement
    references: Object[]
    warnings: Error[]
    elementsById: { [key: string]: ModdleElement }
  }
  type ParseError = {
    warnings: Error[]
  }

  type SerializationResult = {
    xml: string
  }

  // bpmn.json 原始类型
  export interface RootElement extends BaseElement {}
  export interface BaseElement extends ModdleElement {
    id?: string
    documentation?: Documentation
    extensionDefinitions?: ExtensionDefinition[]
    extensionElements?: ExtensionElements
  }
  export interface Interface extends RootElement {
    name?: string
    operations?: Operation[]
    implementationRef?: string
  }
  export interface Operation extends BaseElement {
    name?: string
    inMessageRef?: Message
    outMessageRef?: Message
    errorRef?: Error[]
    implementationRef?: string
  }
  export interface EndPoint extends RootElement {}
  export interface Auditing extends BaseElement {}
  export interface GlobalTask extends CallableElement {
    resources?: ResourceRole[]
  }
  export interface Monitoring extends BaseElement {}
  export interface Performer extends ResourceRole {}
  export interface Process extends FlowElementsContainer, CallableElement {
    processType?: ProcessType
    isClosed?: boolean
    auditing?: Auditing
    monitoring?: Monitoring
    properties?: Property[]
    laneSets?: LaneSet[]
    flowElements?: FlowElement[]
    artifacts?: Artifact[]
    resources?: ResourceRole[]
    correlationSubscriptions?: CorrelationSubscription[]
    supports?: Process[]
    definitionalCollaborationRef?: Collaboration[]
    isExecutable?: boolean
  }
  export interface Lane extends BaseElement {
    name?: string
    partitionElementRef?: BaseElement[]
    partitionElement?: BaseElement
    flowNodeRef?: FlowNode[]
    childLaneSet?: LaneSet[]
  }
  export interface LaneSet extends BaseElement {
    lanes?: Lane[]
    name?: string
  }
  export interface GlobalManualTask extends GlobalTask {}
  export interface ManualTask extends Task {}
  export interface UserTask extends Task {
    renderings?: Rendering[]
    implementation?: string
  }
  export interface Rendering extends BaseElement {}
  export interface HumanPerformer extends Performer {}
  export interface PotentialOwner extends HumanPerformer {}
  export interface GlobalUserTask extends GlobalTask {
    implementation?: string
    renderings?: Rendering[]
  }
  export interface Gateway extends FlowNode {
    gatewayDirection?: GatewayDirection
  }
  export interface EventBasedGateway extends Gateway {
    instantiate: boolean
    eventGatewayType?: EventBasedGatewayType
  }
  export interface ComplexGateway extends Gateway {
    activationCondition?: Expression
    default?: SequenceFlow
  }
  export interface ExclusiveGateway extends Gateway {
    default?: SequenceFlow
  }
  export interface InclusiveGateway extends Gateway {
    default?: SequenceFlow
  }
  export interface ParallelGateway extends Gateway {}
  export interface Relationship extends BaseElement {
    type?: string
    direction?: RelationshipDirection
    source?: Element[]
    target?: Element[]
  }
  export interface Extension {
    mustUnderstand: boolean //"default": false
    definition?: ExtensionDefinition
  }
  export interface ExtensionDefinition {
    name?: string //"default": false
    extensionAttributeDefinitions?: ExtensionAttributeDefinition[]
  }
  export interface ExtensionAttributeDefinition {
    name?: string
    type?: string
    isReference: boolean
    extensionAttributeDefinitions?: ExtensionAttributeDefinition[]
    extensionDefinition?: ExtensionDefinition
  }
  export interface ExtensionElements {
    valueRef?: Element
    values?: Element[]
    extensionAttributeDefinition?: ExtensionAttributeDefinition
  }
  export interface Documentation extends BaseElement {
    text?: string
    textFormat: string
  }
  export interface Event extends FlowNode, InteractionNode {
    properties?: Property[]
  }
  export interface IntermediateCatchEvent extends CatchEvent {}
  export interface IntermediateThrowEvent extends ThrowEvent {}
  export interface EndEvent extends ThrowEvent {}
  export interface StartEvent extends CatchEvent {
    isInterrupting: boolean
  }
  export interface ThrowEvent extends Event {
    dataInputs?: DataInput[]
    dataInputAssociations?: DataInputAssociation[]
    inputSet?: InputSet
    eventDefinitions?: EventDefinition[]
    eventDefinitionRef?: EventDefinition[]
  }
  export interface CatchEvent extends Event {
    parallelMultiple: boolean
    dataOutputs?: DataOutput[]
    dataOutputAssociations?: DataOutputAssociation[]
    outputSet?: OutputSet
    eventDefinitions?: EventDefinition[]
    eventDefinitionRef?: EventDefinition[]
  }
  export interface BoundaryEvent extends CatchEvent {
    cancelActivity: boolean
    attachedToRef?: Activity
  }
  export interface EventDefinition extends RootElement {}
  export interface CancelEventDefinition extends EventDefinition {}
  export interface ErrorEventDefinition extends EventDefinition {
    errorRef?: Error
  }
  export interface TerminateEventDefinition extends EventDefinition {}
  export interface EscalationEventDefinition extends EventDefinition {
    escalationRef?: Escalation
  }
  export interface Escalation extends RootElement {
    structureRef?: ItemDefinition
    name?: string
    escalationCode?: string
  }
  export interface CompensateEventDefinition extends EventDefinition {
    waitForCompletion: boolean
    activityRef?: Activity
  }
  export interface TimerEventDefinition extends EventDefinition {
    timeDate?: Expression
    timeCycle?: Expression
    timeDuration?: Expression
  }
  export interface LinkEventDefinition extends EventDefinition {
    name?: string
    target?: LinkEventDefinition
    source?: LinkEventDefinition
  }
  export interface MessageEventDefinition extends EventDefinition {
    messageRef?: Message
    operationRef?: Operation
  }
  export interface ConditionalEventDefinition extends EventDefinition {
    condition?: Expression
  }
  export interface SignalEventDefinition extends EventDefinition {
    signalRef?: Signal
  }
  export interface Signal extends RootElement {
    name?: string
    structureRef?: ItemDefinition
  }
  export interface ImplicitThrowEvent extends ThrowEvent {}
  export interface DataState extends BaseElement {
    name?: string
  }
  export interface ItemAwareElement extends BaseElement {
    itemSubjectRef?: ItemDefinition
    dataState?: DataState
  }
  export interface DataAssociation extends BaseElement {
    sourceRef?: ItemAwareElement
    targetRef?: ItemAwareElement
    transformation?: FormalExpression
    assignment?: Assignment
  }
  export interface DataInput extends ItemAwareElement {
    name?: string
    isCollection: boolean
    inputSetRef?: InputSet[]
    inputSetWithOptional?: InputSet[]
    inputSetWithWhileExecuting?: InputSet[]
  }
  export interface DataOutput extends ItemAwareElement {
    name?: string
    isCollection: boolean
    outputSetRef?: OutputSet[]
    outputSetWithOptional?: OutputSet[]
    outputSetWithWhileExecuting?: OutputSet[]
  }
  export interface InputSet extends BaseElement {
    name?: string
    dataInputRefs?: DataInput[]
    optionalInputRefs?: DataInput[]
    whileExecutingInputRefs?: DataInput[]
    outputSetRefs?: OutputSet[]
  }
  export interface OutputSet extends BaseElement {
    name?: string
    dataOutputRefs?: DataOutput[]
    inputSetRefs?: InputSet[]
    optionalOutputRefs?: DataOutput[]
    whileExecutingOutputRefs?: DataOutput[]
  }
  export interface Property extends ItemAwareElement {
    name?: string
  }
  export interface DataInputAssociation extends DataAssociation {}
  export interface DataOutputAssociation extends DataAssociation {}
  export interface InputOutputSpecification extends BaseElement {
    dataInputs?: DataInput[]
    dataOutputs?: DataOutput[]
    inputSets?: InputSet[]
    outputSets?: OutputSet[]
  }
  export interface DataObject extends FlowElement, ItemAwareElement {
    isCollection: boolean
  }
  export interface isCollection {
    inputDataRef?: InputSet
    outputDataRef?: OutputSet
    operationRef?: Operation
  }
  export interface Assignment extends BaseElement {
    from?: Expression
    to?: Expression
  }
  export interface DataStore extends RootElement, ItemAwareElement {
    name?: string
    capacity?: number
    isUnlimited: boolean
  }
  export interface Category extends RootElement, ItemAwareElement {
    name?: string
    capacity?: number
    isUnlimited: boolean
  }
  export interface DataStoreReference extends ItemAwareElement, FlowElement {
    dataStoreRef?: DataStore
  }
  export interface DataObjectReference extends ItemAwareElement, FlowElement {
    dataObjectRef?: DataObject
  }
  export interface ConversationNode extends BaseElement, InteractionNode {
    name?: string
    messageFlows?: MessageFlow[]
    CorrelationKeys?: CorrelationKey[]
    participants?: Participant[]
  }
  export interface ConversationLink extends BaseElement {
    sourceRef?: InteractionNode
    targetRef?: InteractionNode
    name?: string
  }
  export interface ConversationAssociation extends BaseElement {
    innerConversationNodeRef?: ConversationNode
    outerConversationNodeRef?: ConversationNode
  }
  export interface CallConversation extends ConversationNode {
    calledCollaborationRef?: Collaboration
    participantAssociations?: ParticipantAssociation[]
  }
  export interface Conversation extends ConversationNode {}
  export interface SubConversation extends ConversationNode {
    conversationNodes?: ConversationNode[]
  }
  export interface conversationNodes extends BaseElement, InteractionNode {
    name?: string
    participantRef?: Participant[]
    messageFlowRefs?: MessageFlow[]
    correlationKeys?: CorrelationKey[]
  }
  export interface GlobalConversation extends Collaboration {}
  export interface PartnerEntity extends RootElement {
    name?: string
    participantRef?: Participant[]
  }
  export interface PartnerRole extends RootElement {
    name?: string
    participantRef?: Participant[]
  }
  export interface CorrelationProperty extends RootElement {
    name?: string
    correlationPropertyRetrievalExpression?: CorrelationPropertyRetrievalExpression[]
    type?: ItemDefinition
  }
  export interface Error extends RootElement {
    name?: string
    errorCode?: string
    structureRef?: ItemDefinition
  }
  export interface CorrelationKey extends BaseElement {
    correlationPropertyRef?: CorrelationProperty[]
    name?: string
  }
  export interface Expression extends BaseElement {
    body?: string
  }
  export interface FormalExpression extends Expression {
    language?: string
    evaluatesToTypeRef?: ItemDefinition
  }
  export interface Message extends RootElement {
    language?: string
    itemRef?: ItemDefinition
  }
  export interface ItemDefinition extends RootElement {
    itemKind?: ItemKind
    structureRef?: string
    isCollection: boolean
    import?: Import
  }
  export interface FlowElement extends BaseElement {
    name?: string
    auditing?: Auditing
    monitoring?: Monitoring
    categoryValueRef?: CategoryValue[]
  }
  export interface SequenceFlow extends FlowElement {
    conditionExpression?: Expression
    isImmediate?: boolean
    sourceRef?: FlowNode
    targetRef?: FlowNode
  }
  export interface FlowElementsContainer extends BaseElement {
    laneSets?: LaneSet[]
    flowElements?: FlowElement[]
  }
  export interface CallableElement extends RootElement {
    name?: string
    ioSpecification?: InputOutputSpecification
    supportedInterfaceRefs?: Interface[]
    ioBinding?: InputOutputBinding[]
  }
  export interface FlowNode extends FlowElement {
    incoming?: SequenceFlow[]
    outgoing?: SequenceFlow[]
    lanes?: Lane[]
  }
  export interface CorrelationPropertyRetrievalExpression extends BaseElement {
    messagePath?: FormalExpression
    messageRef?: Message
  }
  export interface CorrelationPropertyBinding extends BaseElement {
    dataPath?: FormalExpression
    correlationPropertyRef?: CorrelationProperty
  }
  export interface Resource extends RootElement {
    name?: string
    resourceParameters?: ResourceParameter[]
  }
  export interface ResourceParameter extends RootElement {
    name?: string
    isRequired?: boolean
    type?: ItemDefinition
  }
  export interface CorrelationSubscription extends BaseElement {
    correlationKeyRef?: CorrelationKey[]
    correlationPropertyBinding?: CorrelationPropertyBinding[]
  }
  export interface MessageFlow extends BaseElement {
    name?: string
    sourceRef?: InteractionNode
    targetRef?: InteractionNode
    messageRef?: Message
  }
  export interface MessageFlowAssociation extends BaseElement {
    innerMessageFlowRef?: MessageFlow
    outerMessageFlowRef?: MessageFlow
  }
  export interface InteractionNode {
    incomingConversationLinks?: ConversationLink[]
    outgoingConversationLinks?: ConversationLink[]
  }
  export interface Participant extends BaseElement, InteractionNode {
    name?: string
    interfaceRef?: Interface[]
    participantMultiplicity?: ParticipantMultiplicity
    endPointRefs?: EndPoint[]
    processRef?: Process
  }
  export interface ParticipantAssociation extends BaseElement {
    innerParticipantRef?: Participant
    outerParticipantRef?: Participant
  }
  export interface ParticipantMultiplicity extends BaseElement {
    minimum: number
    maximum: number
  }
  export interface Collaboration extends RootElement {
    name?: string
    isClosed?: boolean
    participants?: Participant[]
    messageFlows?: MessageFlow[]
    artifacts?: Artifact[]
    conversations?: ConversationNode[]
    conversationAssociations?: ConversationAssociation[]
    participantAssociations?: ParticipantAssociation[]
    messageFlowAssociations?: MessageFlowAssociation[]
    correlationKeys?: CorrelationKey[]
    choreographyRef?: Choreography[]
    conversationLinks?: ConversationLink[]
  }
  export interface ChoreographyActivity extends FlowNode {
    initiatingParticipantRef?: Participant
    participantRefs?: Participant[]
    correlationKeys?: CorrelationKey[]
    loopType: ChoreographyLoopType
  }
  export interface CallChoreography extends ChoreographyActivity {
    calledChoreographyRef?: Choreography
    participantAssociations?: ParticipantAssociation[]
  }
  export interface ChoreographyTask extends ChoreographyActivity {
    messageFlowRef?: MessageFlow[]
  }
  export interface Choreography extends Collaboration, FlowElementsContainer {}
  export interface GlobalChoreographyTask extends Choreography {
    initiatingParticipantRef?: Participant
  }
  export interface TextAnnotation extends Artifact {
    text?: string
    textFormat?: String
  }
  export interface Group extends Artifact {
    categoryValueRef?: CategoryValue[]
  }
  export interface Association extends Artifact {
    associationDirection?: AssociationDirection[]
    sourceRef?: BaseElement[]
    targetRef?: BaseElement[]
  }
  export interface Category extends RootElement {
    categoryValue?: CategoryValue[]
    name?: string
  }
  export interface Artifact extends BaseElement {}
  export interface CategoryValue extends BaseElement {
    categorizedFlowElements?: FlowElement[]
    value?: string
  }
  export interface Activity extends FlowNode {
    isForCompensation: boolean
    default?: SequenceFlow
    ioSpecification?: InputOutputSpecification
    boundaryEventRefs?: BoundaryEvent[]
    properties?: Property[]
    dataInputAssociations?: DataInputAssociation[]
    dataOutputAssociations?: DataOutputAssociation[]
    startQuantity: number
    resources?: ResourceRole[]
    completionQuantity: number
    loopCharacteristics?: LoopCharacteristics
  }
  export interface ServiceTask extends Task {
    implementation?: string
    operationRef?: Operation
  }
  export interface SubProcess extends Activity, FlowElementsContainer, InteractionNode {
    triggeredByEvent: boolean
    artifacts?: Artifact[]
  }
  export interface LoopCharacteristics extends BaseElement {}
  export interface MultiInstanceLoopCharacteristics extends LoopCharacteristics {
    isSequential: boolean
    behavior?: MultiInstanceBehavior
    loopCardinality?: Expression
    loopDataInputRef?: ItemAwareElement
    loopDataOutputRef?: ItemAwareElement
    inputDataItem?: DataInput
    outputDataItem?: DataOutput
    complexBehaviorDefinition?: ComplexBehaviorDefinition
    completionCondition?: Expression
    oneBehaviorEventRef?: EventDefinition[]
    noneBehaviorEventRef?: EventDefinition[]
  }
  export interface StandardLoopCharacteristics extends LoopCharacteristics {
    testBefore: boolean
    loopCondition?: Expression
    loopMaximum?: number
  }
  export interface CallActivity extends Activity, InteractionNode {
    calledElement?: string
  }
  export interface Task extends Activity, InteractionNode {}
  export interface SendTask extends Task {
    implementation?: string
    operationRef?: Operation
    messageRef?: Message
  }
  export interface ReceiveTask extends Task {
    implementation?: string
    instantiate: boolean
    operationRef?: Operation
    messageRef?: Message
  }
  export interface ScriptTask extends Task {
    scriptFormat?: string
    script?: string
  }
  export interface BusinessRuleTask extends Task {
    implementation?: string
  }
  export interface AdHocSubProcess extends SubProcess {
    completionCondition?: Expression
    ordering?: AdHocOrdering
    cancelRemainingInstances: boolean
  }
  export interface Transaction extends SubProcess {
    protocal?: string
    method?: string
  }
  export interface GlobalScriptTask extends GlobalTask {
    scriptLanguage?: string
    script?: string
  }
  export interface GlobalBusinessRuleTask extends GlobalTask {
    implementation?: string
  }
  export interface CompletionCondition extends BaseElement {
    condition?: FormalExpression
    event?: ImplicitThrowEvent
  }
  export interface ResourceRole extends BaseElement {
    name?: string
    resourceRef?: Resource
    resourceParameterBindings?: ResourceParameterBinding[]
    resourceAssignmentExpression?: ResourceAssignmentExpression
  }
  export interface ResourceParameterBinding extends BaseElement {
    expression?: Expression
    parameterRef?: ResourceParameter
  }
  export interface ResourceAssignmentExpression extends BaseElement {
    expression?: Expression
  }
  export interface Import {
    importType?: string
    location?: string
    namespace?: string
  }
  export interface Definitions extends BaseElement {
    name?: string
    targetNamespace?: string
    expressionLanguage: string
    typeLanguage: string
    imports?: Import[]
    extensions?: Extension[]
    rootElements?: RootElement[]
    diagrams?: any[] // bpmndi:BPMNDiagram
    exporters?: string
    relationships?: Relationship[]
    exporterVersion?: string
  }
  export interface InputOutputBinding {
    inputDataRef?: InputSet
    outputDataRef?: OutputSet
    operationRef?: Operation
  }
  export interface ComplexBehaviorDefinition extends BaseElement {
    condition?: FormalExpression
    event?: ImplicitThrowEvent[]
  }

  export enum ProcessType {
    None,
    Public,
    Private
  }
  export enum GatewayDirection {
    Unspecified,
    Convergent,
    Diverging,
    Mixed
  }
  export enum EventBasedGatewayType {
    Parallel,
    Exclusive
  }
  export enum RelationshipDirection {
    None,
    Forward,
    Backward,
    Both
  }
  export enum ItemKind {
    Physical,
    Information
  }
  export enum ChoreographyLoopType {
    None,
    Standard,
    MultiInstanceSequential,
    MultiInstanceParallel
  }
  export enum AssociationDirection {
    None,
    One,
    Both
  }
  export enum MultiInstanceBehavior {
    None,
    One,
    All,
    Complex
  }
  export enum AdHocOrdering {
    Parallel,
    Sequential
  }

  // 默认导出
  export default class BpmnModdle extends Moddle {
    constructor(packages?: Package[], options?: Object)
    fromXML(
      xmlStr: string,
      typeName?: string | Object,
      options?: Object
    ): Promise<ParseResult | ParseError>
    toXML(element: string, options?: Object): Promise<SerializationResult | Error>
  }
}
