import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 7 — Optimasi & Performa","description":"","frontmatter":{"title":"Bagian 7 — Optimasi & Performa"},"headers":[],"relativePath":"bagian-7/index.md","filePath":"bagian-7/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-7/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-7-—-optimasi-performa" tabindex="-1">Bagian 7 — Optimasi &amp; Performa <a class="header-anchor" href="#bagian-7-—-optimasi-performa" aria-label="Permalink to &quot;Bagian 7 — Optimasi &amp; Performa&quot;">​</a></h1><p>Bagian ini mencakup Bab 18 sampai Bab 19.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>18</td><td><a href="/bagian-7/bab-18">Bab 18 — Optimasi Gambar, Font &amp; Script</a></td></tr><tr><td>19</td><td><a href="/bagian-7/bab-19">Bab 19 — Caching, Suspense &amp; Streaming</a></td></tr></tbody></table><p><a href="/bagian-8/index">Lanjut ke Bagian 8</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-7/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
