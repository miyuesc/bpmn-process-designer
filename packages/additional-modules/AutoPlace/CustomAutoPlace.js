import { is } from "bpmn-js/lib/util/ModelUtil";
import { getMid, asTRBL, getOrientation } from "diagram-js/lib/layout/LayoutUtil";
import {
  findFreePosition,
  generateGetNextPosition,
  getConnectedDistance
} from "diagram-js/lib/features/auto-place/AutoPlaceUtil";

class CustomAutoPlace {
  constructor(config, eventBus) {
    const { minDistance = 100 } = config || {};

    eventBus.on("autoPlace", 3000, function (context) {
      const shape = context.shape,
        source = context.source;

      return getNewShapePosition(source, shape, minDistance);
    });
  }
}

function getVerticalDistance(orientation, minDistance) {
  if (orientation.indexOf("top") !== -1) {
    return -1 * minDistance;
  } else if (orientation.indexOf("bottom") !== -1) {
    return minDistance;
  } else {
    return 0;
  }
}

function getNewShapePosition(source, element, minDistance) {
  if (is(element, "bpmn:FlowNode")) {
    const sourceTrbl = asTRBL(source);
    const sourceMid = getMid(source);

    const horizontalDistance = getConnectedDistance(source, {
      defaultDistance: minDistance,
      filter: function (connection) {
        return is(connection, "bpmn:SequenceFlow");
      }
    });

    let margin = 30,
      orientation = "left";

    if (is(source, "bpmn:BoundaryEvent")) {
      orientation = getOrientation(source, source.host, -25);

      if (orientation.indexOf("top") !== -1) {
        margin *= -1;
      }
    }

    const position = {
      x: sourceTrbl.right + horizontalDistance + element.width / 2,
      y: sourceMid.y + getVerticalDistance(orientation, minDistance)
    };

    const nextPositionDirection = {
      y: {
        margin: margin,
        minDistance: minDistance
      }
    };

    return findFreePosition(source, element, position, generateGetNextPosition(nextPositionDirection));
  }
}

CustomAutoPlace.$inject = ["config.autoPlace", "eventBus"];

export default CustomAutoPlace;
