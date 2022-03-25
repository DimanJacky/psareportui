import React from 'react';
import { Refresh } from '@neoflex/psa-ui-shared';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { logout } from 'redux/reducer/auth';


export default () => {
    const { keycloak } = useKeycloak();
    const dispatch = useDispatch();

    if(process.env.NODE_ENV === 'development') {
        if(!!keycloak.authenticated) {
            keycloak.logout();

            dispatch(logout());
        }

        return null;
    }

    return (
        <Refresh to="/logout" />
    );
};
