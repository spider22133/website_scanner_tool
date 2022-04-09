import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import IWebsiteControlStep from '../interfaces/website_control_step.interface';
import WebsiteControlStepsDataService from '../services/website_control_steps.service';
import { AxiosError } from 'axios';
import { setMessage } from './message.slice';
import httpErrors from '../interfaces/api.error.interface';

const initialState = {
  steps: [] as IWebsiteControlStep[],
  loading: false as boolean,
};

type setErrorType = {
  data: IWebsiteControlStep;
  id: string;
};

export const createWebsiteControlStep = createAsyncThunk<
  IWebsiteControlStep,
  setErrorType,
  {
    rejectValue: httpErrors;
  }
>('website_control_step/create', async ({ data, id }, { rejectWithValue, dispatch }) => {
  try {
    const res = await WebsiteControlStepsDataService.create(data);
    return res.data.data;
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }
    dispatch(setMessage({ id, message: error.response.data.message }));
    return rejectWithValue(error.response.data);
  }
});

export const updateWebsiteControlStep = createAsyncThunk<
  IWebsiteControlStep,
  IWebsiteControlStep,
  {
    rejectValue: httpErrors;
  }
>('website_control_step/update', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await WebsiteControlStepsDataService.update(data);
    return response.data.data;
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }

    dispatch(setMessage({ id: data.id, message: error.response.data.message }));
    return rejectWithValue(error.response.data);
  }
});

export const getStepsByWebsiteId = createAsyncThunk<
  IWebsiteControlStep[],
  string,
  {
    rejectValue: httpErrors;
  }
>('website_control_step/retrieve', async (id, { rejectWithValue, dispatch }) => {
  try {
    const res = await WebsiteControlStepsDataService.getStepsById(id);
    return res.data.data;
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }
    dispatch(setMessage(error.response.data.message));
    return rejectWithValue(error.response.data);
  }
});

export const deleteWebsiteControlSteps = createAsyncThunk<
  { id: string },
  { id: string },
  {
    rejectValue: httpErrors;
  }
>('website_control_step/delete', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    await WebsiteControlStepsDataService.deleteStep(id);
    return { id };
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }
    dispatch(setMessage(error.response.data.message));
    return rejectWithValue(error.response.data);
  }
});

const websiteControlStateSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Create website
    builder.addCase(createWebsiteControlStep.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(createWebsiteControlStep.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.steps.push(payload);
    });
    builder.addCase(createWebsiteControlStep.rejected, state => {
      state.loading = false;
    });

    // Retrieve websites
    builder.addCase(getStepsByWebsiteId.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(getStepsByWebsiteId.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.steps = payload;
    });
    builder.addCase(getStepsByWebsiteId.rejected, state => {
      state.loading = false;
    });

    // Update website
    builder.addCase(updateWebsiteControlStep.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(updateWebsiteControlStep.fulfilled, (state, { payload }) => {
      const index = state.steps.findIndex(item => item.id === payload.id);

      state.loading = false;
      state.steps[index] = {
        ...state.steps[index],
        ...payload,
      };
    });
    builder.addCase(updateWebsiteControlStep.rejected, state => {
      state.loading = false;
    });

    // Delete website
    builder.addCase(deleteWebsiteControlSteps.fulfilled, (state, { payload }) => {
      state.steps = state.steps.filter(item => item.id !== payload.id);
    });
  },
});

export default websiteControlStateSlice.reducer;
