<template>
  <div class="tailwind-preview-wrapper">
    <div class="tailwind-preview">
      <div class="tailwind-preview-label">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>Preview Hasil</span>
      </div>
      <iframe
        class="tailwind-preview-frame"
        :srcdoc="srcDoc"
        :style="{ height: height + 'px' }"
        title="Preview Hasil"
        loading="lazy"
        scrolling="no"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
})

const { isDark } = useData()
const height = ref(88)

// Preview dirender di dalam iframe dengan Tailwind Play CDN.
// Ini memberikan isolasi style total: utility Tailwind tidak bisa
// ditimpa style VitePress (.vp-doc p, h2, table, dst), semua utility
// termasuk arbitrary values didukung, dan inline onclick berfungsi.
const srcDoc = computed(() => {
  const darkClass = isDark.value ? ' class="dark"' : ''
  return `<!DOCTYPE html>
<html${darkClass}>
<head>
<meta charset="utf-8">
<script src="https://cdn.tailwindcss.com"><\/script>
<script>tailwind.config = { darkMode: 'class' }<\/script>
<style>
  html, body { margin: 0; padding: 0; }
  body {
    padding: 24px;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
    font-size: 16px;
    line-height: 1.5;
    background: #ffffff;
    color: #111827;
  }
  html.dark body { background: #0f172a; color: #e5e7eb; }
</style>
</head>
<body>
${props.code}
<script>
(function () {
  var post = function () {
    parent.postMessage(
      { type: 'tw-preview-height', height: Math.ceil(document.documentElement.getBoundingClientRect().height) },
      '*'
    )
  }
  window.addEventListener('load', function () {
    post()
    if (window.ResizeObserver) {
      new ResizeObserver(post).observe(document.documentElement)
    }
  })
  // Interaktivitas dasar untuk demo modal: klik tombol/overlay menutup modal.
  document.addEventListener('click', function (e) {
    var modal = e.target.closest('.fixed.inset-0')
    if (!modal) return
    var isButton = e.target.closest('button')
    var isOverlay = e.target === modal
    if (isButton || isOverlay) modal.style.display = 'none'
  })
})()
<\/script>
</body>
</html>`
})

function onMessage(e) {
  if (e.data && e.data.type === 'tw-preview-height') {
    height.value = Math.max(88, e.data.height)
  }
}

onMounted(() => window.addEventListener('message', onMessage))
onUnmounted(() => window.removeEventListener('message', onMessage))
</script>

<style scoped>
.tailwind-preview-wrapper {
  margin-top: -1rem;
  margin-bottom: 1.5rem;
}

.tailwind-preview {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}
.dark .tailwind-preview {
  border-color: #374151;
}

.tailwind-preview-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #4b5563;
}
.dark .tailwind-preview-label {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.tailwind-preview-frame {
  display: block;
  width: 100%;
  border: 0;
  background: #ffffff;
}
.dark .tailwind-preview-frame {
  background: #0f172a;
}
</style>
