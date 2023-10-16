import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";

class EnhancementContextPadProvider extends ContextPadProvider {
  constructor(
    config,
    injector,
    eventBus,
    contextPad,
    modeling,
    elementFactory,
    connect,
    create,
    popupMenu,
    canvas,
    rules,
    translate
  ) {
    super(
      config,
      injector,
      eventBus,
      contextPad,
      modeling,
      elementFactory,
      connect,
      create,
      popupMenu,
      canvas,
      rules,
      translate,
      2000
    );

    this._contextPad = contextPad;
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;

    this._autoPlace = injector.get("autoPlace", false);
  }

  getContextPadEntries(element) {
    const actions = {};
    const modeling = this._modeling;
    const contextPad = this._contextPad;

    // const appendUserTask = (event, element) => {
    //   const shape = this._elementFactory.createShape({ type: "bpmn:UserTask" });
    //   this._create.start(event, shape, {
    //     source: element
    //   });
    // };
    //
    // const append = this._autoPlace
    //   ? (event, element) => {
    //       const shape = this._elementFactory.createShape({ type: "bpmn:UserTask" });
    //       this._autoPlace.append(element, shape);
    //     }
    //   : appendUserTask;
    //
    // // 添加创建用户任务按钮
    // actions["append.append-user-task"] = {
    //   group: "model",
    //   className: "bpmn-icon-user-task",
    //   title: "用户任务",
    //   action: {
    //     dragstart: appendUserTask,
    //     click: append
    //   }
    // };

    // 添加一个与edit一组的按钮
    actions["enhancement-op-1"] = {
      group: "edit",
      className: "enhancement-op",
      title: "扩展操作1",
      action: {
        click: function (e) {
          alert("点击 扩展操作1");
        }
      }
    };

    // 添加一个新分组的自定义按钮
    actions["enhancement-op"] = {
      group: "enhancement",
      className: "enhancement-op",
      title: "扩展删除",
      action: {
        click: function (event, delElement) {
          modeling.removeElements([...(delElement.incoming || []), ...(delElement.outgoing || []), delElement]);
        }
      }
    };
    actions["enhancement-op-1"] = {
      group: "edit",
      className: "enhancement-op",
      title: "切换ContextPad样式",
      action: {
        click: function (e) {
          contextPad.toggleStyles && contextPad.toggleStyles();
        }
      }
    };

    return actions;
  }
}

export default EnhancementContextPadProvider;
