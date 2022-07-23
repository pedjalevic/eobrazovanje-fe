import Role from './role';

export default interface User {
    id: number;
    username: string;
    roles: Role[];
}
