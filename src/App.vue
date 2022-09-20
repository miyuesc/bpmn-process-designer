<template>
  <div id="app">
    <bpmn-designer />
  </div>
</template>

<script>
import BpmnDesigner from "../packages/components/Designer";
export default {
  name: "App",
  components: { BpmnDesigner },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
body,
html {
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
</style>
