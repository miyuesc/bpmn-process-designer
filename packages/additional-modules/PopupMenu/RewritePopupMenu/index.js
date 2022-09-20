import rewritePopupMenuProvider from "./rewritePopupMenuProvider";

const rewritePopupMenu = {
  __init__: ["replaceMenuProvider"],
  replaceMenuProvider: ["type", rewritePopupMenuProvider]
};

export default rewritePopupMenu;
