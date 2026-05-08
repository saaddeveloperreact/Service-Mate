import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../services/api'

export const fetchSubscription = createAsyncThunk(
  'subscription/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/subscription/status')
      return data
    } catch (e) { return rejectWithValue(e.response?.data?.message) }
  }
)

export const createOrder = createAsyncThunk(
  'subscription/createOrder',
  async (plan, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/subscription/create-order', { plan })
      return data
    } catch (e) { return rejectWithValue(e.response?.data?.message) }
  }
)

export const verifyPayment = createAsyncThunk(
  'subscription/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/subscription/verify-payment', paymentData)
      return data
    } catch (e) { return rejectWithValue(e.response?.data?.message) }
  }
)

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: { subscription: null, latest: null, loading: false, error: null },
  reducers: { clearSubError(state) { state.error = null } },
  extraReducers: builder => {
    builder
      .addCase(fetchSubscription.pending,  s => { s.loading = true })
      .addCase(fetchSubscription.fulfilled,(s,a) => { s.loading = false; s.subscription = a.payload.subscription; s.latest = a.payload.latest })
      .addCase(fetchSubscription.rejected, (s,a) => { s.loading = false; s.error = a.payload })
      .addCase(verifyPayment.pending,   s => { s.loading = true })
      .addCase(verifyPayment.fulfilled, (s,a) => { s.loading = false; s.subscription = a.payload.subscription?.subscription })
      .addCase(verifyPayment.rejected,  (s,a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearSubError } = subscriptionSlice.actions
export const selectSubscription = s => s.subscription.subscription
export const selectSubLoading   = s => s.subscription.loading
export default subscriptionSlice.reducer
