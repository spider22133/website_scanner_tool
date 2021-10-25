import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
// import authReducer from './slices/auth.slice';
import messageReducer from './slices/message.slice';
import websiteReducer from './slices/websites.slice';

const reducer = {
  // auth: authReducer,
  websites: websiteReducer,
  message: messageReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
