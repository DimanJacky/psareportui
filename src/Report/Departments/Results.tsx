import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
    Table,
    TableCell,
    IconCalendar,
    TableRow,
    IconRight,
    Typography,
    Tooltip,
    IconDownload,
    Notification,
    IconInfo,
    Alert,
    IconError
} from '@neoflex/fastdata-ui-kit';
import { Loader, Error, AxiosErrorType } from '@neoflex/psa-ui-shared';
import { add, format, isAfter, isBefore, setDate } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';

import { useDispatch } from 'react-redux';
import { useAppSelector } from 'redux/hooks';
import { getReportDisposalBusiness } from './actions';
import { getUniqueDate } from './Selectors';
import settings from 'settings';
import { setExport } from 'helpers';

import './data-picker.scss';
import css from './results.module.scss';

import type { IRootState } from 'redux/types';
import type { NotificationType } from 'types';
import type { TReportDisposalBusiness } from 'Report/types'; 

registerLocale('ru', ru);

const Results = () => {
    const [notification, setNotification] = useState<boolean | NotificationType>(false);
    const [fromDate, setFromDate] = useState<Date | null>(setDate(new Date(), 1));
    const [toDate, setToDate] = useState<Date | null>(add(new Date(), { months: 3 }));

    const { reportDisposalBusiness, isLoading, error } = useAppSelector((state: IRootState) => state.report);
    const dispatch = useDispatch();
    const uniqueMonth = useAppSelector(getUniqueDate);
    const currentMonth = format(new Date(), 'MM.yyyy');

    const dataParams = {
        start: fromDate && format(fromDate, 'MM-yyyy'),
        finish: toDate && format(toDate, 'MM-yyyy')
    };

    const calculateDate = (date: number | null): boolean => {
        const lastMonth = add(new Date(), { months: -1 });
        const replaceDate = String(date).split('.').reverse().join('.');
        const dateFormat = new Date(replaceDate);

        return lastMonth > dateFormat;
    };

    const _notificationError = (error: AxiosErrorType) => {
        setNotification({
            type: 'error',
            title: 'Ошибка ' + error.status,
            message: 'Ошибка при генерации файла на сервере'
        });
    };

    const urlDownloadFile = `${settings.API_URL}${settings.DASHBOARD_PATH}${settings.DISPOSAL_BUSINESS}/export/excel`;

    useEffect(() => {
        // добавим одну минуту на случай расхождения в миллисекунды
        if(toDate && fromDate && isAfter(add(toDate, { minutes: 1 }), fromDate)) {
            dispatch(getReportDisposalBusiness(dataParams));
        } else
            return;
    }, [fromDate, toDate]);

    const getCountEmployees = (number: number | null) => {

        if(number === null) {
            return `${0 + ' ' + 'сотрудников'}`;
        }

        let n = Math.abs(number);

        if(n >= 5 && n <= 20) {
            return `${n + ' ' + 'сотрудников'}`;
        }

        if(n === 1) {
            return `${n + ' ' + 'сотрудник'}`;
        }

        if(n >= 2 && n <= 4) {
            return `${n + ' ' + 'сотрудника'}`;
        }

        return `${n + ' ' + 'сотрудников'}`;
    };

    // добавим одну минуту на случай расхождения в миллисекунды
    const showMsgError = (toDate && fromDate && isBefore(add(toDate, { minutes: 1 }), fromDate));

    return (
        <>
            {
                notification &&
                <Notification { ...notification } timeout={10000} onClose={() => setNotification(false)} />
            }
            <div className={css.wrapper}>
                <div className={css.tableWrapper}>
                    <div className={css.tableHat}>
                        <Typography style={{ fontSize: '163.5%' }} type="h3" weight="medium">Плановая утилизация</Typography>
                        <div className={css.tableActions}>
                            <div className="picker-wrapper">
                                <div className="picker-wrapper__content">
                                    <DatePicker
                                        className="picker-wrapper__from"
                                        locale="ru"
                                        selected={fromDate}
                                        selectsStart
                                        startDate={fromDate}
                                        endDate={toDate}
                                        dateFormat="MM.yyyy"
                                        onChange={(date: React.SetStateAction<Date | null>) => setFromDate(date)}
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                    />
                                    <IconCalendar/>
                                </div>
                                <IconRight className="picker-wrapper__arrow" />
                                <div className="picker-wrapper__content">
                                    <DatePicker
                                        className="picker-wrapper__to"
                                        locale="ru"
                                        selected={toDate}
                                        selectsEnd
                                        startDate={fromDate}
                                        endDate={toDate}
                                        dateFormat="MM.yyyy"
                                        onChange={(date: React.SetStateAction<Date | null>) => setToDate(date)}
                                        showMonthYearPicker
                                        showFullMonthYearPicker
                                    />
                                    <IconCalendar/>
                                </div>
                                {
                                    showMsgError &&
                                    <Alert className={css.popupError} message={settings.TEXT_ERROR_TO_DATES} type="warning" icon={<IconError view={'secondary'} size={'large'} />} />
                                }
                            </div>
                            <span className={css.separator}/>

                            <Tooltip position="left" title="Скачать отчёт">
                                <IconDownload 
                                    className={css.download}
                                    onClick={() => setExport(dataParams, _notificationError, urlDownloadFile, 'disposal_business_')}
                                    disabled={isLoading}
                                />
                            </Tooltip>
                        </div>
                    </div>

                    {reportDisposalBusiness.length && !isLoading ? (
                        <div className={css.splitTable}>
                            <Table cells={16} className={css.table} style={{ minWidth: '414px' }} fontSize="small">
                                <Table.Header className={css.tableLeftHeader}>
                                    <TableCell colspan={12}>Подразделение</TableCell>
                                    <TableCell colspan={4} className={css.tableCol}>
                                    Кол-во сотрудников
                                        <Tooltip title="Текущее количество сотрудников подразделения"><IconInfo className={css.tableIcon} /></Tooltip>
                                    </TableCell>
                                </Table.Header>

                                {reportDisposalBusiness.map((item: TReportDisposalBusiness, index) => (
                                    <TableRow key={index} className={css.tableLeftRow}>
                                        <TableCell colspan={12} className={css.tableLeftCell}>{item.name}</TableCell>
                                        <TableCell colspan={4} className={classNames(css.tableLeftCell, css.tableWeight)}>{item.actualEmployeesNow}</TableCell>
                                    </TableRow>
                                ))}
                            </Table>

                            <div className={css.middle}>
                                <Table fontSize="small" className={css.table} style={{ display: 'table', width: '100%' }}>
                                    <Table.Header className={css.tableHeader}>
                                        {uniqueMonth.map((item, index) => (
                                            <TableCell key={index}>{item}</TableCell>
                                        ))}
                                    </Table.Header>

                                    {reportDisposalBusiness.map((item: TReportDisposalBusiness, index) => (
                                        <Table.Row className={css.middleRow} key={index}>
                                            {item.planDepartmentLoadOnMonth.map((value, key) => {
                                                const [currentMonthA, currentYearA] = currentMonth.split('.');
                                                const [monthB, yearB] = String(value.month).split('.');
                                                const currentDateA = new Date(Number(currentYearA), Number(currentMonthA) - 1);
                                                const dateB = new Date(Number(yearB), Number(monthB) - 1);

                                                return (
                                                    <TableCell
                                                        key={key}
                                                        className={classNames(css.tableRow, calculateDate(value.month) ? css.tableRowTransparent : '')}>
                                                        {currentDateA > dateB && <span className={css.tableRowTooltip}>
                                                            {getCountEmployees(value.employeesPerMonth)} в этом месяце</span>}
                                                        {value.planDepartmentLoad}%
                                                    </TableCell>);
                                            })}
                                        </Table.Row>
                                    ))}
                                </Table>
                            </div>
                        </div>
                    ) : isLoading ? <Loader inline /> : error.data.message ? (
                        <>
                            <Typography type="h4">Результаты поиска</Typography>
                            <Typography type="h3">{error.data.message}</Typography>
                        </>
                    ) : (
                        <Error {...error} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Results;
