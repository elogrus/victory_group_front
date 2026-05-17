import { CONSTS } from "@/shared/lib/consts";
import { myFetch } from "@/shared/lib/myFetch";
import tokenService from "./Token";
import { User } from "./User";
import { Project } from "./Project";

class AdminService {
    private ROUTES = {
        users: CONSTS.API_URL + "/admin/users",
        id_activate: (user_id: User["id"]) =>
            CONSTS.API_URL + `/admin/users/${user_id}/activate`,
        id_deactivate: (user_id: User["id"]) =>
            CONSTS.API_URL + `/admin/users/${user_id}/deactivate`,
        id_set_superuser: (user_id: User["id"], activation: boolean) =>
            CONSTS.API_URL +
            `/admin/users/${user_id}/set-superuser?is_superuser=${activation}`,
        projects: CONSTS.API_URL + "/admin/projects",
    };
    async getUsers() {
        return await myFetch<User[]>(this.ROUTES.users, {
            method: "GET",
        });
    }

    async activateUser(user_id: User["id"]) {
        return await myFetch<User>(this.ROUTES.id_activate(user_id), {
            method: "PATCH",
        });
    }

    async deactivateUser(user_id: User["id"]) {
        return await myFetch<User>(this.ROUTES.id_deactivate(user_id), {
            method: "PATCH",
        });
    }

    async setSuperuser(user_id: User["id"], activation: boolean) {
        return await myFetch<User>(
            this.ROUTES.id_set_superuser(user_id, activation),
            {
                method: "PATCH",
            },
        );
    }

    async getProjects() {
        return await myFetch<Project[]>(this.ROUTES.projects, {
            method: "GET",
        });
    }
}
const adminService = new AdminService();
export default adminService;
