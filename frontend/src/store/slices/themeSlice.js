// ─────────────────────────────────────────────────────────────
//  THEME SLICE  —  dark / light mode
// ─────────────────────────────────────────────────────────────
import { createSlice } from '@reduxjs/toolkit'

const saved = localStorage.getItem('sm_theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initial = saved || (prefersDark ? 'dark' : 'light')

// Apply immediately so there's no flash on load
if (initial === 'dark') document.documentElement.classList.add('dark')
else                    document.documentElement.classList.remove('dark')

const themeSlice = createSlice({
  name: 'theme',
  initialState: { mode: initial },
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light'
      if (state.mode === 'dark') document.documentElement.classList.add('dark')
      else                       document.documentElement.classList.remove('dark')
      localStorage.setItem('sm_theme', state.mode)
    },
    setTheme(state, action) {
      state.mode = action.payload
      if (state.mode === 'dark') document.documentElement.classList.add('dark')
      else                       document.documentElement.classList.remove('dark')
      localStorage.setItem('sm_theme', state.mode)
    },
  },
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const selectTheme  = s => s.theme.mode
export const selectIsDark = s => s.theme.mode === 'dark'
export default themeSlice.reducer
