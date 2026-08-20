import DefaultTheme from 'vitepress/theme'
import './style.css'
import TailwindPreview from './components/TailwindPreview.vue'

/**
 * Global handler untuk interaktivitas di dalam preview Tailwind.
 *
 * Plugin preview menggunakan `v-html` untuk render HTML, yang berarti
 * JavaScript `onclick` di dalam code example TIDAK jalan (konten
 * dirender sebagai static HTML). Untuk membuat demo interaktif
 * (seperti modal) tetap bisa ditutup, kita pakai event delegation
 * di level document.
 *
 * Behavior:
 * - Klik tombol close (✕) di modal → sembunyikan modal
 * - Klik overlay/backdrop di luar modal content → sembunyikan modal
 * - Klik tombol Batal/Ya di footer modal → sembunyikan modal
 * - Tombol "Buka Modal Lagi" muncul untuk menampilkan lagi
 */
function setupPreviewInteractivity() {
  if (typeof window === 'undefined') return

  function openModal(modal) {
    modal.style.display = ''
    modal.classList.remove('tw-preview-hidden')
  }

  function closeModal(modal) {
    modal.style.display = 'none'
    modal.classList.add('tw-preview-hidden')
  }

  function ensureReopenButton(modal) {
    if (document.querySelector('.tw-reopen-btn')) return

    const btn = document.createElement('button')
    btn.className =
      'tw-reopen-btn fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2 z-[60]'
    btn.innerHTML = '<span>🔄</span><span>Buka Modal Lagi</span>'
    btn.type = 'button'
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation()
      openModal(modal)
      btn.remove()
    })
    document.body.appendChild(btn)
  }

  // Event delegation: listen click di seluruh document
  // Pakai 'click' di document, bukan di preview — agar bisa handle
  // modal yang ditambahkan setelah hydration.
  document.addEventListener('click', (e) => {
    // Cari modal yang ada di preview
    // Modal di-render di dalam .tailwind-preview-content
    const modal = e.target.closest('.tailwind-preview .fixed.inset-0.z-50')
    if (!modal) return

    // Jangan proses jika modal sedang hidden
    if (modal.classList.contains('tw-preview-hidden')) return

    // Cek kondisi close:
    // 1. Klik tombol apa saja DI DALAM modal
    //    (biasanya hanya ada tombol close + footer buttons)
    const clickedButton = e.target.closest('button')
    // 2. Klik overlay (yaitu target adalah modal itu sendiri,
    //    BUKAN inner content)
    const isOverlayClick = e.target === modal

    if (clickedButton || isOverlayClick) {
      e.preventDefault()
      e.stopPropagation()
      closeModal(modal)
      ensureReopenButton(modal)
    }
  })

  // Watch for new modals yang di-render setelah navigasi SPA
  const observer = new MutationObserver(() => {
    // Observer hanya trigger check, tidak perlu action.
    // Handler event delegation di atas akan catch clicks di modal baru.
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TailwindPreview', TailwindPreview)

    // Setup interactivity setelah route berubah
    if (typeof window !== 'undefined') {
      // Jalan setelah hydration selesai
      if (document.readyState === 'complete') {
        setupPreviewInteractivity()
      } else {
        window.addEventListener('load', setupPreviewInteractivity)
      }
    }
  },
}
