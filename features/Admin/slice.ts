import adminService from "@/entity/Admin";
import pipelineService, { Pipeline } from "@/entity/Pipeline";
import { Project } from "@/entity/Project";
import { User } from "@/entity/User";
import { createAppSlice } from "@/shared/lib/createAppSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { Users } from "lucide-react";

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

export const projectSlice = createAppSlice({
    name: "project",
    initialState,
    reducers: (create) => ({
        clear: create.reducer((state) => {
            state.projects = null;
            state.errors = [];
        }),

        fetchProjects: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                const res = await adminService.getProjects();
                if (!res.ok) {
                    return rejectWithValue(res.errors);
                }
                return res.body;
            },
            {
                pending: (state) => {
                    state.isLoading = true;
                },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.projects = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                },
            },
        ),

        fetchUsers: create.asyncThunk(
            async (_, { rejectWithValue }) => {
                const res = await adminService.getUsers();
                if (!res.ok) {
                    return rejectWithValue(res.errors);
                }
                return res.body;
            },
            {
                pending: (state) => {
                    state.isLoading = true;
                },
                fulfilled: (state, action) => {
                    state.isLoading = false;
                    state.users = action.payload;
                },
                rejected: (state, action) => {
                    state.isLoading = false;
                    state.errors = action.payload as string[];
                },
            },
        ),

        setActivation: create.reducer(
            (
                state,
                action: PayloadAction<{
                    user_id: User["id"];
                    activation: boolean;
                }>,
            ) => {
                if (!state.users) return;
                const { user_id, activation } = action.payload;
                const user = state.users.find((u) => u.id === user_id);
                if (!user) return;
                user.is_active = activation;
            },
        ),

        fetchSetActivation: create.asyncThunk(
            async (
                payload: {
                    user_id: User["id"];
                    activation: boolean;
                },
                { dispatch },
            ) => {
                const { user_id, activation } = payload;
                const res = activation
                    ? await adminService.activateUser(user_id)
                    : await adminService.deactivateUser(user_id);
                if (!res.ok) {
                    return;
                }
                dispatch(setActivation({ user_id, activation }));
            },
        ),

        setSuperuser: create.reducer(
            (
                state,
                action: PayloadAction<{
                    user_id: User["id"];
                    activation: boolean;
                }>,
            ) => {
                if (!state.users) return;
                const { user_id, activation } = action.payload;
                const user = state.users.find((u) => u.id === user_id);
                if (!user) return;
                user.is_superuser = activation;
            },
        ),

        fetchSetSuperuser: create.asyncThunk(
            async (
                payload: {
                    user_id: User["id"];
                    activation: boolean;
                },
                { dispatch },
            ) => {
                const { user_id, activation } = payload;
                const res = await adminService.setSuperuser(
                    user_id,
                    activation,
                );
                if (!res.ok) {
                    return;
                }
                dispatch(setSuperuser({ user_id, activation }));
            },
        ),
    }),
});

export const {
    clear,
    fetchProjects,
    fetchUsers,
    setActivation,
    fetchSetActivation,
    setSuperuser,
    fetchSetSuperuser,
} = projectSlice.actions;
