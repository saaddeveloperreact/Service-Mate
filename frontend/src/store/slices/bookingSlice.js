import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

export const fetchUserBookings     = createAsyncThunk('bookings/fetchUser',     async (_, { rejectWithValue }) => { try { const { data } = await API.get('/bookings/my');       return data.bookings } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const fetchProviderBookings = createAsyncThunk('bookings/fetchProvider', async (_, { rejectWithValue }) => { try { const { data } = await API.get('/bookings/provider'); return data.bookings } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const createBooking         = createAsyncThunk('bookings/create',        async (d,  { rejectWithValue }) => { try { const { data } = await API.post('/bookings', d);    return data.booking  } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const cancelBooking         = createAsyncThunk('bookings/cancel',        async (id, { rejectWithValue }) => { try { const { data } = await API.put(`/bookings/${id}/cancel`);   return data.booking } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const updateBookingStatus   = createAsyncThunk('bookings/updateStatus',  async ({ id, status, totalAmount, hoursWorked }, { rejectWithValue }) => { try { const { data } = await API.put(`/bookings/${id}/status`, { status, totalAmount, hoursWorked }); return data.booking } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const markPaymentDone       = createAsyncThunk('bookings/markPaid',      async (id, { rejectWithValue }) => { try { const { data } = await API.put(`/bookings/${id}/payment`); return data.booking } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const addOrUpdateReview     = createAsyncThunk('bookings/review',        async ({ id, rating, comment }, { rejectWithValue }) => { try { const { data } = await API.post(`/bookings/${id}/review`, { rating, comment }); return data.booking } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const deleteReview          = createAsyncThunk('bookings/deleteReview',  async (id, { rejectWithValue }) => { try { const { data } = await API.delete(`/bookings/${id}/review`); return data.booking } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const deleteBooking         = createAsyncThunk('bookings/delete',        async (id, { rejectWithValue }) => { try { await API.delete(`/bookings/${id}`); return id } catch (e) { return rejectWithValue(e.response?.data?.message) } })
export const deleteAllHistory      = createAsyncThunk('bookings/deleteAll',     async (_, { rejectWithValue }) => { try { await API.delete('/bookings/history/all'); return true } catch (e) { return rejectWithValue(e.response?.data?.message) } })

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { bookings: [], loading: false, error: null, activeTab: 'all' },
  reducers: {
    setActiveTab(state, action) { state.activeTab = action.payload },
    clearBookingError(state)    { state.error = null },
  },
  extraReducers: builder => {
    const setLoading = state => { state.loading = true;  state.error = null }
    const setError   = (state, action) => { state.loading = false; state.error = action.payload }
    const updateOne  = (state, action) => {
      state.loading = false
      if (!action.payload) return
      const idx = state.bookings.findIndex(b => b._id === action.payload._id)
      if (idx !== -1) state.bookings[idx] = action.payload
    }
    builder
      .addCase(fetchUserBookings.pending,     setLoading)
      .addCase(fetchProviderBookings.pending, setLoading)
      .addCase(fetchUserBookings.fulfilled,   (s,a) => { s.loading = false; s.bookings = a.payload })
      .addCase(fetchProviderBookings.fulfilled,(s,a) => { s.loading = false; s.bookings = a.payload })
      .addCase(fetchUserBookings.rejected,    setError)
      .addCase(fetchProviderBookings.rejected,setError)
      .addCase(cancelBooking.pending,         setLoading).addCase(cancelBooking.fulfilled,       updateOne).addCase(cancelBooking.rejected,       setError)
      .addCase(updateBookingStatus.pending,   setLoading).addCase(updateBookingStatus.fulfilled, updateOne).addCase(updateBookingStatus.rejected,  setError)
      .addCase(markPaymentDone.pending,       setLoading).addCase(markPaymentDone.fulfilled,     updateOne).addCase(markPaymentDone.rejected,      setError)
      .addCase(addOrUpdateReview.pending,     setLoading).addCase(addOrUpdateReview.fulfilled,   updateOne).addCase(addOrUpdateReview.rejected,    setError)
      .addCase(deleteReview.pending,          setLoading).addCase(deleteReview.fulfilled,        updateOne).addCase(deleteReview.rejected,         setError)
      .addCase(deleteBooking.pending,         setLoading)
      .addCase(deleteBooking.fulfilled,       (s,a) => { s.loading = false; s.bookings = s.bookings.filter(b => b._id !== a.payload) })
      .addCase(deleteBooking.rejected,        setError)
      .addCase(deleteAllHistory.pending,      setLoading)
      .addCase(deleteAllHistory.fulfilled,    (s) => { s.loading = false; s.bookings = s.bookings.filter(b => !['completed','cancelled','rejected'].includes(b.status)) })
      .addCase(deleteAllHistory.rejected,     setError)
  },
})

export const { setActiveTab, clearBookingError } = bookingSlice.actions
export const selectBookings  = s => s.bookings.bookings
export const selectBLoading  = s => s.bookings.loading
export const selectBError    = s => s.bookings.error
export const selectActiveTab = s => s.bookings.activeTab
export default bookingSlice.reducer
