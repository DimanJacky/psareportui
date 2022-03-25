import { Dispatch } from 'redux';

import { API, serializer } from 'helpers';
import { setError, setReportFreeEmployees } from 'Report/report.model';

import type { TFormDataType } from 'types';
import type { TReportFreeEmployees } from 'Report/types';

const getReportFreeEmployeesPrefix = 'report/free';

export const getReportFreeEmployees = (searchData: TFormDataType) => async (dispatch: Dispatch) => {
    try {
        const parse = serializer(searchData);

        const response = await API.get<TReportFreeEmployees[]>(getReportFreeEmployeesPrefix, {
            params: parse,
        });

        dispatch(setReportFreeEmployees(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn(`Отчет не может быть сформирован: ${error}`);
            dispatch(setError(error));
        }
    }
};
