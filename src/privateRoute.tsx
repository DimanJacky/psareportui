import React, { Fragment, useEffect, ComponentProps } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Loader } from '@neoflex/psa-ui-shared';
import { useKeycloak } from '@react-keycloak/web';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { authLoading, getUserInfo } from 'redux/reducer/auth';

import type { IRootState } from 'redux/types';
import Login from 'Auth/Login';

interface PrivateRouteParams extends RouteProps {
    component:
        | React.ComponentType<RouteComponentProps<any>>
        | React.ComponentType<any>,
    path?: string,
}

export default (props: PrivateRouteParams) => {
    const {
        component: Component,
        ...rest
    } = props;

    const { loading } = useAppSelector((state: IRootState) => state.auth);
    const { keycloak, initialized } = useKeycloak();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(!initialized)
            return;

        if(!keycloak.authenticated) {
            dispatch(authLoading());

            return;
        }

        keycloak.onTokenExpired = () => {
            keycloak.updateToken(50);
        };

        (async () => {
            const userInfo = await keycloak.loadUserInfo()
                .then((data: any) => {
                    return data;
                });

            dispatch(getUserInfo(userInfo));
            dispatch(authLoading());
        })();

    }, [keycloak.authenticated]);

    return (
        loading || !initialized ?
            <Loader /> :
            <Fragment>
                <Route {...rest} render={(props: ComponentProps<any>) => (
                    keycloak.authenticated ?
                        <Component {...props} /> :
                        <Login />
                )} />
            </Fragment>
    );
};
