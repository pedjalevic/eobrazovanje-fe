export default interface Role {
    id: number;
    name: string;
}

export enum RoleTypes {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_STUDENT = 'ROLE_STUDENT',
  ROLE_TEACHER = 'ROLE_TEACHER'
}
