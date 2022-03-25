import React, { Fragment, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
    Tag,
    Table,
    Typography,
    Tooltip,
    Button,
    IconDownload,
    Notification
} from '@neoflex/fastdata-ui-kit';
import { Loader, IconSort, AxiosErrorType } from '@neoflex/psa-ui-shared';

import { setExport } from 'helpers';
import settings from 'settings';
import NativeLink from 'components/NativeLink';
import { useForm } from '../FormProvider';
import { sortFieldsUser, clearReport } from 'Report/report.model';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import css from './results.module.scss';

import type { NotificationType, TOrderBy } from 'types';
import type { IRootState } from 'redux/types';
import type { TReportOpenPosition } from 'Report/types';

const Results = () => {
    const initialOrderBy: TOrderBy = { 'fio': 'asc' };
    const [orderedBy, setOrderedBy] = useState(initialOrderBy);
    const [notification, setNotification] = useState<boolean | NotificationType>(false);
    const { searchData } = useForm();
    const dispatch = useAppDispatch();
    const { reportOpenPosition, isLoading } = useAppSelector((state: IRootState) => state.report);

    useEffect(() => {
        return () => {
            dispatch(clearReport());
        };
    }, []);

    useEffect(() => {
        setOrderedBy(initialOrderBy);
    }, [isLoading]);

    const sortBy = (field: string, desc: boolean = false) => {
        setOrderedBy({ [field]: desc ? 'desc' : 'asc' });
        dispatch(sortFieldsUser(reportOpenPosition, field, desc, 'openPosition'));
    };

    const _notificationError = (error: AxiosErrorType) => {
        setNotification({
            type: 'error',
            title: 'Ошибка ' + error.status,
            message: 'Ошибка при генерации файла на сервере'
        });
    };

    const urlDownloadFile = `${settings.API_URL}${settings.DASHBOARD_PATH}${settings.POSITIONS_REPORT_METHOD}/export/excel`;
    
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
                            reportOpenPosition.length ?
                                <Fragment>
                                    <Table cells={27} className={css.table} fontSize="small" view="compact" width={1800} stickyFirstColumn>
                                        <Table.Hat className={css.tableTitle}>
                                            <Typography type="h3">Отчет сформирован: {format(new Date(searchData.start), 'dd.MM.yyyy')} - {format(new Date(searchData.finish), 'dd.MM.yyyy')}</Typography>
                                            <div className={css.tableActions}>
                                                <span className={css.separator} />
                                                <Button
                                                    view="ghost"
                                                    className={css.download}
                                                    onClick={() => setExport(searchData, _notificationError, urlDownloadFile, 'positions_')}
                                                >
                                                    <Tooltip title="Скачать отчёт" position="left"><IconDownload /></Tooltip>
                                                </Button>
                                            </div>
                                        </Table.Hat>
                                        <Table.Header className={css.tableHeader}>
                                            <Table.Cell colspan={3}>Позиция
                                                <IconSort fieldName="projectPosition" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={4}>Программа
                                                <IconSort fieldName="project.name" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>Клиент
                                                <IconSort fieldName="projectClient" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>Грейд
                                                <IconSort fieldName="positionUnion" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={3}>Специализация
                                                <IconSort fieldName="specialization" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={3}>Подразделение
                                                <IconSort fieldName="businessEntity" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>Филиал
                                                <IconSort fieldName="companyBranch" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>Роль
                                                <IconSort fieldName="projectRole" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>%
                                                <IconSort fieldName="percentage" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>Дата нач.
                                                <IconSort fieldName="startDate" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                            <Table.Cell colspan={2}>Дата оконч.
                                                <IconSort fieldName="endDate" sortBy={sortBy} orderedBy={orderedBy} />
                                            </Table.Cell>
                                        </Table.Header>

                                        {reportOpenPosition.map((user: TReportOpenPosition, key: number) => (
                                            <Table.Row className={css.tableRow} key={key}>
                                                <Table.Cell colspan={3}>{user.projectPosition}</Table.Cell>
                                                <Table.Cell colspan={4}>
                                                    <NativeLink to={settings.PROJECT_PATH + '/' + user.project?.id}>{user.project?.name}</NativeLink>
                                                </Table.Cell>
                                                <Table.Cell colspan={2}>{user.projectClient}</Table.Cell>
                                                <Table.Cell colspan={2}>{user.positionUnion}</Table.Cell>
                                                <Table.Cell colspan={3}>{user.specialization}</Table.Cell>
                                                <Table.Cell colspan={3}>{user.businessEntity}</Table.Cell>
                                                <Table.Cell colspan={2}>{user.companyBranch ?? 'Любой'}</Table.Cell>
                                                <Table.Cell colspan={2}>{user.projectRole}</Table.Cell>
                                                <Table.Cell colspan={2}>
                                                    <Tag color={'default'}>
                                                        {user.percentage + '%'}
                                                    </Tag>
                                                </Table.Cell>
                                                <Table.Cell colspan={2}>{format(new Date(user.startDate), 'dd.MM.yyyy')}</Table.Cell>
                                                <Table.Cell colspan={2}>{format(new Date(user.endDate), 'dd.MM.yyyy')}</Table.Cell>
                                            </Table.Row>
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
