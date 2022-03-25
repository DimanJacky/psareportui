import { Dispatch } from 'redux';

import { API } from 'helpers';
import { setAuth, logout, setError, authLoading } from './auth.model';
import type { IUserInfo } from './types';

const userInfoPrefix = 'employee/';

export const getUserInfo  = (userInfo: IUserInfo) => async (dispatch: Dispatch) => {
    try {
        const response = await API.get(`${userInfoPrefix}info-by-login`, {
            params: {
                login: userInfo.preferred_username
            }
        });

        dispatch(setAuth(response));

    } catch(error) {
        if(error instanceof Error) {
            dispatch(logout());
            dispatch(setError(error));
        }
    }

    dispatch(authLoading());
};
