import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import settings from 'settings';
import Free from './Free';
import Busy from './Busy';
import Positions from './Positions';
import Departments from './Departments';
import { Error } from '@neoflex/psa-ui-shared';

export default () => {
    const history = useHistory();

    const goBack = () => {
        history.goBack();
    };

    return (
        <Switch>
            <Route exact path={settings.DASHBOARD_PATH} component={Free} />
            <Route path={settings.DASHBOARD_PATH + '/busy'} component={Busy} />
            <Route path={settings.DASHBOARD_PATH + '/free'} component={Free} />
            <Route path={settings.DASHBOARD_PATH + '/positions'} component={Positions} />
            <Route path={settings.DASHBOARD_PATH + '/departments'} component={Departments} />
            {/* render 404 */}
            <Route render={() => <Error status={404} goBack={goBack} />} />
            {/* or redirect to dashboard */}
            <Redirect to={settings.DASHBOARD_PATH} />
        </Switch>
    );
};
