import Logger from "@utils/Logger";

export function catchWarning(warn) {
  Logger.prettyWarn("[Process Designer Warning]", warn);
}

export function catchError(error) {
  Logger.prettyError("[Process Designer Error]", typeof error === "string" ? error : error.message);
}
