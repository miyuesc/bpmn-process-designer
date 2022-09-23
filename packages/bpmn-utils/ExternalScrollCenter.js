import { catchError } from "@utils/printCatch";

export default function (modeler, el) {
  if (!modeler || !el) {
    return catchError("modeler 和 元素都不能为空");
  }

  if (typeof el === "string") {
    el = modeler.get("elementRegistry").get(el);
  }

  const viewbox = modeler.get("canvas").viewbox();
  // 减去 20 的默认画布内边距
  const vPadding = Math.floor((viewbox.outer.height - el.height) / 2) - 20;
  const hPadding = Math.floor((viewbox.outer.width - el.width) / 2) - 20;

  modeler.get("canvas").scrollToElement(el, { top: vPadding, bottom: vPadding, left: hPadding, right: hPadding });
}
