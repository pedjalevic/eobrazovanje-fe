import Role from './role';

export default interface Student {
  id: number;
  firstName: string;
  lastName: string;
  personalIdNumber: string;
  schoolIdNumber: string;
  phoneNumber: string;
  email: boolean;
  role: Role;
  userName: string;
  createdAt: string;
  updatedAt: string;
  currentStudyYear: Years;
  financialStatus: FinancialStatus;
}

export enum Years {
  FIRST = 'FIRST',
  SECCOND = 'SECCOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH'
}

export enum FinancialStatus {
  SELF_FINANCING = 'SELF_FINANCING',
  BUDGET = 'BUDGET'
}
