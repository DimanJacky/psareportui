import { fetch } from 'helpers';

import type { AxiosErrorType } from '@neoflex/psa-ui-shared';
import { TFormDataType, IDate } from 'types';

export const setExport = (searchData: TFormDataType | IDate, setNotification: (error: AxiosErrorType) => void, methodApi: string, nameFile: string) => {
    document.body.style.cursor = 'wait';

    fetch({
        url: methodApi,
        method: 'GET',
        params: searchData,
    })
        .then(r => r.blob())
        .then((blob) => {
            const link = document.createElement('a');

            link.href = window.URL.createObjectURL(new Blob([blob]));
            link.setAttribute('download', nameFile + searchData.start + '-' + searchData.finish + '.xlsx');
            link.setAttribute('rel', 'noreferrer');
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            document.body.style.cursor = 'default';
        })
        .catch((error: AxiosErrorType) => {
            document.body.style.cursor = 'default';

            setNotification(error);
        });
};
