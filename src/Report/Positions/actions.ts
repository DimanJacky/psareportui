import { API, serializer } from 'helpers';
import { setError, setReportOpenPosition } from 'Report/report.model';

import type { TReportOpenPosition } from 'Report/types';
import type { TFormDataType } from 'types';
import type { Dispatch } from 'redux';

const getReportOpenPositionPrefix = 'report/freePosition';

export const getReportOpenPosition = (searchData: TFormDataType) => async (dispatch: Dispatch) => {
    try {
        const parse = serializer(searchData);

        const response = await API.get<TReportOpenPosition[]>(getReportOpenPositionPrefix, {
            params: parse,
        });

        dispatch(setReportOpenPosition(response));
    } catch(error) {
        if(error instanceof Error) {
            console.warn(`Отчет не может быть сформирован: ${error}`);
            dispatch(setError(error));
        }
    }
};
