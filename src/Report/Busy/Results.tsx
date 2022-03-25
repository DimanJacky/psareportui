import React, { Fragment, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Loader, IconSort, AxiosErrorType } from '@neoflex/psa-ui-shared';
import { format } from 'date-fns';
import {
    Tag, Table, TableCell, TableHeader, TableRow, Typography, Tooltip, Button, IconDownload, Notification
} from '@neoflex/fastdata-ui-kit';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { businessEntity, setExport } from 'helpers';
import settings from 'settings';
import NativeLink from 'components/NativeLink';
import { useForm } from '../FormProvider';
import { sortFieldsUser, clearReport } from 'Report/report.model';

import css from './results.module.scss';

import type { NotificationType, TOrderBy } from 'types';
import type { TReportBusyEmployees } from 'Report/types';
import type { IRootState } from 'redux/types';

const Results = () => {
    const initialOrderBy: TOrderBy = { 'fio': 'asc' };
    const [orderedBy, setOrderedBy] = useState(initialOrderBy);
    const [notification, setNotification] = useState<boolean | NotificationType>(false);
    const { reportBusyEmployee, isLoading } = useAppSelector((state: IRootState) => state.report);
    const { searchData } = useForm();
    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearReport());
        };
    }, []);

    useEffect(() => {
        // сбрасываем сортировку при новом поиске
        setOrderedBy(initialOrderBy);
    }, [isLoading]);

    const sortBy = (field: string, desc: boolean = false) => {
        setOrderedBy({ [field]: desc ? 'desc' : 'asc' });
        dispatch(sortFieldsUser(reportBusyEmployee, field, desc, 'busyEmployee'));
    };

    const _notificationError = (error: AxiosErrorType) => {
        setNotification({
            type: 'error',
            title: 'Ошибка ' + error.status,
            message: 'Ошибка при генерации файла на сервере'
        });
    };

    const urlDownloadFile = `${settings.API_URL}${settings.DASHBOARD_PATH}${settings.BUSY_REPORT_METHOD}/export/excel`;

    return (
        <Fragment>
            {
                notification &&
                    <Notification { ...notification } timeout={10000} onClose={() => setNotification(false)} />
            }
            {
                searchData && !!Object.keys(searchData).length &&
                    <div className={css.results}>
                        {
                            reportBusyEmployee.length ?
                                <Fragment>
                                    <Table cells={23} className={css.table} fontSize="small" view="compact" width={1800} stickyFirstColumn>
                                        <Table.Hat className={css.tableTitle}>
                                            <Typography type="h3">Отчет сформирован: {format(new Date(searchData.start), 'dd.MM.yyyy')} - {format(new Date(searchData.finish), 'dd.MM.yyyy')}</Typography>
                                            <div className={css.tableActions}>
                                                <span className={css.separator} />
                                                <Button
                                                    view="ghost"
                                                    className={css.download}
                                                    onClick={() => setExport(searchData, _notificationError, urlDownloadFile, 'busy_employee_')}
                                                >
                                                    <Tooltip title="Скачать отчёт" position="left"><IconDownload /></Tooltip>
                                                </Button>
                                            </div>
                                        </Table.Hat>
                                        <TableHeader className={css.tableHeader}>
                                            <TableCell colspan={3}>ФИО
                                                <IconSort fieldName="fio" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Грейд
                                                <IconSort fieldName="grade" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Специализация
                                                <IconSort fieldName="specialization" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Роль
                                                <IconSort fieldName="role" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={4}>Подразделение
                                                <IconSort fieldName="businessEntity" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Программа
                                                <IconSort fieldName="project" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Клиент
                                                <IconSort fieldName="projectClient" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>% Загрузки
                                                <IconSort fieldName="load" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Дата нач.
                                                <IconSort fieldName="start" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                            <TableCell colspan={2}>Дата оконч.
                                                <IconSort fieldName="finish" sortBy={sortBy} orderedBy={orderedBy} />
                                            </TableCell>
                                        </TableHeader>

                                        {reportBusyEmployee.map((user: TReportBusyEmployees) => (
                                            <TableRow className={css.tableRow} key={uuid()}>
                                                <TableCell colspan={3}>
                                                    <NativeLink to={settings.EMPLOYEE_PATH + '/' + user.employeeId}>{user.fio}</NativeLink>
                                                </TableCell>
                                                <TableCell colspan={2}>{user.grade}</TableCell>
                                                <TableCell colspan={2}>{user.specialization}</TableCell>
                                                <TableCell colspan={2}>{user.role}</TableCell>
                                                <TableCell colspan={4}>
                                                    {businessEntity(user.businessEntity, user.department, user.group)}
                                                </TableCell>
                                                <TableCell colspan={2}>
                                                    <NativeLink to={settings.PROJECT_PATH + '/' + user.projectId}>{user.project}</NativeLink>
                                                </TableCell>
                                                <TableCell colspan={2}>
                                                    {user.projectClient}
                                                </TableCell>
                                                <TableCell colspan={2}>
                                                    <Tag color={user.isOverloaded ? 'error' : 'default'}>
                                                        {user.load + '%'}
                                                    </Tag>
                                                </TableCell>
                                                <TableCell colspan={2}>{format(new Date(user.start), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell colspan={2}>{format(new Date(user.finish), 'dd.MM.yyyy')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </Table>
                                </Fragment> :
                                <Fragment>
                                    {isLoading ? <Loader inline /> :
                                        <>
                                            <Typography type="h4">Результаты поиска</Typography>
                                            <Typography type="h3">Подходящих данных по заданным параметрам не найдено. Повторите попытку.</Typography>
                                        </>
                                    }
                                </Fragment>
                        }
                    </div>
            }
        </Fragment>
    );
};

export default Results;
