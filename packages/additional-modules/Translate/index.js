import zhCN from "./zh-cn";

export function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = zhCN[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || "{" + key + "}";
  });
}

export default {
  translate: ["value", customTranslate]
};
