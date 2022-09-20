import PaletteProvider from "bpmn-js/lib/features/palette/PaletteProvider";
import { assign } from "min-dash";
import { createAction } from "../utils";

class RewritePaletteProvider extends PaletteProvider {
  constructor(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect) {
    super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, 2000);
    this._create = create;
    this._elementFactory = elementFactory;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._globalConnect = globalConnect;
  }
  getPaletteEntries() {
    const actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      globalConnect = this._globalConnect;

    function createSqlTask(event) {
      const sqlTask = elementFactory.createShape({ type: "miyue:SqlTask" });

      create.start(event, sqlTask);
    }

    function createSubprocess(event) {
      const subProcess = elementFactory.createShape({
        type: "bpmn:SubProcess",
        x: 0,
        y: 0,
        isExpanded: true
      });

      const startEvent = elementFactory.createShape({
        type: "bpmn:StartEvent",
        x: 40,
        y: 82,
        parent: subProcess
      });

      create.start(event, [subProcess, startEvent], {
        hints: {
          autoSelect: [startEvent]
        }
      });
    }

    assign(actions, {
      "hand-tool": {
        group: "tools",
        className: "bpmn-icon-hand-tool",
        title: "手型工具",
        action: {
          click: function (event) {
            handTool.activateHand(event);
          }
        }
      },
      "lasso-tool": {
        group: "tools",
        className: "bpmn-icon-lasso-tool",
        title: "套索工具",
        action: {
          click: function (event) {
            lassoTool.activateSelection(event);
          }
        }
      },
      "global-connect-tool": {
        group: "tools",
        className: "bpmn-icon-connection-multi",
        title: "全局连线",
        action: {
          click: function (event) {
            globalConnect.toggle(event);
          }
        }
      },
      "tool-separator": {
        group: "tools",
        separator: true
      },
      "create.start-event": createAction(
        elementFactory,
        create,
        "bpmn:StartEvent",
        "events",
        "bpmn-icon-start-event-none",
        "开始事件"
      ),
      "create.end-event": createAction(
        elementFactory,
        create,
        "bpmn:EndEvent",
        "events",
        "bpmn-icon-end-event-none",
        "结束事件"
      ),
      "events-separator": {
        group: "events",
        separator: true
      },
      "create.exclusive-gateway": createAction(
        elementFactory,
        create,
        "bpmn:ExclusiveGateway",
        "gateway",
        "bpmn-icon-gateway-none",
        "网关"
      ),
      "create.parallel-gateway": createAction(
        elementFactory,
        create,
        "bpmn:ParallelGateway",
        "gateway",
        "bpmn-icon-gateway-parallel",
        "并行网关"
      ),
      "create.event-base-gateway": createAction(
        elementFactory,
        create,
        "bpmn:EventBasedGateway",
        "gateway",
        "bpmn-icon-gateway-eventbased",
        "事件网关"
      ),
      "gateway-separator": {
        group: "gateway",
        separator: true
      },
      "create.user-task": createAction(
        elementFactory,
        create,
        "bpmn:UserTask",
        "activity",
        "bpmn-icon-user-task",
        "用户任务"
      ),
      "create.script-task": createAction(
        elementFactory,
        create,
        "bpmn:ScriptTask",
        "activity",
        "bpmn-icon-script-task",
        "脚本任务"
      ),
      "create.service-task": createAction(
        elementFactory,
        create,
        "bpmn:ServiceTask",
        "activity",
        "bpmn-icon-service-task",
        "服务任务"
      ),
      "create.sql-task": {
        group: "activity",
        className: "miyue-sql-task",
        title: "数据库任务",
        action: {
          click: createSqlTask,
          dragstart: createSqlTask
        }
      },
      "create.subprocess-expanded": {
        group: "activity",
        className: "bpmn-icon-subprocess-expanded",
        title: "子流程",
        action: {
          dragstart: createSubprocess,
          click: createSubprocess
        }
      }
    });

    return actions;
  }
}

RewritePaletteProvider.$inject = [
  "palette",
  "create",
  "elementFactory",
  "spaceTool",
  "lassoTool",
  "handTool",
  "globalConnect"
];

export default RewritePaletteProvider;
