import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { history, tokenService, i18n } from 'helpers';
import { Loader } from '@neoflex/psa-ui-shared';
import Routes from './routes';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import { I18nextProvider } from 'react-i18next';

import 'assets/scss/root.module.scss';


ReactDOM.render(
    <React.StrictMode>
        <ReactKeycloakProvider
            authClient={keycloak}
            onTokens={({ token }) => {
                tokenService.tokenStorage.setAccessToken(token ?? '');
            }}>
            <Provider store={store}>
                <Router history={history}>
                    <I18nextProvider i18n={i18n}>
                        <Suspense fallback={<Loader/>}>
                            <Routes/>
                        </Suspense>
                    </I18nextProvider>
                </Router>
            </Provider>
        </ReactKeycloakProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
