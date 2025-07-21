import UrlStateSync from "./headless/UrlStateSync";
import "./style.css";
import Juris from "./juris/juris.js";
import NotFoundPage from "./pages/notFound";
import Router from "./components/router";
import HomePage from "./pages/home";
import EditorPage from "./pages/editor";
import FlowRenderer from "./components/flowRenderer";
import FlowEditorSidebar from "./components/flowEditorSidebar";
import NodeEditDialog from "./components/nodeEditDialog";

const juris = new Juris({
  components: {
    NotFoundPage,
    Router,
    HomePage,
    EditorPage,
    FlowRenderer,
    FlowEditorSidebar,
    NodeEditDialog,
  },
  headlessComponents: {
    UrlStateSync: { fn: UrlStateSync, options: { autoInit: true } },
  },
  layout: { Router: {} },
  logLevel: 'debug'
});

juris.render("#app");
