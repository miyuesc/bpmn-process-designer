import AutoPlaceModule from "diagram-js/lib/features/auto-place";
import CustomAutoPlace from "./CustomAutoPlace";

export default {
  __depends__: [AutoPlaceModule],
  __init__: ["customAutoPlace"],
  customAutoPlace: ["type", CustomAutoPlace]
};
