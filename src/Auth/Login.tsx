import React, { useCallback } from 'react';
import { Refresh } from '@neoflex/psa-ui-shared';
import { tokenService } from 'helpers';
import { useKeycloak } from '@react-keycloak/web';
import { Button } from '@neoflex/fastdata-ui-kit';
import settings from 'settings';


export default () => {
    // надо запомнить последний url откуда мы переходим на Login
    // чтобы потом вернуть пользователя обратно куда он пришел
    tokenService.tokenStorage.set('lastRoute', window.location.href);

    if(process.env.NODE_ENV === 'development') {
        // чтобы можно было авторизоваться на localhost
        const { keycloak } = useKeycloak();

        const login = useCallback(() => {
            keycloak?.login();
        }, [keycloak]);

        console.log('Refresh to ' + settings.LOGIN_URL);

        return (
            <div style={{ margin: '3rem' }}>
                <h1>DEV mode</h1>
                <Button onClick={login}>Login with keycloak</Button>
            </div>
        );
    }

    return (
        <Refresh to={settings.LOGIN_URL} />
    );
};
