import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import classNames from 'classnames';
import { format, add, isAfter } from 'date-fns';
import { Typography, Button, Input, Autocomplete, Alert, IconError } from '@neoflex/fastdata-ui-kit';

import { Paper } from 'components/Paper';
import {
    getBusinessEntities,
    getProjectClients,
    getSpecializations
} from 'redux/reducer/appServices';
import { getReportBusyEmployees } from './actions';
import { setIsLoading } from 'Report/report.model';
import { useForm } from 'Report/FormProvider';

import css from './search-form.module.scss';

import type { TFormDataType } from 'types';
import type { IRootState } from 'redux/types';

const SearchForm = () => {
    let history = useHistory();
    const { setSearchData, formDataFromParams } = useForm();

    const allowedFields: TFormDataType =
        { 'businessEntity': [], 'specialization': [], 'projectClient': [], 'loadFrom': 0, 'loadTo': 0, 'start': '', 'finish': '' };

    let initialFormData: TFormDataType = {
        loadFrom: 0,
        loadTo: 100,
        start: format(new Date(), 'yyyy-MM-dd'),
        finish: format(add(new Date(), { months: 1 }), 'yyyy-MM-dd')
    };

    let initialStateFormData = formDataFromParams(allowedFields, initialFormData);
    const [formData, setFormData] = useState(initialStateFormData);
    const [open, setOpen] = useState(true);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const dispatch = useAppDispatch();
    const { businessEntities, specializations, projectClients } = useAppSelector((state: IRootState) => state.appServices);

    const search = window.location.search;
    const params = new URLSearchParams(search);

    useEffect(() => {
        dispatch(getBusinessEntities());
        dispatch(getSpecializations());
        dispatch(getProjectClients());
    }, []);

    useEffect(() => {
        const errors: {[key: string]: string} = {};

        if(!formData.start) {
            errors.start = '?????????????????? ???????????????????????? ???????? ?? ?????????????????? ?????????????? ??????????';
        }

        if(!formData.finish) {
            errors.finish = '?????????????????? ???????????????????????? ???????? ?? ?????????????????? ?????????????? ??????????';
        }

        formData.loadFrom > 100 && setFormData({ ...formData, loadFrom: 100 });
        formData.loadFrom < 0 && setFormData({ ...formData, loadFrom: 0 });
        formData.loadTo > 100 && setFormData({ ...formData, loadTo: 100 });
        formData.loadTo < 0 && setFormData({ ...formData, loadTo: 0 });

        if(formData.start && formData.finish && isAfter(new Date(formData.start.toString()), new Date(formData.finish.toString()))) {
            errors.start = '???????? ???????????? ???? ?????????? ???????? ???????????? ???????? ??????????';
            errors.finish = '???????? ???????????? ???? ?????????? ???????? ???????????? ???????? ??????????';
        }

        setErrors(errors);

    }, [formData]);

    const getData = (name: string) => {
        return formData.hasOwnProperty(name) ? formData[name] : '';
    };


    const addData = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const makeSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
        e && e.preventDefault();

        // ?????????????? ?????? ???? ????????????????????
        Object.keys(formData).map((name) => params.delete(name));

        if(!!Object.keys(errors).length)
            return;

        setSearchData(formData);

        if(formData && !!Object.keys(formData).length) {
            dispatch(setIsLoading(true));
            dispatch(getReportBusyEmployees(formData)).then(() => dispatch(setIsLoading(false)));
            setOpen(false);
        }

        // ?????????????????? ?????? ???? formData ?? ??????????????????
        Object.keys(formData).map((name) => {
            if(formData[name] && formData[name] !== '' && JSON.stringify(formData[name]) !== '[]') {
                params.set(name, formData[name].toString());
            }
        });

        history.push({ search: params.toString() });
    };

    const formReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormData(initialFormData);

        Object.keys(formData).map((name) => params.delete(name));
        history.push({ search: params.toString() });
    };

    return (
        <Paper className={css.paper}>
            <div className={css.header} onClick={() => setOpen(!open)}>
                <Typography type="h3" className={css.title}>???????????????????????? ????????????</Typography>
                <a role="button">{ open ? '????????????????' : '????????????????????'}</a>
            </div>
            <div className={classNames(css.body, (open && css.open))}>
                {
                    !!Object.keys(errors).length &&
                    Object.keys(errors).slice(0, 1).map(error => <Alert key={error} message={errors[error]} type="error" icon={<IconError />} />)
                }
                <form onSubmit={makeSearch} noValidate>
                    <div className={css.row}>
                        <Autocomplete
                            label="??????????????????????????"
                            name="businessEntity"
                            multiple
                            fullWidth
                            withError={false}
                            value={getData('businessEntity')}
                            onChange={(name: string, value: string) => addData(name, value)}
                            options={businessEntities}
                            placeholder="??????"
                            error={errors.businessEntity} />
                        <Autocomplete
                            label="??????????????????????????"
                            name="specialization"
                            multiple
                            fullWidth
                            withError={false}
                            value={getData('specialization')}
                            onChange={(name: string, value: string) => addData(name, value)}
                            options={specializations}
                            placeholder="??????"
                            error={errors.specialization} />
                    </div>
                    <div className={css.row}>
                        <Autocomplete
                            label="????????????"
                            name="projectClient"
                            multiple
                            fullWidth
                            withError={false}
                            value={getData('projectClient')}
                            onChange={(name: string, value: string) => addData(name, value)}
                            options={projectClients}
                            placeholder="??????"
                            error={errors.projectClient} />
                        <Input
                            className={css.load}
                            label="???????????????? ????"
                            name="loadFrom"
                            type="number"
                            placeholder="????"
                            min="0" max="100" step="10"
                            value={getData('loadFrom')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => addData(e.target.name, e.target.value)}
                            withError={false}
                            error={errors.loadFrom} />
                        <Input
                            className={css.load}
                            label="???????????????? ????"
                            name="loadTo"
                            type="number"
                            placeholder="????"
                            min="0" max="100" step="10"
                            value={getData('loadTo')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => addData(e.target.name, e.target.value)}
                            withError={false}
                            error={errors.loadTo} />
                        <Input className={css.date}
                            label="???????????? ????"
                            name="start"
                            type="date"
                            required
                            placeholder="????"
                            value={getData('start')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => addData(e.target.name, e.target.value)}
                            withError={false}
                            error={errors.start} />
                        <Input className={css.date}
                            label="???????????? ????"
                            name="finish"
                            type="date"
                            required
                            placeholder="????"
                            value={getData('finish')}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => addData(e.target.name, e.target.value)}
                            withError={false}
                            error={errors.finish} />
                    </div>
                    <div className={css.buttons}>
                        <Button type="submit">????????????????????????</Button>
                        <Button type="reset" view="secondary" onClick={formReset}>????????????????</Button>
                    </div>
                </form>
            </div>
        </Paper>
    );
};

export default SearchForm;
