import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { normalize } from 'normalizr';
import httpErrors from '../interfaces/api.error.interface';
import IState from '../interfaces/website-state.interface';
import { stateEntity } from '../schemas/state.normalizr';
import StatesDataService from '../services/states.service';
import { RootState } from '../store';
import { setMessage } from './message.slice';

export const getStatesByWebsiteId = createAsyncThunk<
  { states: { [key: string]: IState } },
  string,
  {
    rejectValue: httpErrors;
  }
>('states/getStatesByWebsiteId', async (id, { rejectWithValue, dispatch }) => {
  try {
    const res = await StatesDataService.getStatesByWebsiteId(id);
    const normalized = normalize<
      any,
      {
        states: { [key: string]: IState };
      }
    >(res.data.data, [stateEntity]);

    return normalized.entities;
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }
    dispatch(setMessage(error.response.data.message));
    return rejectWithValue(error.response.data);
  }
});

export const statesAdapter = createEntityAdapter<IState>({
  selectId: state => state.id,
});

const stateSlice = createSlice({
  name: 'states',
  initialState: statesAdapter.getInitialState({
    loading: false,
  }),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getStatesByWebsiteId.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(getStatesByWebsiteId.fulfilled, (state, { payload }) => {
      state.loading = false;
      if (Object.keys(payload).length === 0) return statesAdapter.removeAll(state);
      statesAdapter.setAll(state, payload.states);
    });
    builder.addCase(getStatesByWebsiteId.rejected, (state, {}) => {
      state.loading = false;
    });
  },
});

export const {
  selectById: selectStateById,
  selectIds: selectStateIds,
  selectEntities: selectStateEntities,
  selectAll: selectAllStates,
  selectTotal: selectTotalStates,
} = statesAdapter.getSelectors<RootState>(state => state.states);

export default stateSlice.reducer;
