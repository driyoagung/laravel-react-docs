import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 3 — Rendering Strategies","description":"","frontmatter":{"title":"Bagian 3 — Rendering Strategies"},"headers":[],"relativePath":"bagian-3/index.md","filePath":"bagian-3/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-3/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-3-—-rendering-strategies" tabindex="-1">Bagian 3 — Rendering Strategies <a class="header-anchor" href="#bagian-3-—-rendering-strategies" aria-label="Permalink to &quot;Bagian 3 — Rendering Strategies&quot;">​</a></h1><p>Bagian ini mencakup Bab 7 sampai Bab 9.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>7</td><td><a href="/bagian-3/bab-7">Bab 7 — Server Components vs Client Components</a></td></tr><tr><td>8</td><td><a href="/bagian-3/bab-8">Bab 8 — SSR, SSG, ISR — Strategi Rendering</a></td></tr><tr><td>9</td><td><a href="/bagian-3/bab-9">Bab 9 — Metadata &amp; SEO</a></td></tr></tbody></table><p><a href="/bagian-4/index">Lanjut ke Bagian 4</a></p></div>`);
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
