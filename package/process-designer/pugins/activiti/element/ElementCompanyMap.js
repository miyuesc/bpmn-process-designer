//元素和组件的映射表
import ElementType from "./ElementType";

const ElementCompanyMap = {};

//执行流程属性组件
ElementCompanyMap[ElementType.process] = "ProcessProps";
ElementCompanyMap[ElementType.startEvent] = "StartEventProps";
ElementCompanyMap[ElementType.endEvent] = "EndEventProps";
ElementCompanyMap[ElementType.throwEvent] = "IntermediateThrowEventProps";
ElementCompanyMap[ElementType.exclusiveGateway] = "ExclusiveGatewayProps";
ElementCompanyMap[ElementType.inclusiveGateway] = "InclusiveGatewayProps";
ElementCompanyMap[ElementType.parallelGateway] = "ParallelGatewayProps";
ElementCompanyMap[ElementType.sequenceFlow] = "SequenceFlowProps";
ElementCompanyMap[ElementType.userTask] = "UserTaskProps";
ElementCompanyMap[ElementType.callActivity] = "CallActivityProps";

// 只读设计器
ElementCompanyMap[ElementType.startEventReadonly] = "StartEventPropsReadonly";
ElementCompanyMap[ElementType.endEventReadonly] = "EndEventPropsReadonly";
ElementCompanyMap[ElementType.throwEventReadonly] = "IntermediateThrowEventPropsReadonly";
ElementCompanyMap[ElementType.exclusiveGatewayReadonly] = "ExclusiveGatewayPropsReadonly";
ElementCompanyMap[ElementType.inclusiveGatewayReadonly] = "InclusiveGatewayPropsReadonly";
ElementCompanyMap[ElementType.parallelGatewayReadonly] = "ParallelGatewayPropsReadonly";
ElementCompanyMap[ElementType.sequenceFlowReadonly] = "SequenceFlowPropsReadonly";
ElementCompanyMap[ElementType.userTaskReadonly] = "UserTaskPropsReadonly";
ElementCompanyMap[ElementType.callActivityReadonly] = "CallActivityPropsReadonly";

export default ElementCompanyMap;
