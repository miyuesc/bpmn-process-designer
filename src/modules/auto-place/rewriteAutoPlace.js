import { asTRBL, getMid } from "diagram-js/lib/layout/LayoutUtil";

const DEFAULT_DISTANCE = 200;

const LOW_PRIORITY = 100;

export default function RewriteAutoPlace(eventBus, modeling, canvas) {
  eventBus.on("autoPlace", LOW_PRIORITY, function(context) {
    const shape = context.shape,
      source = context.source;

    return getNewShapePosition(source, shape);
  });

  eventBus.on("autoPlace.end", function(event) {
    canvas.scrollToElement(event.shape);
  });

  this.append = function(source, shape, hints) {
    eventBus.fire("autoPlace.start", {
      source: source,
      shape: shape
    });

    // allow others to provide the position
    const position = eventBus.fire("autoPlace", {
      source: source,
      shape: shape
    });

    const newShape = modeling.appendShape(source, shape, position, source.parent, hints);

    eventBus.fire("autoPlace.end", {
      source: source,
      shape: newShape
    });

    return newShape;
  };
}

RewriteAutoPlace.$inject = ["eventBus", "modeling", "canvas"];

function getNewShapePosition(source, element) {
  const distance = DEFAULT_DISTANCE;

  const sourceMid = getMid(source),
    sourceTrbl = asTRBL(source);

  // simply put element right next to source
  return {
    x: sourceTrbl.right + distance + element.width / 2,
    y: sourceMid.y
  };
}
