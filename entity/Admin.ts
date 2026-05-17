import { CONSTS } from "@/shared/lib/consts";
import { myFetch } from "@/shared/lib/myFetch";
import tokenService from "./Token";
import { User } from "./User";
import { Project } from "./Project";
import { Role } from "@/shared/lib/data";

class AdminService {
    private ROUTES = {
        users: CONSTS.API_URL + "/admin/users",
        register: CONSTS.API_URL + "/auth/register",
        roles: CONSTS.API_URL + "/roles",
        role_id: (id: number | string) => CONSTS.API_URL + `/roles/${id}`,
        id_activate: (user_id: User["id"]) =>
            CONSTS.API_URL + `/admin/users/${user_id}/activate`,
        id_deactivate: (user_id: User["id"]) =>
            CONSTS.API_URL + `/admin/users/${user_id}/deactivate`,
        id_set_superuser: (user_id: User["id"], activation: boolean) =>
            CONSTS.API_URL +
            `/admin/users/${user_id}/set-superuser?is_superuser=${activation}`,
        projects: CONSTS.API_URL + "/admin/projects",
        project_analytics: (projectId: number | string) => 
            CONSTS.API_URL + `/projects/${projectId}/analytics/tasks`,
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

    async registerUser(data: any) {
        return await myFetch<any>(this.ROUTES.register, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    // --- РОЛИ ---
    async getRoles() {
        return await myFetch<Role[]>(this.ROUTES.roles);
    }

    async createRole(data: Omit<Role, "id">) {
        return await myFetch<Role>(this.ROUTES.roles, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateRole(id: number | string, data: Partial<Role>) {
        return await myFetch<Role>(this.ROUTES.role_id(id), {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteRole(id: number | string) {
        return await myFetch<any>(this.ROUTES.role_id(id), {
            method: "DELETE",
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

    async getProjectAnalytics(projectId: number | string) {
        return await myFetch<any>(this.ROUTES.project_analytics(projectId), {
            method: "GET",
        });
    }

    private AUTOMATION_ROUTES = {
        list: (projectId: number | string) => 
            CONSTS.API_URL + `/projects/${projectId}/automation-rules`,
        detail: (projectId: number | string, ruleId: number | string) => 
            CONSTS.API_URL + `/projects/${projectId}/automation-rules/${ruleId}`,
    };

    async getAutomationRules(projectId: number | string) {
        return await myFetch<any[]>(this.AUTOMATION_ROUTES.list(projectId));
    }

    async createAutomationRule(projectId: number | string, data: any) {
        return await myFetch<any>(this.AUTOMATION_ROUTES.list(projectId), {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async updateAutomationRule(projectId: number | string, ruleId: number | string, data: any) {
        return await myFetch<any>(this.AUTOMATION_ROUTES.detail(projectId, ruleId), {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }

    async deleteAutomationRule(projectId: number | string, ruleId: number | string) {
        return await myFetch<any>(this.AUTOMATION_ROUTES.detail(projectId, ruleId), {
            method: "DELETE",
        });
    }
}


const adminService = new AdminService();
export default adminService;
