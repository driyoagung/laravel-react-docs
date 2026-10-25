import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 2 — App Router: Routing & Layout","description":"","frontmatter":{"title":"Bagian 2 — App Router: Routing & Layout"},"headers":[],"relativePath":"bagian-2/index.md","filePath":"bagian-2/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-2/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-2-—-app-router-routing-layout" tabindex="-1">Bagian 2 — App Router: Routing &amp; Layout <a class="header-anchor" href="#bagian-2-—-app-router-routing-layout" aria-label="Permalink to &quot;Bagian 2 — App Router: Routing &amp; Layout&quot;">​</a></h1><p>Bagian ini mencakup Bab 4 sampai Bab 6.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>4</td><td><a href="/bagian-2/bab-4">Bab 4 — File Convention &amp; Routing System</a></td></tr><tr><td>5</td><td><a href="/bagian-2/bab-5">Bab 5 — Layouts, Loading &amp; Error UI</a></td></tr><tr><td>6</td><td><a href="/bagian-2/bab-6">Bab 6 — Navigasi &amp; Link</a></td></tr></tbody></table><p><a href="/bagian-3/index">Lanjut ke Bagian 3</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-2/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
