import { API } from 'helpers';
import { clearReport, setError, setIsLoading, setReportDisposalBusiness } from 'Report/report.model';

import type { Dispatch } from 'redux';
import type { TFormDataDisposalBusiness, TReportDisposalBusiness } from 'Report/types';

const getReportDisposalBusinessPrefix = 'report/disposalBusiness';

export const getReportDisposalBusiness = (searchData: TFormDataDisposalBusiness) => (dispatch: Dispatch) => {
    dispatch(setIsLoading(true));
    dispatch(clearReport());

    API.get<TReportDisposalBusiness[]>(getReportDisposalBusinessPrefix, {
        params: searchData,
    })
        .then(response => {

            dispatch(setReportDisposalBusiness(response));
            dispatch(setIsLoading(false));
        })
        .catch(error => {
            dispatch(setIsLoading(false));
            dispatch(setError(error));
        });
};
