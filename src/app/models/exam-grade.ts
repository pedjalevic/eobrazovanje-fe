export interface ExamGradeFeil {
  id: number;
  exam: number;
  student: number;
  examRegistrationStatus: ExamRegistrationStatus;
}

export interface ExamGradePass {
  exam: number;
  student: number;
  examRegistration: number;
  gradeType: GradeType;
}

export enum GradeType {
  FIVE = 'FIVE',
  SIX = 'SIX',
  SEVEN = 'SEVEN',
  EIGHT = 'EIGHT',
  NINE = 'NINE',
  TEN = 'TEN'
}


export enum ExamRegistrationStatus {
  REGISTERED = 'REGISTERED',
  PASSED = 'PASSED',
  FAILED = 'FAILED'
}
