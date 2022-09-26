import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  select as svgSelect,
  on as svgOn
} from "tiny-svg";
import Ids from "ids";
import { assign, forEach, isObject } from "min-dash";
import { query as domQuery } from "min-dom";

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import { createLine } from "diagram-js/lib/util/RenderUtil";
import { rotate, transform, translate } from "diagram-js/lib/util/SvgTransformUtil";
import {
  getCirclePath,
  getDi,
  getDiamondPath,
  getFillColor,
  getLabelColor,
  getRectPath,
  getRoundRectPath,
  getSemantic,
  getStrokeColor,
  isCollection,
  isThrowEvent,
  isTypedEvent
} from "bpmn-js/lib/draw/BpmnRenderUtil.js";
import { is } from "bpmn-js/lib/util/ModelUtil";
import { getLabel } from "bpmn-js/lib/features/label-editing/LabelUtil";
import { isEventSubProcess, isExpanded } from "bpmn-js/lib/util/DiUtil";

import mysqlIcon from "@packages/theme/process-icons/mysql.png";

const RENDERER_IDS = new Ids();
const TASK_BORDER_RADIUS = 10;
const INNER_OUTER_DIST = 3;
const DEFAULT_FILL_OPACITY = 0.95;
const HIGH_FILL_OPACITY = 0.35;
const ELEMENT_LABEL_DISTANCE = 10;

