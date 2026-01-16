# Where to Store SVG Files

## Option 1: `public/` Folder (Recommended for Logo)

**Location:** `Frontend/public/logo.svg`

**Path in code:** `/logo.svg`

**Example usage:**
```tsx
<img src="/logo.svg" alt="Logo" />
```

**Pros:**
- Simple absolute path
- Good for logo that appears in multiple places
- No import needed

**Best for:** Logo, favicon, static assets

---

## Option 2: `src/assets/` Folder

**Location:** `Frontend/src/assets/logo.svg`

**Path in code:** Import it

**Example usage:**
```tsx
import logo from '@/assets/logo.svg'
<img src={logo} alt="Logo" />
```

**Pros:**
- Processed by Vite (optimization)
- Type-safe imports
- Can use as React component with plugins

**Best for:** Component-specific icons, images used in components

---

## Recommended Structure:

```
Frontend/
├── public/
│   └── logo.svg          ← Main logo (use this)
│   └── favicon.ico
│
└── src/
    └── assets/
        └── icons/        ← Component icons
        └── images/       ← Component images
```

## For Your Logo:

**Store in:** `Frontend/public/logo.svg`

**Use in components:**
```tsx
<img src="/logo.svg" alt="Second Brain" className="w-8 h-8" />
```
