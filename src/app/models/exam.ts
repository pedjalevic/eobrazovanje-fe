import Courses from "./courses";
import { Term } from "./term";

export default interface Exam {
  id: number;
  examDate: string;
  location: string;
  term: Term;
  course: Courses;
}
