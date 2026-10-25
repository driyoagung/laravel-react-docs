import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 1 — Fondasi Vue.js","description":"","frontmatter":{"title":"Bagian 1 — Fondasi Vue.js"},"headers":[],"relativePath":"bagian-1/index.md","filePath":"bagian-1/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-1/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-1-—-fondasi-vue-js" tabindex="-1">Bagian 1 — Fondasi Vue.js <a class="header-anchor" href="#bagian-1-—-fondasi-vue-js" aria-label="Permalink to &quot;Bagian 1 — Fondasi Vue.js&quot;">​</a></h1><p>Mulai dari pengenalan Vue, setup project, komponen, dan sintaks template.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>1</td><td><a href="/bagian-1/bab-1">Mengenal Vue.js &amp; Ekosistemnya</a></td></tr><tr><td>2</td><td><a href="/bagian-1/bab-2">Setup &amp; Struktur Project</a></td></tr><tr><td>3</td><td><a href="/bagian-1/bab-3">Cara Berpikir Berbasis Komponen</a></td></tr><tr><td>4</td><td><a href="/bagian-1/bab-4">Template Syntax &amp; Direktif Dasar</a></td></tr></tbody></table><p><a href="/bagian-2/index">Lanjut ke Bagian 2</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-1/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
