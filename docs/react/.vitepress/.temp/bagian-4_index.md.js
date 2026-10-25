import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian IV — State Management","description":"","frontmatter":{"title":"Bagian IV — State Management"},"headers":[],"relativePath":"bagian-4/index.md","filePath":"bagian-4/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-4/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🟠-bagian-iv-—-state-management" tabindex="-1">🟠 BAGIAN IV — State Management <a class="header-anchor" href="#🟠-bagian-iv-—-state-management" aria-label="Permalink to &quot;🟠 BAGIAN IV — State Management&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Menguasai dua pilar state management React — Redux Toolkit untuk global state dan TanStack Query untuk server state. Keduanya bekerja bersama, bukan bersaing.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>13</td><td><a href="/bagian-4/bab-13">Redux Toolkit — Global State</a></td><td>✅ Tersedia</td></tr><tr><td>14</td><td><a href="/bagian-4/bab-14">Cart &amp; Wishlist Slice</a></td><td>✅ Tersedia</td></tr><tr><td>15</td><td><a href="/bagian-4/bab-15">RTK Query — Data Fetching</a></td><td>✅ Tersedia</td></tr><tr><td>16</td><td><a href="/bagian-4/bab-16">Zustand — Alternatif Redux</a></td><td>✅ Tersedia</td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Data Fetching Modern</p><p>Untuk server state (data dari API), <strong>TanStack Query</strong> (Bab 19) lebih direkomendasikan daripada RTK Query. Tapi RTK Query dibahas di sini karena textbook menggunakan Redux.</p></div></div>`);
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
