<template>
  <div class="bpmn-toolbar">
    <el-button-group>
      <bpmn-import />
      <bpmn-exports />
      <bpmn-previews />
    </el-button-group>
    <bpmn-aligns />
    <bpmn-scales />
    <bpmn-commands />
    <bpmn-externals />
  </div>
</template>

<script>
import BpmnImport from "./tools/Import";
import BpmnExports from "./tools/Exports";
import BpmnPreviews from "./tools/Previews";
import BpmnAligns from "./tools/Aligns";
import BpmnScales from "./tools/Scales";
import BpmnCommands from "./tools/Commands";
import BpmnExternals from "./tools/Externals";
export default {
  name: "BpmnToolbar",
  components: { BpmnExternals, BpmnCommands, BpmnScales, BpmnAligns, BpmnPreviews, BpmnExports, BpmnImport }
};
</script>
