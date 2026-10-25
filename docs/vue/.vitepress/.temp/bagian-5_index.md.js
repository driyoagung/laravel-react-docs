import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 5 — Ekosistem Vue","description":"","frontmatter":{"title":"Bagian 5 — Ekosistem Vue"},"headers":[],"relativePath":"bagian-5/index.md","filePath":"bagian-5/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-5/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-5-—-ekosistem-vue" tabindex="-1">Bagian 5 — Ekosistem Vue <a class="header-anchor" href="#bagian-5-—-ekosistem-vue" aria-label="Permalink to &quot;Bagian 5 — Ekosistem Vue&quot;">​</a></h1><p>Bangun navigasi, kelola state dengan Pinia, dan hubungkan aplikasi ke API.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>17</td><td><a href="/bagian-5/bab-17">Vue Router Dasar</a></td></tr><tr><td>18</td><td><a href="/bagian-5/bab-18">Vue Router Lanjutan &amp; Best Practices</a></td></tr><tr><td>19</td><td><a href="/bagian-5/bab-19">Pinia Dasar</a></td></tr><tr><td>20</td><td><a href="/bagian-5/bab-20">Pinia Lanjutan &amp; Best Practices</a></td></tr><tr><td>21</td><td><a href="/bagian-5/bab-21">HTTP Request &amp; Integrasi API</a></td></tr></tbody></table><p><a href="/bagian-6/index">Lanjut ke Bagian 6</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-5/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
