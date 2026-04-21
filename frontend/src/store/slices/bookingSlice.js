// ─────────────────────────────────────────────────────────────
//  BOOKING SLICE  —  manages bookings for user and provider
//  State shape: { bookings, loading, error, activeTab }
// ─────────────────────────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

// ── Async Thunks ──────────────────────────────────────────────
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/bookings/my')
      return data.bookings
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch')
    }
  }
)

export const fetchProviderBookings = createAsyncThunk(
  'bookings/fetchProvider',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/bookings/provider')
      return data.bookings
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch')
    }
  }
)

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/bookings', bookingData)
      return data.booking
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Booking failed')
    }
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/bookings/${id}/cancel`)
      return data.booking
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Cancel failed')
    }
  }
)

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status, totalAmount }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/bookings/${id}/status`, { status, totalAmount })
      return data.booking
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed')
    }
  }
)

export const markPaymentDone = createAsyncThunk(
  'bookings/markPaid',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/bookings/${id}/payment`)
      return data.booking
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment update failed')
    }
  }
)

// ── Slice ─────────────────────────────────────────────────────
const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings:  [],
    loading:   false,
    error:     null,
    activeTab: 'all',
  },
  reducers: {
    setActiveTab(state, action) { state.activeTab = action.payload },
    clearBookingError(state)    { state.error = null },
  },
  extraReducers: builder => {
    const setLoading  = state => { state.loading = true;  state.error = null }
    const setError    = (state, action) => { state.loading = false; state.error = action.payload }

    // Fetch bookings
    builder
      .addCase(fetchUserBookings.pending,     setLoading)
      .addCase(fetchProviderBookings.pending, setLoading)
      .addCase(fetchUserBookings.fulfilled,   (state, action) => { state.loading = false; state.bookings = action.payload })
      .addCase(fetchProviderBookings.fulfilled,(state, action) => { state.loading = false; state.bookings = action.payload })
      .addCase(fetchUserBookings.rejected,    setError)
      .addCase(fetchProviderBookings.rejected,setError)

    // Update a single booking in the list after any mutation
    const updateOne = (state, action) => {
      state.loading = false
      if (!action.payload) return
      const idx = state.bookings.findIndex(b => b._id === action.payload._id)
      if (idx !== -1) state.bookings[idx] = action.payload
    }

    builder
      .addCase(cancelBooking.pending,        setLoading)
      .addCase(cancelBooking.fulfilled,      updateOne)
      .addCase(cancelBooking.rejected,       setError)
      .addCase(updateBookingStatus.pending,  setLoading)
      .addCase(updateBookingStatus.fulfilled,updateOne)
      .addCase(updateBookingStatus.rejected, setError)
      .addCase(markPaymentDone.pending,      setLoading)
      .addCase(markPaymentDone.fulfilled,    updateOne)
      .addCase(markPaymentDone.rejected,     setError)
  },
})

export const { setActiveTab, clearBookingError } = bookingSlice.actions

// ── Selectors ─────────────────────────────────────────────────
export const selectBookings  = s => s.bookings.bookings
export const selectBLoading  = s => s.bookings.loading
export const selectBError    = s => s.bookings.error
export const selectActiveTab = s => s.bookings.activeTab
export const selectFiltered  = tab => s =>
  tab === 'all' ? s.bookings.bookings : s.bookings.bookings.filter(b => b.status === tab)

export default bookingSlice.reducer
