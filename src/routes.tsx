import React from 'react';
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import { AppBar, SubMenu, Loader, Error } from '@neoflex/psa-ui-shared';
import PrivateRoute from './privateRoute';
import settings from './settings';
import Dashboard from './Report';
import Login from './Auth/Login';
import Logout from './Auth/Logout';
import { useKeycloak } from '@react-keycloak/web';

import type { IRootState } from 'redux/types';

const Routes = () => {
    const { initialized } = useKeycloak();
    const { userInfo } = useAppSelector((state: IRootState) => state.auth);
    const history = useHistory();

    const userAppBar: { id: number, name: string } = {
        id: userInfo.id,
        name: `${userInfo.lastName} ${userInfo.firstName}`,
    };

    const goBack = () => {
        history.goBack();
    };

    const navLinks = [
        {
            link: '/employee',
            label: 'Сотрудники',
            isActive: !!useRouteMatch('/employee'),
        },
        {
            link: settings.PROJECT_PATH,
            label: 'Проекты',
            isActive: !!useRouteMatch(settings.PROJECT_PATH),
        },
        {
            link: '/report',
            label: 'Отчеты',
            isActive: !!useRouteMatch('/report'),
        },
    ];

    const dropDownItems = [
        {
            link: settings.DASHBOARD_PATH + '/busy',
            label: 'Прикреплённые сотрудники',
            isActive: !!useRouteMatch(settings.DASHBOARD_PATH + '/busy'),
        },
        {
            link: settings.DASHBOARD_PATH + '/departments',
            label: 'Утилизация',
            isActive: false,
        },
    ];

    const navLinksSubmenu = [
        {
            link: settings.DASHBOARD_PATH + '/free',
            label: 'Свободные сотрудники',
            isActive: (!!useRouteMatch(settings.DASHBOARD_PATH + '/free') || useRouteMatch({ path: settings.DASHBOARD_PATH })?.isExact),
        },
        {
            link: '',
            dropDown: true,
            label: '',
        },
        {
            link: settings.DASHBOARD_PATH + '/positions',
            label: 'Открытые позиции',
            isActive: !!useRouteMatch(settings.DASHBOARD_PATH + '/positions'),
        },
    ];

    if(!initialized)
        return <Loader />;

    const getCurrentLocation = (href: string) => {
        switch(href) {
            case '/report/busy':
                return 'Прикреплённые сотрудники';
            case '/report/departments':
                return 'Утилизация';
            default:
                return '';
        }
    };

    return (
        <>
            <div className="sticky">
                <AppBar user={userAppBar} navLinks={navLinks} />
                <SubMenu navLinks={navLinksSubmenu} dropDownList={dropDownItems} initialLinkDropDown={getCurrentLocation(window.location.pathname) || 'Прикреплённые сотрудники'} />
            </div>
            <div className="page-container">
                <Switch>
                    <PrivateRoute path={settings.DASHBOARD_PATH} component={Dashboard} />
                    <Route path="/login" component={Login} exact />
                    <Route path="/logout" component={Logout} exact />
                    {/* render 404 */}
                    <Route render={() => <Error status={404} goBack={goBack} />} />
                    {/* or redirect to dashboard */}
                    <Redirect to={settings.DASHBOARD_PATH} />
                </Switch>
            </div>
        </>
    );
};

export default Routes;
