import BpmnRenderer from "bpmn-js/lib/draw/BpmnRenderer";

import { append as svgAppend, create as svgCreate } from "tiny-svg";

export default class CustomRenderer extends BpmnRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer) {
    super(config, eventBus, styles, pathMap, canvas, textRenderer, 2000);

    this.handlers["user:MySql"] = function(parentGfx, element) {
      const url = "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/rules.png",
        attr = { x: 0, y: 0, width: 48, height: 48 };
      const customIcon = svgCreate("image", {
        // 在这里创建了一个image
        ...attr,
        href: url
      });
      element["width"] = attr.width; // 这里我是取了巧, 直接修改了元素的宽高
      element["height"] = attr.height;
      svgAppend(parentGfx, customIcon);
      return customIcon;
    };
  }
}
