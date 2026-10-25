import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"Ebook Vue.js","text":"Dari Dasar ke Clone Netflix","tagline":"Pelajari Vue 3, Composition API, Vue Router, Pinia, dan integrasi API melalui 24 bab dalam Bahasa Indonesia.","actions":[{"theme":"brand","text":"Mulai Bab 1","link":"/bagian-1/bab-1"},{"theme":"alt","text":"Lihat Daftar Bagian","link":"/bagian-1/index"},{"theme":"alt","text":"Buka Project Akhir","link":"/bagian-7/bab-24"}]}},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":null}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="tentang-ebook-ini" tabindex="-1">Tentang ebook ini <a class="header-anchor" href="#tentang-ebook-ini" aria-label="Permalink to &quot;Tentang ebook ini&quot;">​</a></h2><p>Materi dimulai dari konsep dasar Vue 3, lalu berlanjut ke komponen, reaktivitas, Composition API, Vue Router, Pinia, dan project Clone Netflix dengan TMDB API.</p><h2 id="daftar-bagian" tabindex="-1">Daftar bagian <a class="header-anchor" href="#daftar-bagian" aria-label="Permalink to &quot;Daftar bagian&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bagian</th><th>Materi</th><th>Bab</th></tr></thead><tbody><tr><td><a href="/bagian-1/index">1</a></td><td>Fondasi Vue.js</td><td>1–4</td></tr><tr><td><a href="/bagian-2/index">2</a></td><td>Core Concepts Vue 3</td><td>5–9</td></tr><tr><td><a href="/bagian-3/index">3</a></td><td>Options API</td><td>10–12</td></tr><tr><td><a href="/bagian-4/index">4</a></td><td>Composition API</td><td>13–16</td></tr><tr><td><a href="/bagian-5/index">5</a></td><td>Ekosistem Vue</td><td>17–21</td></tr><tr><td><a href="/bagian-6/index">6</a></td><td>Level Up</td><td>22–23</td></tr><tr><td><a href="/bagian-7/index">7</a></td><td>Project Clone Netflix</td><td>24</td></tr></tbody></table><p>Mulai dari <a href="/bagian-1/bab-1">Bab 1: Mengenal Vue.js</a>, atau pilih bagian yang sesuai kebutuhan Anda.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
