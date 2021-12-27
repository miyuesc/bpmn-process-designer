import AutoPlace from "diagram-js/lib/features/auto-place/AutoPlace";

export default function CustomAutoPlace(eventBus, modeling) {
  AutoPlace.call(this, eventBus, modeling, 3000);

  eventBus.on("autoPlace", 3000, function(context) {
    const shape = context.shape,
      source = context.source;

    return getNewCustomShapePosition(source, shape);
  });

  this.append = function(source, shape, hints) {
    eventBus.fire("autoPlace.start", {
      source: source,
      shape: shape
    });

    // allow others to provide the position
    var position = eventBus.fire("autoPlace", {
      source: source,
      shape: shape
    });

    console.log("hints", hints, "position", position);

    var newShape = modeling.appendShape(source, shape, position, source.parent, hints);

    eventBus.fire("autoPlace.end", {
      source: source,
      shape: newShape
    });

    return newShape;
  };
}

export function asTRBL(bounds) {
  return {
    top: bounds.y,
    right: bounds.x + (bounds.width || 0),
    bottom: bounds.y + (bounds.height || 0),
    left: bounds.x
  };
}

export function roundPoint(point) {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y)
  };
}

export function getMid(bounds) {
  return roundPoint({
    x: bounds.x + (bounds.width || 0) / 2,
    y: bounds.y + (bounds.height || 0) / 2
  });
}

export function getNewCustomShapePosition(source, element, hints) {
  if (!hints) {
    hints = {};
  }

  var distance = hints.defaultDistance || 50;

  var sourceMid = getMid(source),
    sourceTrbl = asTRBL(source);

  // simply put element right next to source
  return {
    x: sourceMid.x,
    y: sourceTrbl.bottom + distance + element.height / 2
  };
}

const F = function() {}; // 核心，利用空对象作为中介；
F.prototype = AutoPlace.prototype; // 核心，将父类的原型赋值给空对象F；
CustomAutoPlace.prototype = new F(); // 核心，将 F的实例赋值给子类；
CustomAutoPlace.prototype.constructor = AutoPlace; // 修复子类CustomRenderer的构造器指向，防止原型链的混乱；
