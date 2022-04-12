import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setMessage } from './message.slice';
import AuthService from '../services/auth.service';
import httpErrors from '../interfaces/api.error.interface';
import { AxiosError } from 'axios';
import IUser from '../interfaces/user.interface';
import { getUser, setUserSession } from '../helpers/session.helper';

type loginType = {
  data: IUser;
  id: string;
};

export const login = createAsyncThunk<
  IUser,
  loginType,
  {
    rejectValue: httpErrors;
  }
>('auth/login', async ({ data: { email, password }, id }, { rejectWithValue, dispatch }) => {
  try {
    const res = await AuthService.login({ email, password });
    console.log('sadfsdf', res);
    setUserSession(res.data);
    return res.data;
  } catch (err: any) {
    console.log('sadfsdf', err);
    const error: AxiosError<httpErrors> = err;
    if (!error.response) {
      throw err;
    }
    dispatch(setMessage({ id, message: error.response.data.message }));
    return rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await AuthService.logout();
});

const user = getUser();
const initialState = user ? { isLoggedIn: true, user, loading: false } : { isLoggedIn: false, user: null, loading: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Login
    builder.addCase(login.pending, (state, {}) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.isLoggedIn = true;
      state.user = payload;
      state.loading = false;
    });
    builder.addCase(login.rejected, state => {
      state.isLoggedIn = false;
      state.user = null;
      state.loading = false;
    });

    // Logout
    builder.addCase(logout.fulfilled, state => {
      state.isLoggedIn = false;
      state.user = null;
    });
  },
});

export default authSlice.reducer;
