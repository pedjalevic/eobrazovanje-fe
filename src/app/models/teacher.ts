import Role from './role';

export default interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  personalIdNumber: string;
  academicTitle: string;
  phoneNumber: string;
  email: boolean;
  role: Role;
  userName: string;
  createdAt: string;
  updatedAt: string;
}
