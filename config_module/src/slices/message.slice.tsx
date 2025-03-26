import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Corrected interface name
export interface MessageState {
  id?: string
  message: string
  variant?: 'error' | 'info' | 'success' | 'warning' // Removed generic string
}

// Initial state is an array of messages
const initialState: MessageState[] = []

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessage: (state, { payload }: PayloadAction<MessageState>) => {
      const index = state.findIndex(item => item.id === payload.id)
      if (index === -1) {
        state.push(payload)
      } else {
        state[index] = { ...state[index], ...payload }
      }
    },
    clearMessage: (state, { payload }: PayloadAction<string>) => {
      const index = state.findIndex(item => item.id === payload)
      if (index !== -1) state.splice(index, 1) // Mutate state directly
    },
  },
})

const { reducer, actions } = messageSlice

export const { setMessage, clearMessage } = actions
export default reducer
