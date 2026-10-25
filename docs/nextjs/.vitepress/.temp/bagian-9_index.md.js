import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 9 — Project Blog CMS Full Stack","description":"","frontmatter":{"title":"Bagian 9 — Project Blog CMS Full Stack"},"headers":[],"relativePath":"bagian-9/index.md","filePath":"bagian-9/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-9/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-9-—-project-blog-cms-full-stack" tabindex="-1">Bagian 9 — Project Blog CMS Full Stack <a class="header-anchor" href="#bagian-9-—-project-blog-cms-full-stack" aria-label="Permalink to &quot;Bagian 9 — Project Blog CMS Full Stack&quot;">​</a></h1><p>Bagian ini mencakup Bab 21.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>21</td><td><a href="/bagian-9/bab-21">Bab 21 — Project: Blog CMS dengan Next.js 14</a></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-9/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
