import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian II — Hooks: Jantung React Modern","description":"","frontmatter":{"title":"Bagian II — Hooks: Jantung React Modern"},"headers":[],"relativePath":"bagian-2/index.md","filePath":"bagian-2/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-2/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🔵-bagian-ii-—-hooks-jantung-react-modern" tabindex="-1">🔵 BAGIAN II — Hooks: Jantung React Modern <a class="header-anchor" href="#🔵-bagian-ii-—-hooks-jantung-react-modern" aria-label="Permalink to &quot;🔵 BAGIAN II — Hooks: Jantung React Modern&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Menguasai semua built-in hooks React — dari yang paling dasar hingga yang paling sering membuat developer bingung. Hooks adalah cara React modern menggantikan class component sepenuhnya.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>5</td><td><a href="/bagian-2/bab-5">useState &amp; useEffect</a></td><td>✅ Tersedia</td></tr><tr><td>6</td><td><a href="/bagian-2/bab-6">useContext &amp; Context API</a></td><td>✅ Tersedia</td></tr><tr><td>7</td><td><a href="/bagian-2/bab-7">useReducer untuk State Kompleks</a></td><td>✅ Tersedia</td></tr><tr><td>8</td><td><a href="/bagian-2/bab-8">useCallback, useMemo &amp; useRef</a></td><td>✅ Tersedia</td></tr><tr><td>9</td><td><a href="/bagian-2/bab-9">Custom Hooks</a></td><td>✅ Tersedia</td></tr></tbody></table><h2 id="🗺️-peta-konsep-bagian-ii" tabindex="-1">🗺️ Peta Konsep Bagian II <a class="header-anchor" href="#🗺️-peta-konsep-bagian-ii" aria-label="Permalink to &quot;🗺️ Peta Konsep Bagian II&quot;">​</a></h2><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Bab 5 — useState &amp; useEffect    ⭐⭐⭐ (KRITIS)</span></span>
<span class="line"><span>   │  (Jantung React modern)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 6 — useContext</span></span>
<span class="line"><span>   │  (State lintas komponen)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 7 — useReducer</span></span>
<span class="line"><span>   │  (State kompleks)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 8 — useCallback, useMemo, useRef</span></span>
<span class="line"><span>   │  (Performa)</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Bab 9 — Custom Hooks</span></span>
<span class="line"><span>   ▼</span></span>
<span class="line"><span>Lanjut ke Bagian III → Pola Desain</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="⏱️-estimasi-waktu" tabindex="-1">⏱️ Estimasi Waktu <a class="header-anchor" href="#⏱️-estimasi-waktu" aria-label="Permalink to &quot;⏱️ Estimasi Waktu&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Estimasi</th></tr></thead><tbody><tr><td>Bab 5</td><td>60–90 menit</td></tr><tr><td>Bab 6</td><td>30–45 menit</td></tr><tr><td>Bab 7</td><td>30–45 menit</td></tr><tr><td>Bab 8</td><td>60–90 menit</td></tr><tr><td>Bab 9</td><td>45–60 menit</td></tr><tr><td><strong>Total Bagian II</strong></td><td><strong>± 4–5.5 jam</strong></td></tr></tbody></table><div class="warning custom-block"><p class="custom-block-title">⚠️ Penting</p><p><strong>Bab 5 (useState &amp; useEffect) dan Bab 8 (useCallback, useMemo, useRef) adalah bab PALING KRITIS</strong> di seluruh ebook React. Tanpa pemahaman yang kuat tentang hook ini, kode React Anda akan penuh bug dan performa yang buruk.</p></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-2/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
