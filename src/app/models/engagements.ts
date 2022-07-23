import Courses from './courses';
import Teacher from './teacher';

export default interface Engagements {
  id: number;
  engagementType: EngagementType;
  course: Courses;
  teacher: Teacher;
}

export enum EngagementType {
  PROFESSOR = 'PROFESSOR',
  ASSISTANT = 'ASSISTANT'
}

