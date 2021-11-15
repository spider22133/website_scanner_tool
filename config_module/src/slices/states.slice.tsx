import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import IState from '../interfaces/website-state.interface';
import { stateEntity } from '../schemas/state.normalizr';
import StatesDataService from '../services/states.service';
import { RootState } from '../store';

export const getStatesByWebsiteId = createAsyncThunk('states/getStatesByWebsiteId', async (id: string) => {
  const res = await StatesDataService.getStatesByWebsiteId(id);
  console.log('&&&&&&&&&&&&', res);
  const normalized = normalize<
    any,
    {
      states: { [key: string]: IState };
    }
  >(res.data.data, [stateEntity]);
  return normalized.entities;
});

export const statesAdapter = createEntityAdapter<IState>({
  selectId: state => state.id,
});

const stateSlice = createSlice({
  name: 'states',
  initialState: statesAdapter.getInitialState(),
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getStatesByWebsiteId.fulfilled, (state, { payload }) => {
      if (Object.keys(payload).length == 0) '';
      statesAdapter.setAll(state, payload.states);
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
