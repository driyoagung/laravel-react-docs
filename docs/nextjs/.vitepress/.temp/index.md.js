import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"","description":"","frontmatter":{"layout":"home","hero":{"name":"Ebook Next.js 14","text":"Dari React ke Blog CMS","tagline":"Pelajari App Router, Server Components, data, autentikasi, dan deployment melalui 21 bab dalam Bahasa Indonesia.","actions":[{"theme":"brand","text":"Mulai Bab 1","link":"/bagian-1/bab-1"},{"theme":"alt","text":"Lihat Daftar Bagian","link":"/bagian-1/index"},{"theme":"alt","text":"Buka Project Blog CMS","link":"/bagian-9/bab-21"}]}},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":null}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="tentang-ebook-ini" tabindex="-1">Tentang ebook ini <a class="header-anchor" href="#tentang-ebook-ini" aria-label="Permalink to &quot;Tentang ebook ini&quot;">​</a></h2><p>Materi ini ditujukan bagi pembaca yang sudah mengenal komponen, props, state, dan hooks di React. Contoh dan penjelasannya mengikuti Next.js 14 dengan App Router.</p><h2 id="daftar-bagian" tabindex="-1">Daftar bagian <a class="header-anchor" href="#daftar-bagian" aria-label="Permalink to &quot;Daftar bagian&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bagian</th><th>Materi</th><th>Bab</th></tr></thead><tbody><tr><td><a href="/bagian-1/index">1</a></td><td>Dari React ke Next.js</td><td>1–3</td></tr><tr><td><a href="/bagian-2/index">2</a></td><td>App Router: Routing &amp; Layout</td><td>4–6</td></tr><tr><td><a href="/bagian-3/index">3</a></td><td>Rendering Strategies</td><td>7–9</td></tr><tr><td><a href="/bagian-4/index">4</a></td><td>Data Fetching &amp; Database</td><td>10–12</td></tr><tr><td><a href="/bagian-5/index">5</a></td><td>API Routes &amp; Server Actions</td><td>13–15</td></tr><tr><td><a href="/bagian-6/index">6</a></td><td>Autentikasi &amp; Otorisasi</td><td>16–17</td></tr><tr><td><a href="/bagian-7/index">7</a></td><td>Optimasi &amp; Performa</td><td>18–19</td></tr><tr><td><a href="/bagian-8/index">8</a></td><td>Deployment &amp; CI/CD</td><td>20</td></tr><tr><td><a href="/bagian-9/index">9</a></td><td>Project Blog CMS Full Stack</td><td>21</td></tr></tbody></table><p>Mulai dari <a href="/bagian-1/bab-1">Bab 1: Mengenal Next.js</a>, atau pilih bagian yang sesuai kebutuhan Anda dari tabel di atas.</p></div>`);
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
