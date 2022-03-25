import type { IAuthState, IServicesDataState } from './reducer';
import type { IReportState } from 'Report/report.model';

export interface IRootState {
  auth: IAuthState,
  appServices: IServicesDataState,
  report: IReportState,
}
