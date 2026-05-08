import { configureStore } from '@reduxjs/toolkit'
import authReducer         from './slices/authSlice'
import bookingReducer      from './slices/bookingSlice'
import providerReducer     from './slices/providerSlice'
import themeReducer        from './slices/themeSlice'
import subscriptionReducer from './slices/subscriptionSlice'

const store = configureStore({
  reducer: {
    auth:         authReducer,
    bookings:     bookingReducer,
    providers:    providerReducer,
    theme:        themeReducer,
    subscription: subscriptionReducer,
  },
})

export default store
