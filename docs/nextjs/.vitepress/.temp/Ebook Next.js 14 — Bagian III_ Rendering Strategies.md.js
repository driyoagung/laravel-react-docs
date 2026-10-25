import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"Ebook Next.js 14 — Bagian III_ Rendering Strategies.md","filePath":"Ebook Next.js 14 — Bagian III_ Rendering Strategies.md","lastUpdated":null}');
const _sfc_main = { name: "Ebook Next.js 14 — Bagian III_ Rendering Strategies.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Ebook Next.js 14 — Bagian III_ Rendering Strategies.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Ebook_Next_js_14___Bagian_III__Rendering_Strategies = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Ebook_Next_js_14___Bagian_III__Rendering_Strategies as default
};
