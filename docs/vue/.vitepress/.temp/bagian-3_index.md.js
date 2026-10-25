import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 3 — Options API","description":"","frontmatter":{"title":"Bagian 3 — Options API"},"headers":[],"relativePath":"bagian-3/index.md","filePath":"bagian-3/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-3/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-3-—-options-api" tabindex="-1">Bagian 3 — Options API <a class="header-anchor" href="#bagian-3-—-options-api" aria-label="Permalink to &quot;Bagian 3 — Options API&quot;">​</a></h1><p>Pahami cara kerja Options API dan peralihan konsep ke Composition API.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>10</td><td><a href="/bagian-3/bab-10">Options API — Cara Klasik Vue</a></td></tr><tr><td>11</td><td><a href="/bagian-3/bab-11">Fitur Lanjutan Options API</a></td></tr><tr><td>12</td><td><a href="/bagian-3/bab-12">Migrasi Mindset Options ke Composition</a></td></tr></tbody></table><p><a href="/bagian-4/index">Lanjut ke Bagian 4</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-3/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
