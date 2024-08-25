import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../models/IUser';

interface AuthState {
  user: IUser | null;
  isAuth: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuth: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuth, setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;
