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
        // Add a unique ID if not provided
        const newMessage = {
          ...payload,
          id: payload.id || Date.now().toString(), // Ensure each message has a unique ID
        }
        state.push(newMessage)
      } else {
        state[index] = { ...state[index], ...payload }
      }
    },
    clearMessage: (state, { payload }: PayloadAction<string>) => {
      const index = state.findIndex(item => item.id === payload)
      if (index !== -1) state.splice(index, 1)
    },
    clearAllMessages: state => {
      return [] // Reset state to empty array
    },
  },
})

const { reducer, actions } = messageSlice

export const { setMessage, clearMessage } = actions
export default reducer
