import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 4 — Data Fetching & Database","description":"","frontmatter":{"title":"Bagian 4 — Data Fetching & Database"},"headers":[],"relativePath":"bagian-4/index.md","filePath":"bagian-4/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-4/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-4-—-data-fetching-database" tabindex="-1">Bagian 4 — Data Fetching &amp; Database <a class="header-anchor" href="#bagian-4-—-data-fetching-database" aria-label="Permalink to &quot;Bagian 4 — Data Fetching &amp; Database&quot;">​</a></h1><p>Bagian ini mencakup Bab 10 sampai Bab 12.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>10</td><td><a href="/bagian-4/bab-10">Bab 10 — Data Fetching di Next.js</a></td></tr><tr><td>11</td><td><a href="/bagian-4/bab-11">Bab 11 — Prisma ORM — Database di Next.js</a></td></tr><tr><td>12</td><td><a href="/bagian-4/bab-12">Bab 12 — State Management di Next.js</a></td></tr></tbody></table><p><a href="/bagian-5/index">Lanjut ke Bagian 5</a></p></div>`);
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
