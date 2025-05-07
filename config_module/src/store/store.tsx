import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import messageReducer from './slices/message.slice'
import websiteReducer from './slices/software.slice'
import authReducer from './slices/auth.slice'
import userReducer from './slices/user.slice'
import issuesSlice from './slices/issues.slice'

const reducer = {
  software: websiteReducer,
  messages: messageReducer,
  auth: authReducer,
  users: userReducer,
  issues: issuesSlice,
}

const store = configureStore({
  reducer: reducer,
  devTools: true,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
