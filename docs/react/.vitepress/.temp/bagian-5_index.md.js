import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Bagian V — Ekosistem React","description":"","frontmatter":{"title":"Bagian V — Ekosistem React"},"headers":[],"relativePath":"bagian-5/index.md","filePath":"bagian-5/index.md","lastUpdated":null}');
const _sfc_main = { name: "bagian-5/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="🔴-bagian-v-—-ekosistem-react" tabindex="-1">🔴 BAGIAN V — Ekosistem React <a class="header-anchor" href="#🔴-bagian-v-—-ekosistem-react" aria-label="Permalink to &quot;🔴 BAGIAN V — Ekosistem React&quot;">​</a></h1><blockquote><p>🎯 <strong>Tujuan Bagian Ini:</strong> Menguasai React Router untuk navigasi, TanStack Query untuk server state, dan Form handling yang benar — tiga pilar aplikasi React yang siap production.</p></blockquote><h2 id="📚-daftar-bab-di-bagian-ini" tabindex="-1">📚 Daftar Bab di Bagian Ini <a class="header-anchor" href="#📚-daftar-bab-di-bagian-ini" aria-label="Permalink to &quot;📚 Daftar Bab di Bagian Ini&quot;">​</a></h2><table tabindex="0"><thead><tr><th>Bab</th><th>Topik</th><th>Status</th></tr></thead><tbody><tr><td>17</td><td><a href="/bagian-5/bab-17">React Router v6</a></td><td>✅ Tersedia</td></tr><tr><td>18</td><td><a href="/bagian-5/bab-18">React Router Lanjutan</a></td><td>✅ Tersedia</td></tr><tr><td>19</td><td><a href="/bagian-5/bab-19">TanStack Query — Server State</a></td><td>✅ Tersedia</td></tr><tr><td>20</td><td><a href="/bagian-5/bab-20">Form Handling — React Hook Form</a></td><td>✅ Tersedia</td></tr><tr><td>21</td><td><a href="/bagian-5/bab-21">Axios &amp; API Layer</a></td><td>✅ Tersedia</td></tr></tbody></table><div class="tip custom-block"><p class="custom-block-title">💡 Kunci Aplikasi Production</p><p>Tiga pilar aplikasi React modern:</p><ol><li><strong>React Router</strong> untuk navigasi</li><li><strong>TanStack Query</strong> untuk server state &amp; caching</li><li><strong>React Hook Form + Zod</strong> untuk form handling</li></ol></div></div>`);
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
