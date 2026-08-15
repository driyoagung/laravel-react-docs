---
title: Bab 10 — Compound Components & Render Props
---

# 📖 Bab 10 — Compound Components & Render Props

## 10.1 🏗️ Compound Components

```jsx
// Pola Compound Component — komponen yang bekerja sama
// Seperti <select> dan <option> — tidak bisa dipisah

// Implementasi Modal yang fleksibel
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

Modal.Header = function ModalHeader({ children }) {
  return <div className="modal-header">{children}</div>
}

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>
}

Modal.Footer = function ModalFooter({ children }) {
  return <div className="modal-footer">{children}</div>
}

// Penggunaan — sangat fleksibel dan intuitif
<Modal isOpen={isOpen} onClose={closeModal}>
  <Modal.Header>
    <h2>Filter Pencarian</h2>
  </Modal.Header>
  <Modal.Body>
    <FilterForm />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={resetFilters}>Reset</Button>
    <Button variant="primary" onClick={applyFilters}>Terapkan</Button>
  </Modal.Footer>
</Modal>
```

**Penjelasan Compound Component:**

- **Sub-component via static property** — `Modal.Header`, `Modal.Body`, `Modal.Footer` adalah property dari `Modal`.
- **Shared parent** — Semua sub-component ter-mount dalam DOM tree yang sama.
- **API intuitive** — Tag `Modal.Header` jelas menunjukkan strukturnya.

## 10.2 🎨 Render Props Pattern

```jsx
// Render Props — komponen yang menerima fungsi sebagai prop
// Memungkinkan logic reuse dengan tampilan yang fleksibel

function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false)

  // children sebagai fungsi — komponen induk kontrol tampilan
  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative"
    >
      {children}
      {isVisible && (
        <div className="tooltip">
          {content}
        </div>
      )}
    </div>
  )
}

// Penggunaan
<Tooltip content="Klik untuk menyimpan ke wishlist">
  <button>♥ Simpan</button>
</Tooltip>
```

**Penjelasan Render Props:**

- **Function as prop** — `children` atau prop lain adalah function.
- **Logic reuse** — Komponen induk menyediakan logic, parent kontrol tampilan.

## 10.3 🔄 Compound Components dengan Context

```jsx
// Versi lebih powerful — Modal yang share state antar sub-component

const ModalContext = createContext(null)

function Modal({ children, isOpen, onClose }) {
  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      {isOpen && <div className="modal-overlay">{children}</div>}
    </ModalContext.Provider>
  )
}

Modal.Header = function ModalHeader({ children }) {
  const { onClose } = useContext(ModalContext)
  return (
    <div className="modal-header">
      {children}
      <button onClick={onClose}>×</button>
    </div>
  )
}

Modal.Body = function ModalBody({ children }) {
  return <div className="modal-body">{children}</div>
}

// Penggunaan
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>Judul</Modal.Header>
  <Modal.Body>Konten</Modal.Body>
</Modal>
```

**Penjelasan Context-backed Compound:**

- **Context** — Share state (`isOpen`, `onClose`) antar sub-component.
- **Self-contained** — Modal.Header tahu cara close dirinya sendiri.

## 📌 Ringkasan Bab 10

| Konsep                | Penjelasan Singkat                                              |
| --------------------- | --------------------------------------------------------------- |
| Compound Components    | Grup komponen yang bekerja bersama, share state via Context    |
| Render Props           | Prop yang berisi fungsi untuk render UI yang fleksibel        |
| Kapan pakai            | Library dengan API fleksibel (Modal, Dropdown, Card)           |
| Modern alternative     | Custom hooks lebih简洁 untuk kebanyakan kasus                 |

---

➡️ Lanjut ke [Bab 11 — Higher-Order Components & React.memo](/bagian-3/bab-11)
