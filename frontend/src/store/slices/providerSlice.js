// ─────────────────────────────────────────────────────────────
//  PROVIDER SLICE  —  manages provider listing and detail page
//  State shape: { providers, selected, total, loading, error }
// ─────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

export const fetchProviders = createAsyncThunk(
  'providers/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {}
      if (filters.search)   params.search   = filters.search
      if (filters.category) params.category = filters.category
      if (filters.city)     params.city     = filters.city
      if (filters.minRate)  params.minRate  = filters.minRate
      if (filters.maxRate)  params.maxRate  = filters.maxRate
      const { data } = await axios.get(`${BASE}/providers`, { params })
      return { providers: data.providers, total: data.total }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Fetch failed')
    }
  }
)

export const fetchProviderById = createAsyncThunk(
  'providers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE}/providers/${id}`)
      return data.provider
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Not found')
    }
  }
)

const providerSlice = createSlice({
  name: 'providers',
  initialState: {
    providers: [],
    selected:  null,
    total:     0,
    loading:   false,
    error:     null,
    filters: {
      search: '', category: '', city: '', minRate: '', maxRate: '',
    },
  },
  reducers: {
    setFilters(state, action)      { state.filters = { ...state.filters, ...action.payload } },
    resetFilters(state)            { state.filters = { search:'', category:'', city:'', minRate:'', maxRate:'' } },
    clearSelected(state)           { state.selected = null },
    clearProviderError(state)      { state.error = null },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProviders.pending,     state => { state.loading = true;  state.error = null })
      .addCase(fetchProviders.fulfilled,   (state, action) => {
        state.loading   = false
        state.providers = action.payload.providers
        state.total     = action.payload.total
      })
      .addCase(fetchProviders.rejected,    (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchProviderById.pending,  state => { state.loading = true;  state.error = null; state.selected = null })
      .addCase(fetchProviderById.fulfilled,(state, action) => { state.loading = false; state.selected = action.payload })
      .addCase(fetchProviderById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { setFilters, resetFilters, clearSelected, clearProviderError } = providerSlice.actions

// Selectors
export const selectProviders     = s => s.providers.providers
export const selectSelected      = s => s.providers.selected
export const selectTotal         = s => s.providers.total
export const selectPLoading      = s => s.providers.loading
export const selectPError        = s => s.providers.error
export const selectProvFilters   = s => s.providers.filters

export default providerSlice.reducer
