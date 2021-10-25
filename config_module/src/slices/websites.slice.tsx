import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import IWebsite from '../interfaces/website.interface';
import WebsiteDataService from '../services/website.service';
import { AxiosError } from 'axios';
import { setMessage } from './message.slice';

const initialState = {
  websites: [] as IWebsite[],
  loading: false as boolean,
};

interface httpErrors {
  message: string;
}

export const createWebsite = createAsyncThunk<
  IWebsite,
  IWebsite,
  {
    rejectValue: httpErrors;
  }
>('websites/create', async ({ name, url }, { rejectWithValue, dispatch }) => {
  try {
    const res = await WebsiteDataService.create({ name, url });
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

export const retrieveWebsites = createAsyncThunk<
  IWebsite[],
  void,
  {
    rejectValue: httpErrors;
  }
>('websites/retrieve', async (_, { rejectWithValue, dispatch }) => {
  try {
    const res = await WebsiteDataService.getAll();
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

export const updateWebsite = createAsyncThunk<
  IWebsite,
  IWebsite,
  {
    rejectValue: httpErrors;
  }
>('websites/update', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await WebsiteDataService.update(data);
    return response.data.data;
  } catch (err: any) {
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }
    dispatch(setMessage(error.response.data.message));
    return rejectWithValue(error.response.data);
  }
});

export const deleteWebsite = createAsyncThunk<
  { id: string },
  { id: string },
  {
    rejectValue: httpErrors;
  }
>('websites/delete', async ({ id }, { rejectWithValue, dispatch }) => {
  try {
    await WebsiteDataService.deleteWebsite(id);
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

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Create website
    builder.addCase(createWebsite.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(createWebsite.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.websites.push(payload);
    });
    builder.addCase(createWebsite.rejected, (state, { payload }) => {
      if (payload) {
        state.loading = false;
      }
    });

    // Retrieve websites
    builder.addCase(retrieveWebsites.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(retrieveWebsites.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.websites = payload;
    });
    builder.addCase(retrieveWebsites.rejected, (state, { payload }) => {
      if (payload) {
        state.loading = false;
        console.log('###########', payload.message);
      }
    });

    // Update website
    builder.addCase(updateWebsite.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(updateWebsite.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.websites[payload.id as unknown as number] = payload;
    });
    builder.addCase(updateWebsite.rejected, (state, { payload }) => {
      if (payload) {
        state.loading = false;
      }
    });

    // Delete website
    builder.addCase(deleteWebsite.fulfilled, (state, { payload }) => {
      const newList: IWebsite[] = state.websites.filter(item => item.id !== payload.id);
      state.websites = newList;
    });
  },
});

export default websiteSlice.reducer;
