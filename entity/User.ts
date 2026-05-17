export type User = {
    id: number;
    name: string;
    login: string;
    is_superuser: boolean;
    is_active: boolean;
};

class UserService {
    private ROUTES = {};
    async getUser(id: User["id"]) {}
    async updateUser(id: User["id"]) {}
    async createUser(id: User["id"]) {}
    async deleteUser(id: User["id"]) {}
}
const userService = new UserService();
export default userService;
