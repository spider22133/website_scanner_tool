import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/auth.slice';
import messageReducer from './slices/message.slice';

const reducer = {
  // auth: authReducer,
  messageReducer,
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
