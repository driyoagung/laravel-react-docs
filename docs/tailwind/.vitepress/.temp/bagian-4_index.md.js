import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian IV — Komponen UI dengan Tailwind","description":"","frontmatter":{"title":"Bagian IV — Komponen UI dengan Tailwind"},"headers":[],"relativePath":"bagian-4/index.md","filePath":"bagian-4/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-4/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟠-bagian-iv-—-komponen-ui-dengan-tailwind" tabindex="-1">🟠 BAGIAN IV — Komponen UI dengan Tailwind <a class="header-anchor" href="#🟠-bagian-iv-—-komponen-ui-dengan-tailwind" aria-label="Permalink to &quot;🟠 BAGIAN IV — Komponen UI dengan Tailwind&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Membangun komponen UI yang sering dipakai — button, form, card, modal, navbar — menggunakan Tailwind secara profesional.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>9</td><td><a href="/bagian-4/bab-9">Komponen Button &amp; Form</a></td><td>✅ Tersedia</td></tr><tr><td>10</td><td><a href="/bagian-4/bab-10">Card, List &amp; Table</a></td><td>✅ Tersedia</td></tr><tr><td>11</td><td><a href="/bagian-4/bab-11">Modal, Alert, Badge &amp; Komponen Interaktif</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 9</td><td>60–90 menit</td></tr><tr><td>Bab 10</td><td>45–60 menit</td></tr><tr><td>Bab 11</td><td>60–90 menit</td></tr><tr><td><strong>Total Bagian IV</strong></td><td><strong>± 2.5–4 jam</strong></td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Pattern yang Bisa Dipakai Ulang</p><p>Setiap bab di Bagian IV berisi <strong>koleksi pattern</strong> yang bisa Anda copy-paste ke project nyata. Bookmark halaman ini sebagai referensi harian.</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-4/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
