import { getRawType } from "./tool";

export class Logger {
  constructor() {}

  static types = ["primary", "success", "warn", "error", "info"];
  static typeColor(type) {
    switch (type) {
      case "primary":
        return "#2d8cf0";
      case "success":
        return "#19be6b";
      case "info":
        return "#909399";
      case "warn":
        return "#ff9900";
      case "error":
        return "#f03f14";
      default:
        return "#35495E";
    }
  }

  static rawType(val) {
    return Logger.printBack(getRawType(val));
  }

  static isArray(val) {
    return getRawType(val) === "array";
  }

  static print(text, type = "default", back = false) {
    if (typeof text === "object") {
      // 如果是對象則調用打印對象方式
      Logger.isArray(text) ? console.table(text) : console.dir(text);
      return;
    }
    if (back) {
      // 如果是打印帶背景圖的
      console.log(
        `%c ${text} `,
        `background:${Logger.typeColor(type)}; padding: 2px; border-radius: 4px; color: #fff;`
      );
    } else {
      console.log(
        `%c ${text} `,
        `border: 1px solid ${Logger.typeColor(type)};
                 padding: 2px; border-radius: 4px;
                 color: ${Logger.typeColor(type)};`
      );
    }
  }

  static printBack(text, type = "primary") {
    return Logger.print(text, type, true);
  }

  static pretty(type = "primary", title, text) {
    if (typeof text === "object") {
      console.group("Console Group", title);
      console.log(
        `%c ${title}`,
        `background:${Logger.typeColor(type)};border:1px solid ${Logger.typeColor(type)};
                 padding: 1px; border-radius: 4px; color: #fff;`
      );
      Logger.isArray(text) ? console.table(text) : console.dir(text);
      console.groupEnd();
      return;
    }
    console.log(
      `%c ${title} %c ${text} %c`,
      `background:${Logger.typeColor(type)};border:1px solid ${Logger.typeColor(type)};
             padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
      `border:1px solid ${Logger.typeColor(type)};
             padding: 1px; border-radius: 0 4px 4px 0; color: ${Logger.typeColor(type)};`,
      "background:transparent"
    );
  }

  static prettyPrimary(title, ...text) {
    text.forEach((t) => Logger.pretty("primary", title, t));
  }

  static prettySuccess(title, ...text) {
    text.forEach((t) => Logger.pretty("success", title, t));
  }

  static prettyWarn(title, ...text) {
    text.forEach((t) => Logger.pretty("warn", title, t));
  }

  static prettyError(title, ...text) {
    text.forEach((t) => Logger.pretty("error", title, t));
  }

  static prettyInfo(title, ...text) {
    text.forEach((t) => Logger.pretty("info", title, t));
  }
}
export default Logger;
