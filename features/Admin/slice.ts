"use client";

import adminService from "@/entity/Admin";
import { Project } from "@/entity/Project";
import { User } from "@/entity/User";
import { Role } from "@/shared/lib/data";
import { createAppSlice } from "@/shared/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface State {
    isLoading: boolean;
    projects: Project[] | null;
    users: User[] | null;
    roles: Role[] | null; // <-- Добавили
    errors: string[];
    automationRules: any[] | null;
}

const initialState: State = {
    isLoading: false,
    projects: null,
    users: null,
    roles: null,
    errors: [],
    automationRules: null,
};

export const adminSlice = createAppSlice({
    name: "admin", 
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.projects = null;
            state.users = null;
            state.roles = null;
            state.errors = [];
        }),

        fetchProjects: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                const res = await adminService.getProjects();
                if (!res.ok) return rejectWithValue(res.errors);
                return res.body;
            },
            {
                pending: (state) => { state.isLoading = true; },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.projects = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                },
            }
        ),

        fetchUsers: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                const res = await adminService.getUsers();
                if (!res.ok) return rejectWithValue(res.errors);
                return res.body;
            },
            {
                pending: (state) => { state.isLoading = true; },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.users = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                },
            }
        ),

        fetchRoles: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                const res = await adminService.getRoles();
                if (!res.ok) return rejectWithValue(res.errors);
                return res.body;
            },
            {
                fulfilled: (state, action) => {
                    state.roles = action.payload;
                }
            }
        ),

        fetchRegisterUser: create.asyncThunk(
            async (data: any, { dispatch }) => {
                const res = await adminService.registerUser(data);
                if (res.ok) {
                    toast.success("Пользователь зарегистрирован");
                    dispatch(adminSlice.actions.fetchUsers());
                } else {
                    toast.error(res.errors[0] || "Ошибка регистрации");
                }
                return res.ok;
            }
        ),

        fetchSetActivation: create.asyncThunk(
            async (payload: { user_id: number; activation: boolean }, { dispatch }) => {
                const res = payload.activation
                    ? await adminService.activateUser(payload.user_id)
                    : await adminService.deactivateUser(payload.user_id);
                if (res.ok) {
                    toast.success(payload.activation ? "Пользователь активирован" : "Пользователь деактивирован");
                    dispatch(adminSlice.actions.fetchUsers());
                }
            }
        ),

        fetchSetSuperuser: create.asyncThunk(
            async (payload: { user_id: number; activation: boolean }, { dispatch }) => {
                const res = await adminService.setSuperuser(payload.user_id, payload.activation);
                if (res.ok) {
                    toast.success("Права изменены");
                    dispatch(adminSlice.actions.fetchUsers());
                }
            }
        ),

        fetchCreateRole: create.asyncThunk(
            async (data: any, { dispatch }) => {
                const res = await adminService.createRole(data);
                if (res.ok) {
                    toast.success("Роль создана");
                    dispatch(adminSlice.actions.fetchRoles());
                }
            }
        ),

        fetchUpdateRole: create.asyncThunk(
            async (payload: { id: any, data: any }, { dispatch }) => {
                const res = await adminService.updateRole(payload.id, payload.data);
                if (res.ok) {
                    toast.success("Роль обновлена");
                    dispatch(adminSlice.actions.fetchRoles());
                }
            }
        ),

        fetchDeleteRole: create.asyncThunk(
            async (id: any, { dispatch }) => {
                const res = await adminService.deleteRole(id);
                if (res.ok) {
                    toast.success("Роль удалена");
                    dispatch(adminSlice.actions.fetchRoles());
                }
            }
        ),

        fetchAutomationRules: create.asyncThunk(
            async (projectId: number | string, { rejectWithValue }) => {
                const res = await adminService.getAutomationRules(projectId);
                if (!res.ok) return rejectWithValue(res.errors);
                return res.body;
            },
            {
                fulfilled: (state, action) => { state.automationRules = action.payload; },
            }
        ),

        fetchCreateRule: create.asyncThunk(
            async (payload: { projectId: number; data: any }, { dispatch }) => {
                const res = await adminService.createAutomationRule(payload.projectId, payload.data);
                if (res.ok) {
                    toast.success("Правило создано");
                    dispatch(adminSlice.actions.fetchAutomationRules(payload.projectId));
                }
            }
        ),

        fetchUpdateRule: create.asyncThunk(
            async (payload: { projectId: number; ruleId: number; data: any }, { dispatch }) => {
                const res = await adminService.updateAutomationRule(payload.projectId, payload.ruleId, payload.data);
                if (res.ok) {
                    toast.success("Правило обновлено");
                    dispatch(adminSlice.actions.fetchAutomationRules(payload.projectId));
                }
            }
        ),

        fetchDeleteRule: create.asyncThunk(
            async (payload: { projectId: number; ruleId: number }, { dispatch }) => {
                const res = await adminService.deleteAutomationRule(payload.projectId, payload.ruleId);
                if (res.ok) {
                    toast.success("Правило удалено");
                    dispatch(adminSlice.actions.fetchAutomationRules(payload.projectId));
                }
            }
        ),
    }),
});

export const {
    clear,
    fetchProjects,
    fetchUsers,
    fetchRoles,
    fetchRegisterUser,
    fetchSetActivation,
    fetchSetSuperuser,
    fetchCreateRole,
    fetchUpdateRole,
    fetchDeleteRole,
    fetchAutomationRules,
    fetchCreateRule,
    fetchDeleteRule,
    fetchUpdateRule
} = adminSlice.actions;