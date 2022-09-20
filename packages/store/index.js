import Vue from "vue";
import Vuex from "vuex";
import { defaultSettings } from "../preset-configuration/editor.config";
import { unObserver } from "@utils/tool";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    editor: { ...defaultSettings },
    bpmn: {
      _modeler: null,
      _modeling: null,
      _canvas: null,
      _eventBus: null,
      _moddle: null,
      _elementRegistry: null,
      _activeElement: null,
      _activeElementId: null,
      __v_skip: true
    }
  },
  getters: {
    //  editor
    getEditor: (state) => state.editor,
    getProcessDef: (state) => ({
      processName: state.editor.processName,
      processId: state.editor.processId
    }),
    getProcessEngine: (state) => state.editor.processEngine,
    getEditorConfig: (state) => {
      return Object.keys(state.editor).reduce((config, key) => {
        if (!["processName", "processId", "processEngine"].includes(key)) {
          config[key] = state.editor[key];
        }
        return config;
      }, {});
    },

    // modeler
    getModeler: (state) => state.bpmn._modeler,
    getModeling: (state) => state.bpmn._modeling,
    getCanvas: (state) => state.bpmn._canvas,
    getEventBus: (state) => state.bpmn._eventBus,
    getModdle: (state) => state.bpmn._moddle,
    getElRegistry: (state) => state.bpmn._elementRegistry,
    getActive: (state) => state.bpmn._activeElement,
    getActiveId: (state) => state.bpmn._activeElementId
  },
  mutations: {
    // editor
    setConfiguration(state, conf) {
      state.editor = { ...state.editor, ...conf };
    },

    /**
     * @param state
     * @param modeler { object }
     */
    setModeler(state, modeler) {
      state.bpmn._modeler = unObserver(modeler);
    },
    /**
     * @param state
     * @param key { string }
     * @param module { object }
     */
    setModules(state, { key, module }) {
      state.bpmn[`_${key}`] = unObserver(module);
    },
    /**
     * @param state
     * @param id { string }
     * @param element { object }
     */
    setElement(state, { element, id }) {
      state.bpmn._activeElement = unObserver(element);
      state.bpmn._activeElementId = id;
    }
  }
});

export default store;
