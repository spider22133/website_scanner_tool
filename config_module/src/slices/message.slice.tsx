import { createSlice } from '@reduxjs/toolkit';

export interface iniState {
  id: string;
  message: string;
}

const initialState: iniState[] = [];

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, { payload }) => {
      const index = state.findIndex(item => item.id === payload.id);
      if (index === -1) state.push(payload);
      else
        state[index] = {
          ...state[index],
          ...payload,
        };
    },
    clearMessage: (state, { payload }) => {
      const newList: iniState[] = state.filter(item => item.id !== payload);
      return [...newList];
    },
  },
});

const { reducer, actions } = messageSlice;

export const { setMessage, clearMessage } = actions;
export default reducer;
