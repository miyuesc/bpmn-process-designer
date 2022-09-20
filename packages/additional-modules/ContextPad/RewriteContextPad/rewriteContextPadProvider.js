import ContextPadProvider from "bpmn-js/lib/features/context-pad/ContextPadProvider";

class RewriteContextPadProvider extends ContextPadProvider {
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
      title: "扩展操作2",
      action: {
        click: function (e) {
          alert("点击 扩展操作2");
        }
      }
    };

    return actions;
  }
}

export default RewriteContextPadProvider;
