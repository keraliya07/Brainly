# Assets Folder

This folder contains assets that are imported and processed by Vite.

## Usage

Files in this folder should be imported in your components.

### Example:
- Store SVG: `src/assets/logo.svg`
- Use in code: 
  ```tsx
  import logo from '@/assets/logo.svg'
  <img src={logo} />
  ```

## Recommended for:
- Component-specific images
- Icons used in React components
- Assets that need optimization/processing
- SVGs imported as React components (with vite-plugin-svgr)
