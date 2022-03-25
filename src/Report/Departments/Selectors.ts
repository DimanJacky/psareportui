import { createSelector } from '@reduxjs/toolkit';
import type { IRootState } from 'redux/types';

export const getReportDisposalBusiness = (state: IRootState) => state.report.reportDisposalBusiness;

export const getUniqueDate = createSelector(getReportDisposalBusiness, reportDisposalBusiness => {
    const months = reportDisposalBusiness.map(({ planDepartmentLoadOnMonth }) => planDepartmentLoadOnMonth).flat();

    return [...new Set(months.map(item => item.month))];
});
