import fetch from 'cross-fetch';
import { tokenService } from 'helpers';
import { v4 as uuidV4 } from 'uuid';


type QueryOptions = {
    method: string,
    params?: any,
    url: string,
    accessToken?: string | boolean,
    headers?: object,
}

type Headers = {
    'Content-Type': string,
    'X-Request-ID': string,
    'Authorization'?: string,
    'Cache-Control'?: string,
};


export default async (options: QueryOptions) => {
    const method = options.method || 'GET';
    const params = options.params || {};
    const accessToken = tokenService.tokenStorage.getAccessToken();

    if(['GET', 'DELETE'].includes(method) && Object.keys(params).length !== 0) {
        options.url += '?' +  Object.keys(params).map(key => (encodeURIComponent(key) + '=' +
                encodeURIComponent(params ? params[key] : '')
        )).join('&');
    }

    let headers: Headers = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=40000',
        'X-Request-ID': uuidV4()
    };

    if(options.accessToken)
        headers.Authorization = 'Bearer ' + options.accessToken;
    else if(options.accessToken !== false) {
        // await tokenService.refreshToken.checkAccessToken()
        //     .then(refreshed => console.warn(refreshed.message))
        //     .catch(error => Promise.reject(error));

        headers.Authorization = 'Bearer ' + accessToken;
    }

    if(options.headers) {
        headers = {
            ...headers,
            ...options.headers,
        };
    }

    let body = null;

    if(['POST', 'PUT', 'PATCH'].includes(method))
        body = JSON.stringify(params);

    return fetch(options.url, {
        headers,
        method,
        body
    })
        .then(response => {
            if(response.status >= 200 && response.status < 300) {
                return Promise.resolve(response);
            } else if(response.status >= 400) {
                const { status, statusText } = response;

                return response.json()
                    .then(response => Promise.reject({ ...response, status, statusText }))
                    .catch(error => Promise.reject({ ...error, status, statusText }));
            } else {
                // CORS error, скорее всего до сюда не дойдет ни когда
                return Promise.reject({ ...response, status: 405, message: 'Network request failed' });
            }
        });
    // не надо это обрабатывать, при вызове fetch из actions есть свой catch, который обрабатывает ошибки
    // .catch(error => Promise.reject({ ...error, status: 405, message: 'Network request failed' }));
};
