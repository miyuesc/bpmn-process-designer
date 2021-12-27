function Log() {}

Log.prototype.type = ["primary", "success", "warn", "error", "info"];

Log.prototype.typeColor = function(type) {
  let color = "";
  switch (type) {
    case "primary":
      color = "#2d8cf0";
      break;
    case "success":
      color = "#19be6b";
      break;
    case "info":
      color = "#909399";
      break;
    case "warn":
      color = "#ff9900";
      break;
    case "error":
      color = "#f03f14";
      break;
    default:
      color = "#35495E";
      break;
  }
  return color;
};

Log.prototype.isArray = function(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
};

Log.prototype.print = function(text, type = "default", back = false) {
  if (typeof text === "object") {
    // 如果是對象則調用打印對象方式
    this.isArray(text) ? console.table(text) : console.dir(text);
    return;
  }
  if (back) {
    // 如果是打印帶背景圖的
    console.log(`%c ${text} `, `background:${this.typeColor(type)}; padding: 2px; border-radius: 4px; color: #fff;`);
  } else {
    console.log(
      `%c ${text} `,
      `border: 1px solid ${this.typeColor(type)};
        padding: 2px; border-radius: 4px;
        color: ${this.typeColor(type)};`
    );
  }
};

Log.prototype.printBack = function(type = "primary", title) {
  this.print(type, title, true);
};

Log.prototype.pretty = function(type = "primary", title, text) {
  if (typeof text === "object") {
    console.group("Console Group", title);
    console.log(
      `%c ${title}`,
      `background:${this.typeColor(type)};border:1px solid ${this.typeColor(type)};
        padding: 1px; border-radius: 4px; color: #fff;`
    );
    this.isArray(text) ? console.table(text) : console.dir(text);
    console.groupEnd();
    return;
  }
  console.log(
    `%c ${title} %c ${text} %c`,
    `background:${this.typeColor(type)};border:1px solid ${this.typeColor(type)};
      padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
    `border:1px solid ${this.typeColor(type)};
      padding: 1px; border-radius: 0 4px 4px 0; color: ${this.typeColor(type)};`,
    "background:transparent"
  );
};

Log.prototype.prettyPrimary = function(title, ...text) {
  text.forEach(t => this.pretty("primary", title, t));
};

Log.prototype.prettySuccess = function(title, ...text) {
  text.forEach(t => this.pretty("success", title, t));
};

Log.prototype.prettyWarn = function(title, ...text) {
  text.forEach(t => this.pretty("warn", title, t));
};

Log.prototype.prettyError = function(title, ...text) {
  text.forEach(t => this.pretty("error", title, t));
};

Log.prototype.prettyInfo = function(title, ...text) {
  text.forEach(t => this.pretty("info", title, t));
};

export default new Log();
