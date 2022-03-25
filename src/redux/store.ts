import { configureStore } from '@reduxjs/toolkit';

import { authReducer, appServicesReducer } from './reducer';
import { reportReducer } from 'Report/report.model';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        appServices: appServicesReducer,
        report: reportReducer,
    },
});

export type TAppDispatch = typeof store.dispatch;
export type TRootState = ReturnType<typeof store.getState>;
