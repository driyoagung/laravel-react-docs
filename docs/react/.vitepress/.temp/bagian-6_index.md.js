import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian VI — Level Up","description":"","frontmatter":{"title":"Bagian VI — Level Up"},"headers":[],"relativePath":"bagian-6/index.md","filePath":"bagian-6/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-6/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟣-bagian-vi-—-level-up" tabindex="-1">🟣 BAGIAN VI — Level Up <a class="header-anchor" href="#🟣-bagian-vi-—-level-up" aria-label="Permalink to &quot;🟣 BAGIAN VI — Level Up&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Teknik-teknik yang membedakan developer React biasa dengan developer React yang benar-benar mahir dan siap production.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>22</td><td><a href="/bagian-6/bab-22">Performa &amp; Optimasi</a></td><td>✅ Tersedia</td></tr><tr><td>23</td><td><a href="/bagian-6/bab-23">Testing &amp; Best Practices</a></td><td>✅ Tersedia</td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Topik Langka tapi Krusial</p><p>Topik testing &amp; performa sering dilewatkan developer junior, padahal ini yang membedakan developer biasa dengan senior. Kuasai ini untuk naik level.</p></div></div>`);
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
