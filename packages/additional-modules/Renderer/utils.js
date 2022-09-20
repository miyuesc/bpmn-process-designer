import { every, some, isObject } from "min-dash";
import { append as svgAppend, attr as svgAttr, create as svgCreate } from "tiny-svg";

//////////////////// 校验部分
export function isTypedEvent(event, eventDefinitionType, filter) {
  function matches(definition, filter) {
    return every(filter, function (val, key) {
      return definition[key] === val;
    });
  }
  return some(event.eventDefinitions, function (definition) {
    return definition.$type === eventDefinitionType && matches(event, filter);
  });
}

export function getSemantic(element) {
  return element.businessObject;
}

export function isThrowEvent(event) {
  return event.$type === "bpmn:IntermediateThrowEvent" || event.$type === "bpmn:EndEvent";
}

//////////////////// svg 图形绘制部分
// 绘制圆形
export function drawCircle(renderer, parentGfx, width, height, offset, attrs) {
  if (isObject(offset)) {
    attrs = offset;
    offset = 0;
  }
  offset = offset || 0;
  attrs = renderer._styles.computeStyle(attrs);
  if (attrs.fill === "none") {
    delete attrs.fillOpacity;
  }
  const cx = width / 2,
    cy = height / 2;
  const circle = svgCreate("circle");
  svgAttr(circle, {
    cx: cx,
    cy: cy,
    r: Math.round((width + height) / 4 - offset)
  });
  svgAttr(circle, attrs);
  svgAppend(parentGfx, circle);
  return circle;
}
// 绘制路径元素
export function drawPath(renderer, parentGfx, d, attrs) {
  attrs = renderer._styles.computeStyle(attrs, ["no-fill"], {
    strokeWidth: 2,
    stroke: "black"
  });
  const path = svgCreate("path");
  svgAttr(path, { d: d });
  svgAttr(path, attrs);
  svgAppend(parentGfx, path);
  return path;
}
