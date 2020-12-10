export function debounce(fn, wait) {
  let timeout = null;
  return function() {
    if (timeout !== null) clearTimeout(timeout);
    console.log(fn, wait);
    timeout = setTimeout(fn, wait);
  };
}
