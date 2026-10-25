import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 6 — Level Up","description":"","frontmatter":{"title":"Bagian 6 — Level Up"},"headers":[],"relativePath":"bagian-6/index.md","filePath":"bagian-6/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-6/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-6-—-level-up" tabindex="-1">Bagian 6 — Level Up <a class="header-anchor" href="#bagian-6-—-level-up" aria-label="Permalink to &quot;Bagian 6 — Level Up&quot;">​</a></h1><p>Pelajari komponen lanjutan, performa, dan pengujian sebelum mengerjakan project akhir.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>22</td><td><a href="/bagian-6/bab-22">Komponen Lanjutan &amp; Teknik Khusus</a></td></tr><tr><td>23</td><td><a href="/bagian-6/bab-23">Performa, Testing &amp; Best Practices</a></td></tr></tbody></table><p><a href="/bagian-7/index">Lanjut ke Bagian 7</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-6/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
