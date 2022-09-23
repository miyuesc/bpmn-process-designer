/**
 * 随机生成一个指定长度的 id， 默认长度为 8
 * @param length {number}
 * @param [chars] {string}
 * @returns {string}
 */
export default function uuid(length = 8, chars) {
  let result = "";
  const charsString = chars || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = length; i > 0; --i) {
    result += charsString[Math.floor(Math.random() * charsString.length)];
  }
  return result;
}
