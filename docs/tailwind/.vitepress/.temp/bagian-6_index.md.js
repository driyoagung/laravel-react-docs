import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian VI — Kustomisasi & Design System","description":"","frontmatter":{"title":"Bagian VI — Kustomisasi & Design System"},"headers":[],"relativePath":"bagian-6/index.md","filePath":"bagian-6/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-6/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟣-bagian-vi-—-kustomisasi-design-system" tabindex="-1">🟣 BAGIAN VI — Kustomisasi &amp; Design System <a class="header-anchor" href="#🟣-bagian-vi-—-kustomisasi-design-system" aria-label="Permalink to &quot;🟣 BAGIAN VI — Kustomisasi &amp; Design System&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Mengkonfigurasi Tailwind untuk membangun design system yang konsisten, scalable, dan sesuai identitas brand.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>14</td><td><a href="/bagian-6/bab-14">Konfigurasi tailwind.config.js</a></td><td>✅ Tersedia</td></tr><tr><td>15</td><td><a href="/bagian-6/bab-15">Arbitrary Values &amp; Direktif CSS</a></td><td>✅ Tersedia</td></tr><tr><td>16</td><td><a href="/bagian-6/bab-16">Plugin Tailwind &amp; Design Tokens</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 14</td><td>60–90 menit</td></tr><tr><td>Bab 15</td><td>30–45 menit</td></tr><tr><td>Bab 16</td><td>45–60 menit</td></tr><tr><td><strong>Total Bagian VI</strong></td><td><strong>± 2.5–3 jam</strong></td></tr></tbody></table><div class="warning custom-block"><p class="custom-block-title">⚠️ Penting untuk Project Nyata</p><p>Konfigurasi Tailwind adalah <strong>kunci</strong> membangun design system yang scalable. Tanpa ini, setiap developer akan pakai warna/spacing berbeda, dan konsistensi visual hilang.</p></div></div>`);
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
