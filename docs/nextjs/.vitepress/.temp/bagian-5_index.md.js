import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 5 — API Routes & Server Actions","description":"","frontmatter":{"title":"Bagian 5 — API Routes & Server Actions"},"headers":[],"relativePath":"bagian-5/index.md","filePath":"bagian-5/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-5/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-5-—-api-routes-server-actions" tabindex="-1">Bagian 5 — API Routes &amp; Server Actions <a class="header-anchor" href="#bagian-5-—-api-routes-server-actions" aria-label="Permalink to &quot;Bagian 5 — API Routes &amp; Server Actions&quot;">​</a></h1><p>Bagian ini mencakup Bab 13 sampai Bab 15.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>13</td><td><a href="/bagian-5/bab-13">Bab 13 — API Routes (Route Handlers)</a></td></tr><tr><td>14</td><td><a href="/bagian-5/bab-14">Bab 14 — Server Actions — Cara Modern Mutasi Data</a></td></tr><tr><td>15</td><td><a href="/bagian-5/bab-15">Bab 15 — Middleware Next.js</a></td></tr></tbody></table><p><a href="/bagian-6/index">Lanjut ke Bagian 6</a></p></div>`);
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
