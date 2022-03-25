export type TReportOpenPosition = {
  companyBranch: string | null;
  businessEntity: string | null;
  projectClient: string | null;
  percentage: number | null;
  positionUnion: string | null;
  project: {
      id: number | null;
      name: string | null;
    };
  id: number | null;
  name: string | null;
  projectPosition: string | null;
  projectRole: string | null;
  specialization: string | null;
  startDate: string | number | Date;
  endDate: string | number | Date;
}

export type TReportBusyEmployees = {
  businessEntity: string | undefined;
  department: string | undefined;
  employeeId: number | null;
  finish: string | number | Date;
  fio: string | null;
  grade: string | null;
  role: string | null;
  group: string;
  isOverloaded: false
  load: number | null;
  project: string | null;
  projectClient: null
  projectId: number | null;
  specialization: string | null;
  start: string | number | Date;
}

export type TReportFreeEmployees = {
  allSpecializations: string | null;
  businessEntity: string | undefined;
  commonNameGrade: string | null;
  department: string | undefined;
  employeeId: number | null;
  finish: string | number | Date;
  fio: string | null;
  group: string | undefined;
  isOverloaded: false
  nameGrade: string | null;
  percentage: number | null;
  shortNameGrade: string | null;
  specialization: string | null;
  start: string | number | Date;
}

export type TReportDisposalBusiness = {
  name: string | null;
  actualEmployeesNow: number | null;
  planDepartmentLoadOnMonth: {
    month: number | null;
    employeesPerMonth: number | null;
    planDepartmentLoad: number | null;
  }[]
}

export type TFormDataDisposalBusiness = {
  start: string | null
  finish: string | null
}
