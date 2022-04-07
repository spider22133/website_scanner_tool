import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import messageReducer from './slices/message.slice';
import websiteReducer from './slices/websites.slice';
import websiteControlStepReducer from './slices/websites_control_steps.slice';
import statesReducer from './slices/states.slice';
import authReducer from './slices/auth.slice';

const reducer = {
  websites: websiteReducer,
  steps: websiteControlStepReducer,
  states: statesReducer,
  messages: messageReducer,
  auth: authReducer,
};

const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
