// ─────────────────────────────────────────────────────────────
//  AUTH SLICE  —  manages everything related to login / logout
//  State shape: { user, role, token, loading, error }
// ─────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

// ── helpers ──────────────────────────────────────────────────
const saveToStorage = (token, user, role) => {
  localStorage.setItem('sm_token', token)
  localStorage.setItem('sm_user',  JSON.stringify(user))
  localStorage.setItem('sm_role',  role)
}

const clearStorage = () =>
  ['sm_token', 'sm_user', 'sm_role'].forEach(k => localStorage.removeItem(k))

const loadFromStorage = () => ({
  token: localStorage.getItem('sm_token') || null,
  user:  JSON.parse(localStorage.getItem('sm_user') || 'null'),
  role:  localStorage.getItem('sm_role')  || null,
})

// ── Async Thunks (API calls) ──────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/user/login', { email, password })
      saveToStorage(data.token, data.user, 'user')
      return { token: data.token, user: data.user, role: 'user' }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/user/register', form)
      saveToStorage(data.token, data.user, 'user')
      return { token: data.token, user: data.user, role: 'user' }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

export const loginProvider = createAsyncThunk(
  'auth/loginProvider',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/provider/login', { email, password })
      saveToStorage(data.token, data.provider, 'provider')
      return { token: data.token, user: data.provider, role: 'provider' }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const registerProvider = createAsyncThunk(
  'auth/registerProvider',
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/provider/register', form)
      saveToStorage(data.token, data.provider, 'provider')
      return { token: data.token, user: data.provider, role: 'provider' }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────
const stored = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    stored.user,
    role:    stored.role,
    token:   stored.token,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      clearStorage()
      state.user  = null
      state.role  = null
      state.token = null
      state.error = null
    },
    updateAvatar(state, action) {
      if (state.user) {
        state.user.avatar = action.payload
        localStorage.setItem('sm_user', JSON.stringify(state.user))
      }
    },
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }
    const fulfilled = (state, action) => {
      state.loading = false
      state.user    = action.payload.user
      state.role    = action.payload.role
      state.token   = action.payload.token
      state.error   = null
    }

    ;[loginUser, registerUser, loginProvider, registerProvider].forEach(thunk => {
      builder
        .addCase(thunk.pending,   pending)
        .addCase(thunk.fulfilled, fulfilled)
        .addCase(thunk.rejected,  rejected)
    })
  },
})

export const { logout, updateAvatar, clearError } = authSlice.actions

// ── Selectors ─────────────────────────────────────────────────
export const selectUser    = s => s.auth.user
export const selectRole    = s => s.auth.role
export const selectToken   = s => s.auth.token
export const selectLoading = s => s.auth.loading
export const selectError   = s => s.auth.error
export const selectIsAuth  = s => !!s.auth.token

export default authSlice.reducer
