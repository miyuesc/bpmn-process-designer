import BpmnIcon from "@packages/components/common/BpmnIcon";
import CollapseTitle from "@packages/components/common/CollapseTitle";
import EditItem from "@packages/components/common/EditItem";
import LucideIcon from "@packages/components/common/LucideIcon";

const components = [BpmnIcon, CollapseTitle, EditItem, LucideIcon];

export default {
  install: (Vue) => {
    components.forEach((component) => {
      Vue.component(component.name, component);
    });
  }
};
