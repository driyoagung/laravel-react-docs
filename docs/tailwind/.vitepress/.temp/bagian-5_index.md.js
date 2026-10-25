import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian V — Responsive & Dark Mode","description":"","frontmatter":{"title":"Bagian V — Responsive & Dark Mode"},"headers":[],"relativePath":"bagian-5/index.md","filePath":"bagian-5/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-5/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🔴-bagian-v-—-responsive-dark-mode" tabindex="-1">🔴 BAGIAN V — Responsive &amp; Dark Mode <a class="header-anchor" href="#🔴-bagian-v-—-responsive-dark-mode" aria-label="Permalink to &quot;🔴 BAGIAN V — Responsive &amp; Dark Mode&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Membangun tampilan yang sempurna di semua ukuran layar dan mengimplementasikan dark mode dengan Tailwind.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>12</td><td><a href="/bagian-5/bab-12">Responsive Design</a></td><td>✅ Tersedia</td></tr><tr><td>13</td><td><a href="/bagian-5/bab-13">Dark Mode</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 12</td><td>45–60 menit</td></tr><tr><td>Bab 13</td><td>30–45 menit</td></tr><tr><td><strong>Total Bagian V</strong></td><td><strong>± 1.5–2 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Modern Web Standard</p><p>Responsive + Dark Mode adalah <strong>fitur wajib</strong> aplikasi web modern di 2026. Pelajari baik-baik — ini sangat marketable di CV.</p></div></div>`);
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
