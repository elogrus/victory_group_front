"use client";

import adminService from "@/entity/Admin";
import { Project } from "@/entity/Project";
import { User } from "@/entity/User";
import { createAppSlice } from "@/shared/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";

interface State {
    isLoading: boolean;
    projects: Project[] | null;
    users: User[] | null;
    errors: string[];
}

const initialState: State = {
    isLoading: false,
    projects: null,
    users: null,
    errors: [],
};

// Изменили имя на adminSlice и name на "admin"
export const adminSlice = createAppSlice({
    name: "admin", 
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.projects = null;
            state.users = null;
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

        setActivation: create.reducer(
            (state, action: PayloadAction<{ user_id: User["id"]; activation: boolean }>) => {
                if (!state.users) return;
                const user = state.users.find((u) => u.id === action.payload.user_id);
                if (user) user.is_active = action.payload.activation;
            }
        ),

        fetchSetActivation: create.asyncThunk(
            async (payload: { user_id: User["id"]; activation: boolean }, { dispatch }) => {
                const res = payload.activation
                    ? await adminService.activateUser(payload.user_id)
                    : await adminService.deactivateUser(payload.user_id);
                if (res.ok) dispatch(adminSlice.actions.setActivation(payload));
            }
        ),

        setSuperuser: create.reducer(
            (state, action: PayloadAction<{ user_id: User["id"]; activation: boolean }>) => {
                if (!state.users) return;
                const user = state.users.find((u) => u.id === action.payload.user_id);
                if (user) user.is_superuser = action.payload.activation;
            }
        ),

        fetchSetSuperuser: create.asyncThunk(
            async (payload: { user_id: User["id"]; activation: boolean }, { dispatch }) => {
                const res = await adminService.setSuperuser(payload.user_id, payload.activation);
                if (res.ok) dispatch(adminSlice.actions.setSuperuser(payload));
            }
        ),
    }),
});

export const {
    clear,
    fetchProjects,
    fetchUsers,
    fetchSetActivation,
    fetchSetSuperuser,
} = adminSlice.actions;