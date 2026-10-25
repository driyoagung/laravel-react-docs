import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian III — Pola Desain Komponen","description":"","frontmatter":{"title":"Bagian III — Pola Desain Komponen"},"headers":[],"relativePath":"bagian-3/index.md","filePath":"bagian-3/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-3/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟡-bagian-iii-—-pola-desain-komponen" tabindex="-1">🟡 BAGIAN III — Pola Desain Komponen <a class="header-anchor" href="#🟡-bagian-iii-—-pola-desain-komponen" aria-label="Permalink to &quot;🟡 BAGIAN III — Pola Desain Komponen&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Memahami pola-pola desain komponen yang membuat kode React scalable, mudah di-maintain, dan mudah di-test.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>10</td><td><a href="/bagian-3/bab-10">Compound Components &amp; Render Props</a></td><td>✅ Tersedia</td></tr><tr><td>11</td><td><a href="/bagian-3/bab-11">HOC &amp; React.memo</a></td><td>✅ Tersedia</td></tr><tr><td>12</td><td><a href="/bagian-3/bab-12">Error Boundaries &amp; Suspense</a></td><td>✅ Tersedia</td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Kapan Pakai Pola Ini?</p><p>Pola Compound &amp; Render Props udah mulai jarang dipakai di project React modern — hook lebih ringkas. Tapi memahami pola ini penting untuk baca codebase lama atau library pihak ketiga. HOC &amp; React.memo masih relevan. Error Boundary adalah <strong>WAJIB</strong> untuk production.</p></div></div>`);
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
