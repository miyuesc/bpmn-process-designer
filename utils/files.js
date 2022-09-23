// 根据所需类型进行转码并返回下载地址
export function setEncoded(type, filename, data) {
  const encodedData = encodeURIComponent(data);
  return {
    filename: `${filename}.${type.toLowerCase()}`,
    href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
    data: data
  };
}

// 文件下载方法
export function downloadFile(href, filename) {
  if (href && filename) {
    const a = document.createElement("a");
    a.download = filename; //指定下载的文件名
    a.href = href; //  URL对象
    a.click(); // 模拟点击
    URL.revokeObjectURL(a.href); // 释放URL 对象
  }
}
