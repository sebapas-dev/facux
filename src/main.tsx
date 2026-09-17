import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/dynapuff/400.css'
import '@fontsource/dynapuff/600.css'
import '@fontsource/dynapuff/700.css'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import './index.css'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
