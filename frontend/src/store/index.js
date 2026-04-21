// ─────────────────────────────────────────────────────────────
//  REDUX STORE  —  combines all slices into one store
// ─────────────────────────────────────────────────────────────
import { configureStore } from '@reduxjs/toolkit'
import authReducer     from './slices/authSlice'
import bookingReducer  from './slices/bookingSlice'
import providerReducer from './slices/providerSlice'
import themeReducer    from './slices/themeSlice'

const store = configureStore({
  reducer: {
    auth:      authReducer,
    bookings:  bookingReducer,
    providers: providerReducer,
    theme:     themeReducer,
  },
})

export default store
