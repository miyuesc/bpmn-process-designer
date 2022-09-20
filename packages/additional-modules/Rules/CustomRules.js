import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";

class CustomRules extends RuleProvider {
  constructor(eventBus) {
    super(eventBus);
    this.init();
  }

  init() {
    // 禁止删除开始和结束
    this.addRule(["elements.delete"], 2000, function (context) {
      const [element] = context.elements;
      return element.type !== "bpmn:StartEvent" && element.type !== "bpmn:EndEvent";
    });
  }
}

// @ts-ignore
CustomRules.$inject = ["eventBus"];

export default CustomRules;
