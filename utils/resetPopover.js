const getReference = (el, binding, vnode) => {
  const { arg, value } = binding;
  let elRefs;
  if (arg) {
    elRefs = vnode.context.$refs[arg];
    if (Array.isArray(elRefs)) {
      elRefs[value].$refs.reference = el;
    } else {
      elRefs.$refs.reference = el;
    }
  } else {
    vnode.context.$refs[value].$refs.reference = arg;
  }
};

export default {
  bind(el, binding, vnode) {
    getReference(el, binding, vnode);
  },
  inserted(el, binding, vnode) {
    getReference(el, binding, vnode);
  }
};
