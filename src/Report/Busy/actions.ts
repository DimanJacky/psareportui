import { API, serializer } from 'helpers';

import { setError, setReportBusyEmployees } from 'Report/report.model';
import type { Dispatch } from 'redux';
import type { TReportBusyEmployees } from 'Report/types';
import type { TFormDataType } from 'types';

const getReportBusyEmployeesPrefix = 'report/busy'; 

export const getReportBusyEmployees = (searchData: TFormDataType) => async (dispatch: Dispatch) => {
    try {
        const parse = serializer(searchData);

        const response = await API.get<TReportBusyEmployees[]>(getReportBusyEmployeesPrefix, {
            params: parse,
        });

        dispatch(setReportBusyEmployees(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn(`Отчет не может быть сформирован: ${error}`);
            dispatch(setError(error));
        }
    }
};
