/**
 * Tailwind Preview Plugin untuk VitePress
 *
 * Plugin ini OTOMATIS menambahkan visual preview di bawah setiap
 * code block HTML — tanpa perlu menulis HTML dua kali.
 *
 * Cara pakai: Tulis code block biasa dengan language `html`
 * (atau bahasa apapun, default = html). Plugin akan otomatis
 * mendeteksi dan menambahkan preview di bawahnya.
 *
 *   ```html
 *   <button class="bg-blue-500 text-white px-4 py-2 rounded">Klik</button>
 *   ```
 *
 *   ↓ Plugin otomatis tambahkan preview:
 *
 *   <TailwindPreview>
 *     <button class="bg-blue-500 text-white px-4 py-2 rounded">Klik</button>
 *   </TailwindPreview>
 *
 * Untuk SKIP preview pada code block tertentu, gunakan:
 *   ```html no-preview
 *   <button>...</button>
 *   ```
 */

const PREVIEW_SKIP_TOKEN = 'no-preview'
const PREVIEW_DEFAULT_LANG = 'html'

export default function tailwindPreviewPlugin(md) {
  const defaultFence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const lang = (token.info || '').trim().split(/\s+/)[0]
    const langParams = (token.info || '').trim().split(/\s+/).slice(1).join(' ')

    // Skip jika explicitly di-mark no-preview
    if (langParams.includes(PREVIEW_SKIP_TOKEN)) {
      return defaultFence
        ? defaultFence(tokens, idx, options, env, slf)
        : slf.renderToken(tokens, idx, options)
    }

    // Hanya tambahkan preview untuk block dengan bahasa HTML / XML
    // (atau block tanpa info — anggap html default)
    const isHtmlLike =
      !lang ||
      ['html', 'xml', 'svg', 'vue', 'jsx', 'tsx'].includes(lang)

    if (!isHtmlLike) {
      return defaultFence
        ? defaultFence(tokens, idx, options, env, slf)
        : slf.renderToken(tokens, idx, options)
    }

    // Render code block seperti biasa
    const codeHtml = defaultFence
      ? defaultFence(tokens, idx, options, env, slf)
      : slf.renderToken(tokens, idx, options)

    // Decode HTML entities di token.content untuk preview
    const rawCode = token.content

    // Skip preview jika code kosong
    if (!rawCode.trim()) {
      return codeHtml
    }

    // Bungkus code + preview dalam container
    // Preview menggunakan v-html di komponen Vue untuk render HTML
    const previewId = `tw-preview-${idx}-${Math.random().toString(36).slice(2, 8)}`

    // Escape untuk attribute value di HTML element
    // Ganti " dengan &quot; dan < dengan &lt; agar tidak bentrok dengan parsing
    const escapedCode = rawCode
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Tag <br>, <input>, <img>, <hr> adalah self-closing
      // Tidak perlu di-escape karena akan di-render via v-html

    return `
      ${codeHtml}
      <TailwindPreview code="${escapedCode}" />
    `
  }
}
