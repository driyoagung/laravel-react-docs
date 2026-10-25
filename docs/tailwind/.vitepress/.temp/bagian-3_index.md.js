import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian III — Typography & Colors","description":"","frontmatter":{"title":"Bagian III — Typography & Colors"},"headers":[],"relativePath":"bagian-3/index.md","filePath":"bagian-3/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-3/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟡-bagian-iii-—-typography-colors" tabindex="-1">🟡 BAGIAN III — Typography &amp; Colors <a class="header-anchor" href="#🟡-bagian-iii-—-typography-colors" aria-label="Permalink to &quot;🟡 BAGIAN III — Typography &amp; Colors&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Menguasai sistem warna Tailwind, menggunakannya secara konsisten, dan membangun hierarki tipografi yang profesional.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>7</td><td><a href="/bagian-3/bab-7">Sistem Warna Tailwind</a></td><td>✅ Tersedia</td></tr><tr><td>8</td><td><a href="/bagian-3/bab-8">Shadow, Effects &amp; Transitions</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 7</td><td>30–45 menit</td></tr><tr><td>Bab 8</td><td>30–45 menit</td></tr><tr><td><strong>Total Bagian III</strong></td><td><strong>± 1–1.5 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Visual Design</p><p>Bagian ini fokus ke <strong>visual design</strong> — warna, shadow, animasi. Skill ini membedakan website &quot;terlihat profesional&quot; vs &quot;terlihat amatir&quot;. Luangkan waktu untuk eksperimen.</p></div></div>`);
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
