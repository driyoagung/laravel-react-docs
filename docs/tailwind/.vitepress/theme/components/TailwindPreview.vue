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
      <div class="tailwind-preview-content" v-html="code"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  code: {
    type: String,
    required: true,
  },
})
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
  isolation: isolate;
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
  font-family: "Inter", system-ui, sans-serif;
}
.dark .tailwind-preview-label {
  background-color: #1f2937;
  border-color: #374151;
  color: #9ca3af;
}

.tailwind-preview-content {
  padding: 1.5rem;
  min-height: 60px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #fafafa;
  color: #111827;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  position: relative;
  /* Reset parent styles - critical untuk Tailwind utilities bisa override VitePress */
  isolation: isolate;
}
.dark .tailwind-preview-content {
  background-color: #0f172a;
  color: #e5e7eb;
}

/* Apply Tailwind-like reset untuk children di preview */
.tailwind-preview-content :deep(*) {
  font-family: inherit;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  border: 0 solid #e5e7eb;
}

.tailwind-preview-content :deep(button) {
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  cursor: pointer;
  background-color: transparent;
  background-image: none;
  -webkit-appearance: button;
}

.tailwind-preview-content :deep(p) {
  margin: 0;
  line-height: 1.5;
}

.tailwind-preview-content :deep(h1),
.tailwind-preview-content :deep(h2),
.tailwind-preview-content :deep(h3),
.tailwind-preview-content :deep(h4) {
  margin: 0;
  font-weight: 600;
}

.tailwind-preview-content :deep(code) {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.875em;
}

.tailwind-preview-content :deep(ul),
.tailwind-preview-content :deep(ol) {
  margin: 0;
  padding-left: 1.5rem;
}

.tailwind-preview-content :deep(input) {
  font-family: inherit;
  font-size: inherit;
}
</style>
