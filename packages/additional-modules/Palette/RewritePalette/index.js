import rerenderPaletteProvider from "./rewritePaletteProvider";

// 使用 paletteProvider 同名参数 覆盖 默认 paletteProvider 构造函数
const RerenderPalette = {
  __init__: ["paletteProvider"],
  paletteProvider: ["type", rerenderPaletteProvider]
};

export default RerenderPalette;