class RewriteRenderer extends BaseRenderer {
  constructor(config, eventBus, styles, pathMap, canvas, textRenderer, elementRegistry, interactionEvents, priority) {
    super(eventBus, priority);
    this._elementRegistry = elementRegistry;
    const presetColor = {
      defaultFillColor: "#ffffff",
      defaultStartEventColor: "#61c071",
      defaultEndEventColor: "#d03050",
      defaultIntermediateEventColor: "#e9a28d",
      defaultIntermediateThrowEventColor: "#e9a28d",
      defaultIntermediateCatchEventColor: "#e9a28d",
      defaultTaskColor: "#9cafcf",
      defaultLabelColor: "#000000",
      defaultGatewayColor: "#fb863c",
      defaultSequenceColor: "#9cafcf"
    };
    const presetOpacity = {
      defaultStartEventOpacity: 0,
      defaultEndEventOpacity: 0,
      defaultIntermediateThrowEventOpacity: 0,
      defaultIntermediateCatchEventOpacity: 1,
      defaultTaskOpacity: 0,
      defaultLabelOpacity: 1,
      defaultGatewayOpacity: 0.2,
      defaultSequenceOpacity: 1
    };
    const {
      defaultFillColor,
      defaultStartEventColor,
      defaultEndEventColor,
      defaultIntermediateEventColor,
      defaultIntermediateThrowEventColor,
      defaultIntermediateCatchEventColor,
      defaultTaskColor,
      defaultLabelColor,
      defaultGatewayColor,
      defaultSequenceColor
    } = { ...presetColor, ...config };
    const {
      defaultStartEventOpacity,
      defaultEndEventOpacity,
      defaultIntermediateThrowEventOpacity,
      defaultIntermediateCatchEventOpacity,
      defaultTaskOpacity,
      defaultLabelOpacity,
      defaultGatewayOpacity,
      defaultSequenceOpacity
    } = { ...presetOpacity, ...config };

    const useCurve = config?.useCurve || false;

    const computeStyle = styles.computeStyle;
    const rendererId = RENDERER_IDS.next();
    const markers = {};

    function addMarker(id, options) {
      const attrs = assign(
        {
          fill: "black",
          strokeWidth: 1,
          strokeLinecap: "round",
          strokeDasharray: "none"
        },
        options.attrs
      );
      const ref = options.ref || { x: 0, y: 0 };
      const scale = options.scale || 1;
      if (attrs.strokeDasharray === "none") {
        attrs.strokeDasharray = [10000, 1];
      }
      const marker = svgCreate("marker");
      svgAttr(options.element, attrs);
      svgAppend(marker, options.element);
      svgAttr(marker, {
        id: id,
        viewBox: "0 0 20 20",
        refX: ref.x,
        refY: ref.y,
        markerWidth: 20 * scale,
        markerHeight: 20 * scale,
        orient: "auto"
      });
      let defs = domQuery("defs", canvas._svg);
      if (!defs) {
        defs = svgCreate("defs");
        svgAppend(canvas._svg, defs);
      }
      svgAppend(defs, marker);
      markers[id] = marker;
    }

    function colorEscape(str) {
      return str.replace(/[^\da-zA-z]+/g, "_");
    }

    function marker(type, fill, stroke) {
      const id = type + "-" + colorEscape(fill) + "-" + colorEscape(stroke) + "-" + rendererId;
      if (!markers[id]) {
        createMarker(id, type, fill, stroke);
      }
      return "url(#" + id + ")";
    }

    function createMarker(id, type, fill, stroke) {
      if (type === "sequenceflow-end") {
        const sequenceFlowEnd = svgCreate("path");
        svgAttr(sequenceFlowEnd, { d: "M 1 5 L 11 10 L 1 15 Z" });
        addMarker(id, {
          element: sequenceFlowEnd,
          ref: { x: 11, y: 10 },
          scale: 0.5,
          attrs: {
            fill: stroke,
            stroke: stroke
          }
        });
      }
      if (type === "messageflow-start") {
        const messageflowStart = svgCreate("circle");
        svgAttr(messageflowStart, { cx: 6, cy: 6, r: 3.5 });
        addMarker(id, {
          element: messageflowStart,
          attrs: {
            fill: fill,
            stroke: stroke
          },
          ref: { x: 6, y: 6 }
        });
      }
      if (type === "messageflow-end") {
        const messageflowEnd = svgCreate("path");
        svgAttr(messageflowEnd, { d: "m 1 5 l 0 -3 l 7 3 l -7 3 z" });
        addMarker(id, {
          element: messageflowEnd,
          attrs: {
            fill: fill,
            stroke: stroke,
            strokeLinecap: "butt"
          },
          ref: { x: 8.5, y: 5 }
        });
      }
      if (type === "association-start") {
        const associationStart = svgCreate("path");
        svgAttr(associationStart, { d: "M 11 5 L 1 10 L 11 15" });
        addMarker(id, {
          element: associationStart,
          attrs: {
            fill: "none",
            stroke: stroke,
            strokeWidth: 1.5
          },
          ref: { x: 1, y: 10 },
          scale: 0.5
        });
      }
      if (type === "association-end") {
        const associationEnd = svgCreate("path");
        svgAttr(associationEnd, { d: "M 1 5 L 11 10 L 1 15" });
        addMarker(id, {
          element: associationEnd,
          attrs: {
            fill: "none",
            stroke: stroke,
            strokeWidth: 1.5
          },
          ref: { x: 12, y: 10 },
          scale: 0.5
        });
      }
      if (type === "conditional-flow-marker") {
        const conditionalflowMarker = svgCreate("path");
        svgAttr(conditionalflowMarker, { d: "M 0 10 L 8 6 L 16 10 L 8 14 Z" });
        addMarker(id, {
          element: conditionalflowMarker,
          attrs: {
            fill: fill,
            stroke: stroke
          },
          ref: { x: -1, y: 10 },
          scale: 0.5
        });
      }
      if (type === "conditional-default-flow-marker") {
        const conditionaldefaultflowMarker = svgCreate("path");
        svgAttr(conditionaldefaultflowMarker, { d: "M 6 4 L 10 16" });
        addMarker(id, {
          element: conditionaldefaultflowMarker,
          attrs: {
            stroke: stroke
          },
          ref: { x: 0, y: 10 },
          scale: 0.5
        });
      }
    }

    function drawCircle(parentGfx, width, height, offset, attrs) {
      if (isObject(offset)) {
        attrs = offset;
        offset = 0;
      }

      offset = offset || 0;

      attrs = computeStyle(attrs, {
        stroke: "black",
        strokeWidth: 2,
        fill: "white"
      });

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

    function drawRect(parentGfx, width, height, r, offset, attrs) {
      if (isObject(offset)) {
        attrs = offset;
        offset = 0;
      }

      offset = offset || 0;

      attrs = computeStyle(attrs, {
        stroke: "black",
        strokeWidth: 2,
        fill: "white"
      });

      const rect = svgCreate("rect");
      svgAttr(rect, {
        x: offset,
        y: offset,
        width: width - offset * 2,
        height: height - offset * 2,
        rx: r,
        ry: r
      });
      svgAttr(rect, attrs);

      svgAppend(parentGfx, rect);

      return rect;
    }

    function drawDiamond(parentGfx, width, height, attrs) {
      const x_2 = width / 2;
      const y_2 = height / 2;

      const points = [
        { x: x_2, y: 0 },
        { x: width, y: y_2 },
        { x: x_2, y: height },
        { x: 0, y: y_2 }
      ];

      const pointsString = points
        .map(function (point) {
          return point.x + "," + point.y;
        })
        .join(" ");

      attrs = computeStyle(attrs, {
        stroke: "black",
        strokeWidth: 2,
        fill: "white"
      });

      const polygon = svgCreate("polygon");
      svgAttr(polygon, {
        points: pointsString
      });
      svgAttr(polygon, attrs);

      svgAppend(parentGfx, polygon);

      return polygon;
    }

    function drawLine(parentGfx, waypoints, attrs) {
      attrs = computeStyle(attrs, ["no-fill"], {
        stroke: "black",
        strokeWidth: 2,
        fill: "none"
      });
      const line = createLine(waypoints, attrs);
      svgAppend(parentGfx, line);
      return line;
    }

    function drawPath(parentGfx, d, attrs) {
      attrs = computeStyle(attrs, ["no-fill"], {
        strokeWidth: 2,
        stroke: "black"
      });

      const path = svgCreate("path");
      svgAttr(path, { d: d });
      svgAttr(path, attrs);

      svgAppend(parentGfx, path);

      return path;
    }

    function drawMarker(type, parentGfx, path, attrs) {
      return drawPath(parentGfx, path, assign({ "data-marker": type }, attrs));
    }

    function as(type) {
      return function (parentGfx, element) {
        return renderer(type)(parentGfx, element);
      };
    }

    function renderEventContent(element, parentGfx) {
      const event = getSemantic(element);
      const isThrowing = isThrowEvent(event);
      const colorOptions = {
        "bpmn:StartEvent": { color: defaultStartEventColor, opacity: defaultStartEventOpacity },
        "bpmn:EndEvent": { color: defaultEndEventColor, opacity: defaultEndEventOpacity },
        "bpmn:BoundaryEvent": { color: defaultTaskColor, opacity: defaultTaskOpacity },
        "bpmn:IntermediateThrowEvent": {
          color: defaultIntermediateThrowEventColor,
          opacity: defaultIntermediateThrowEventOpacity
        },
        "bpmn:IntermediateCatchEvent": {
          color: defaultIntermediateCatchEventColor,
          opacity: defaultIntermediateCatchEventOpacity
        }
      };
      const type = element.type;

      if (event.eventDefinitions && event.eventDefinitions.length > 1) {
        if (event.parallelMultiple) {
          return renderer("bpmn:ParallelMultipleEventDefinition")(parentGfx, element, {
            isThrowing,
            attrs: colorOptions[type]
          });
        } else {
          return renderer("bpmn:MultipleEventDefinition")(parentGfx, element, {
            isThrowing,
            attrs: colorOptions[type]
          });
        }
      }

      if (isTypedEvent(event, "bpmn:MessageEventDefinition")) {
        return renderer("bpmn:MessageEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:TimerEventDefinition")) {
        return renderer("bpmn:TimerEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:ConditionalEventDefinition")) {
        return renderer("bpmn:ConditionalEventDefinition")(parentGfx, element, {
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:SignalEventDefinition")) {
        return renderer("bpmn:SignalEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:EscalationEventDefinition")) {
        return renderer("bpmn:EscalationEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:LinkEventDefinition")) {
        return renderer("bpmn:LinkEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:ErrorEventDefinition")) {
        return renderer("bpmn:ErrorEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:CancelEventDefinition")) {
        return renderer("bpmn:CancelEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:CompensateEventDefinition")) {
        return renderer("bpmn:CompensateEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      if (isTypedEvent(event, "bpmn:TerminateEventDefinition")) {
        return renderer("bpmn:TerminateEventDefinition")(parentGfx, element, {
          isThrowing,
          attrs: colorOptions[type]
        });
      }

      return null;
    }

    function renderLabel(parentGfx, label, options) {
      options = assign(
        {
          size: {
            width: 100
          }
        },
        options
      );

      const text = textRenderer.createText(label || "", options);

      svgClasses(text).add("djs-label");

      svgAppend(parentGfx, text);

      return text;
    }

    function renderButton(parentGfx, text, options) {
      const button = svgCreate("rect");
      const attrs = computeStyle(options, {
        stroke: "black",
        strokeWidth: 2,
        fill: "white"
      });
      const offset = 4;

      svgAttr(button, {
        x: 40,
        y: 8,
        width: 60 - offset * 2,
        height: 36 - offset * 2,
        rx: offset,
        ry: offset
      });
      svgAttr(button, attrs);

      svgAppend(parentGfx, button);
      svgOn(
        button,
        "click",
        function (event) {
          event.stopPropagation();
          alert("task button click");
        },
        false
      );
      return button;
    }

    function renderEmbeddedLabel(parentGfx, element, align) {
      const semantic = getSemantic(element);

      return renderLabel(parentGfx, semantic.name, {
        box: element,
        align: align,
        padding: 5,
        style: {
          fill: getLabelColor(element, defaultLabelColor, defaultTaskColor)
        }
      });
    }

    function renderExternalLabel(parentGfx, element) {
      const box = {
        width: 90,
        height: 30,
        x: element.width / 2 + element.x,
        y: element.height / 2 + element.y
      };

      return renderLabel(parentGfx, getLabel(element), {
        box: box,
        fitBox: true,
        style: assign({}, textRenderer.getExternalStyle(), {
          fill: getLabelColor(element, defaultLabelColor, defaultTaskColor)
        })
      });
    }

    function renderLaneLabel(parentGfx, text, element) {
      const textBox = renderLabel(parentGfx, text, {
        box: {
          height: 30,
          width: element.height
        },
        align: "center-middle",
        style: {
          fill: getLabelColor(element, defaultLabelColor, defaultTaskColor)
        }
      });

      const top = -1 * element.height;

      transform(textBox, 0, -top, 270);
    }

    function createPathFromConnection(connection) {
      const waypoints = connection.waypoints;

      // 起始点
      let pathData = "m " + waypoints[0].x + "," + waypoints[0].y;

      // 原始折线
      if (!useCurve) {
        for (let i = 1; i < waypoints.length; i++) {
          pathData += "L" + waypoints[i].x + "," + waypoints[i].y + " ";
        }
        return pathData;
      }

      // 曲线绘制部分
      // 不同 length 对应的 svg path关键字，两个点时使用直线，三个点用Q，其余数量使用三次贝塞尔曲线
      const curveCodeMap = {
        2: " L ",
        3: " Q ",
        0: " C " // 置空作用
      };
      // 点数总数
      const waypointCount = waypoints.length;
      // 路径组装
      if (waypointCount === 2) {
        for (let i = 1; i < waypointCount; i++) {
          pathData += curveCodeMap[waypointCount] + waypoints[i].x + "," + waypoints[i].y + " ";
        }
      } else {
        pathData += curveCodeMap[waypointCount] || "C";
        for (let i = 1; i < waypoints.length; i++) {
          pathData += waypoints[i].x + "," + waypoints[i].y + " ";
        }
      }

      console.log("pathData", pathData);
      return pathData;
    }

    function attachTaskMarkers(parentGfx, element, taskMarkers) {
      const obj = getSemantic(element);

      const subprocess = taskMarkers && taskMarkers.indexOf("SubProcessMarker") !== -1;
      let position;

      if (subprocess) {
        position = {
          seq: -21,
          parallel: -22,
          compensation: -42,
          loop: -18,
          adhoc: 10
        };
      } else {
        position = {
          seq: -3,
          parallel: -6,
          compensation: -27,
          loop: 0,
          adhoc: 10
        };
      }

      forEach(taskMarkers, function (marker) {
        renderer(marker)(parentGfx, element, position);
      });

      if (obj.isForCompensation) {
        renderer("CompensationMarker")(parentGfx, element, position);
      }

      if (obj.$type === "bpmn:AdHocSubProcess") {
        renderer("AdhocMarker")(parentGfx, element, position);
      }

      const loopCharacteristics = obj.loopCharacteristics,
        isSequential = loopCharacteristics && loopCharacteristics.isSequential;

      if (loopCharacteristics) {
        if (isSequential === undefined) {
          renderer("LoopMarker")(parentGfx, element, position);
        }

        if (isSequential === false) {
          renderer("ParallelMarker")(parentGfx, element, position);
        }

        if (isSequential === true) {
          renderer("SequentialMarker")(parentGfx, element, position);
        }
      }
    }

    function renderDataItemCollection(parentGfx, element) {
      const yPosition = (element.height - 18) / element.height;

      const pathData = pathMap.getScaledPath("DATA_OBJECT_COLLECTION_PATH", {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0.33,
          my: yPosition
        }
      });

      /* collection path */ drawPath(parentGfx, pathData, {
        strokeWidth: 2
      });
    }

    this._drawPath = function drawPath(parentGfx, d, attrs) {
      attrs = computeStyle(attrs, ["no-fill"], {
        strokeWidth: 2,
        stroke: "black"
      });
      const path = svgCreate("path");
      svgAttr(path, { d: d });
      svgAttr(path, attrs);
      svgAppend(parentGfx, path);
      return path;
    };
    const renderer = (this._renderer = function (type) {
      return handlers[type];
    });
    const handlers = (this.handlers = {
      "bpmn:Event": function (parentGfx, element, attrs = {}) {
        if (!("fillOpacity" in attrs)) {
          attrs["fillOpacity"] = DEFAULT_FILL_OPACITY;
        }
        return drawCircle(parentGfx, element.width, element.height, attrs);
      },
      "bpmn:StartEvent": function (parentGfx, element) {
        let attrs = {
          fill: getFillColor(element, defaultStartEventColor),
          fillOpacity: defaultStartEventOpacity,
          stroke: getStrokeColor(element, defaultStartEventColor)
        };
        const semantic = getSemantic(element);
        if (!semantic.isInterrupting) {
          attrs = {
            strokeDasharray: "6",
            strokeLinecap: "round",
            fill: getFillColor(element, defaultStartEventColor),
            stroke: getStrokeColor(element, defaultStartEventColor),
            fillOpacity: defaultStartEventOpacity
          };
        }
        const circle = renderer("bpmn:Event")(parentGfx, element, attrs);
        renderEventContent(element, parentGfx);
        return circle;
      },
      "bpmn:MessageEventDefinition": function (parentGfx, element, options) {
        const pathData = pathMap.getScaledPath("EVENT_MESSAGE", {
          xScaleFactor: 0.9,
          yScaleFactor: 0.9,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.235,
            my: 0.315
          }
        });
        const fill = options.isThrowing ? getFillColor(element, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(element, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:TimerEventDefinition": function (parentGfx, element, options) {
        const fill = options.isThrowing ? getFillColor(element, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(element, options?.attrs?.color);
        const circle = drawCircle(parentGfx, element.width, element.height, element.height * 0.2, {
          strokeWidth: 2,
          fill,
          stroke
        });
        const pathData = pathMap.getScaledPath("EVENT_TIMER_WH", {
          xScaleFactor: 0.75,
          yScaleFactor: 0.75,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.5,
            my: 0.5
          }
        });
        drawPath(parentGfx, pathData, {
          strokeWidth: 2,
          strokeLinecap: "square",
          stroke
        });
        for (let i = 0; i < 12; i++) {
          const linePathData = pathMap.getScaledPath("EVENT_TIMER_LINE", {
            xScaleFactor: 0.75,
            yScaleFactor: 0.75,
            containerWidth: element.width,
            containerHeight: element.height,
            position: {
              mx: 0.5,
              my: 0.5
            }
          });

          const width = element.width / 2;
          const height = element.height / 2;

          drawPath(parentGfx, linePathData, {
            strokeWidth: 1,
            strokeLinecap: "square",
            transform: "rotate(" + i * 30 + "," + height + "," + width + ")",
            stroke
          });
        }
        return circle;
      },
      "bpmn:EscalationEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_ESCALATION", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.5,
            my: 0.2
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:ConditionalEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_CONDITIONAL", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.5,
            my: 0.222
          }
        });
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);

        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          stroke
        });
      },
      "bpmn:LinkEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_LINK", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.57,
            my: 0.263
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:ErrorEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_ERROR", {
          xScaleFactor: 1.1,
          yScaleFactor: 1.1,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.2,
            my: 0.722
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:CancelEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_CANCEL_45", {
          xScaleFactor: 1.0,
          yScaleFactor: 1.0,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.638,
            my: -0.055
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        const path = drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });

        rotate(path, 45);

        return path;
      },
      "bpmn:CompensateEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_COMPENSATION", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.22,
            my: 0.5
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:SignalEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_SIGNAL", {
          xScaleFactor: 0.9,
          yScaleFactor: 0.9,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.5,
            my: 0.2
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:MultipleEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_MULTIPLE", {
          xScaleFactor: 1.1,
          yScaleFactor: 1.1,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.222,
            my: 0.36
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:ParallelMultipleEventDefinition": function (parentGfx, event, options) {
        const pathData = pathMap.getScaledPath("EVENT_PARALLEL_MULTIPLE", {
          xScaleFactor: 1.2,
          yScaleFactor: 1.2,
          containerWidth: event.width,
          containerHeight: event.height,
          position: {
            mx: 0.458,
            my: 0.194
          }
        });
        const fill = options.isThrowing ? getFillColor(event, options?.attrs?.color) : defaultFillColor;
        const stroke = options.isThrowing ? defaultFillColor : getStrokeColor(event, options?.attrs?.color);
        return drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill,
          stroke
        });
      },
      "bpmn:EndEvent": function (parentGfx, element) {
        const circle = renderer("bpmn:Event")(parentGfx, element, {
          strokeWidth: 4,
          fill: getFillColor(element, defaultEndEventColor),
          fillOpacity: defaultEndEventOpacity,
          stroke: getStrokeColor(element, defaultEndEventColor)
        });
        renderEventContent(element, parentGfx);
        return circle;
      },
      "bpmn:TerminateEventDefinition": function (parentGfx, element) {
        return drawCircle(parentGfx, element.width, element.height, 8, {
          strokeWidth: 4,
          fill: getStrokeColor(element, defaultEndEventColor),
          stroke: getStrokeColor(element, defaultEndEventColor)
        });
      },
      "bpmn:IntermediateEvent": function (parentGfx, element) {
        const outer = renderer("bpmn:Event")(parentGfx, element, {
          strokeWidth: 1,
          stroke: getStrokeColor(element, defaultIntermediateEventColor)
        });
        drawCircle(parentGfx, element.width, element.height, INNER_OUTER_DIST, {
          strokeWidth: 1,
          stroke: getStrokeColor(element, defaultIntermediateEventColor)
        });
        renderEventContent(element, parentGfx);
        return outer;
      },
      "bpmn:IntermediateCatchEvent": as("bpmn:IntermediateEvent"),
      "bpmn:IntermediateThrowEvent": as("bpmn:IntermediateEvent"),
      "bpmn:Activity": function (parentGfx, element, attrs) {
        attrs = attrs || {};

        if (!("fillOpacity" in attrs)) {
          attrs.fillOpacity = DEFAULT_FILL_OPACITY;
        }

        return drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, attrs);
      },
      "bpmn:Task": function (parentGfx, element) {
        const attrs = {
          fill: getFillColor(element, defaultFillColor),
          fillOpacity: defaultTaskOpacity,
          stroke: getStrokeColor(element, defaultTaskColor)
        };

        const rect = renderer("bpmn:Activity")(parentGfx, element, attrs);

        renderEmbeddedLabel(parentGfx, element, "center-middle");
        attachTaskMarkers(parentGfx, element);

        return rect;
      },
      "bpmn:ServiceTask": function (parentGfx, element) {
        const task = renderer("bpmn:Task")(parentGfx, element);

        const pathDataBG = pathMap.getScaledPath("TASK_TYPE_SERVICE", {
          abspos: {
            x: 12,
            y: 18
          }
        });

        /* service bg */ drawPath(parentGfx, pathDataBG, {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        const fillPathData = pathMap.getScaledPath("TASK_TYPE_SERVICE_FILL", {
          abspos: {
            x: 17.2,
            y: 18
          }
        });

        /* service fill */ drawPath(parentGfx, fillPathData, {
          strokeWidth: 0,
          fill: getFillColor(element, defaultFillColor)
        });

        const pathData = pathMap.getScaledPath("TASK_TYPE_SERVICE", {
          abspos: {
            x: 17,
            y: 22
          }
        });

        /* service */ drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        return task;
      },
      "bpmn:UserTask": function (parentGfx, element) {
        const task = renderer("bpmn:Task")(parentGfx, element);

        const x = 15;
        const y = 12;

        const pathData = pathMap.getScaledPath("TASK_TYPE_USER_1", {
          abspos: {
            x: x,
            y: y
          }
        });

        /* user path */ drawPath(parentGfx, pathData, {
          strokeWidth: 0.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        const pathData2 = pathMap.getScaledPath("TASK_TYPE_USER_2", {
          abspos: {
            x: x,
            y: y
          }
        });

        /* user2 path */ drawPath(parentGfx, pathData2, {
          strokeWidth: 0.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        const pathData3 = pathMap.getScaledPath("TASK_TYPE_USER_3", {
          abspos: {
            x: x,
            y: y
          }
        });

        /* user3 path */ drawPath(parentGfx, pathData3, {
          strokeWidth: 0.5,
          fill: getStrokeColor(element, defaultTaskColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        return task;
      },
      "bpmn:ManualTask": function (parentGfx, element) {
        const task = renderer("bpmn:Task")(parentGfx, element);

        const pathData = pathMap.getScaledPath("TASK_TYPE_MANUAL", {
          abspos: {
            x: 17,
            y: 15
          }
        });

        /* manual path */ drawPath(parentGfx, pathData, {
          strokeWidth: 0.5, // 0.25,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        return task;
      },
      "bpmn:SendTask": function (parentGfx, element) {
        const task = renderer("bpmn:Task")(parentGfx, element);

        const pathData = pathMap.getScaledPath("TASK_TYPE_SEND", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: 21,
          containerHeight: 14,
          position: {
            mx: 0.285,
            my: 0.357
          }
        });

        /* send path */ drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill: getStrokeColor(element, defaultTaskColor),
          stroke: getFillColor(element, defaultFillColor)
        });

        return task;
      },
      "bpmn:ReceiveTask": function (parentGfx, element) {
        const semantic = getSemantic(element);

        const task = renderer("bpmn:Task")(parentGfx, element);
        let pathData;

        if (semantic.instantiate) {
          drawCircle(parentGfx, 28, 28, 20 * 0.22, { strokeWidth: 1 });

          pathData = pathMap.getScaledPath("TASK_TYPE_INSTANTIATING_SEND", {
            abspos: {
              x: 7.77,
              y: 9.52
            }
          });
        } else {
          pathData = pathMap.getScaledPath("TASK_TYPE_SEND", {
            xScaleFactor: 0.9,
            yScaleFactor: 0.9,
            containerWidth: 21,
            containerHeight: 14,
            position: {
              mx: 0.3,
              my: 0.4
            }
          });
        }

        /* receive path */ drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        return task;
      },
      "bpmn:ScriptTask": function (parentGfx, element) {
        const task = renderer("bpmn:Task")(parentGfx, element);

        const pathData = pathMap.getScaledPath("TASK_TYPE_SCRIPT", {
          abspos: {
            x: 15,
            y: 20
          }
        });

        /* script path */ drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        return task;
      },
      "bpmn:BusinessRuleTask": function (parentGfx, element) {
        const task = renderer("bpmn:Task")(parentGfx, element);

        const headerPathData = pathMap.getScaledPath("TASK_TYPE_BUSINESS_RULE_HEADER", {
          abspos: {
            x: 8,
            y: 8
          }
        });

        const businessHeaderPath = drawPath(parentGfx, headerPathData);
        svgAttr(businessHeaderPath, {
          strokeWidth: 1,
          fill: getFillColor(element, "#aaaaaa"),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        const headerData = pathMap.getScaledPath("TASK_TYPE_BUSINESS_RULE_MAIN", {
          abspos: {
            x: 8,
            y: 8
          }
        });

        const businessPath = drawPath(parentGfx, headerData);
        svgAttr(businessPath, {
          strokeWidth: 1,
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        return task;
      },
      "bpmn:SubProcess": function (parentGfx, element, attrs) {
        attrs = assign(
          {
            fill: getFillColor(element, defaultFillColor),
            stroke: getStrokeColor(element, defaultTaskColor)
          },
          attrs
        );

        const rect = renderer("bpmn:Activity")(parentGfx, element, attrs);

        const expanded = isExpanded(element);

        if (isEventSubProcess(element)) {
          svgAttr(rect, {
            strokeDasharray: "1,2"
          });
        }

        renderEmbeddedLabel(parentGfx, element, expanded ? "center-top" : "center-middle");

        if (expanded) {
          attachTaskMarkers(parentGfx, element);
        } else {
          attachTaskMarkers(parentGfx, element, ["SubProcessMarker"]);
        }

        return rect;
      },
      "bpmn:AdHocSubProcess": function (parentGfx, element) {
        return renderer("bpmn:SubProcess")(parentGfx, element);
      },
      "bpmn:Transaction": function (parentGfx, element) {
        const outer = renderer("bpmn:SubProcess")(parentGfx, element);

        const innerAttrs = styles.style(["no-fill", "no-events"], {
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        /* inner path */ drawRect(
          parentGfx,
          element.width,
          element.height,
          TASK_BORDER_RADIUS - 2,
          INNER_OUTER_DIST,
          innerAttrs
        );

        return outer;
      },
      "bpmn:CallActivity": function (parentGfx, element) {
        return renderer("bpmn:SubProcess")(parentGfx, element, {
          strokeWidth: 5
        });
      },
      "bpmn:Participant": function (parentGfx, element) {
        const attrs = {
          fillOpacity: DEFAULT_FILL_OPACITY,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        };

        const lane = renderer("bpmn:Lane")(parentGfx, element, attrs);

        const expandedPool = isExpanded(element);

        if (expandedPool) {
          drawLine(
            parentGfx,
            [
              { x: 30, y: 0 },
              { x: 30, y: element.height }
            ],
            {
              stroke: getStrokeColor(element, defaultTaskColor)
            }
          );
          const text = getSemantic(element).name;
          renderLaneLabel(parentGfx, text, element);
        } else {
          // Collapsed pool draw text inline
          const text2 = getSemantic(element).name;
          renderLabel(parentGfx, text2, {
            box: element,
            align: "center-middle",
            style: {
              fill: getLabelColor(element, defaultLabelColor, defaultTaskColor)
            }
          });
        }

        const participantMultiplicity = !!getSemantic(element).participantMultiplicity;

        if (participantMultiplicity) {
          renderer("ParticipantMultiplicityMarker")(parentGfx, element);
        }

        return lane;
      },
      "bpmn:Lane": function (parentGfx, element, attrs) {
        const rect = drawRect(
          parentGfx,
          element.width,
          element.height,
          0,
          assign(
            {
              fill: getFillColor(element, defaultFillColor),
              fillOpacity: HIGH_FILL_OPACITY,
              stroke: getStrokeColor(element, defaultTaskColor)
            },
            attrs
          )
        );

        const semantic = getSemantic(element);

        if (semantic.$type === "bpmn:Lane") {
          const text = semantic.name;
          renderLaneLabel(parentGfx, text, element);
        }

        return rect;
      },
      "bpmn:InclusiveGateway": function (parentGfx, element) {
        const diamond = renderer("bpmn:Gateway")(parentGfx, element);

        /* circle path */
        drawCircle(parentGfx, element.width, element.height, element.height * 0.24, {
          strokeWidth: 2.5,
          fill: getStrokeColor(element, defaultGatewayColor),
          stroke: getStrokeColor(element, defaultGatewayColor)
        });

        return diamond;
      },
      "bpmn:ExclusiveGateway": function (parentGfx, element) {
        const diamond = renderer("bpmn:Gateway")(parentGfx, element);

        const pathData = pathMap.getScaledPath("GATEWAY_EXCLUSIVE", {
          xScaleFactor: 0.4,
          yScaleFactor: 0.4,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.32,
            my: 0.3
          }
        });

        if (getDi(element).isMarkerVisible) {
          drawPath(parentGfx, pathData, {
            strokeWidth: 1,
            fill: getStrokeColor(element, defaultGatewayColor),
            stroke: getStrokeColor(element, defaultGatewayColor)
          });
        }

        return diamond;
      },
      "bpmn:ComplexGateway": function (parentGfx, element) {
        const diamond = renderer("bpmn:Gateway")(parentGfx, element);

        const pathData = pathMap.getScaledPath("GATEWAY_COMPLEX", {
          xScaleFactor: 0.5,
          yScaleFactor: 0.5,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.46,
            my: 0.26
          }
        });

        /* complex path */ drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill: getStrokeColor(element, defaultGatewayColor),
          stroke: getStrokeColor(element, defaultGatewayColor)
        });

        return diamond;
      },
      "bpmn:ParallelGateway": function (parentGfx, element) {
        const diamond = renderer("bpmn:Gateway")(parentGfx, element);

        const pathData = pathMap.getScaledPath("GATEWAY_PARALLEL", {
          xScaleFactor: 0.6,
          yScaleFactor: 0.6,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.46,
            my: 0.2
          }
        });

        /* parallel path */ drawPath(parentGfx, pathData, {
          strokeWidth: 1,
          fill: getStrokeColor(element, defaultGatewayColor),
          stroke: getStrokeColor(element, defaultGatewayColor)
        });

        return diamond;
      },
      "bpmn:EventBasedGateway": function (parentGfx, element) {
        const semantic = getSemantic(element);

        const diamond = renderer("bpmn:Gateway")(parentGfx, element);

        /* outer circle path */
        drawCircle(parentGfx, element.width, element.height, element.height * 0.2, {
          strokeWidth: 1,
          fill: "none",
          stroke: getStrokeColor(element, defaultGatewayColor)
        });

        const type = semantic.eventGatewayType;
        const instantiate = !!semantic.instantiate;

        function drawEvent() {
          const pathData = pathMap.getScaledPath("GATEWAY_EVENT_BASED", {
            xScaleFactor: 0.18,
            yScaleFactor: 0.18,
            containerWidth: element.width,
            containerHeight: element.height,
            position: {
              mx: 0.36,
              my: 0.44
            }
          });

          const attrs = {
            strokeWidth: 2,
            fill: getFillColor(element, "none"),
            stroke: getStrokeColor(element, defaultGatewayColor)
          };
          drawPath(parentGfx, pathData, attrs);
        }

        if (type === "Parallel") {
          const pathData = pathMap.getScaledPath("GATEWAY_PARALLEL", {
            xScaleFactor: 0.4,
            yScaleFactor: 0.4,
            containerWidth: element.width,
            containerHeight: element.height,
            position: {
              mx: 0.474,
              my: 0.296
            }
          });

          const parallelPath = drawPath(parentGfx, pathData);
          svgAttr(parallelPath, {
            strokeWidth: 1,
            fill: "none"
          });
        } else if (type === "Exclusive") {
          if (!instantiate) {
            const innerCircle = drawCircle(parentGfx, element.width, element.height, element.height * 0.26);
            svgAttr(innerCircle, {
              strokeWidth: 1,
              fill: "none",
              stroke: getStrokeColor(element, defaultGatewayColor)
            });
          }

          drawEvent();
        }

        return diamond;
      },
      "bpmn:Gateway": function (parentGfx, element) {
        const attrs = {
          fill: getFillColor(element, defaultGatewayColor),
          fillOpacity: defaultGatewayOpacity,
          stroke: getStrokeColor(element, defaultGatewayColor)
        };

        return drawDiamond(parentGfx, element.width, element.height, attrs);
      },
      "bpmn:SequenceFlow": function (parentGfx, element) {
        const pathData = createPathFromConnection(element);
        const fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultSequenceColor);
        const attrs = {
          strokeLinejoin: "round",
          markerEnd: marker("sequenceflow-end", fill, stroke),
          stroke: getStrokeColor(element, defaultSequenceColor)
        };
        const path = drawPath(parentGfx, pathData, attrs);
        const sequenceflow = getSemantic(element);
        let source;
        if (element.source) {
          source = element.source.businessObject;
          if (sequenceflow.conditionExpression && source.$instanceOf("bpmn:Activity")) {
            svgAttr(path, {
              markerStart: marker("conditional-flow-marker", fill, stroke)
            });
          }
          if (
            source.default &&
            (source.$instanceOf("bpmn:Gateway") || source.$instanceOf("bpmn:Activity")) &&
            source.default === sequenceflow
          ) {
            svgAttr(path, {
              markerStart: marker("conditional-default-flow-marker", fill, stroke)
            });
          }
        }

        return path;
      },
      "bpmn:Association": function (parentGfx, element, attrs) {
        const semantic = getSemantic(element);

        const fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultTaskColor);

        attrs = assign(
          {
            strokeDasharray: "0.5, 5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            stroke: getStrokeColor(element, defaultTaskColor)
          },
          attrs || {}
        );

        if (semantic.associationDirection === "One" || semantic.associationDirection === "Both") {
          attrs.markerEnd = marker("association-end", fill, stroke);
        }

        if (semantic.associationDirection === "Both") {
          attrs.markerStart = marker("association-start", fill, stroke);
        }

        return drawLine(parentGfx, element.waypoints, attrs);
      },
      "bpmn:DataInputAssociation": function (parentGfx, element) {
        const fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultTaskColor);

        return renderer("bpmn:Association")(parentGfx, element, {
          markerEnd: marker("association-end", fill, stroke)
        });
      },
      "bpmn:DataOutputAssociation": function (parentGfx, element) {
        const fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultTaskColor);

        return renderer("bpmn:Association")(parentGfx, element, {
          markerEnd: marker("association-end", fill, stroke)
        });
      },
      "bpmn:MessageFlow": function (parentGfx, element) {
        const semantic = getSemantic(element),
          di = getDi(element);

        const fill = getFillColor(element, defaultFillColor),
          stroke = getStrokeColor(element, defaultTaskColor);

        const pathData = createPathFromConnection(element);

        const attrs = {
          markerEnd: marker("messageflow-end", fill, stroke),
          markerStart: marker("messageflow-start", fill, stroke),
          strokeDasharray: "10, 12",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
          stroke: getStrokeColor(element, defaultTaskColor)
        };

        const path = drawPath(parentGfx, pathData, attrs);

        if (semantic.messageRef) {
          const midPoint = path.getPointAtLength(path.getTotalLength() / 2);

          const markerPathData = pathMap.getScaledPath("MESSAGE_FLOW_MARKER", {
            abspos: {
              x: midPoint.x,
              y: midPoint.y
            }
          });

          const messageAttrs = { strokeWidth: 1 };

          if (di.messageVisibleKind === "initiating") {
            messageAttrs.fill = "white";
            messageAttrs.stroke = "black";
          } else {
            messageAttrs.fill = "#888";
            messageAttrs.stroke = "white";
          }

          const message = drawPath(parentGfx, markerPathData, messageAttrs);

          const labelText = semantic.messageRef.name;
          const label = renderLabel(parentGfx, labelText, {
            align: "center-top",
            fitBox: true,
            style: {
              fill: getStrokeColor(element, defaultLabelColor, defaultTaskColor)
            }
          });

          const messageBounds = message.getBBox(),
            labelBounds = label.getBBox();

          const translateX = midPoint.x - labelBounds.width / 2,
            translateY = midPoint.y + messageBounds.height / 2 + ELEMENT_LABEL_DISTANCE;

          transform(label, translateX, translateY, 0);
        }

        return path;
      },
      "bpmn:DataObject": function (parentGfx, element) {
        const pathData = pathMap.getScaledPath("DATA_OBJECT_PATH", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.474,
            my: 0.296
          }
        });

        const elementObject = drawPath(parentGfx, pathData, {
          fill: getFillColor(element, defaultFillColor),
          fillOpacity: DEFAULT_FILL_OPACITY,
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        const semantic = getSemantic(element);

        if (isCollection(semantic)) {
          renderDataItemCollection(parentGfx, element);
        }

        return elementObject;
      },
      "bpmn:DataObjectReference": as("bpmn:DataObject"),
      "bpmn:DataInput": function (parentGfx, element) {
        const arrowPathData = pathMap.getRawPath("DATA_ARROW");

        // page
        const elementObject = renderer("bpmn:DataObject")(parentGfx, element);

        /* input arrow path */ drawPath(parentGfx, arrowPathData, { strokeWidth: 1 });

        return elementObject;
      },
      "bpmn:DataOutput": function (parentGfx, element) {
        const arrowPathData = pathMap.getRawPath("DATA_ARROW");

        // page
        const elementObject = renderer("bpmn:DataObject")(parentGfx, element);

        /* output arrow path */ drawPath(parentGfx, arrowPathData, {
          strokeWidth: 1,
          fill: "black"
        });

        return elementObject;
      },
      "bpmn:DataStoreReference": function (parentGfx, element) {
        const DATA_STORE_PATH = pathMap.getScaledPath("DATA_STORE", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0,
            my: 0.133
          }
        });

        return drawPath(parentGfx, DATA_STORE_PATH, {
          strokeWidth: 2,
          fill: getFillColor(element, defaultFillColor),
          fillOpacity: DEFAULT_FILL_OPACITY,
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },
      "bpmn:BoundaryEvent": function (parentGfx, element) {
        const semantic = getSemantic(element),
          cancel = semantic.cancelActivity;

        const attrs = {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        };

        if (!cancel) {
          attrs.strokeDasharray = "6";
          attrs.strokeLinecap = "round";
        }

        // apply fillOpacity
        const outerAttrs = assign({}, attrs, {
          fillOpacity: 1
        });

        // apply no-fill
        const innerAttrs = assign({}, attrs, {
          fill: "none"
        });

        const outer = renderer("bpmn:Event")(parentGfx, element, outerAttrs);

        /* inner path */ drawCircle(parentGfx, element.width, element.height, INNER_OUTER_DIST, innerAttrs);

        renderEventContent(element, parentGfx);

        return outer;
      },
      "bpmn:Group": function (parentGfx, element) {
        return drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, {
          stroke: getStrokeColor(element, defaultTaskColor),
          strokeWidth: 1,
          strokeDasharray: "8,3,1,3",
          fill: "none",
          pointerEvents: "none"
        });
      },
      label: function (parentGfx, element) {
        return renderExternalLabel(parentGfx, element);
      },
      "bpmn:TextAnnotation": function (parentGfx, element) {
        const style = {
          fill: "none",
          stroke: "none"
        };

        const textElement = drawRect(parentGfx, element.width, element.height, 0, 0, style);

        const textPathData = pathMap.getScaledPath("TEXT_ANNOTATION", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: 0.0,
            my: 0.0
          }
        });

        drawPath(parentGfx, textPathData, {
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        const text = getSemantic(element).text || "";
        renderLabel(parentGfx, text, {
          box: element,
          align: "left-top",
          padding: 5,
          style: {
            fill: getLabelColor(element, defaultLabelColor, defaultTaskColor)
          }
        });

        return textElement;
      },
      ParticipantMultiplicityMarker: function (parentGfx, element) {
        const markerPath = pathMap.getScaledPath("MARKER_PARALLEL", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: element.width / 2 / element.width,
            my: (element.height - 15) / element.height
          }
        });

        return drawMarker("participant-multiplicity", parentGfx, markerPath, {
          strokeWidth: 2,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },
      SubProcessMarker: function (parentGfx, element) {
        const markerRect = drawRect(parentGfx, 14, 14, 0, {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });

        // Process marker is placed in the middle of the box
        // therefore fixed values can be used here
        translate(markerRect, element.width / 2 - 7.5, element.height - 20);

        const markerPath = pathMap.getScaledPath("MARKER_SUB_PROCESS", {
          xScaleFactor: 1.5,
          yScaleFactor: 1.5,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: (element.width / 2 - 7.5) / element.width,
            my: (element.height - 20) / element.height
          }
        });

        return drawMarker("sub-process", parentGfx, markerPath, {
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },
      ParallelMarker: function (parentGfx, element, position) {
        const markerPath = pathMap.getScaledPath("MARKER_PARALLEL", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: (element.width / 2 + position.parallel) / element.width,
            my: (element.height - 20) / element.height
          }
        });

        return drawMarker("parallel", parentGfx, markerPath, {
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },
      SequentialMarker: function (parentGfx, element, position) {
        const markerPath = pathMap.getScaledPath("MARKER_SEQUENTIAL", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: (element.width / 2 + position.seq) / element.width,
            my: (element.height - 19) / element.height
          }
        });

        return drawMarker("sequential", parentGfx, markerPath, {
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },
      CompensationMarker: function (parentGfx, element, position) {
        const markerMath = pathMap.getScaledPath("MARKER_COMPENSATION", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: (element.width / 2 + position.compensation) / element.width,
            my: (element.height - 13) / element.height
          }
        });

        return drawMarker("compensation", parentGfx, markerMath, {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },
      LoopMarker: function (parentGfx, element, position) {
        const markerPath = pathMap.getScaledPath("MARKER_LOOP", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: (element.width / 2 + position.loop) / element.width,
            my: (element.height - 7) / element.height
          }
        });

        return drawMarker("loop", parentGfx, markerPath, {
          strokeWidth: 1,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultTaskColor),
          strokeLinecap: "round",
          strokeMiterlimit: 0.5
        });
      },
      AdhocMarker: function (parentGfx, element, position) {
        const markerPath = pathMap.getScaledPath("MARKER_ADHOC", {
          xScaleFactor: 1,
          yScaleFactor: 1,
          containerWidth: element.width,
          containerHeight: element.height,
          position: {
            mx: (element.width / 2 + position.adhoc) / element.width,
            my: (element.height - 15) / element.height
          }
        });

        return drawMarker("adhoc", parentGfx, markerPath, {
          strokeWidth: 1,
          fill: getStrokeColor(element, defaultTaskColor),
          stroke: getStrokeColor(element, defaultTaskColor)
        });
      },

      // 自定义节点的绘制
      "miyue:SqlTask": function (parentGfx, element, attr) {
        // 渲染外层边框
        const attrs = {
          fill: getFillColor(element, defaultFillColor),
          fillOpacity: defaultTaskOpacity,
          stroke: getStrokeColor(element, defaultTaskColor)
        };
        renderer("bpmn:Activity")(parentGfx, element, attrs);
        // 自定义节点
        const customIcon = svgCreate("image");
        svgAttr(customIcon, {
          ...(attr || {}),
          width: element.width,
          height: element.height,
          href: mysqlIcon
        });
        svgAppend(parentGfx, customIcon);
        return customIcon;
      }
    });
  }

  canRender(element) {
    return is(element, "bpmn:BaseElement");
  }
  drawConnection(parentGfx, connection) {
    const type = connection.type;
    const h = this._renderer(type);
    return h(parentGfx, connection);
  }
  drawShape(parentGfx, element) {
    const type = element.type;
    const h = this._renderer(type);
    return h(parentGfx, element);
  }
  getConnectionPath(connection) {
    return undefined;
  }
  getShapePath(shape) {
    if (is(shape, "bpmn:Event")) {
      return getCirclePath(shape);
    }

    if (is(shape, "bpmn:Activity")) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    if (is(shape, "bpmn:Gateway")) {
      return getDiamondPath(shape);
    }

    return getRectPath(shape);
  }

  setElementColors(element, colors) {
    const svg = this._elementRegistry?.getGraphics(element);
    if (!svg) return;
    const paths = svgSelect(svg, ".djs-visual");
    // @ts-ignore
    paths && paths.childNodes.forEach((el) => svgAttr(el, colors));
  }
}

RewriteRenderer.$inject = [
  "config.bpmnRenderer",
  "eventBus",
  "styles",
  "pathMap",
  "canvas",
  "textRenderer",
  "elementRegistry",
  "interactionEvents"
];

export default RewriteRenderer;
