import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import IWebsite from '../interfaces/website.interface';
import WebsiteDataService from '../services/website.service';
import { AxiosError } from 'axios';
import { number } from 'yup/lib/locale';

const initialState = [] as IWebsite[];

interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export const createWebsite = createAsyncThunk<
  IWebsite,
  IWebsite,
  {
    rejectValue: ValidationErrors;
  }
>('websites/create', async ({ name, url }, { rejectWithValue }) => {
  const res = await WebsiteDataService.create({ name, url });
  return res.data.data;
});

export const retrieveWebsites = createAsyncThunk<
  IWebsite[],
  void,
  {
    rejectValue: ValidationErrors;
  }
>('websites/retrieve', async (_, { rejectWithValue }) => {
  const res = await WebsiteDataService.getAll();
  return res.data.data;
});

export const updateWebsite = createAsyncThunk<
  IWebsite,
  IWebsite,
  {
    rejectValue: ValidationErrors;
  }
>('websites/update', async (data, { rejectWithValue }) => {
  const response = await WebsiteDataService.update(data);
  return response.data.data;
});

export const deleteWebsite = createAsyncThunk<
  { id: string },
  { id: string },
  {
    rejectValue: ValidationErrors;
  }
>('websites/delete', async ({ id }) => {
  await WebsiteDataService.deleteWebsite(id);
  return { id };
});

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(createWebsite.fulfilled, (state, { payload }) => {
      state.push(payload);
    });
    builder.addCase(retrieveWebsites.fulfilled, (state, { payload }) => {
      return [...payload];
    });
    builder.addCase(updateWebsite.fulfilled, (state, { payload }) => {
      state[payload.id as unknown as number] = payload;
    });
    builder.addCase(deleteWebsite.fulfilled, (state, { payload }) => {
      const newList: IWebsite[] = state.filter(item => item.id !== payload.id);
      return [...newList];
    });
  },
});

export default websiteSlice.reducer;
