export default interface StudyProgram {
  id: number;
  name: string;
  prefix: string;
  studyField: string;
  espbPoints: number;
  studyProgramType: StudyProgramType;
}

export enum StudyProgramType {
  PROFESSIONAL_STUDIES = 'PROFESSIONAL_STUDIES',
  ACADEMIC_STUDIES = 'ACADEMIC_STUDIES'
}

