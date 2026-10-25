import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian 2 — Core Concepts Vue 3","description":"","frontmatter":{"title":"Bagian 2 — Core Concepts Vue 3"},"headers":[],"relativePath":"bagian-2/index.md","filePath":"bagian-2/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-2/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="bagian-2-—-core-concepts-vue-3" tabindex="-1">Bagian 2 — Core Concepts Vue 3 <a class="header-anchor" href="#bagian-2-—-core-concepts-vue-3" aria-label="Permalink to &quot;Bagian 2 — Core Concepts Vue 3&quot;">​</a></h1><p>Pelajari reaktivitas, computed, komunikasi antarkomponen, slots, dan lifecycle hooks.</p><table tabindex="0"><thead><tr><th>Bab</th><th>Materi</th></tr></thead><tbody><tr><td>5</td><td><a href="/bagian-2/bab-5">Reaktivitas Vue</a></td></tr><tr><td>6</td><td><a href="/bagian-2/bab-6">Computed Properties &amp; Watchers</a></td></tr><tr><td>7</td><td><a href="/bagian-2/bab-7">Props &amp; Emits</a></td></tr><tr><td>8</td><td><a href="/bagian-2/bab-8">Slots</a></td></tr><tr><td>9</td><td><a href="/bagian-2/bab-9">Lifecycle Hooks</a></td></tr></tbody></table><p><a href="/bagian-3/index">Lanjut ke Bagian 3</a></p></div>`);
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
