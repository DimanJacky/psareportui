import { createSlice } from '@reduxjs/toolkit';

import { tokenService } from 'helpers';

const initialState: IAuthState = {
    loading: true,
    error: {
        status: false,
        message: '',
    },
    userInfo: {
        id: 0,
        lastName: '',
        firstName: '',
        patronymic: '',
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.userInfo = action.payload;
            state.loading = false;
        },
        logout(state) {
            tokenService.tokenStorage.removeAccessToken();
            state.loading = false;
        },
        setError(state, action) {
            state.error.status = true;
            state.error.message = action.payload;
        },
        authLoading(state) {
            state.loading = false;
        }
    }
});

export const authReducer = authSlice.reducer;

export const { setAuth, logout, setError, authLoading } = authSlice.actions;

export interface IAuthState {
  loading: boolean;
  error: {
      status: boolean;
      message: string;
  }
  userInfo: {
      id: number;
      lastName: string;
      firstName: string;
      patronymic?: string;
  }
}
