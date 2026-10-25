import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 7 — Project Clone Netflix","description":"","frontmatter":{"title":"Bagian 7 — Project Clone Netflix"},"headers":[],"relativePath":"bagian-7/index.md","filePath":"bagian-7/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-7/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-7-—-project-clone-netflix" tabindex="-1">Bagian 7 — Project Clone Netflix <a class="header-anchor" href="#bagian-7-—-project-clone-netflix" aria-label="Permalink to &quot;Bagian 7 — Project Clone Netflix&quot;">​</a></h1><p>Gabungkan Vue Router, Pinia, composables, dan TMDB API dalam project akhir.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>24</td><td><a href="/bagian-7/bab-24">Project Clone Netflix dengan TMDB API</a></td></tr></tbody></table></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("bagian-7/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
