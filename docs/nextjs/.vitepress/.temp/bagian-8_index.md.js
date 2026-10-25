import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 8 — Deployment & CI/CD","description":"","frontmatter":{"title":"Bagian 8 — Deployment & CI/CD"},"headers":[],"relativePath":"bagian-8/index.md","filePath":"bagian-8/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-8/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-8-—-deployment-ci-cd" tabindex="-1">Bagian 8 — Deployment &amp; CI/CD <a class="header-anchor" href="#bagian-8-—-deployment-ci-cd" aria-label="Permalink to &quot;Bagian 8 — Deployment &amp; CI/CD&quot;">​</a></h1><p>Bagian ini mencakup Bab 20.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>20</td><td><a href="/bagian-8/bab-20">Bab 20 — Deploy ke Vercel &amp; Best Practices</a></td></tr></tbody></table><p><a href="/bagian-9/index">Lanjut ke Bagian 9</a></p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-8/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
