import { createSlice } from '@reduxjs/toolkit';
import { sort } from '@neoflex/psa-ui-shared';
import { Dispatch } from 'redux';

import type { 
    TReportOpenPosition,
    TReportBusyEmployees,
    TReportFreeEmployees,
    TReportDisposalBusiness
} from './types';

const initialState: IReportState = {
    reportFreeEmployee: [],
    reportBusyEmployee: [],
    reportOpenPosition: [],
    reportDisposalBusiness: [],
    error: {
        data: {
            message: '',
        },
        status: 0,
        statusText: '',
    },
    isLoading: true,
};

const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        setReportOpenPosition(state, action) {
            state.reportOpenPosition = action.payload;
        },
        setReportBusyEmployees(state, action) {
            state.reportBusyEmployee = action.payload;
        },
        setReportFreeEmployees(state, action) {
            state.reportFreeEmployee = action.payload;
        },
        setReportDisposalBusiness(state, action) {
            state.reportDisposalBusiness = action.payload;
        },
        sortFields(state, action) {
            const { sortField, nameReport } = action.payload;

            switch(nameReport) {
                case 'freeEmployee':
                    state.reportFreeEmployee = sortField;
                    break;
                case 'busyEmployee':
                    state.reportBusyEmployee = sortField;
                    break;
                case 'openPosition':
                    state.reportOpenPosition = sortField;
                    break;
                default:
                    return state;
            }
        },
        clearReport(state) {
            state.reportFreeEmployee = [];
            state.reportBusyEmployee = [];
            state.reportOpenPosition = [];
            state.reportDisposalBusiness = [];
        },
        setError(state, action) {
            const { data, status, statusText } = action.payload;

            state.error.data = data;
            state.error.status = status;
            state.error.statusText = statusText;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        }
    },
});

export const sortFieldsUser = (users:TReport, field: string, desc: boolean = false, nameReport: TReportName) => async (dispatch: Dispatch) => {
    const sortField = sort(users, field, desc);

    dispatch(reportSlice.actions.sortFields({ sortField, nameReport }));
};

export const reportReducer = reportSlice.reducer;

export const { 
    setReportOpenPosition,
    setReportBusyEmployees,
    setReportFreeEmployees,
    setReportDisposalBusiness,
    sortFields,
    clearReport,
    setError,
    setIsLoading,
} = reportSlice.actions;

export interface IReportState {
  reportFreeEmployee: TReportFreeEmployees[];
  reportBusyEmployee: TReportBusyEmployees[];
  reportOpenPosition: TReportOpenPosition[];
  reportDisposalBusiness: TReportDisposalBusiness[];
  error: {
    data: {
        message: string;
    };
    status: number;
    statusText: string;
  };
  isLoading: boolean;
}

type TReportName = 'openPosition' | 'busyEmployee' | 'freeEmployee';

type TReport = TReportFreeEmployees[] | TReportBusyEmployees[] | TReportOpenPosition[];
